import { adminProcedure, createTRPCRouter } from "../trpc";
import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  updateTeacherInputBE,
  getAllTeacherInput,
} from "@/shared/validators/teacher";
import { getUserById } from "@/shared/validators/user";
import { hashPassword } from "@/helper/hash";

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
    }),

  getUserById: adminProcedure
    .input(getUserById)
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.id },
        include: { homeRoomFor: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      return user;
    }),

  updateUser: adminProcedure
    .input(updateTeacherInputBE)
    .mutation(async ({ ctx, input }) => {
      const { id, name, nisn, password, classNames } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { id },
        include: { homeRoomFor: true },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User tidak ditemukan",
        });
      }

      const updateUserData: {
        name?: string;
        nisn?: string;
        passwordHash?: string;
      } = {};

      if (name) updateUserData.name = name;
      if (nisn) updateUserData.nisn = nisn;
      if (password) updateUserData.passwordHash = await hashPassword(password);

      return await ctx.db.$transaction(async (tx) => {
        await tx.user.update({
          where: { id },
          data: updateUserData,
        });

        if (classNames) {
          if (classNames.length > 0) {
            const foundClasses = await tx.class.findMany({
              where: { name: { in: classNames } },
            });

            if (foundClasses.length !== classNames.length) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: "Beberapa kelas tidak ditemukan",
              });
            }

            const classesToSet = foundClasses.map((classItem) => {
              return { id: classItem.id };
            });

            await tx.user.update({
              where: { id },
              data: {
                homeRoomFor: {
                  set: classesToSet,
                },
              },
            });
          } else {
            await tx.user.update({
              where: { id },
              data: {
                homeRoomFor: {
                  set: [],
                },
              },
            });
          }
        }

        return tx.user.findUnique({
          where: { id },
          include: { homeRoomFor: true },
        });
      });
    }),
});
