import { Role } from "@prisma/client";

export const roles = Object.values(Role) as [Role, ...Role[]];
