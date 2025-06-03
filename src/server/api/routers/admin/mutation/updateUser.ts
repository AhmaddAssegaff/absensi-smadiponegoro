import { TRPCError } from "@trpc/server";
import { adminProcedure } from "@/server/api/trpc";
import { updateTeacherInputBE } from "@/shared/validators/teacher";
import { hashPassword } from "@/helper/hash";
import { findDuplicateNisn } from "@/helper/findDuplicateNisn";

export const UpdateUserTeacher = adminProcedure
  .input(updateTeacherInputBE)
  .mutation(async ({ ctx, input }) => {
    const { id: teacherId, name, nisn, password, classNames } = input;

    const updateUserData: {
      name?: string;
      nisn?: string;
      passwordHash?: string;
    } = {};

    if (nisn) {
      await findDuplicateNisn({
        nisn,
        prisma: ctx.db,
        excludeUserId: teacherId,
      });
    }

    if (name) updateUserData.name = name;
    if (nisn) updateUserData.nisn = nisn;
    if (password) updateUserData.passwordHash = await hashPassword(password);

    return await ctx.db.$transaction(async (tx) => {
      const teacher = await tx.user.findUnique({ where: { id: teacherId } });
      if (!teacher) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Guru tidak ditemukan",
        });
      }
      if (teacher.role !== "TEACHER") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User bukan guru",
        });
      }

      await tx.user.update({
        where: { id: teacherId },
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

        await tx.class.updateMany({
          where: { homeroomId: teacherId },
          data: { homeroomId: null },
        });

        for (const kelas of foundClasses) {
          if (kelas.homeroomId && kelas.homeroomId !== teacherId) {
            throw new TRPCError({
              code: "CONFLICT",
              message: `Kelas ${kelas.name} sudah punya wali kelas lain`,
            });
          }
          await tx.class.update({
            where: { id: kelas.id },
            data: { homeroomId: teacherId },
          });
        }
      }

      return await tx.user.findUnique({
        where: { id: teacherId },
        include: { homeRoomFor: true },
      });
    });
  });
