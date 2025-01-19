/*
  Warnings:

  - You are about to drop the column `qty` on the `carts` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "carts" DROP COLUMN "qty",
ADD COLUMN     "quantity" INTEGER NOT NULL;
