import { z } from "zod";
import { paginationShema } from "@/shared/validators/common/paginationShema";

export const paginationAttandanceShema = paginationShema.extend({
  sortBy: z.enum(["dateAttandance", "status"]).default("dateAttandance"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
