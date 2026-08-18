-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "QuizMode" AS ENUM ('PRACTICE', 'EXAM');

-- CreateEnum
CREATE TYPE "QuizSource" AS ENUM ('TOPIC', 'EXAM', 'MISTAKES', 'BOOKMARKS');

-- CreateEnum
CREATE TYPE "QuizStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ProgressStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "flag_emoji" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "facts" TEXT,
    "exam_question_count" INTEGER NOT NULL DEFAULT 20,
    "exam_pass_percent" INTEGER NOT NULL DEFAULT 75,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "category_id" TEXT,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon_emoji" TEXT NOT NULL DEFAULT '🚦',
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "prompt" TEXT NOT NULL,
    "image_url" TEXT,
    "image_alt" TEXT,
    "explanation" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "options" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "selected_country_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "topic_id" TEXT,
    "mode" "QuizMode" NOT NULL DEFAULT 'PRACTICE',
    "source" "QuizSource" NOT NULL DEFAULT 'TOPIC',
    "status" "QuizStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "total_questions" INTEGER NOT NULL,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "score_percent" INTEGER NOT NULL DEFAULT 0,
    "passed" BOOLEAN,
    "grade" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_items" (
    "id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "selected_option_id" TEXT,
    "is_correct" BOOLEAN,
    "answered_at" TIMESTAMP(3),

    CONSTRAINT "quiz_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "topic_id" TEXT NOT NULL,
    "status" "ProgressStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "best_score_percent" INTEGER NOT NULL DEFAULT 0,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "pass_count" INTEGER NOT NULL DEFAULT 0,
    "last_attempt_at" TIMESTAMP(3),

    CONSTRAINT "topic_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_stats" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "times_seen" INTEGER NOT NULL DEFAULT 0,
    "times_correct" INTEGER NOT NULL DEFAULT 0,
    "times_wrong" INTEGER NOT NULL DEFAULT 0,
    "is_bookmarked" BOOLEAN NOT NULL DEFAULT false,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_country_id_slug_key" ON "categories"("country_id", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "topics_slug_key" ON "topics"("slug");

-- CreateIndex
CREATE INDEX "topics_country_id_order_idx" ON "topics"("country_id", "order");

-- CreateIndex
CREATE INDEX "questions_topic_id_order_idx" ON "questions"("topic_id", "order");

-- CreateIndex
CREATE INDEX "options_question_id_order_idx" ON "options"("question_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "quizzes_user_id_started_at_idx" ON "quizzes"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "quiz_items_quiz_id_order_idx" ON "quiz_items"("quiz_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "quiz_items_quiz_id_question_id_key" ON "quiz_items"("quiz_id", "question_id");

-- CreateIndex
CREATE UNIQUE INDEX "topic_progress_user_id_topic_id_key" ON "topic_progress"("user_id", "topic_id");

-- CreateIndex
CREATE INDEX "question_stats_user_id_is_bookmarked_idx" ON "question_stats"("user_id", "is_bookmarked");

-- CreateIndex
CREATE UNIQUE INDEX "question_stats_user_id_question_id_key" ON "question_stats"("user_id", "question_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "options" ADD CONSTRAINT "options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_selected_country_id_fkey" FOREIGN KEY ("selected_country_id") REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_items" ADD CONSTRAINT "quiz_items_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_items" ADD CONSTRAINT "quiz_items_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_items" ADD CONSTRAINT "quiz_items_selected_option_id_fkey" FOREIGN KEY ("selected_option_id") REFERENCES "options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_progress" ADD CONSTRAINT "topic_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic_progress" ADD CONSTRAINT "topic_progress_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_stats" ADD CONSTRAINT "question_stats_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_stats" ADD CONSTRAINT "question_stats_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

