import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
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
    email: "admin@gmail.com",
    password: "Admin@123",
    name: "Admin",
    role: RoleName.ADMIN,
  },
  {
    email: "manager@gmail.com",
    password: "Manager@123",
    name: "Manager",
    role: RoleName.MANAGER,
  },
  {
    email: "auditor@gmail.com",
    password: "Auditor@123",
    name: "Auditor",
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

  await seedCategories();

  console.log("Seed completed: roles, users, and document categories created.");
}

async function seedCategories() {
  const categories = [
    { name: "Financial", description: "Financial statements and records" },
    { name: "Tax", description: "GST and tax related documents" },
    { name: "Legal", description: "Legal and compliance documents" },
    { name: "Operational", description: "Operational audit documents" },
  ];

  for (const category of categories) {
    await prisma.documentCategory.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
