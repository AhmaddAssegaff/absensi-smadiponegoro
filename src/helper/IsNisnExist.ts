import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export async function isNisnExist({
  prisma,
  nisn,
}: {
  prisma: PrismaClient;
  nisn: string;
}) {
  const user = await prisma.user.findUnique({
    where: { nisn },
  });

  if (user) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "NISN sudah terdaftar",
    });
  }
}
