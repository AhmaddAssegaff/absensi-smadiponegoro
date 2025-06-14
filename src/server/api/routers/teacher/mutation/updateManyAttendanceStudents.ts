import { teacherProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { type AttendanceStatus } from "@/shared/constants/attendanceStatus";
import { updateManyAttendanceStudentShema } from "@/shared/validators/teacher/updateManyAttandanceStudentShema";

export const UpdateManyAttandanceStudents = teacherProcedure
  .input(updateManyAttendanceStudentShema)
  .mutation(async ({ input, ctx }) => {
    const { attendances } = input;
    const teacherId = ctx.session?.user.id;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
    );

    const validStudents = await ctx.db.user.findMany({
      where: {
        id: {
          in: attendances.map((a) => a.studentId),
        },
        classId: {
          not: null,
        },
        classesAsStudent: {
          is: {
            homeroomId: teacherId,
          },
        },
      },
      select: {
        id: true,
        classId: true,
      },
    });

    const validStudentMap = new Map(validStudents.map((s) => [s.id, s]));

    type SummaryField =
      | "hadirTepat"
      | "hadirTerlambat"
      | "izin"
      | "sakit"
      | "alpa"
      | "keluarIzin"
      | "keluarTanpaIzin"
      | "totalHadir"
      | "totalTidakHadir";

    const countFields = (
      s?: AttendanceStatus,
    ): Record<SummaryField, number> => ({
      hadirTepat: s === "HADIR_TEPAT_WAKTU" ? 1 : 0,
      hadirTerlambat: s === "HADIR_TERLAMBAT" ? 1 : 0,
      izin: s === "IZIN" ? 1 : 0,
      sakit: s === "IZIN_SAKIT" ? 1 : 0,
      alpa: s === "ALPA" ? 1 : 0,
      keluarIzin: s === "HADIR_DAN_KELUAR_DENGAN_IZIN" ? 1 : 0,
      keluarTanpaIzin: s === "HADIR_DAN_KELUAR_TANPA_IZIN" ? 1 : 0,
      totalHadir: s?.startsWith("HADIR") ? 1 : 0,
      totalTidakHadir:
        s === "ALPA" || s === "IZIN" || s === "IZIN_SAKIT" ? 1 : 0,
    });

    try {
      await ctx.db.$transaction(async (tx) => {
        for (const { studentId, status, description } of attendances) {
          const student = validStudentMap.get(studentId);
          if (!student) continue;

          const existing = await tx.attendance.findFirst({
            where: {
              userId: studentId,
              createdAt: {
                gte: startOfDay,
                lt: endOfDay,
              },
            },
          });

          const prevStatus = existing?.status;
          const newStatus = status;

          const minus = countFields(prevStatus);
          const plus = countFields(newStatus);

          const updateSummaryFields: Record<string, { increment: number }> = {};
          (Object.keys(plus) as SummaryField[]).forEach((key) => {
            updateSummaryFields[key] = {
              increment: plus[key] - minus[key],
            };
          });

          const isNew = !existing;
          if (isNew) {
            updateSummaryFields.totalHari = { increment: 1 };
          }

          if (existing) {
            await tx.attendance.update({
              where: {
                id: existing.id,
              },
              data: {
                status,
                description: description ?? "",
                dateAttandance: now,
              },
            });
          } else {
            await tx.attendance.create({
              data: {
                userId: studentId,
                dateAttandance: now,
                status,
                description: description ?? "",
              },
            });
          }

          const summaryExists = await tx.attendanceSummary.findUnique({
            where: {
              userId_year_month: {
                userId: studentId,
                year,
                month,
              },
            },
          });

          if (summaryExists) {
            await tx.attendanceSummary.update({
              where: {
                userId_year_month: {
                  userId: studentId,
                  year,
                  month,
                },
              },
              data: updateSummaryFields,
            });
          } else {
            await tx.attendanceSummary.create({
              data: {
                userId: studentId,
                classId: student.classId,
                year,
                month,
                totalHari: 1,
                ...plus,
              },
            });
          }
        }
      });

      return { success: true };
    } catch (e) {
      console.error(e);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal menyimpan absensi siswa.",
      });
    }
  });
