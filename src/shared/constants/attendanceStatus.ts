import { AttendanceStatus } from "@prisma/client";

export { AttendanceStatus };

export const AttendanceStatuses = Object.values(
  AttendanceStatus,
) as AttendanceStatus[];
