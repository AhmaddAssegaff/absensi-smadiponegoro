import { z } from "zod";
import { classNames } from "@/shared/constants/className";

export const updateTeacherShemaFE = z.object({
  name: z.string().optional(),
  nisn: z.string().optional(),
  password: z.string().optional(),
  classNames: z.array(z.enum(classNames)).default([]),
});

export type UpdateTeacherInputFE = z.infer<typeof updateTeacherShemaFE>;

export const getAllTeacherInput = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(15).default(10),
  sortBy: z.enum(["name", "createdAt", "updatedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const updateTeacherInputBE = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  nisn: z.string().min(1).optional(),
  password: z.string().min(6).optional(),
  classNames: z.array(z.enum(classNames)).optional(),
});
