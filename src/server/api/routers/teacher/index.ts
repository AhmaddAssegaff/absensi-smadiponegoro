import { GetAllClass } from "@/server/api/routers/teacher/queries/getAllClass";
import { GetClassByClassName } from "@/server/api/routers/teacher/queries/getClassByClassName";
import { GetMyClass } from "@/server/api/routers/teacher/queries/getMyClass";
import { GetQRCode } from "@/server/api/routers/teacher/queries/getQRCode";
import { GetDetailAttandanceStudentMonthly } from "@/server/api/routers/teacher/queries/getDetailAtandanceStudent";
import { createTRPCRouter } from "@/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  GetAllClass,
  GetClassByClassName,
  GetMyClass,
  GetQRCode,
  GetDetailAttandanceStudentMonthly,
});
