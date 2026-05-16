export const CATEGORIES = [
  { slug: 'tat-ca', name: 'Tất cả', accent: '#888888', bg: '#F5F5F5' },
  { slug: 'kinh-doanh', name: 'Kinh doanh', accent: '#2D7D5F', bg: '#E8F5EE' },
  { slug: 'tai-chinh', name: 'Tài chính', accent: '#2568A8', bg: '#E3EFF8' },
  { slug: 'the-thao', name: 'Thể thao', accent: '#B83230', bg: '#FBEAEA' },
  { slug: 'cong-nghe', name: 'Công nghệ', accent: '#5C6BC0', bg: '#EDEEF8' },
  { slug: 'xa-hoi', name: 'Xã hội', accent: '#A08520', bg: '#FAF5E4' },
  { slug: 'giai-tri', name: 'Giải trí', accent: '#C44569', bg: '#FCE8EF' },
  { slug: 'doi-song', name: 'Đời sống', accent: '#A08520', bg: '#FAF5E4' },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]['slug'];

export function getCategoryByName(name: string) {
  return CATEGORIES.find(
    (c) => c.name.toLowerCase() === name.toLowerCase()
  ) ?? CATEGORIES[0];
}

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? CATEGORIES[0];
}

export function categoryNameToSlug(name: string): string {
  const cat = getCategoryByName(name);
  return cat.slug;
}
