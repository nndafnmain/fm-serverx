/*
  Warnings:

  - A unique constraint covering the columns `[userId,productId]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_productId_key" ON "carts"("userId", "productId");
