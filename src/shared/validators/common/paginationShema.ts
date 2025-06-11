import { z } from "zod";

export const paginationShema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(15).default(10),
});
