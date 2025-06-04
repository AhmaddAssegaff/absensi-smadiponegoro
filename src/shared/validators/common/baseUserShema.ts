import { z } from "zod";
import { Role } from "@/shared/constants/role";
import { Gender } from "@/shared/constants/gender";

export const baseUserSchema = z.object({
  nisn: z.string().min(1),
  name: z.string().min(1),
  passwordHash: z.string().min(6),
  role: z.nativeEnum(Role),
  gender: z.nativeEnum(Gender),
});
