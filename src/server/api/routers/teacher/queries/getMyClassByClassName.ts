import { teacherProcedure } from "@/server/api/trpc";
import { getClassByClassNameShema } from "@/shared/validators/teacher/getClassByClassNameShema";
import { TRPCError } from "@trpc/server";
import { parseISO, startOfDay, endOfDay } from "date-fns";

export const GetMyClassByClassName = teacherProcedure
  .input(getClassByClassNameShema)
  .query(async ({ ctx, input }) => {
    const { className, date } = input;

    if (!className) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kelas tidak ditemukan",
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

    const userTeacherId = ctx.session?.user.id;

    const classData = await ctx.db.class.findFirst({
      where: { homeroomId: userTeacherId, ClassName: className },
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

    if (!classData) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Kamu tidak memiliki akses ke kelas ini.",
      });
    }

    return classData;
  });
