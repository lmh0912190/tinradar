import {
  pgTable, bigserial, varchar, integer,
  timestamp, text, index,
} from 'drizzle-orm/pg-core';

export const aiBatchJobs = pgTable(
  'ai_batch_jobs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    batchId: varchar('batch_id', { length: 100 }).notNull().unique(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    totalRequests: integer('total_requests').notNull().default(0),
    completedCount: integer('completed_count').notNull().default(0),
    failedCount: integer('failed_count').notNull().default(0),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_batch_jobs_status').on(t.status),
    index('idx_batch_jobs_submitted').on(t.submittedAt),
  ],
);

export type AiBatchJobInsert = typeof aiBatchJobs.$inferInsert;
export type AiBatchJobSelect = typeof aiBatchJobs.$inferSelect;
