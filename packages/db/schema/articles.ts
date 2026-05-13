import {
  pgTable, bigserial, bigint, text, varchar,
  timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core';
import { trends } from './trends.js';

export const articles = pgTable(
  'articles',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    trendId: bigint('trend_id', { mode: 'number' }).notNull().references(() => trends.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    sourceName: varchar('source_name', { length: 100 }).notNull(),
    sourceUrl: text('source_url'),
    articleUrl: text('article_url').notNull(),
    googleUrl: text('google_url'),
    snippet: text('snippet'),
    pictureUrl: text('picture_url'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    fetchedAt: timestamp('fetched_at', { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex('idx_articles_unique').on(t.trendId, t.articleUrl),
    index('idx_articles_trend').on(t.trendId, t.publishedAt),
    index('idx_articles_source').on(t.sourceName),
  ],
);

export type ArticleInsert = typeof articles.$inferInsert;
export type ArticleSelect = typeof articles.$inferSelect;
