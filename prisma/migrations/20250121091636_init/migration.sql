-- DropForeignKey
ALTER TABLE "carts" DROP CONSTRAINT "carts_storeId_fkey";

-- AlterTable
ALTER TABLE "carts" ALTER COLUMN "storeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
