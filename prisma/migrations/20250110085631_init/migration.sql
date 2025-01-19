/*
  Warnings:

  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `categories_on_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories_on_product" DROP CONSTRAINT "categories_on_product_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categories_on_product" DROP CONSTRAINT "categories_on_product_productId_fkey";

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "productCategory" "ProductCategory" NOT NULL DEFAULT 'MEAT';

-- DropTable
DROP TABLE "categories";

-- DropTable
DROP TABLE "categories_on_product";
