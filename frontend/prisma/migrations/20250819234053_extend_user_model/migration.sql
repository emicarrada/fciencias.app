/*
  Warnings:

  - The `career` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Career" AS ENUM ('ACTUARIA', 'BIOLOGIA', 'CIENCIAS_COMPUTACION', 'CIENCIAS_TIERRA', 'FISICA', 'MATEMATICAS', 'MATEMATICAS_APLICADAS', 'OTRO');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "passwordResetExpires" TIMESTAMP(3),
ADD COLUMN     "passwordResetToken" TEXT,
ADD COLUMN     "semester" INTEGER,
DROP COLUMN "career",
ADD COLUMN     "career" "Career";
