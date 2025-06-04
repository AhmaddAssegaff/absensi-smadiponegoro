import { teacherProcedure } from "@/server/api/trpc";
import { getClassByClassName } from "@/shared/validators/teacher/getClassByClassName";

export const GetClassByClassName = teacherProcedure
  .input(getClassByClassName)
  .query(({ ctx, input }) => {
    const { className, gender } = input;

    return ctx.db.class.findFirst({
      where: { className: className, gender: gender },
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
