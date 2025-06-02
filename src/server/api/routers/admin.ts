import { adminProcedure, createTRPCRouter } from "../trpc";
import { type Prisma, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import {
  updateTeacherInputBE,
  getAllTeacherInput,
} from "@/shared/validators/teacher";
import { createUserFE, getUserById } from "@/shared/validators/user";

import { hashPassword } from "@/helper/hash";
import { findUserOrThrow } from "@/helper/findUserOrThrow";
import { throwIfUserExists } from "@/helper/throwIfUserExists";

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
      return await findUserOrThrow({
        prisma: ctx.db,
        id: input.id,
        include: { homeRoomFor: true },
      });
    }),

  updateUser: adminProcedure
    .input(updateTeacherInputBE)
    .mutation(async ({ ctx, input }) => {
      const { id, name, nisn, password, classNames } = input;

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

        if (classNames !== undefined) {
          const foundClasses = await tx.class.findMany({
            where: { name: { in: classNames } },
          });

          if (foundClasses.length !== classNames.length) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Beberapa kelas tidak ditemukan",
            });
          }

          await tx.user.update({
            where: { id },
            data: {
              homeRoomFor: {
                set: foundClasses.map((c) => ({ id: c.id })),
              },
            },
          });
        }

        return await tx.user.findUnique({
          where: { id },
          include: { homeRoomFor: true },
        });
      });
    }),

  createUser: adminProcedure
    .input(createUserFE)
    .mutation(async ({ ctx, input }) => {
      const { name, nisn, passwordHash, role, className, homeRoomFor } = input;

      await throwIfUserExists({
        prisma: ctx.db,
        nisn,
      });

      const hashedPassword = await hashPassword(passwordHash);

      const userData: Prisma.UserCreateInput = {
        name,
        nisn,
        passwordHash: hashedPassword,
        role,
      };

      if (role === "STUDENT" && className) {
        userData.classesAsStudent = {
          connect: { name: className },
        };
      }

      if (
        role === "TEACHER" &&
        Array.isArray(homeRoomFor) &&
        homeRoomFor.length > 0
      ) {
        userData.homeRoomFor = {
          connect: homeRoomFor.map((id) => ({ id })),
        };
      }

      return await ctx.db.user.create({
        data: userData,
      });
    }),
});
