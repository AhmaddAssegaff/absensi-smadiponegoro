import { getUserById } from "@/shared/validators/user";
import { adminProcedure } from "@/server/api/trpc";
import { isNisnExist } from "@/helper/isUserExist";

export const GetUserById = adminProcedure
  .input(getUserById)
  .query(async ({ ctx, input }) => {
    return await isNisnExist({
      prisma: ctx.db,
      id: input.id,
      include: { homeRoomFor: true },
    });
  });
