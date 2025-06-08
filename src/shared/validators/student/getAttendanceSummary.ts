import { z } from "zod";

export const GetAttendanceSummaryStudentShema = z.object({
  months: z.number().min(1).max(12),
  years: z.number().min(2025),
});
