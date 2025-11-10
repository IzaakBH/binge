-- CreateEnum
CREATE TYPE "OrderState" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "beanId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "orderState" "OrderState" NOT NULL DEFAULT 'PENDING',
    "orderPlacedDateTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
