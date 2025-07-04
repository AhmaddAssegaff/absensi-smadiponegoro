import { z } from "zod";
import { paginationShema } from "@/shared/validators/common/paginationShema";

export const paginationTeacherSchema = paginationShema.extend({
  sortBy: z.enum(["name", "nisn", "role", "updatedAt"]).default("updatedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
