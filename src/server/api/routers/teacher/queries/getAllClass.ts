import { teacherProcedure } from "@/server/api/trpc";

export const GetAllClass = teacherProcedure.query(({ ctx }) => {
  return ctx.db.class.findMany({
    orderBy: { ClassName: "asc" },
    include: {
      homeroom: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
});
