import { adminProcedure, createTRPCRouter } from "../trpc";

export const AdminRouter = createTRPCRouter({
  getAllTeacher: adminProcedure.query(({ ctx, input, signal }) => {
    const data = ctx.db.user.findMany({
      where: {
        role: "TEACHER",
      },
    });
    return data;
  }),
});
