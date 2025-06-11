import { z } from "zod";
import { paginationShema } from "@/shared/validators/common/paginationShema";

export const paginationAttandanceShema = paginationShema.extend({
  sortBy: z.enum(["createdAt", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
