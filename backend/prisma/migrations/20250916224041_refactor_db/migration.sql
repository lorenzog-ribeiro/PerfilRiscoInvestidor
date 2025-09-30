/*
  Warnings:

  - You are about to drop the column `category_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `is_required` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `result_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tradeoff_scenarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "projeto_api"."ResultStatus" AS ENUM ('COMPLETED', 'ABANDONED');

-- AlterEnum
ALTER TYPE "projeto_api"."QuestionType" ADD VALUE 'MULTISELECT';

-- DropForeignKey
ALTER TABLE "projeto_api"."questions" DROP CONSTRAINT "questions_category_id_fkey";

-- DropForeignKey
ALTER TABLE "projeto_api"."result_history" DROP CONSTRAINT "result_history_user_id_fkey";

-- DropForeignKey
ALTER TABLE "projeto_api"."sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- AlterTable
ALTER TABLE "projeto_api"."questions" DROP COLUMN "category_id",
DROP COLUMN "is_required",
ADD COLUMN     "category" TEXT NOT NULL;

-- DropTable
DROP TABLE "projeto_api"."categories";

-- DropTable
DROP TABLE "projeto_api"."result_history";

-- DropTable
DROP TABLE "projeto_api"."sessions";

-- DropTable
DROP TABLE "projeto_api"."tradeoff_scenarios";

-- DropEnum
DROP TYPE "projeto_api"."session_status";

-- CreateTable
CREATE TABLE "projeto_api"."results" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "projeto_api"."ResultStatus" NOT NULL,
    "answers" JSONB,
    "profile_name" TEXT,
    "score" INTEGER,
    "details" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "projeto_api"."results" ADD CONSTRAINT "results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "projeto_api"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
