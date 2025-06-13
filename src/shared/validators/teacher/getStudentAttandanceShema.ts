import { z } from "zod";

export const getStudentAttandanceShema = z.object({
  id: z.string(),
  month: z.number().min(1).max(12),
  year: z.number().min(2025),
});
