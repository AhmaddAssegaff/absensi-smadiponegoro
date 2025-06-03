import { z } from "zod";
import { baseUserSchema } from "@/shared/validators/common/baseUserShema";
import { ClassName } from "@/shared/constants/className";

export const createUserSchema = baseUserSchema
  .extend({
    classesAsStudent: z
      .nativeEnum(ClassName, {
        errorMap: () => ({ message: "Harap pilih kelas yang valid" }),
      })
      .optional(),
    homeRoomFor: z.array(z.nativeEnum(ClassName)).optional(),
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
