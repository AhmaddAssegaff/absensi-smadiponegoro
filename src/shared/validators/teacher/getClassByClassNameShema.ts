import { ClassName } from "@/shared/constants/className";
import { z } from "zod";

export const getClassByClassNameShema = z.object({
  className: z.nativeEnum(ClassName),
  date: z.string().optional(),
});
