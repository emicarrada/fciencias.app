/*
  Warnings:

  - A unique constraint covering the columns `[email,type,used]` on the table `verification_tokens` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailVerificationSentAt" TIMESTAMP(3),
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "username" DROP NOT NULL;

-- AlterTable
ALTER TABLE "verification_tokens" ALTER COLUMN "type" SET DEFAULT 'EMAIL_VERIFICATION';

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_email_type_used_key" ON "verification_tokens"("email", "type", "used");
