/*
  Warnings:

  - The values [OTRO] on the enum `Career` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PASSWORD_RESET');

-- AlterEnum
BEGIN;
CREATE TYPE "Career_new" AS ENUM ('ACTUARIA', 'BIOLOGIA', 'CIENCIAS_AMBIENTALES', 'CIENCIAS_COMPUTACION', 'CIENCIAS_TIERRA', 'FISICA', 'FISICA_BIOMEDICA', 'MANEJO_ZONAS_COSTERAS', 'MATEMATICAS', 'MATEMATICAS_APLICADAS', 'NEUROCIENCIAS');
ALTER TABLE "users" ALTER COLUMN "career" TYPE "Career_new" USING ("career"::text::"Career_new");
ALTER TYPE "Career" RENAME TO "Career_old";
ALTER TYPE "Career_new" RENAME TO "Career";
DROP TYPE "Career_old";
COMMIT;

-- CreateTable
CREATE TABLE "verification_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");
