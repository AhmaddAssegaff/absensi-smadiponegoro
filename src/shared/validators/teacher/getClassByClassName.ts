import { ClassName } from "@/shared/constants/className";
import { z } from "zod";

export const getClassByClassName = z.object({
  className: z.nativeEnum(ClassName),
});
