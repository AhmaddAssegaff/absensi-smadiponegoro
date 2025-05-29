import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { ClassName, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

const getAllTeacherInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(15).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const getUserById = z.object({
  id: z.string(),
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
            homeRoomFor: true,
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

  getUserById: adminProcedure
    .input(getUserById)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: {
          homeRoomFor: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      return user;
    }),

  changeTeacherHomeRoom: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        className: z.nativeEnum(ClassName),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId, className } = input;

      const kelas = await ctx.db.class.findUnique({
        where: { name: className },
      });

      if (!kelas) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Kelas tidak ditemukan",
        });
      }

      return await ctx.db.class.update({
        where: { id: kelas.id },
        data: {
          homerooms: {
            connect: { id: userId },
          },
        },
        include: {
          homerooms: true,
        },
      });
    }),
});
