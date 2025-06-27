import { teacherProcedure } from "@/server/api/trpc";

export const GetQRCode = teacherProcedure.query(({ ctx }) => {
  return ctx.db.qRCode.findFirst({
    select: {
      code: true,
      expiresAt: true,
      updatedAt: true,
    },
  });
});
