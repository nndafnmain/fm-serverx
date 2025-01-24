-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_storeId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "storeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
