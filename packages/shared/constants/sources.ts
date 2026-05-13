export const SOURCE_COLORS: Record<string, string> = {
  'CafeF': '#C68A17',
  'VnExpress': '#1A5276',
  'Tuổi Trẻ': '#C0392B',
  'Thanh Niên': '#1B6B4A',
  'GenK': '#7B3FA0',
  'Zing': '#C44569',
  'Dân Trí': '#117A65',
  'Bóng Đá': '#B83230',
  'Kenh14': '#E74C3C',
  'VTV': '#1A5276',
  'VTC': '#2E86C1',
};

export const DEFAULT_SOURCE_COLOR = '#888888';

export function getSourceColor(sourceName: string): string {
  for (const [key, color] of Object.entries(SOURCE_COLORS)) {
    if (sourceName.toLowerCase().includes(key.toLowerCase())) {
      return color;
    }
  }
  return DEFAULT_SOURCE_COLOR;
}
