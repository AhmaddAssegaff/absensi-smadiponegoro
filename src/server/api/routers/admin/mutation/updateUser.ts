import { hashPassword } from "@/helper/hash";
import { updateTeacherInputBE } from "@/shared/validators/teacher";
import { TRPCError } from "@trpc/server";
import { adminProcedure } from "@/server/api/trpc";

export const UpdateUserTeacher = adminProcedure
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
  });
