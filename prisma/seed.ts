import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Seed Themes with all color fields
  const theme1 = await prisma.themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      price: 0,
      primary: "#4CAF50",
      subprimary: "#66BB6A",
      secondary: "#81C784",
      subsecondary: "#A5D6A7",
      background: "#FFFFFF",
      subbackground: "#F5F5F5",
      text: "#212121",
      subtext: "#757575",
      pie1: "#4CAF50",
      pie2: "#81C784",
    },
  })
  

  const theme2 = await prisma.themes.upsert({
    where: { id: 2 },
    update: {},
    create: {
      price: 100,
      primary: "#2196F3",
      subprimary: "#42A5F5",
      secondary: "#64B5F6",
      subsecondary: "#90CAF9",
      background: "#FFFFFF",
      subbackground: "#E3F2FD",
      text: "#0D47A1",
      subtext: "#1976D2",
      pie1: "#2196F3",
      pie2: "#64B5F6",
    },
  })
  

  const theme3 = await prisma.themes.upsert({
    where: { id: 3 },
    update: {},
    create: {
      price: 150,
      primary: "#FF9800",
      subprimary: "#FFA726",
      secondary: "#FFB74D",
      subsecondary: "#FFCC80",
      background: "#FFFFFF",
      subbackground: "#FFF3E0",
      text: "#E65100",
      subtext: "#F57C00",
      pie1: "#FF9800",
      pie2: "#FFB74D",
    },
  })
  

  // Hash the password for the seeded user
  const hashedPassword = await bcrypt.hash("password123", 10)

  // Seed Users
  const user = await prisma.users.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test User",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      activeThemeId: theme1.id,
      budgetingPercentage: 20,
      coin: 500,
      streak: 3,
      highestStreak: 5,
    },
  })

  // Seed User_Themes (unlock default theme for user)
  await prisma.user_Themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      themeId: theme1.id,
      unlocked: true,
    },
  })

  // Seed Pockets
  await prisma.pockets.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Kebutuhan",
      total: 5000,
      walletType: "Main",
      isActive: true,
      userId: user.id,
    },
  })

  await prisma.pockets.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Investment",
      total: 5000,
      walletType: "Investment",
      isActive: true,
      userId: user.id,
    },
  })

  await prisma.pockets.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Savings",
      total: 5000,
      walletType: "Savings",
      isActive: true,
      userId: user.id,
    },
  })

  // Seed Levels
  const level = await prisma.levels.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Level 1",
      isCompleted: false,
      userId: user.id,
    },
  })

  // Seed Questions
  await prisma.questions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      question: "What is 2 + 2?",
      option1: "3",
      option2: "4",
      option3: "5",
      option4: "6",
      answer: "4",
      levelId: level.id,
    },
  })

  // Seed Transactions
  await prisma.transactions.upsert({
    where: { id: 1 },
    update: {},
    create: {
      date: new Date(),
      name: "Buy Seeds",
      pricePerUnit: 1000,
      action: "Buy",
      nominal: 2000,
      unitAmount: 2,
      pocketId: 1,
      toPocketId: 2,
    },
  })

  await prisma.transactions.upsert({
    where: { id: 2 },
    update: {},
    create: {
      date: new Date(),
      name: "Sell Plants",
      pricePerUnit: 1500,
      action: "Sell",
      nominal: 3000,
      unitAmount: 2,
      pocketId: 2,
      toPocketId: 1,
    },
  })

  await prisma.transactions.upsert({
    where: { id: 3 },
    update: {},
    create: {
      date: new Date(),
      name: "Pocket Transfer",
      pricePerUnit: 0,
      action: "Out",
      nominal: 1000,
      unitAmount: 1,
      pocketId: 1,
      toPocketId: 3,
    },
  })

  console.log("✅ Seeded all tables successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })