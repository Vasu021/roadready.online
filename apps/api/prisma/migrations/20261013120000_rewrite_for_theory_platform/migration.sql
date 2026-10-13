-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "topic_test_id" TEXT,
ALTER COLUMN "scenario_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "scenario_attempts" ADD COLUMN     "topic_test_id" TEXT,
ADD COLUMN     "total_questions" INTEGER,
ALTER COLUMN "scenario_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "scenarios" ADD COLUMN     "image_prompt" TEXT,
ADD COLUMN     "image_url" TEXT;

-- CreateTable
CREATE TABLE "signs" (
    "id" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "sign_key" TEXT NOT NULL,
    "name_de" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "legal_basis" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_tests" (
    "id" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_sign_topic" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_tests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "signs_sign_key_key" ON "signs"("sign_key");

-- CreateIndex
CREATE UNIQUE INDEX "topic_tests_slug_key" ON "topic_tests"("slug");

-- CreateIndex
CREATE INDEX "questions_scenario_id_idx" ON "questions"("scenario_id");

-- CreateIndex
CREATE INDEX "questions_topic_test_id_idx" ON "questions"("topic_test_id");

-- CreateIndex
CREATE INDEX "scenario_attempts_user_id_idx" ON "scenario_attempts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_session_answers_test_session_id_question_id_key" ON "test_session_answers"("test_session_id", "question_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_test_id_fkey" FOREIGN KEY ("topic_test_id") REFERENCES "topic_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_attempts" ADD CONSTRAINT "scenario_attempts_topic_test_id_fkey" FOREIGN KEY ("topic_test_id") REFERENCES "topic_tests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

