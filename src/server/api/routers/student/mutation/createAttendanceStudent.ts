import { getDistanceFromLatLonInMeters } from "@/helper";
import { studentProcedure } from "@/server/api/trpc";
import { CreateAttendanceStudentShema } from "@/shared/validators/teacher/createAttendanceStudentShema";
import { TRPCError } from "@trpc/server";
import { isAfter, set } from "date-fns";
import { env } from "@/env";

export const CreateAttendanceStudent = studentProcedure
  .input(CreateAttendanceStudentShema)
  .mutation(async ({ ctx, input }) => {
    const { code, description, latitude, longitude } = input;
    const nisn = ctx.session?.user.nisn;

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

    const isAlreadyAbsen = await ctx.db.attendance.findFirst({
      where: {
        user: {
          nisn,
        },
        dateAttandance: {
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
    const MAX_LATE_HOUR = 7;
    const MAX_LATE_MINUTE = 10;

    const batasJamTerlambat = set(now, {
      hours: MAX_LATE_HOUR,
      minutes: MAX_LATE_MINUTE,
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

    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const user = await ctx.db.user.findUnique({
      where: { nisn },
      select: { id: true, classId: true },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User tidak ditemukan.",
      });
    }

    try {
      await ctx.db.$transaction(async (tx) => {
        const attendance = await tx.attendance.create({
          data: {
            user: {
              connect: { nisn },
            },
            dateAttandance: now,
            status: terlambat ? "HADIR_TERLAMBAT" : "HADIR_TEPAT_WAKTU",
            description: terlambat ? description! : "Hadir tepat waktu",
          },
        });

        const existingSummary = await tx.attendanceSummary.findUnique({
          where: {
            userId_year_month: {
              userId: user.id,
              year,
              month,
            },
          },
        });

        if (existingSummary) {
          await tx.attendanceSummary.update({
            where: {
              userId_year_month: {
                userId: user.id,
                year,
                month,
              },
            },
            data: {
              hadirTepat: terlambat ? undefined : { increment: 1 },
              hadirTerlambat: terlambat ? { increment: 1 } : undefined,
              totalHadir: { increment: 1 },
              totalHari: { increment: 1 },
            },
          });
        } else {
          await tx.attendanceSummary.create({
            data: {
              userId: user.id,
              classId: user?.classId,
              year,
              month,
              hadirTepat: terlambat ? 0 : 1,
              hadirTerlambat: terlambat ? 1 : 0,
              totalHadir: 1,
              totalHari: 1,
            },
          });
        }

        return attendance;
      });
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal mencatat absen. Silakan coba lagi.",
      });
    }
  });
