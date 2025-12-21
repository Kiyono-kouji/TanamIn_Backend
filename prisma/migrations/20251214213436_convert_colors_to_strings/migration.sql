-- CreateEnum
CREATE TYPE "UserThemeUnlocked" AS ENUM('false', 'true');

-- AlterTable
ALTER TABLE "themes" ADD COLUMN     "primary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subprimary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "secondary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subsecondary" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "background" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subbackground" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "text" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subtext" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pie1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "pie2" TEXT NOT NULL DEFAULT '';

-- Migrate existing JSON data to new columns
UPDATE "themes" SET 
    "primary" = COALESCE(("colors"->>'primary')::TEXT, ''),
    "subprimary" = COALESCE(("colors"->>'subprimary')::TEXT, ''),
    "secondary" = COALESCE(("colors"->>'secondary')::TEXT, ''),
    "subsecondary" = COALESCE(("colors"->>'subsecondary')::TEXT, ''),
    "background" = COALESCE(("colors"->>'background')::TEXT, ''),
    "subbackground" = COALESCE(("colors"->>'subbackground')::TEXT, ''),
    "text" = COALESCE(("colors"->>'text')::TEXT, ''),
    "subtext" = COALESCE(("colors"->>'subtext')::TEXT, ''),
    "pie1" = COALESCE(("colors"->>'pie1')::TEXT, ''),
    "pie2" = COALESCE(("colors"->>'pie2')::TEXT, '');

-- Drop the old colors column
ALTER TABLE "themes" DROP COLUMN "colors";