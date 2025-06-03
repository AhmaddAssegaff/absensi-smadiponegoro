import { hashPassword } from "@/helper/hash";
import { findDuplicateNisn } from "@/helper/findDuplicateNisn";
import { createUserFE } from "@/shared/validators/user";
import { type Prisma } from "@prisma/client";
import { adminProcedure } from "@/server/api/trpc";

export const CreateUser = adminProcedure
  .input(createUserFE)
  .mutation(async ({ ctx, input }) => {
    const { name, nisn, passwordHash, role, className, homeRoomFor } = input;

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
  });
