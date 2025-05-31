import { z } from "zod";

export const getUserById = z.object({
  id: z.string(),
});
