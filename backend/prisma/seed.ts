import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { RoleName } from "../src/dtos";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ROLES: { name: RoleName; description: string }[] = [
  { name: RoleName.ADMIN, description: "Full system access" },
  { name: RoleName.MANAGER, description: "Manage clients and audit engagements" },
  { name: RoleName.AUDITOR, description: "Execute audit work and review documents" },
];

const USERS = [
  {
    email: "admin@demo.com",
    password: "Admin@123",
    name: "Demo Admin",
    role: RoleName.ADMIN,
  },
  {
    email: "manager@demo.com",
    password: "Manager@123",
    name: "Demo Manager",
    role: RoleName.MANAGER,
  },
  {
    email: "auditor@demo.com",
    password: "Auditor@123",
    name: "Demo Auditor",
    role: RoleName.AUDITOR,
  },
];

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
  }

  const roles = await prisma.role.findMany();
  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r.uid]));

  for (const user of USERS) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        password: hashedPassword,
        name: user.name,
        roleUid: roleByName[user.role],
        isActive: true,
      },
      create: {
        email: user.email,
        password: hashedPassword,
        name: user.name,
        roleUid: roleByName[user.role],
      },
    });
  }

  console.log("Seed completed: 3 roles and 3 users created.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
