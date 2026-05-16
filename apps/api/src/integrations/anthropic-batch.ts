import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config.js';
import { validateCategory } from '../utils/category-classifier.js';
import { logger } from '../utils/logger.js';

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const AI_MODEL = 'claude-haiku-4-5-20251001';

const SYSTEM_PROMPT = `Bạn là hệ thống tóm lược tin tức tự động cho trang Tin Radar.
Nhiệm vụ: Đọc danh sách bài báo về cùng một chủ đề trending, và trả về JSON.

Quy tắc:
1. summary: Viết 2-3 câu tiếng Việt tóm lược sự kiện. Khách quan, không thiên vị. Nêu fact chính, số liệu nếu có, và lý do chủ đề đang hot.
2. category: Phân loại vào đúng 1 danh mục: "Kinh doanh", "Tài chính", "Thể thao", "Công nghệ", "Xã hội", "Giải trí", "Đời sống"
3. Chỉ trả về JSON, không text khác.

Response format:
{"summary": "...", "category": "..."}`;

export interface BatchRequest {
  customId: string;
  trendId: number;
  keyword: string;
  traffic: number;
  articles: Array<{ source: string; title: string; snippet: string | null }>;
}

export interface BatchResult {
  customId: string;
  trendId: number;
  summary: string | null;
  category: string | null;
  error: string | null;
}

function buildUserMessage(req: BatchRequest): string {
  const articleLines = req.articles
    .slice(0, 10)
    .map((a, i) => `${i + 1}. [${a.source}] ${a.title}\n   ${a.snippet ?? ''}`)
    .join('\n\n');

  return `Keyword trending: "${req.keyword}"
Lượng tìm kiếm: ${req.traffic}

Các bài báo:
${articleLines}`;
}

export async function submitBatch(requests: BatchRequest[]): Promise<string> {
  const batchRequests = requests.map((req) => ({
    custom_id: req.customId,
    params: {
      model: AI_MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user' as const, content: buildUserMessage(req) }],
    },
  }));

  const batch = await anthropic.messages.batches.create({ requests: batchRequests });
  logger.info('Batch submitted', { event: 'batch_submit', batch_id: batch.id, count: requests.length });
  return batch.id;
}

export async function getBatchStatus(batchId: string): Promise<{
  status: string;
  requestCounts: { processing: number; succeeded: number; errored: number; canceled: number; expired: number };
}> {
  const batch = await anthropic.messages.batches.retrieve(batchId);
  return {
    status: batch.processing_status,
    requestCounts: batch.request_counts,
  };
}

export async function processBatchResults(batchId: string, requestMap: Map<string, number>): Promise<BatchResult[]> {
  const results: BatchResult[] = [];

  for await (const result of await anthropic.messages.batches.results(batchId)) {
    const trendId = requestMap.get(result.custom_id);
    if (!trendId) continue;

    if (result.result.type === 'succeeded') {
      const content = result.result.message.content[0];
      if (content?.type === 'text') {
        try {
          const parsed = JSON.parse(content.text) as { summary?: string; category?: string };
          results.push({
            customId: result.custom_id,
            trendId,
            summary: parsed.summary ?? null,
            category: validateCategory(parsed.category),
            error: null,
          });
        } catch {
          results.push({ customId: result.custom_id, trendId, summary: null, category: null, error: 'JSON parse error' });
        }
      }
    } else {
      results.push({ customId: result.custom_id, trendId, summary: null, category: null, error: result.result.type });
    }
  }

  return results;
}

export async function generateSummaryRealtime(keyword: string, traffic: number, articles: BatchRequest['articles']): Promise<{ summary: string | null; category: string | null }> {
  try {
    const msg = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserMessage({ customId: '', trendId: 0, keyword, traffic, articles }) }],
    });
    const content = msg.content[0];
    if (content?.type === 'text') {
      const parsed = JSON.parse(content.text) as { summary?: string; category?: string };
      return { summary: parsed.summary ?? null, category: validateCategory(parsed.category) };
    }
  } catch (err) {
    logger.error('Realtime AI generation failed', { event: 'ai_realtime_fail', keyword, error: String(err) });
  }
  return { summary: null, category: null };
}
