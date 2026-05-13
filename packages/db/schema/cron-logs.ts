import {
  pgTable, bigserial, varchar, integer,
  text, timestamp, jsonb, index,
} from 'drizzle-orm/pg-core';

export const cronLogs = pgTable(
  'cron_logs',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    jobName: varchar('job_name', { length: 100 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    durationMs: integer('duration_ms'),
    metadata: jsonb('metadata'),
    errorMessage: text('error_message'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (t) => [
    index('idx_cron_logs_job').on(t.jobName, t.startedAt),
  ],
);

export type CronLogInsert = typeof cronLogs.$inferInsert;
export type CronLogSelect = typeof cronLogs.$inferSelect;
