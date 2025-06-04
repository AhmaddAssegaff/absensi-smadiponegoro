import { GetAllClass } from "@/server/api/routers/teacher/queries/getAllClass";
import { GetClassByClassName } from "@/server/api/routers/teacher/queries/getClassByClassName";
import { createTRPCRouter } from "@/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  GetAllClass,
  GetClassByClassName,
});
