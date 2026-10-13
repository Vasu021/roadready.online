-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "error_points" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "module_id" TEXT;

-- AlterTable
ALTER TABLE "scenarios" ADD COLUMN     "scene_json" JSONB;

-- AlterTable
ALTER TABLE "test_sessions" ADD COLUMN     "error_points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "failed_by_five_point_rule" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "locale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "theme" TEXT NOT NULL DEFAULT 'study';

-- CreateTable
CREATE TABLE "modules" (
    "id" TEXT NOT NULL,
    "country_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "official_title" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "intro" TEXT NOT NULL,
    "estimated_minutes" INTEGER NOT NULL DEFAULT 20,
    "is_zusatzstoff" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "key_points" JSONB NOT NULL,
    "scene_json" JSONB,
    "sign_ids" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_module_progress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "completed_lesson_ids" JSONB NOT NULL,
    "last_lesson_id" TEXT,
    "completed_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_module_progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "is_machine" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modules_slug_key" ON "modules"("slug");

-- CreateIndex
CREATE INDEX "modules_country_code_idx" ON "modules"("country_code");

-- CreateIndex
CREATE UNIQUE INDEX "lessons_slug_key" ON "lessons"("slug");

-- CreateIndex
CREATE INDEX "lessons_module_id_idx" ON "lessons"("module_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_module_progress_user_id_module_id_key" ON "user_module_progress"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "translations_entity_type_locale_idx" ON "translations"("entity_type", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "translations_entity_type_entity_id_field_locale_key" ON "translations"("entity_type", "entity_id", "field", "locale");

-- CreateIndex
CREATE INDEX "questions_module_id_idx" ON "questions"("module_id");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_module_progress" ADD CONSTRAINT "user_module_progress_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

