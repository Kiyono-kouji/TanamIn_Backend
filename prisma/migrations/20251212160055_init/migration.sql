-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "activeThemeId" INTEGER NOT NULL DEFAULT 1,
    "budgetingPercentage" INTEGER NOT NULL DEFAULT 0,
    "coin" INTEGER NOT NULL DEFAULT 0,
    "streak" INTEGER NOT NULL DEFAULT 0,
    "lastStreakDate" TIMESTAMP(3),
    "highestStreak" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pockets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "walletType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Pockets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerUnit" DOUBLE PRECISION NOT NULL,
    "action" TEXT NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "unitAmount" DOUBLE PRECISION NOT NULL,
    "pocketId" INTEGER NOT NULL,
    "toPocketId" INTEGER,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Levels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Levels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questions" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "option1" TEXT NOT NULL,
    "option2" TEXT NOT NULL,
    "option3" TEXT NOT NULL,
    "option4" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "levelId" INTEGER NOT NULL,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Themes" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "primary" TEXT NOT NULL,
    "subprimary" TEXT NOT NULL,
    "secondary" TEXT NOT NULL,
    "subsecondary" TEXT NOT NULL,
    "background" TEXT NOT NULL,
    "subbackground" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "subtext" TEXT NOT NULL,
    "pie1" TEXT NOT NULL,
    "pie2" TEXT NOT NULL,

    CONSTRAINT "Themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Themes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "unlocked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_Themes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_activeThemeId_fkey" FOREIGN KEY ("activeThemeId") REFERENCES "Themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pockets" ADD CONSTRAINT "Pockets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_pocketId_fkey" FOREIGN KEY ("pocketId") REFERENCES "Pockets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_toPocketId_fkey" FOREIGN KEY ("toPocketId") REFERENCES "Pockets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Levels" ADD CONSTRAINT "Levels_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questions" ADD CONSTRAINT "Questions_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "Levels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Themes" ADD CONSTRAINT "User_Themes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Themes" ADD CONSTRAINT "User_Themes_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Themes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create new migration file: prisma/migrations/[timestamp]_add_theme_colors/migration.sql

-- Add new color columns to Themes table
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "primary" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "subprimary" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "secondary" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "subsecondary" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "background" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "subbackground" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "text" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "subtext" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "pie1" TEXT;
ALTER TABLE "Themes" ADD COLUMN IF NOT EXISTS "pie2" TEXT;

-- Remove old color columns (if they exist)
ALTER TABLE "Themes" DROP COLUMN IF EXISTS "primaryColor";
ALTER TABLE "Themes" DROP COLUMN IF EXISTS "secondaryColor";
ALTER TABLE "Themes" DROP COLUMN IF EXISTS "textColor";

-- Update existing data with default colors
UPDATE "Themes" SET 
  "primary" = COALESCE("primary", '#4CAF50'),
  "subprimary" = COALESCE("subprimary", '#66BB6A'),
  "secondary" = COALESCE("secondary", '#81C784'),
  "subsecondary" = COALESCE("subsecondary", '#A5D6A7'),
  "background" = COALESCE("background", '#FFFFFF'),
  "subbackground" = COALESCE("subbackground", '#F5F5F5'),
  "text" = COALESCE("text", '#212121'),
  "subtext" = COALESCE("subtext", '#757575'),
  "pie1" = COALESCE("pie1", '#4CAF50'),
  "pie2" = COALESCE("pie2", '#81C784');

-- Make columns NOT NULL after setting defaults
ALTER TABLE "Themes" ALTER COLUMN "primary" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "subprimary" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "secondary" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "subsecondary" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "background" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "subbackground" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "text" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "subtext" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "pie1" SET NOT NULL;
ALTER TABLE "Themes" ALTER COLUMN "pie2" SET NOT NULL;
