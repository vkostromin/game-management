import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { login: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      login: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
      balance: 0,
    },
  });

  // Create sample game
  await prisma.game.create({
    data: {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      location: "Main Sports Hall",
      maxPlayers: 18,
      pricePerPerson: 35,
      status: "OPEN",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
