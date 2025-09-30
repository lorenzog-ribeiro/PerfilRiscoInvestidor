-- CreateEnum
CREATE TYPE "projeto_api"."session_status" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "projeto_api"."QuestionType" AS ENUM ('RADIO', 'TEXT', 'DATE', 'EMAIL', 'BOOLEAN');

-- CreateTable
CREATE TABLE "projeto_api"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_api"."sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "projeto_api"."session_status" NOT NULL DEFAULT 'IN_PROGRESS',
    "current_step" TEXT,
    "temp_answers" JSONB,
    "temp_tradeoffs" JSONB,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_api"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_api"."questions" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "projeto_api"."QuestionType" NOT NULL,
    "order" INTEGER NOT NULL,
    "options" JSONB,
    "is_required" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_api"."tradeoff_scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "step" INTEGER NOT NULL,
    "config" JSONB NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "tradeoff_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projeto_api"."result_history" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "profile_name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "calculation" JSONB,
    "questions_data" JSONB NOT NULL,
    "tradeoffs_data" JSONB NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "result_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "projeto_api"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "projeto_api"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_order_key" ON "projeto_api"."categories"("order");

-- CreateIndex
CREATE UNIQUE INDEX "questions_order_key" ON "projeto_api"."questions"("order");

-- CreateIndex
CREATE UNIQUE INDEX "tradeoff_scenarios_step_key" ON "projeto_api"."tradeoff_scenarios"("step");

-- CreateIndex
CREATE UNIQUE INDEX "result_history_user_id_attempt_key" ON "projeto_api"."result_history"("user_id", "attempt");

-- AddForeignKey
ALTER TABLE "projeto_api"."sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "projeto_api"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_api"."questions" ADD CONSTRAINT "questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "projeto_api"."categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projeto_api"."result_history" ADD CONSTRAINT "result_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "projeto_api"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
