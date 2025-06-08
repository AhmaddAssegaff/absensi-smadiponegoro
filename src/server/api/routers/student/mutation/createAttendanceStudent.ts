import { getDistanceFromLatLonInMeters } from "@/helper/getDistanceFromLatLonInMeters";
import { studentProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { isAfter, set } from "date-fns";
import { env } from "@/env";
import { z } from "zod";

export const CreateAttendanceStudent = studentProcedure
  .input(
    z.object({
      code: z.string(),
      description: z.string().optional(),
      latitude: z.number(),
      longitude: z.number(),
    }),
  )
  .mutation(async ({ ctx, input, signal }) => {
    const { code, description, latitude, longitude } = input;
    const nisn = ctx.session?.user.nisn;

    const isAlreadyAbsen = await ctx.db.attendance.findFirst({
      where: {
        user: {
          nisn,
        },
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    if (isAlreadyAbsen) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Anda sudah melakukan absen hari ini.",
      });
    }

    const SCHOOL_LAT = env.SCHOOL_LAT;
    const SCHOOL_LON = env.SCHOOL_LON;

    const MAX_DISTANCE_METERS = 100;

    const distance = getDistanceFromLatLonInMeters(
      latitude,
      longitude,
      SCHOOL_LAT,
      SCHOOL_LON,
    );

    if (distance > MAX_DISTANCE_METERS) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Anda berada di luar area sekolah. Tidak bisa absen.",
      });
    }

    const isQRCodeValid = await ctx.db.qRCode.findFirst({
      where: {
        code,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!isQRCodeValid) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "QR Code tidak valid atau sudah kedaluwarsa.",
      });
    }

    const now = new Date();
    const batasJamTerlambat = set(now, {
      hours: 7,
      minutes: 10,
      seconds: 0,
      milliseconds: 0,
    });

    const terlambat = isAfter(now, batasJamTerlambat);

    if (terlambat && !description) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Anda terlambat. Harap isi alasan keterlambatan.",
      });
    }

    const attendance = await ctx.db.attendance.create({
      data: {
        user: {
          connect: { nisn },
        },
        date: now,
        status: terlambat ? "HADIR_TERLAMBAT" : "HADIR_TEPAT_WAKTU",
        description: terlambat ? description! : "Hadir tepat waktu",
      },
    });

    // const CreateAttendanceSummar = await ctx.db.attendanceSummary.create({
    //   data: {

    //   }
    // })

    return attendance;
  });
