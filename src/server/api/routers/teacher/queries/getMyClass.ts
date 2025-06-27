import { teacherProcedure } from "@/server/api/trpc";

export const GetMyClass = teacherProcedure.query(({ ctx }) => {
  const teacherId = ctx.session?.user.id;

  return ctx.db.class.findFirst({
    where: {
      homeroomId: {
        equals: teacherId,
      },
    },
    select: {
      id: true,
      ClassName: true,
      homeroom: {
        select: {
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
