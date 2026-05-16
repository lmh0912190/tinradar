# PROJECT STRUCTURE — Tin Radar

## 1. Turborepo Monorepo Layout

```
diem-nong/
├── turbo.json
├── package.json                         # Root workspace config
├── .env.example
├── .gitignore
├── docker-compose.yml                   # PostgreSQL 16 + Redis 7 cho local dev
│
├── apps/
│   ├── web/                             # Next.js 15 (Frontend + SSR)
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts           # Nếu dùng Tailwind (optional, có thể CSS modules)
│   │   ├── tsconfig.json
│   │   │
│   │   ├── app/                         # Next.js App Router
│   │   │   ├── layout.tsx               # Root layout: fonts, metadata defaults
│   │   │   ├── page.tsx                 # Trang chủ: Radar View (ISR)
│   │   │   ├── loading.tsx              # Loading skeleton (bubbles + list)
│   │   │   ├── error.tsx                # Error boundary
│   │   │   ├── not-found.tsx
│   │   │   │
│   │   │   ├── xu-huong/
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx         # Story Page (ISR)
│   │   │   │       ├── loading.tsx      # Story skeleton
│   │   │   │       └── opengraph-image.tsx  # Dynamic OG image generation
│   │   │   │
│   │   │   ├── danh-muc/
│   │   │   │   └── [category]/
│   │   │   │       └── page.tsx         # Category filter page (ISR)
│   │   │   │
│   │   │   ├── sitemap.ts              # Dynamic sitemap generation
│   │   │   └── robots.ts              # robots.txt
│   │   │
│   │   ├── components/
│   │   │   ├── radar/
│   │   │   │   ├── BubbleChart.tsx       # Bubble chart component
│   │   │   │   ├── Bubble.tsx            # Single bubble
│   │   │   │   ├── StatsBar.tsx          # 3 stat cards
│   │   │   │   ├── FilterBar.tsx         # Category filter + sort
│   │   │   │   ├── TrendList.tsx         # List view dưới bubbles
│   │   │   │   └── TrendListItem.tsx     # Single list item
│   │   │   │
│   │   │   ├── story/
│   │   │   │   ├── StoryHeader.tsx       # Keyword + category + traffic
│   │   │   │   ├── StorySummary.tsx      # AI summary box
│   │   │   │   ├── SourceList.tsx        # Expandable source cards
│   │   │   │   ├── SourceCard.tsx        # Single source (expandable)
│   │   │   │   ├── Timeline.tsx          # Timeline component
│   │   │   │   └── BackButton.tsx
│   │   │   │
│   │   │   ├── shared/
│   │   │   │   ├── Masthead.tsx          # Site header/masthead
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── SourceBadge.tsx       # Colored source label
│   │   │   │   ├── CategoryBadge.tsx
│   │   │   │   ├── SkeletonBubble.tsx
│   │   │   │   ├── SkeletonCard.tsx
│   │   │   │   └── JsonLd.tsx           # Structured data component
│   │   │   │
│   │   │   └── seo/
│   │   │       └── MetaTags.tsx          # Reusable meta component
│   │   │
│   │   ├── lib/
│   │   │   ├── api.ts                   # API client (fetch from Fastify)
│   │   │   ├── constants.ts             # Category colors, source colors
│   │   │   └── utils.ts                 # formatTraffic, timeAgo, etc
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css              # Global styles, font imports
│   │   │   └── fonts.ts                 # Next.js font configuration
│   │   │
│   │   └── public/
│   │       ├── favicon.ico
│   │       └── og-default.png           # Default OG image
│   │
│   └── api/                             # Fastify (Backend API)
│       ├── package.json
│       ├── tsconfig.json
│       │
│       ├── src/
│       │   ├── index.ts                 # Fastify server entry point
│       │   ├── config.ts                # Environment config
│       │   │
│       │   ├── routes/
│       │   │   ├── v1/
│       │   │   │   ├── radar.ts         # GET /api/v1/radar
│       │   │   │   ├── stories.ts       # GET /api/v1/stories/:slug
│       │   │   │   └── categories.ts    # GET /api/v1/categories
│       │   │   │
│       │   │   ├── internal/
│       │   │   │   ├── jobs.ts          # POST /internal/jobs/*
│       │   │   │   └── health.ts        # GET /health
│       │   │   │
│       │   │   └── index.ts             # Route registration
│       │   │
│       │   ├── services/
│       │   │   ├── trend.service.ts      # Business logic: trends CRUD
│       │   │   ├── story.service.ts      # Business logic: stories CRUD
│       │   │   ├── radar.service.ts      # Build radar data (aggregate)
│       │   │   └── category.service.ts   # Category management
│       │   │
│       │   ├── jobs/
│       │   │   ├── fetch-trends.job.ts       # Cron: fetch Google Trends RSS
│       │   │   ├── fetch-news.job.ts         # Cron: fetch Google News RSS per keyword
│       │   │   ├── process-ai-batch.job.ts   # Cron: submit Anthropic batch
│       │   │   ├── check-batch-results.job.ts # Cron: poll batch status
│       │   │   ├── cleanup.job.ts            # Cron: archive old trends
│       │   │   └── scheduler.ts              # Cron scheduler setup (node-cron)
│       │   │
│       │   ├── integrations/
│       │   │   ├── google-trends.ts      # Google Trends RSS parser
│       │   │   ├── google-news.ts        # Google News RSS parser
│       │   │   └── anthropic-batch.ts    # Anthropic Batch API client
│       │   │
│       │   ├── cache/
│       │   │   └── redis.ts             # Redis client + cache helpers
│       │   │
│       │   ├── db/
│       │   │   └── client.ts            # PostgreSQL client (drizzle-orm)
│       │   │
│       │   ├── middleware/
│       │   │   ├── auth.ts              # Internal API key auth
│       │   │   ├── cors.ts
│       │   │   └── rate-limit.ts
│       │   │
│       │   └── utils/
│       │       ├── slug.ts              # Vietnamese slug generation
│       │       ├── traffic-parser.ts    # "5K+" → 5000
│       │       ├── xml-parser.ts        # RSS XML parsing helpers
│       │       └── logger.ts            # Structured logging
│       │
│       └── Dockerfile
│
├── packages/
│   ├── db/                              # Database package (shared)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── drizzle.config.ts            # Drizzle ORM config
│   │   │
│   │   ├── schema/
│   │   │   ├── index.ts                 # Export all schemas
│   │   │   ├── trends.ts               # trends table schema
│   │   │   ├── articles.ts             # articles table schema
│   │   │   ├── stories.ts              # stories table schema
│   │   │   ├── story-snapshots.ts      # story_snapshots table schema
│   │   │   ├── ai-batch-jobs.ts        # ai_batch_jobs table schema
│   │   │   └── cron-logs.ts            # cron_logs table schema
│   │   │
│   │   ├── migrations/                  # Auto-generated by drizzle-kit
│   │   │   └── 0000_initial.sql
│   │   │
│   │   └── index.ts                     # DB client + query helpers
│   │
│   ├── shared/                          # Shared types & utils
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   │
│   │   ├── types/
│   │   │   ├── trend.ts                 # Trend, Article, Story types
│   │   │   ├── radar.ts                 # RadarData, RadarStats types
│   │   │   ├── api.ts                   # API request/response types
│   │   │   └── index.ts
│   │   │
│   │   ├── constants/
│   │   │   ├── categories.ts            # Category slugs, colors, labels
│   │   │   ├── sources.ts              # Source name → color mapping
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   ├── format.ts               # formatTraffic, timeAgo
│   │   │   ├── slug.ts                 # generateSlug (Vietnamese-aware)
│   │   │   └── index.ts
│   │   │
│   │   └── index.ts
│   │
│   └── tsconfig/                        # Shared TypeScript configs
│       ├── base.json
│       ├── nextjs.json
│       └── node.json
│
└── docs/                                # Documentation (these files)
    ├── PRD.md
    ├── DESIGN_UIUX.md
    ├── SYSTEM_DESIGN.md
    ├── DATABASE_SCHEMA.md
    └── PROJECT_STRUCTURE.md
```

