import { config } from '../config.js';
import { parseTrafficString } from '../utils/traffic-parser.js';
import { createXmlParser, decodeEntities } from '../utils/xml-parser.js';
import { logger } from '../utils/logger.js';

export interface TrendRssItem {
  keyword: string;
  traffic: number;
  trafficString: string;
  pictureUrl: string | null;
  pictureSource: string | null;
  pubDate: string | null;
  newsItems: Array<{
    title: string;
    url: string;
    source: string;
    picture: string | null;
  }>;
}

export async function fetchGoogleTrendsRss(): Promise<TrendRssItem[]> {
  const url = `https://trends.google.com/trending/rss?geo=${config.googleTrendsGeo}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TinRadar/1.0)' },
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) throw new Error(`Google Trends RSS responded ${res.status}`);

  const xml = await res.text();
  const parser = createXmlParser();
  const parsed = parser.parse(xml) as Record<string, unknown>;

  const channel = (parsed['rss'] as Record<string, unknown>)?.['channel'] as Record<string, unknown>;
  const rawItems = (channel?.['item'] as unknown[]) ?? [];

  return rawItems.map((raw) => {
    const item = raw as Record<string, unknown>;
    const keyword = decodeEntities(String(item['title'] ?? ''));
    const trafficString = String(item['ht:approx_traffic'] ?? '0');
    const newsItemsRaw = (item['ht:news_item'] as unknown[]) ?? [];

    return {
      keyword,
      traffic: parseTrafficString(trafficString),
      trafficString,
      pictureUrl: item['ht:picture'] ? String(item['ht:picture']) : null,
      pictureSource: item['ht:picture_source'] ? String(item['ht:picture_source']) : null,
      pubDate: item['pubDate'] ? String(item['pubDate']) : null,
      newsItems: newsItemsRaw.map((ni) => {
        const n = ni as Record<string, unknown>;
        return {
          title: decodeEntities(String(n['ht:news_item_title'] ?? '')),
          url: String(n['ht:news_item_url'] ?? '').trim(),
          source: String(n['ht:news_item_source'] ?? '').trim(),
          picture: n['ht:news_item_picture'] ? String(n['ht:news_item_picture']) : null,
        };
      }),
    };
  }).filter((t) => t.keyword.length > 0);
}
