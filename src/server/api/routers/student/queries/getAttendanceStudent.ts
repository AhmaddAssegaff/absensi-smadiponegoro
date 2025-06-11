import { studentProcedure } from "@/server/api/trpc";
import { paginationAttandanceShema } from "@/shared/validators/student/paginationGetAllAttendance";

export const GetAttendanceStudent = studentProcedure
  .input(paginationAttandanceShema)
  .query(async ({ ctx, input }) => {
    const { limit, page, order, sortBy } = input;
    const userNISN = ctx.session?.user.nisn;

    const [data, total] = await Promise.all([
      ctx.db.attendance.findMany({
        where: {
          user: { nisn: userNISN },
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
          [sortBy]: order,
        },
      }),
      ctx.db.attendance.count({
        where: {
          user: { nisn: userNISN },
        },
      }),
    ]);

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  });
