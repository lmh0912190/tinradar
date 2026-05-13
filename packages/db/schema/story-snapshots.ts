import {
  pgTable, bigserial, bigint, integer,
  text, timestamp, index,
} from 'drizzle-orm/pg-core';
import { stories } from './stories.js';

export const storySnapshots = pgTable(
  'story_snapshots',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    storyId: bigint('story_id', { mode: 'number' }).notNull().references(() => stories.id, { onDelete: 'cascade' }),
    traffic: integer('traffic').notNull(),
    articleCount: integer('article_count').notNull(),
    summary: text('summary'),
    snapshotAt: timestamp('snapshot_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_snapshots_story').on(t.storyId, t.snapshotAt),
  ],
);

export type StorySnapshotInsert = typeof storySnapshots.$inferInsert;
export type StorySnapshotSelect = typeof storySnapshots.$inferSelect;
