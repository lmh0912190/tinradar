export { formatTraffic, timeAgo, formatViDate } from '@trend-radar/shared';

export function calcBubbleSize(traffic: number, maxTraffic: number, isMobile = false): number {
  const ratio = maxTraffic > 0 ? traffic / maxTraffic : 0;
  if (isMobile) return Math.round(60 + Math.sqrt(ratio) * 80);
  return Math.round(80 + Math.sqrt(ratio) * 100);
}
