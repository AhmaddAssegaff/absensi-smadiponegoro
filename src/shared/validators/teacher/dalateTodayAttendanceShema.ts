import { z } from "zod";

export const updateManyAttendanceStudentShema = z.object({
  studentId: z.string().min(1),
});
