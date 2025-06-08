import { createTRPCRouter } from "@/server/api/trpc";
import { GetAttendanceStudent } from "@/server/api/routers/student/queries/getAttendanceStudent";
import { CreateAttendanceStudent } from "@/server/api/routers/student/mutation/createAttendanceStudent";

export const studentRouter = createTRPCRouter({
  GetAttendanceStudent,
  CreateAttendanceStudent,
});
