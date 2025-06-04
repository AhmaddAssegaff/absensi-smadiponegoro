import { z } from "zod";
import { ClassName } from "@/shared/constants/className";

export const updateUserShema = z.object({
  id: z.string(),
  name: z.string().optional(),
  nisn: z.string().optional(),
  password: z.string().optional(),
  classNames: z.array(z.nativeEnum(ClassName)).default([]),
});

export type UpdateUserInput = z.infer<typeof updateUserShema>;
