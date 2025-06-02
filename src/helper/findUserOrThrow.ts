import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

type Options = {
  prisma: PrismaClient;
  id?: string;
  nisn?: string;
  include?: Parameters<PrismaClient["user"]["findUnique"]>[0]["include"];
};

export async function findUserOrThrow({ prisma, id, nisn, include }: Options) {
  const where = id ? { id } : { nisn };

  const user = await prisma.user.findUnique({ where, include });

  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User tidak ditemukan",
    });
  }

  return user;
}
