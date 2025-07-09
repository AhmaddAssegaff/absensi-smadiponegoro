import { adminProcedure } from "@/server/api/trpc";
import { paginationStudentsSchema } from "@/shared/validators/admin/paginationGetAllUserStudent";
import { Role } from "@/shared/constants/role";
import { Prisma } from "@prisma/client";

export const GetAllStudents = adminProcedure
  .input(paginationStudentsSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, sortBy, order, search } = input;

    const where = {
      role: {
        notIn: [Role.ADMIN, Role.TEACHER],
      },
      OR: search
        ? [
            {
              name: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              nisn: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ]
        : undefined,
    };

    const [total, users] = await Promise.all([
      ctx.db.user.count({ where }),
      ctx.db.user.findMany({
        where,
        select: {
          name: true,
          nisn: true,
          role: true,
          updatedAt: true,
          classesAsStudent: true,
        },
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
