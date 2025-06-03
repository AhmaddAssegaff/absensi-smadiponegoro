import { z } from "zod";
import { roles } from "@/shared/constants/role";
import { classNames } from "@/shared/constants/className";

export const createUserSchema = z
  .object({
    nisn: z.string().min(1, "NISN wajib diisi"),
    name: z.string().min(1, "Nama wajib diisi"),
    passwordHash: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(roles),
    classesAsStudent: z.enum(classNames),
    homeRoomFor: z.array(z.enum(classNames)).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "STUDENT") {
      if (!data.classesAsStudent) {
        ctx.addIssue({
          path: ["classesAsStudent"],
          code: z.ZodIssueCode.custom,
          message: "Kelas wajib diisi untuk murid",
        });
      }
      if (data.homeRoomFor && data.homeRoomFor.length > 0) {
        ctx.addIssue({
          path: ["homeRoomFor"],
          code: z.ZodIssueCode.custom,
          message: "Student tidak boleh menjadi wali kelas",
        });
      }
    }

    if (data.role === "TEACHER") {
      if (data.classesAsStudent) {
        ctx.addIssue({
          path: ["classesAsStudent"],
          code: z.ZodIssueCode.custom,
          message: "Teacher tidak boleh punya kelas",
        });
      }
    }

    if (data.role === "ADMIN") {
      if (data.classesAsStudent) {
        ctx.addIssue({
          path: ["classesAsStudent"],
          code: z.ZodIssueCode.custom,
          message: "Admin tidak boleh punya kelas",
        });
      }
      if (data.homeRoomFor && data.homeRoomFor.length > 0) {
        ctx.addIssue({
          path: ["homeRoomFor"],
          code: z.ZodIssueCode.custom,
          message: "Admin tidak boleh jadi wali kelas",
        });
      }
    }
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
