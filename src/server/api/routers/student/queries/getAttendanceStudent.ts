import { studentProcedure } from "@/server/api/trpc";
import { paginationShema } from "@/shared/validators/common/paginationShema";

export const GetAttendanceStudent = studentProcedure
  .input(paginationShema)
  .query(async ({ ctx, input }) => {
    const { limit, page, order } = input;
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
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  });
