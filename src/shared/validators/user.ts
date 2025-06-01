import { z } from "zod";
import { roles } from "@/shared/constants/role";
import { classNames } from "@/shared/constants/className";

export const getUserById = z.object({
  id: z.string(),
});

export const createUserFE = z
  .object({
    nisn: z.string().min(1, "Wajib diisi"),
    name: z.string().min(1, "Nama wajib diisi"),
    passwordHash: z.string().min(6, "Password minimal 6 karakter"),
    role: z.enum(roles),
    className: z.enum(classNames).optional(),
    homeRoomFor: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "STUDENT" && !data.className) {
      ctx.addIssue({
        path: ["className"],
        code: z.ZodIssueCode.custom,
        message: "Class wajib diisi untuk student",
      });
    }
  });

export type CreateUserInferFE = z.infer<typeof createUserFE>;
