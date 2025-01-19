-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('VEGGIES', 'FRUITS', 'MEAT', 'FISH', 'DRINKS', 'SNACKS');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;
