import { XMLParser } from 'fast-xml-parser';

export function createXmlParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    isArray: (name) => ['item', 'ht:news_item'].includes(name),
    htmlEntities: true,
  });
}

const ENTITY_MAP: Record<string, string> = {
  '&nbsp;': ' ', '&#160;': ' ',
  '&amp;': '&', '&lt;': '<', '&gt;': '>',
  '&quot;': '"', '&#34;': '"',
  '&apos;': "'", '&#39;': "'",
  '&ndash;': '–', '&mdash;': '—',
  '&hellip;': '…', '&laquo;': '«', '&raquo;': '»',
  '&lsquo;': '‘', '&rsquo;': '’',
  '&ldquo;': '“', '&rdquo;': '”',
};

const ENTITY_RE = new RegExp(Object.keys(ENTITY_MAP).join('|'), 'g');

export function decodeEntities(text: string): string {
  return text
    .replace(ENTITY_RE, (m) => ENTITY_MAP[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .trim();
}

export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, ''));
}
