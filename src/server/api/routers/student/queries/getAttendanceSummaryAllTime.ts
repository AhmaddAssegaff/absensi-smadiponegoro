import { studentProcedure } from "@/server/api/trpc";

export const GetAttendanceSummaryAllTime = studentProcedure.query(
  async ({ ctx }) => {
    const userNISN = ctx.session?.user.nisn;

    const summaries = await ctx.db.attendanceSummary.findMany({
      where: {
        user: {
          nisn: userNISN,
        },
      },
    });

    const total = summaries.reduce(
      (acc, item) => {
        acc.totalHari += item.totalHari;
        acc.totalHadir += item.totalHadir;
        acc.hadirTepat += item.hadirTepat;
        acc.hadirTerlambat += item.hadirTerlambat;
        acc.izin += item.izin;
        acc.sakit += item.sakit;
        acc.alpa += item.alpa;
        acc.keluarIzin += item.keluarIzin;
        acc.keluarTanpaIzin += item.keluarTanpaIzin;
        acc.totalTidakHadir += item.totalTidakHadir;
        return acc;
      },
      {
        totalHari: 0,
        totalHadir: 0,
        hadirTepat: 0,
        hadirTerlambat: 0,
        izin: 0,
        sakit: 0,
        alpa: 0,
        keluarIzin: 0,
        keluarTanpaIzin: 0,
        totalTidakHadir: 0,
      },
    );

    return total;
  },
);
