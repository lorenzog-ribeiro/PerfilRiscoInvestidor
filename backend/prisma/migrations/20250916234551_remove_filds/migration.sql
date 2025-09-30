/*
  Warnings:

  - You are about to drop the column `type` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `results` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "projeto_api"."questions" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "projeto_api"."results" DROP COLUMN "status";

-- DropEnum
DROP TYPE "projeto_api"."QuestionType";

-- DropEnum
DROP TYPE "projeto_api"."ResultStatus";
