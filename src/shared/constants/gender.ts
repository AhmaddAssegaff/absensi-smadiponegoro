import { Gender } from "@prisma/client";

export { Gender };

export const Genders = Object.values(Gender) as Gender[];
