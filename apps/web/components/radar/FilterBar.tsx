'use client';

import { CATEGORIES } from '@/lib/constants';
import type { CategorySlug, SortMode } from '@trend-radar/shared';

interface FilterBarProps {
  activeCategory: string;
  activeSort: SortMode;
  onCategoryChange: (slug: string) => void;
  onSortChange: (sort: SortMode) => void;
}

export function FilterBar({ activeCategory, activeSort, onCategoryChange, onSortChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__pills">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.slug}
            className={`filter-pill${activeCategory === cat.slug ? ' filter-pill--active' : ''}`}
            style={{ '--accent': cat.accent } as React.CSSProperties}
            onClick={() => onCategoryChange(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="filter-bar__sort">
        <button
          className={`sort-btn${activeSort === 'traffic' ? ' sort-btn--active' : ''}`}
          onClick={() => onSortChange('traffic')}
        >
          Hot nhất
        </button>
        <button
          className={`sort-btn${activeSort === 'time' ? ' sort-btn--active' : ''}`}
          onClick={() => onSortChange('time')}
        >
          Mới nhất
        </button>
      </div>
    </div>
  );
}