---

## 2. Tech Stack Details

### 2.1 apps/web — Next.js 15

```json
{
  "dependencies": {
    "next": "^15",
    "react": "^19",
    "react-dom": "^19",
    "@diem-nong/shared": "workspace:*",
    "@diem-nong/db": "workspace:*"
  }
}
```

**Key configurations:**
- App Router (NOT Pages Router)
- ISR cho trang chủ + story pages
- Server Components mặc định, Client Components cho interactive parts (BubbleChart, FilterBar, SourceCard expand)
- `next/font` cho Playfair Display, Source Serif 4, DM Sans

### 2.2 apps/api — Fastify

```json
{
  "dependencies": {
    "fastify": "^5",
    "@fastify/cors": "^10",
    "@fastify/rate-limit": "^10",
    "node-cron": "^3",
    "fast-xml-parser": "^4",           // RSS XML parsing
    "ioredis": "^5",
    "@anthropic-ai/sdk": "latest",
    "@diem-nong/db": "workspace:*",
    "@diem-nong/shared": "workspace:*"
  }
}
```

**Key configurations:**
- TypeScript strict mode
- Structured logging (pino — built into Fastify)
- Graceful shutdown handling
- Health check endpoint

### 2.3 packages/db — Drizzle ORM

```json
{
  "dependencies": {
    "drizzle-orm": "latest",
    "postgres": "^3"                    // postgres.js driver
  },
  "devDependencies": {
    "drizzle-kit": "latest"
  }
}
```

