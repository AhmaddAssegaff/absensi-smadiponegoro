import { z } from "zod";
import { ClassName } from "@prisma/client";

export const updateTeacherShema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  nisn: z.string().min(1).optional(),
  password: z.string(),
  classNames: z.array(z.nativeEnum(ClassName)).optional(),
});

export type UpdateTeacherInput = z.infer<typeof updateTeacherShema>;
