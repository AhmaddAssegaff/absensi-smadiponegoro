import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { Role } from "@prisma/client";

const getAllTeacherInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(15).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const AdminRouter = createTRPCRouter({
  getAllTeacher: adminProcedure
    .input(getAllTeacherInput)
    .query(async ({ ctx, input }) => {
      const { page, limit, sortBy, order } = input;

      const where = {
        role: {
          not: Role.STUDENT,
        },
      };

      const [total, users] = await Promise.all([
        ctx.db.user.count({ where }),
        ctx.db.user.findMany({
          include: {
            homeroomFor: true,
          },
          where,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: {
            [sortBy]: order,
          },
        }),
      ]);

      return {
        data: users,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),
});
