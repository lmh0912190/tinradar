import { getCategoryByName } from '@/lib/constants';

interface CategoryBadgeProps {
  name: string;
  small?: boolean;
}

export function CategoryBadge({ name, small }: CategoryBadgeProps) {
  const cat = getCategoryByName(name);
  return (
    <span
      className="category-badge"
      style={{
        background: cat.bg,
        color: cat.accent,
        fontSize: small ? 9 : 10,
      }}
    >
      {name.toUpperCase()}
    </span>
  );
}
