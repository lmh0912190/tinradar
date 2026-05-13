CREATE TABLE IF NOT EXISTS "trends" (
  "id" BIGSERIAL PRIMARY KEY,
  "keyword" VARCHAR(255) NOT NULL,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "traffic" INTEGER NOT NULL DEFAULT 0,
  "category" VARCHAR(50),
  "picture_url" TEXT,
  "picture_source" VARCHAR(100),
  "trend_date" DATE NOT NULL,
  "first_seen_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "is_active" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_trends_slug" ON "trends"("slug");
CREATE INDEX IF NOT EXISTS "idx_trends_active" ON "trends"("is_active", "traffic" DESC);
CREATE INDEX IF NOT EXISTS "idx_trends_category" ON "trends"("category", "is_active");
CREATE INDEX IF NOT EXISTS "idx_trends_date" ON "trends"("trend_date" DESC);
CREATE INDEX IF NOT EXISTS "idx_trends_keyword" ON "trends"("keyword");

CREATE TABLE IF NOT EXISTS "articles" (
  "id" BIGSERIAL PRIMARY KEY,
  "trend_id" BIGINT NOT NULL REFERENCES "trends"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "source_name" VARCHAR(100) NOT NULL,
  "source_url" TEXT,
  "article_url" TEXT NOT NULL,
  "google_url" TEXT,
  "snippet" TEXT,
  "picture_url" TEXT,
  "published_at" TIMESTAMPTZ,
  "fetched_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS "idx_articles_unique" ON "articles"("trend_id", "article_url");
CREATE INDEX IF NOT EXISTS "idx_articles_trend" ON "articles"("trend_id", "published_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_articles_source" ON "articles"("source_name");

CREATE TABLE IF NOT EXISTS "stories" (
  "id" BIGSERIAL PRIMARY KEY,
  "trend_id" BIGINT NOT NULL REFERENCES "trends"("id") ON DELETE CASCADE,
  "slug" VARCHAR(255) NOT NULL UNIQUE,
  "keyword" VARCHAR(255) NOT NULL,
  "category" VARCHAR(50),
  "summary" TEXT,
  "traffic" INTEGER NOT NULL DEFAULT 0,
  "article_count" INTEGER NOT NULL DEFAULT 0,
  "source_count" INTEGER NOT NULL DEFAULT 0,
  "meta_title" VARCHAR(255),
  "meta_description" VARCHAR(320),
  "og_image_url" TEXT,
  "ai_model" VARCHAR(50),
  "ai_batch_id" VARCHAR(100),
  "ai_generated_at" TIMESTAMPTZ,
  "is_published" BOOLEAN NOT NULL DEFAULT TRUE,
  "first_published_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_stories_slug" ON "stories"("slug");
CREATE INDEX IF NOT EXISTS "idx_stories_published" ON "stories"("is_published", "updated_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_stories_category" ON "stories"("category", "is_published");
CREATE INDEX IF NOT EXISTS "idx_stories_trend" ON "stories"("trend_id");

CREATE TABLE IF NOT EXISTS "story_snapshots" (
  "id" BIGSERIAL PRIMARY KEY,
  "story_id" BIGINT NOT NULL REFERENCES "stories"("id") ON DELETE CASCADE,
  "traffic" INTEGER NOT NULL,
  "article_count" INTEGER NOT NULL,
  "summary" TEXT,
  "snapshot_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_snapshots_story" ON "story_snapshots"("story_id", "snapshot_at" DESC);

CREATE TABLE IF NOT EXISTS "ai_batch_jobs" (
  "id" BIGSERIAL PRIMARY KEY,
  "batch_id" VARCHAR(100) NOT NULL UNIQUE,
  "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
  "total_requests" INTEGER NOT NULL DEFAULT 0,
  "completed_count" INTEGER NOT NULL DEFAULT 0,
  "failed_count" INTEGER NOT NULL DEFAULT 0,
  "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completed_at" TIMESTAMPTZ,
  "error_message" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "idx_batch_jobs_status" ON "ai_batch_jobs"("status");
CREATE INDEX IF NOT EXISTS "idx_batch_jobs_submitted" ON "ai_batch_jobs"("submitted_at" DESC);

CREATE TABLE IF NOT EXISTS "cron_logs" (
  "id" BIGSERIAL PRIMARY KEY,
  "job_name" VARCHAR(100) NOT NULL,
  "status" VARCHAR(20) NOT NULL,
  "duration_ms" INTEGER,
  "metadata" JSONB,
  "error_message" TEXT,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "completed_at" TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS "idx_cron_logs_job" ON "cron_logs"("job_name", "started_at" DESC);
