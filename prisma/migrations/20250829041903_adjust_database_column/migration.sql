/*
  Warnings:

  - You are about to drop the column `user` on the `Database` table. All the data in the column will be lost.
  - Added the required column `path` to the `Database` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Database` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Database" DROP COLUMN "user",
ADD COLUMN     "path" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;
