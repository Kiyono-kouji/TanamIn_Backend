import { PrismaClient } from "../generated/prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  // Seed Themes
  const theme = await prisma.themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      price: 0,
<<<<<<< Updated upstream
      primaryColor: "#4CAF50",
      secondaryColor: "#81C784",
      textColor: "#FFFFFF",
    },
  })
=======
      primary: "#FFB86C",
      subprimary: "#FFE3A3",
      secondary: "#66BB6A",
      subsecondary: "#8CD87D",
      background: "#F5F5F5",
      subbackground: "#FFFFFF",
      text: "#222B45",
      subtext: "#7A7A7A",
      pie1: "#FFB86C",
      pie2: "#66BB6A",
    },
  })


  const theme2 = await prisma.themes.upsert({
    where: { id: 2 },
    update: {},
    create: {
      price: 100,
      primary: "#42A5F5",
      subprimary: "#BBDEFB",
      secondary: "#26A69A",
      subsecondary: "#80CBC4",
      background: "#FAFAFA",
      subbackground: "#FFFFFF",
      text: "#0D47A1",
      subtext: "#5472d3",
      pie1: "#42A5F5",
      pie2: "#26A69A",
    },
  })


  const theme3 = await prisma.themes.upsert({
    where: { id: 3 },
    update: {},
    create: {
      price: 150,
      primary: "#AB47BC",
      subprimary: "#E1BEE7",
      secondary: "#FF7043",
      subsecondary: "#FFAB91",
      background: "#FAFAFA",
      subbackground: "#FFFFFF",
      text: "#4A148C",
      subtext: "#7c43bd",
      pie1: "#AB47BC",
      pie2: "#FF7043",
    },
  })

>>>>>>> Stashed changes

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
      activeThemeId: theme.id,
      budgetingPercentage: 20,
      coin: 100,
      streak: 3,
      highestStreak: 5,
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
      name: "Inactive",
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
      name: "Active",
      total: 5000,
      walletType: "Investment",
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
  const question = await prisma.questions.upsert({
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

  // Seed User_Themes
  await prisma.user_Themes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: user.id,
      themeId: theme.id,
      unlocked: true,
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

  console.log("Seeded all tables!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })