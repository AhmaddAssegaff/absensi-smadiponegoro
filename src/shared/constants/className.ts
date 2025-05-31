import { ClassName } from "@prisma/client";

export const classNames = Object.values(ClassName) as [
  ClassName,
  ...ClassName[],
];
