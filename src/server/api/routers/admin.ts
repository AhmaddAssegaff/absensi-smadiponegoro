import { adminProcedure, createTRPCRouter } from "../trpc";
import { z } from "zod";
import { ClassName, Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

const getAllTeacherInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(15).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

const updateTeacherInput = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  nisn: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  classNames: z.array(z.nativeEnum(ClassName)).optional(),
});

const getUserById = z.object({
  id: z.string(),
});

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

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
    .input(updateTeacherInput)
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
