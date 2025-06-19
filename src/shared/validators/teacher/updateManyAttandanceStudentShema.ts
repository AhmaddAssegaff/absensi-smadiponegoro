import { z } from "zod";
import { AttendanceStatus } from "@/shared/constants/attendanceStatus";

export const updateManyAttendanceStudentSchema = z.object({
  attendances: z
    .array(
      z.object({
        studentId: z.string().min(1),
        status: z.nativeEnum(AttendanceStatus, {
          required_error: "Status wajib dipilih",
        }),
        description: z
          .string()
          .min(1, "Deskripsi wajib diisi")
          .max(255, "Deskripsi terlalu panjang"),
      }),
    )
    .min(1, "Minimal satu data harus diubah"),
});

export type AttendanceFormValues = z.infer<
  typeof updateManyAttendanceStudentSchema
>;
