import { teacherProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { parseISO, startOfDay } from "date-fns";
import { AttendanceStatus } from "@/shared/constants/attendanceStatus";
import { z } from "zod";

export const UpdateManyAttandanceStudents = teacherProcedure
  .input(
    z.object({
      date: z.string().optional(),
      attendances: z
        .array(
          z.object({
            studentId: z.string().min(1),
            status: z.nativeEnum(AttendanceStatus),
            description: z.string().optional(),
          }),
        )
        .min(1),
    }),
  )
  .mutation(async ({ input, ctx }) => {
    const { attendances, date } = input;
    const teacherId = ctx.session?.user.id;

    const now = new Date();
    const attendanceDate = date ? startOfDay(parseISO(date)) : startOfDay(now);

    const year = attendanceDate.getFullYear();
    const month = attendanceDate.getMonth() + 1;

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

    try {
      await ctx.db.$transaction(async (tx) => {
        for (const { studentId, status, description } of attendances) {
          const student = validStudentMap.get(studentId);
          if (!student) continue; // skip kalau bukan siswa dari kelas wali

          await tx.attendance.upsert({
            where: {
              userId_dateAttandance: {
                userId: studentId,
                dateAttandance: attendanceDate,
              },
            },
            update: {
              status,
              description: description ?? "",
            },
            create: {
              userId: studentId,
              dateAttandance: attendanceDate,
              status,
              description: description ?? "",
            },
          });

          const existingSummary = await tx.attendanceSummary.findUnique({
            where: {
              userId_year_month: {
                userId: studentId,
                year,
                month,
              },
            },
          });

          const updateFields = {
            hadirTepat: status === "HADIR_TEPAT_WAKTU" ? 1 : 0,
            hadirTerlambat: status === "HADIR_TERLAMBAT" ? 1 : 0,
            izin: status === "IZIN" ? 1 : 0,
            sakit: status === "IZIN_SAKIT" ? 1 : 0,
            alpa: status === "ALPA" ? 1 : 0,
            keluarIzin: status === "HADIR_DAN_KELUAR_DENGAN_IZIN" ? 1 : 0,
            keluarTanpaIzin: status === "HADIR_DAN_KELUAR_TANPA_IZIN" ? 1 : 0,
            totalHadir: status.startsWith("HADIR") ? 1 : 0,
            totalTidakHadir:
              status === "ALPA" || status === "IZIN" || status === "IZIN_SAKIT"
                ? 1
                : 0,
            totalHari: 1,
          };

          if (existingSummary) {
            await tx.attendanceSummary.update({
              where: {
                userId_year_month: {
                  userId: studentId,
                  year,
                  month,
                },
              },
              data: {
                ...Object.fromEntries(
                  Object.entries(updateFields).map(([k, v]) => [
                    k,
                    { increment: v },
                  ]),
                ),
              },
            });
          } else {
            await tx.attendanceSummary.create({
              data: {
                userId: studentId,
                classId: student.classId,
                year,
                month,
                ...updateFields,
              },
            });
          }
        }
      });

      return { success: true };
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Gagal menyimpan absensi siswa.",
      });
    }
  });
