-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('MUTATION', 'INCREASE', 'DECREASE', 'PURCHASE', 'REFUND');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('WAITING_ADMIN_CONFIRMATION', 'SUCCESS', 'REJECTED', 'ON_PROGRESS', 'AUTOMATED');

-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PRODUCT', 'BUY_ONE_GET_ONE', 'MINIMAL_PURCHASE');

-- CreateEnum
CREATE TYPE "VoucherType" AS ENUM ('PRODUCT', 'DELIVERY', 'PURCHASE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING_FOR_PAYMENT', 'WAITING_ADMIN_CONFIRMATION', 'ORDER_PROCESSED', 'ORDER_SHIPPED', 'ORDER_RECEIVED', 'ORDER_CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('COMPLETED', 'CANCELLED', 'DENIED', 'EXPIRED', 'PENDING');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('QRIS', 'VIRTUAL_ACCOUNT', 'MANUAL_TRANSFER');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'CANCELLED', 'ON_DELIVERY', 'DELIVERED');

-- CreateTable
CREATE TABLE "provinces" (
    "id" SERIAL NOT NULL,
    "provinceName" TEXT NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" SERIAL NOT NULL,
    "cityName" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "provinceId" INTEGER NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subdistricts" (
    "id" SERIAL NOT NULL,
    "subdistrictName" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,

    CONSTRAINT "subdistricts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longtitude" DOUBLE PRECISION NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "postalCode" INTEGER,
    "userId" INTEGER NOT NULL,
    "cityId" INTEGER NOT NULL,
    "provinceId" INTEGER NOT NULL,
    "subdistrictId" INTEGER NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_admins" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stores" (
    "id" SERIAL NOT NULL,
    "storeName" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longtitude" DOUBLE PRECISION NOT NULL,
    "isMainStore" BOOLEAN NOT NULL DEFAULT false,
    "qty" INTEGER NOT NULL DEFAULT 0,
    "cityId" INTEGER NOT NULL,
    "storeAdminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_products" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories_on_product" (
    "productId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "categories_on_product_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" SERIAL NOT NULL,
    "qty" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_journals" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "type" TEXT,
    "status" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "fromStoreId" INTEGER NOT NULL,
    "toStoreId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stock_journals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "journal_details" (
    "id" SERIAL NOT NULL,
    "stockJournalId" INTEGER NOT NULL,
    "toStoreId" INTEGER NOT NULL,

    CONSTRAINT "journal_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "DiscountType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "limit" DOUBLE PRECISION NOT NULL,
    "minimalPurchase" DOUBLE PRECISION,
    "isActive" BOOLEAN DEFAULT true,
    "storeId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_discounts" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "discountId" INTEGER NOT NULL,
    "alreadyUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "VoucherType" NOT NULL,
    "value" INTEGER NOT NULL,
    "expiredDate" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vouchers" (
    "id" SERIAL NOT NULL,
    "alreadyUsed" BOOLEAN NOT NULL DEFAULT false,
    "voucherId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "user_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "orderCode" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "totalWeight" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING_FOR_PAYMENT',
    "userId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "userVoucherId" INTEGER,
    "userDiscountId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "discValue" INTEGER NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "totalWeight" INTEGER,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "userDiscountId" INTEGER,
    "userVoucherId" INTEGER,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "invoiceCode" TEXT NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "paymentProof" TEXT,
    "snapToken" TEXT,
    "snapRedirectUrl" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliveries" (
    "id" SERIAL NOT NULL,
    "deliveryCode" TEXT NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deliveryService" TEXT,
    "deliveryCourier" TEXT,
    "addressId" INTEGER NOT NULL,
    "storeId" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "stores_storeAdminId_key" ON "stores"("storeAdminId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_orderId_key" ON "payments"("orderId");

-- AddForeignKey
ALTER TABLE "cities" ADD CONSTRAINT "cities_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subdistricts" ADD CONSTRAINT "subdistricts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_subdistrictId_fkey" FOREIGN KEY ("subdistrictId") REFERENCES "subdistricts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_admins" ADD CONSTRAINT "store_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_storeAdminId_fkey" FOREIGN KEY ("storeAdminId") REFERENCES "store_admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_products" ADD CONSTRAINT "store_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_product" ADD CONSTRAINT "categories_on_product_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories_on_product" ADD CONSTRAINT "categories_on_product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_journals" ADD CONSTRAINT "stock_journals_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_details" ADD CONSTRAINT "journal_details_stockJournalId_fkey" FOREIGN KEY ("stockJournalId") REFERENCES "stock_journals"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "journal_details" ADD CONSTRAINT "journal_details_toStoreId_fkey" FOREIGN KEY ("toStoreId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_discounts" ADD CONSTRAINT "user_discounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_discounts" ADD CONSTRAINT "user_discounts_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vouchers" ADD CONSTRAINT "user_vouchers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userVoucherId_fkey" FOREIGN KEY ("userVoucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userDiscountId_fkey" FOREIGN KEY ("userDiscountId") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_userDiscountId_fkey" FOREIGN KEY ("userDiscountId") REFERENCES "user_discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_userVoucherId_fkey" FOREIGN KEY ("userVoucherId") REFERENCES "user_vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
