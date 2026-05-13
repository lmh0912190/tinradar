export function parseTrafficString(str: string): number {
  if (!str) return 0;
  const s = str.trim().toUpperCase().replace('+', '').replace(',', '');
  if (s.endsWith('M')) return Math.round(parseFloat(s) * 1_000_000);
  if (s.endsWith('K')) return Math.round(parseFloat(s) * 1_000);
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : n;
}
