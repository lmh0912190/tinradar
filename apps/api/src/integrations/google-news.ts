import { config } from '../config.js';
import { createXmlParser, stripHtml, decodeEntities } from '../utils/xml-parser.js';

export interface NewsArticle {
  title: string;
  sourceName: string;
  sourceUrl: string | null;
  articleUrl: string;
  googleUrl: string;
  snippet: string | null;
  publishedAt: string | null;
}

export async function fetchGoogleNewsRss(keyword: string): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(keyword);
  const url = `https://news.google.com/rss/search?q=${encoded}&hl=${config.googleNewsHl}&gl=${config.googleNewsGl}&ceid=${config.googleNewsGl}:${config.googleNewsHl}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TinRadar/1.0)' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Google News RSS responded ${res.status}`);

  const xml = await res.text();
  const parser = createXmlParser();
  const parsed = parser.parse(xml) as Record<string, unknown>;

  const channel = (parsed['rss'] as Record<string, unknown>)?.['channel'] as Record<string, unknown>;
  const rawItems = ((channel?.['item'] as unknown[]) ?? []).slice(0, 15);

  return rawItems.map((raw) => {
    const item = raw as Record<string, unknown>;
    const fullTitle = decodeEntities(String(item['title'] ?? ''));

    const lastDashIdx = fullTitle.lastIndexOf(' - ');
    const title = lastDashIdx > 0 ? fullTitle.substring(0, lastDashIdx).trim() : fullTitle;
    const sourceName = lastDashIdx > 0 ? fullTitle.substring(lastDashIdx + 3).trim() : 'Unknown';

    const sourceEl = item['source'] as Record<string, string> | undefined;
    const sourceUrl = sourceEl?.['@_url'] ?? null;

    const googleUrl = String(item['link'] ?? '').trim();
    const snippet = item['description'] ? stripHtml(String(item['description'])) : null;
    const pubDate = item['pubDate'] ? String(item['pubDate']) : null;

    return {
      title,
      sourceName,
      sourceUrl,
      articleUrl: googleUrl,
      googleUrl,
      snippet: snippet?.substring(0, 300) ?? null,
      publishedAt: pubDate,
    };
  }).filter((a) => a.title.length > 0 && a.articleUrl.length > 0);
}
