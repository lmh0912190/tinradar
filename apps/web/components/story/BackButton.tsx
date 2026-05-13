'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  return (
    <button className="story-back" onClick={() => router.back()}>
      ← Quay lại Radar
    </button>
  );
}
