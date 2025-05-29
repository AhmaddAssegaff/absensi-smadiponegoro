import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  for (let i = 1; i <= 20; i++) {
    await prisma.user.create({
      data: {
        nisn: `00${i.toString().padStart(4, "0")}`,
        name: `Guru ${i}`,
        passwordHash: password,
        role: "TEACHER",
        isActive: true,
      },
    });
  }

  console.log("✅ Seeding guru selesai.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
