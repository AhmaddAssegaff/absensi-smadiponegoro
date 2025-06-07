import { db } from "@/server/db";
import { env } from "@/env";
import type { NextApiRequest, NextApiResponse } from "next";
import { endOfDay } from "date-fns";

function generateCode(): string {
  return Math.random().toString(36).substring(2, 10);
}

function getEndOfToday(): Date {
  return endOfDay(new Date());
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const authHeader = req.headers.authorization;
  const secret = env.CRON_SECRET;

  if (!authHeader || authHeader !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const code = generateCode();
    const expiresAt = getEndOfToday();

    await db.qRCode.upsert({
      where: { id: "only" },
      update: { code, expiresAt },
      create: { id: "only", code, expiresAt },
    });

    return res.status(200).json({ success: true, code });
  } catch (error) {
    console.error("QR update failed", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal Server Error" });
  }
}
