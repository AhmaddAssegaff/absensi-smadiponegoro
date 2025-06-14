import { teacherProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { updateManyAttendanceStudentShema } from "@/shared/validators/teacher/dalateTodayAttendanceShema";

export const DeleteTodayAttendanceStudent = teacherProcedure
  .input(updateManyAttendanceStudentShema)
  .mutation(async ({ input, ctx }) => {
    const { studentId } = input;
    const teacherId = ctx.session?.user.id;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const startOfDay = new Date(year, now.getMonth(), now.getDate());
    const endOfDay = new Date(year, now.getMonth(), now.getDate() + 1);

    const student = await ctx.db.user.findFirst({
      where: {
        id: studentId,
        classId: { not: null },
        classesAsStudent: {
          is: {
            homeroomId: teacherId,
          },
        },
      },
      select: {
        id: true,
        classId: true,
      },
    });

    if (!student) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Siswa tidak ditemukan atau tidak valid.",
      });
    }

    const existing = await ctx.db.attendance.findFirst({
      where: {
        userId: studentId,
        createdAt: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Absensi hari ini tidak ditemukan.",
      });
    }

    const minus = {
      hadirTepat: existing.status === "HADIR_TEPAT_WAKTU" ? 1 : 0,
      hadirTerlambat: existing.status === "HADIR_TERLAMBAT" ? 1 : 0,
      izin: existing.status === "IZIN" ? 1 : 0,
      sakit: existing.status === "IZIN_SAKIT" ? 1 : 0,
      alpa: existing.status === "ALPA" ? 1 : 0,
      keluarIzin: existing.status === "HADIR_DAN_KELUAR_DENGAN_IZIN" ? 1 : 0,
      keluarTanpaIzin:
        existing.status === "HADIR_DAN_KELUAR_TANPA_IZIN" ? 1 : 0,
      totalHadir: existing.status?.startsWith("HADIR") ? 1 : 0,
      totalTidakHadir: ["ALPA", "IZIN", "IZIN_SAKIT"].includes(existing.status)
        ? 1
        : 0,
      totalHari: 1,
    };

    await ctx.db.$transaction([
      ctx.db.attendance.delete({
        where: {
          id: existing.id,
        },
      }),
      ctx.db.attendanceSummary.update({
        where: {
          userId_year_month: {
            userId: studentId,
            year,
            month,
          },
        },
        data: {
          hadirTepat: { decrement: minus.hadirTepat },
          hadirTerlambat: { decrement: minus.hadirTerlambat },
          izin: { decrement: minus.izin },
          sakit: { decrement: minus.sakit },
          alpa: { decrement: minus.alpa },
          keluarIzin: { decrement: minus.keluarIzin },
          keluarTanpaIzin: { decrement: minus.keluarTanpaIzin },
          totalHadir: { decrement: minus.totalHadir },
          totalTidakHadir: { decrement: minus.totalTidakHadir },
          totalHari: { decrement: minus.totalHari },
        },
      }),
    ]);

    return { success: true };
  });
