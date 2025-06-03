import { Role } from "@prisma/client";

export { Role };

export const roles = Object.values(Role) as Role[];
