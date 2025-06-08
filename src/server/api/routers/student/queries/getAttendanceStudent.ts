import { studentProcedure } from "@/server/api/trpc";

export const GetAttendanceStudent = studentProcedure.query(
  async ({ ctx, input, signal }) => {
    const userNISN = ctx.session?.user.nisn;

    return await ctx.db.attendance.findMany({
      where: {
        user: {
          nisn: userNISN,
        },
      },
      select: {
        status: true,
        date: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
);
