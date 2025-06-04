import { ClassName } from "@/shared/constants/className";
import { Gender } from "@/shared/constants/gender";
import { z } from "zod";

export const getClassByClassName = z.object({
  className: z.nativeEnum(ClassName),
  gender: z.nativeEnum(Gender),
});
