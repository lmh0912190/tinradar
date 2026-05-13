import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index.js';

const connectionString = process.env['DATABASE_URL'] ?? 'postgresql://trendradar:trendradar@localhost:5432/trendradar';

const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema });

export * from './schema/index.js';
export type DB = typeof db;
