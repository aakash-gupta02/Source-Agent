/*
  Warnings:

  - You are about to drop the column `apiKey` on the `AIProvider` table. All the data in the column will be lost.
  - Added the required column `credentials` to the `AIProvider` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keyVersion` to the `AIProvider` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIProvider" DROP COLUMN "apiKey",
ADD COLUMN     "credentials" TEXT NOT NULL,
ADD COLUMN     "keyVersion" TEXT NOT NULL;
