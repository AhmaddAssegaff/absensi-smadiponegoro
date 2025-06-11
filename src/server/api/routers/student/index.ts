import { createTRPCRouter } from "@/server/api/trpc";
import { GetAttendanceStudent } from "@/server/api/routers/student/queries/getAttendanceStudent";
import { GetAttendanceSummaryStudent } from "@/server/api/routers/student/queries/getAttendanceSummaryStudent";
import { GetAttendanceSummaryAllTime } from "@/server/api/routers/student/queries/getAttendanceSummaryAllTime";
import { CreateAttendanceStudent } from "@/server/api/routers/student/mutation/createAttendanceStudent";

export const studentRouter = createTRPCRouter({
  GetAttendanceStudent,
  GetAttendanceSummaryStudent,
  GetAttendanceSummaryAllTime,
  CreateAttendanceStudent,
});
