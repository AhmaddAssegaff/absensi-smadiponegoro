import { createTRPCRouter } from "@/server/api/trpc";
import { GetAllTeacher } from "@/server/api/routers/admin/queries/getAllTeacher";
import { GetUserById } from "@/server/api/routers/admin/queries/getUserById";
import { UpdateUserTeacher } from "@/server/api/routers/admin/mutation/updateUser";
import { CreateUser } from "@/server/api/routers/admin/mutation/createUser";

export const adminRouter = createTRPCRouter({
  GetAllTeacher,
  GetUserById,
  UpdateUserTeacher,
  CreateUser,
});
