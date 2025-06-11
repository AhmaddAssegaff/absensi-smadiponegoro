import { teacherProcedure } from "@/server/api/trpc";
import { getClassByClassNameShema } from "@/shared/validators/teacher/getClassByClassNameShema";
import { TRPCError } from "@trpc/server";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export const GetClassByClassName = teacherProcedure
  .input(getClassByClassNameShema)
  .query(({ ctx, input }) => {
    const { className, date } = input;

    if (!className) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kelas tidak di temukan",
      });
    }

    const targetDate = date ? parseISO(date) : new Date();

    if (isNaN(targetDate.getTime())) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Format tanggal tidak valid",
      });
    }

    const todayStart = startOfDay(targetDate);
    const todayEnd = endOfDay(targetDate);

    return ctx.db.class.findFirst({
      where: { ClassName: className },
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
        students: {
          select: {
            id: true,
            name: true,
            attendances: {
              where: {
                dateAttandance: {
                  gte: todayStart,
                  lte: todayEnd,
                },
              },
              select: {
                id: true,
                status: true,
                dateAttandance: true,
                description: true,
              },
            },
          },
        },
      },
    });
  });
