import { GetAllClass } from "@/server/api/routers/teacher/queries/getAllClass";
import { createTRPCRouter } from "@/server/api/trpc";

export const teacherRouter = createTRPCRouter({
  GetAllClass,
});
