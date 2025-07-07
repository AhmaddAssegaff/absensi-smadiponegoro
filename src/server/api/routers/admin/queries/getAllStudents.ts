import { adminProcedure } from "@/server/api/trpc";
import { paginationTeacherSchema } from "@/shared/validators/admin/paginationGetAllUser";
import { Role } from "@/shared/constants/role";

export const GetAllStudents = adminProcedure
  .input(paginationTeacherSchema)
  .query(async ({ ctx, input }) => {
    const { page, limit, sortBy, order } = input;

    const where = {
      role: {
        notIn: [Role.ADMIN, Role.TEACHER],
      },
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
