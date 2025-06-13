import { z } from "zod";

export const CreateAttendanceStudentShema = z.object({
  code: z.string(),
  description: z.string().optional(),
  latitude: z.number(),
  longitude: z.number(),
});
