import { GetAllClass } from "@/server/api/routers/teacher/queries/getAllClass";
import { GetClassByClassName } from "@/server/api/routers/teacher/queries/getClassByClassName";
import { GetMyClass } from "@/server/api/routers/teacher/queries/getMyClass";
import { GetQRCode } from "@/server/api/routers/teacher/queries/getQRCode";
import { GetDetailAttandanceStudentMonthly } from "@/server/api/routers/teacher/queries/getDetailAtandanceStudent";
import { GetMyClassByClassName } from "@/server/api/routers/teacher/queries/getMyClassByClassName";
import { UpdateManyAttandanceStudents } from "@/server/api/routers/teacher/mutation/updateManyAttendanceStudents";
import { DeleteTodayAttendanceStudent } from "@/server/api/routers/teacher/mutation/DeleteTodayAttendanceStudent";
import { createTRPCRouter } from "@/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  GetAllClass,
  GetClassByClassName,
  GetMyClassByClassName,
  GetMyClass,
  GetQRCode,
  GetDetailAttandanceStudentMonthly,
  UpdateManyAttandanceStudents,
  DeleteTodayAttendanceStudent,
});
