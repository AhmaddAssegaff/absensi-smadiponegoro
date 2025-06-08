import { studentProcedure } from "@/server/api/trpc";
import { GetAttendanceSummaryStudentShema } from "@/shared/validators/student/getAttendanceSummary";

export const GetAttendanceSummaryStudent = studentProcedure
  .input(GetAttendanceSummaryStudentShema)
  .query(async ({ ctx, input }) => {
    const { months, years } = input;
    const userNISN = ctx.session?.user.nisn;

    return await ctx.db.attendanceSummary.findFirst({
      where: {
        user: {
          nisn: userNISN,
        },
        year: years,
        month: months,
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
