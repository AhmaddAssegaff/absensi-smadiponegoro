import { teacherProcedure } from "@/server/api/trpc";
import { getStudentAttandanceShema } from "@/shared/validators/teacher/getStudentAttandanceShema";

export const GetDetailAttandanceStudentMonthly = teacherProcedure
  .input(getStudentAttandanceShema)
  .query(async ({ ctx, input }) => {
    const { id, month, year } = input;

    return await ctx.db.attendanceSummary.findFirst({
      where: {
        userId: id,
        month: month,
        year: year,
      },
      select: {
        month: true,
        year: true,
        totalHari: true,
        hadirTepat: true,
        totalTidakHadir: true,
        totalHadir: true,
        hadirTerlambat: true,
        alpa: true,
        sakit: true,
        izin: true,
        keluarIzin: true,
        keluarTanpaIzin: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  });
