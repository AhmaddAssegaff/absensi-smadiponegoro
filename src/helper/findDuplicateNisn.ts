import type { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function findDuplicateNisn({
  prisma,
  nisn,
  excludeUserId,
}: {
  prisma: PrismaClient;
  nisn: string;
  excludeUserId?: string;
}) {
  const user = await prisma.user.findFirst({
    where: {
      nisn,
      ...(excludeUserId && {
        NOT: { id: excludeUserId },
      }),
    },
  });

  if (user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "NISN sudah terdaftar",
    });
  }
}
