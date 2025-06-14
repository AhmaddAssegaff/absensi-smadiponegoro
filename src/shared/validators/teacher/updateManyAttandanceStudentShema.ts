import { AttendanceStatus } from "@/shared/constants/attendanceStatus";
import { z } from "zod";

export const updateManyAttendanceStudentShema = z.object({
  attendances: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.nativeEnum(AttendanceStatus),
        description: z.string().optional(),
      }),
    )
    .min(1),
});
