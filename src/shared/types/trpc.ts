import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;

export type GetAllTeacherOutput = RouterOutput["admin"]["GetAllTeacher"];
export type User = GetAllTeacherOutput["data"][number];

export type GetAttendanceStudent =
  RouterOutput["student"]["GetAttendanceStudent"];
export type Attendance = GetAttendanceStudent["data"][number];
