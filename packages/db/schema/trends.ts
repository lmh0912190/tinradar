import {
  pgTable, bigserial, varchar, text, integer,
  boolean, date, timestamp, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

export const trends = pgTable(
  'trends',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    keyword: varchar('keyword', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    traffic: integer('traffic').notNull().default(0),
    category: varchar('category', { length: 50 }),
    pictureUrl: text('picture_url'),
    pictureSource: varchar('picture_source', { length: 100 }),
    trendDate: date('trend_date').notNull(),
    firstSeenAt: timestamp('first_seen_at', { withTimezone: true }).notNull().defaultNow(),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }).notNull().defaultNow(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_trends_slug').on(t.slug),
    index('idx_trends_active').on(t.isActive, t.traffic),
    index('idx_trends_category').on(t.category, t.isActive),
    index('idx_trends_date').on(t.trendDate),
    index('idx_trends_keyword').on(t.keyword),
  ],
);

export type TrendInsert = typeof trends.$inferInsert;
export type TrendSelect = typeof trends.$inferSelect;
