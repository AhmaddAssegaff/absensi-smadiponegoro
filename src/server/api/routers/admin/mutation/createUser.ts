import { findDuplicateNisn, hashPassword } from "@/helper";
import { createUserSchema } from "@/shared/validators/admin/createUserSchema";
import type { Prisma } from "@prisma/client";
import { adminProcedure } from "@/server/api/trpc";

export const CreateUser = adminProcedure
  .input(createUserSchema)
  .mutation(async ({ ctx, input }) => {
    const { name, nisn, passwordHash, role, classesAsStudent, homeRoomFor } =
      input;

    await findDuplicateNisn({
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

    if (role === "STUDENT" && classesAsStudent) {
      const classRecord = await ctx.db.class.findUnique({
        where: { ClassName: classesAsStudent },
        select: { id: true },
      });

      if (!classRecord) {
        throw new Error("Kelas tidak ditemukan");
      }

      userData.classesAsStudent = {
        connect: { id: classRecord.id },
      };
    }

    if (
      role === "TEACHER" &&
      Array.isArray(homeRoomFor) &&
      homeRoomFor.length > 0
    ) {
      const connectedClasses = [];

      for (const className of homeRoomFor) {
        const classRecord = await ctx.db.class.findUnique({
          where: { ClassName: className },
          select: { id: true },
        });

        if (!classRecord) {
          throw new Error(`Kelas '${className}' tidak ditemukan`);
        }

        const existingTeacher = await ctx.db.user.findFirst({
          where: {
            role: "TEACHER",
            homeRoomFor: {
              some: {
                id: classRecord.id,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        });

        if (existingTeacher) {
          throw new Error(
            `Kelas '${className}' sudah menjadi kelas wali dari guru '${existingTeacher.name}'`,
          );
        }

        connectedClasses.push({ id: classRecord.id });
      }

      userData.homeRoomFor = {
        connect: connectedClasses,
      };
    }

    return await ctx.db.user.create({
      data: userData,
    });
  });