**Why Drizzle:**
- Type-safe queries, zero overhead
- Migration generation from schema
- Works with both Next.js (server components) và Fastify
- Lightweight

### 2.4 Infrastructure

```yaml
# docker-compose.yml (local dev)
services:
  postgres:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: diemnong
      POSTGRES_USER: diemnong
      POSTGRES_PASSWORD: diemnong
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    command: redis-server --appendonly yes
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

---

## 3. turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": [".env"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "dependsOn": ["^build"],
      "persistent": true,
      "cache": false
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "db:generate": {
      "cache": false
    },
    "db:migrate": {
      "cache": false
    },
    "db:studio": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 4. Environment Variables

```bash
# .env.example

# Database
DATABASE_URL=postgresql://diemnong:diemnong@localhost:5432/diemnong

# Redis
REDIS_URL=redis://localhost:6379

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# API
API_PORT=3001
API_HOST=0.0.0.0
INTERNAL_API_KEY=your-internal-api-key    # Cho internal cron endpoints

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001  # URL tới Fastify API
NEXT_PUBLIC_SITE_URL=https://diemnong.vn

# Google (không cần API key, dùng public RSS)
GOOGLE_TRENDS_GEO=VN
GOOGLE_NEWS_HL=vi
GOOGLE_NEWS_GL=VN
```

---

## 5. Development Workflow

```bash
# 1. Clone & install
git clone <repo>
cd diem-nong
pnpm install

# 2. Start infrastructure
docker compose up -d

# 3. Run migrations
pnpm --filter @diem-nong/db db:migrate

# 4. Start dev (all apps)
pnpm dev

# Apps sẽ chạy:
#   web:  http://localhost:3000
#   api:  http://localhost:3001

# 5. Trigger initial data fetch
curl -X POST http://localhost:3001/internal/jobs/fetch-trends \
  -H "x-api-key: your-internal-api-key"
```

---

## 6. Build Order

```
Turborepo tự xử lý dependency graph:

packages/tsconfig     → (no deps)
packages/shared       → tsconfig
packages/db           → tsconfig, shared
apps/api              → db, shared
apps/web              → db, shared
```

---

## 7. Coding Conventions

- **TypeScript strict mode** tất cả packages
- **ESLint** + **Prettier** shared config
- **Naming**: camelCase cho variables/functions, PascalCase cho components/types, kebab-case cho files
- **Imports**: absolute paths via tsconfig paths (`@/components/...`, `@diem-nong/shared`)
- **Components**: functional components + hooks, no class components
- **Async**: async/await, không callbacks
- **Error handling**: try/catch with typed errors, never swallow errors silently
