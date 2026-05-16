CREATE TABLE "trends" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"keyword" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"traffic" integer DEFAULT 0 NOT NULL,
	"category" varchar(50),
	"picture_url" text,
	"picture_source" varchar(100),
	"trend_date" date NOT NULL,
	"first_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "trends_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "articles" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"trend_id" bigint NOT NULL,
	"title" text NOT NULL,
	"source_name" varchar(100) NOT NULL,
	"source_url" text,
	"article_url" text NOT NULL,
	"google_url" text,
	"snippet" text,
	"picture_url" text,
	"published_at" timestamp with time zone,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stories" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"trend_id" bigint NOT NULL,
	"slug" varchar(255) NOT NULL,
	"keyword" varchar(255) NOT NULL,
	"category" varchar(50),
	"summary" text,
	"traffic" integer DEFAULT 0 NOT NULL,
	"article_count" integer DEFAULT 0 NOT NULL,
	"source_count" integer DEFAULT 0 NOT NULL,
	"meta_title" varchar(255),
	"meta_description" varchar(320),
	"og_image_url" text,
	"ai_model" varchar(50),
	"ai_batch_id" varchar(100),
	"ai_generated_at" timestamp with time zone,
	"is_published" boolean DEFAULT true NOT NULL,
	"first_published_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "story_snapshots" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"story_id" bigint NOT NULL,
	"traffic" integer NOT NULL,
	"article_count" integer NOT NULL,
	"summary" text,
	"snapshot_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_batch_jobs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"batch_id" varchar(100) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"total_requests" integer DEFAULT 0 NOT NULL,
	"completed_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ai_batch_jobs_batch_id_unique" UNIQUE("batch_id")
);
--> statement-breakpoint
CREATE TABLE "cron_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"job_name" varchar(100) NOT NULL,
	"status" varchar(20) NOT NULL,
	"duration_ms" integer,
	"metadata" jsonb,
	"error_message" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "articles" ADD CONSTRAINT "articles_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stories" ADD CONSTRAINT "stories_trend_id_trends_id_fk" FOREIGN KEY ("trend_id") REFERENCES "public"."trends"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "story_snapshots" ADD CONSTRAINT "story_snapshots_story_id_stories_id_fk" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_trends_slug" ON "trends" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_trends_active" ON "trends" USING btree ("is_active","traffic");--> statement-breakpoint
CREATE INDEX "idx_trends_category" ON "trends" USING btree ("category","is_active");--> statement-breakpoint
CREATE INDEX "idx_trends_date" ON "trends" USING btree ("trend_date");--> statement-breakpoint
CREATE INDEX "idx_trends_keyword" ON "trends" USING btree ("keyword");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_articles_unique" ON "articles" USING btree ("trend_id","article_url");--> statement-breakpoint
CREATE INDEX "idx_articles_trend" ON "articles" USING btree ("trend_id","published_at");--> statement-breakpoint
CREATE INDEX "idx_articles_source" ON "articles" USING btree ("source_name");--> statement-breakpoint
CREATE INDEX "idx_stories_slug" ON "stories" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_stories_published" ON "stories" USING btree ("is_published","updated_at");--> statement-breakpoint
CREATE INDEX "idx_stories_category" ON "stories" USING btree ("category","is_published");--> statement-breakpoint
CREATE INDEX "idx_stories_trend" ON "stories" USING btree ("trend_id");--> statement-breakpoint
CREATE INDEX "idx_snapshots_story" ON "story_snapshots" USING btree ("story_id","snapshot_at");--> statement-breakpoint
CREATE INDEX "idx_batch_jobs_status" ON "ai_batch_jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_batch_jobs_submitted" ON "ai_batch_jobs" USING btree ("submitted_at");--> statement-breakpoint
CREATE INDEX "idx_cron_logs_job" ON "cron_logs" USING btree ("job_name","started_at");