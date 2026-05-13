import {
  pgTable, bigserial, bigint, varchar, text,
  integer, boolean, timestamp, index,
} from 'drizzle-orm/pg-core';
import { trends } from './trends.js';

export const stories = pgTable(
  'stories',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    trendId: bigint('trend_id', { mode: 'number' }).notNull().references(() => trends.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    keyword: varchar('keyword', { length: 255 }).notNull(),
    category: varchar('category', { length: 50 }),
    summary: text('summary'),
    traffic: integer('traffic').notNull().default(0),
    articleCount: integer('article_count').notNull().default(0),
    sourceCount: integer('source_count').notNull().default(0),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: varchar('meta_description', { length: 320 }),
    ogImageUrl: text('og_image_url'),
    aiModel: varchar('ai_model', { length: 50 }),
    aiBatchId: varchar('ai_batch_id', { length: 100 }),
    aiGeneratedAt: timestamp('ai_generated_at', { withTimezone: true }),
    isPublished: boolean('is_published').notNull().default(true),
    firstPublishedAt: timestamp('first_published_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_stories_slug').on(t.slug),
    index('idx_stories_published').on(t.isPublished, t.updatedAt),
    index('idx_stories_category').on(t.category, t.isPublished),
    index('idx_stories_trend').on(t.trendId),
  ],
);

export type StoryInsert = typeof stories.$inferInsert;
export type StorySelect = typeof stories.$inferSelect;
