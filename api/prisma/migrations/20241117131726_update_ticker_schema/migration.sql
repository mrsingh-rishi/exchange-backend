/*
  Warnings:

  - Added the required column `firstPrice` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `high` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastPrice` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `low` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceChange` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceChangePercent` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quoteVolume` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trades` to the `Ticker` table without a default value. This is not possible if the table is not empty.
  - Added the required column `volume` to the `Ticker` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticker" ADD COLUMN     "firstPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "high" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "lastPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "low" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceChange" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceChangePercent" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "quoteVolume" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "trades" INTEGER NOT NULL,
ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL;
