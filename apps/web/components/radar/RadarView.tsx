'use client';

import { useState, useMemo } from 'react';
import type { RadarApiResponse, SortMode } from '@trend-radar/shared';
import { FilterBar } from './FilterBar';
import { BubbleChart } from './BubbleChart';
import { TrendList } from './TrendList';
import { getCategoryByName, CATEGORIES } from '@/lib/constants';

interface RadarViewProps {
  initialData: RadarApiResponse;
  defaultCategory?: string;
}

export function RadarView({ initialData, defaultCategory = 'tat-ca' }: RadarViewProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [sort, setSort] = useState<SortMode>('traffic');

  const filtered = useMemo(() => {
    let trends = initialData.trends;

    if (activeCategory !== 'tat-ca') {
      const cat = CATEGORIES.find((c) => c.slug === activeCategory);
      if (cat) {
        trends = trends.filter((t) => t.category === cat.name);
      }
    }

    if (sort === 'time') {
      return [...trends].sort(
        (a, b) => new Date(b.pubDate ?? 0).getTime() - new Date(a.pubDate ?? 0).getTime()
      );
    }
    return [...trends].sort((a, b) => b.traffic - a.traffic);
  }, [initialData.trends, activeCategory, sort]);

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={sort}
        onCategoryChange={setActiveCategory}
        onSortChange={setSort}
      />
      <BubbleChart trends={filtered} />
      <div className="section-divider">
        <div className="section-divider__line" />
        <span className="section-divider__text">Chi tiết</span>
        <div className="section-divider__line" />
      </div>
      <TrendList trends={filtered} />
    </>
  );
}
