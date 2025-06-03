import { z } from "zod";
import { baseUserSchema } from "@/shared/validators/baseUserShema";
import { classNames } from "@/shared/constants/className";

export const createUserSchema = baseUserSchema
  .extend({
    classesAsStudent: z
      .enum(classNames, {
        errorMap: () => ({ message: "Harap pilih kelas yang valid" }),
      })
      .optional(),
    homeRoomFor: z.array(z.enum(classNames)).optional(),
  })
  .refine(
    (data) =>
      data.role !== "STUDENT" ||
      (data.classesAsStudent && data.classesAsStudent.length > 0),
    {
      message: "Kelas wajib diisi untuk siswa",
      path: ["classesAsStudent"],
    },
  );

export type CreateUserInput = z.infer<typeof createUserSchema>;
