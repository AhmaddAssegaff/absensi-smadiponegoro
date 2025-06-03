import { getUserById } from "@/shared/validators/getUserById";
import { adminProcedure } from "@/server/api/trpc";

export const GetUserById = adminProcedure
  .input(getUserById)
  .query(async ({ ctx, input }) => {
    const { id: teacherUserId } = input;
    return await ctx.db.user.findUnique({
      where: {
        id: teacherUserId,
      },
      include: {
        homeRoomFor: true,
      },
    });
  });
