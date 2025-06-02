import { adminProcedure } from "@/server/api/trpc";
import { Role } from "@prisma/client";
import { getAllTeacherInput } from "@/shared/validators/teacher";

export const GetAllTeacher = adminProcedure
  .input(getAllTeacherInput)
  .query(async ({ ctx, input }) => {
    const { page, limit, sortBy, order } = input;

    const where = { role: { not: Role.STUDENT } };

    const [total, users] = await Promise.all([
      ctx.db.user.count({ where }),
      ctx.db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
    ]);

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  });
