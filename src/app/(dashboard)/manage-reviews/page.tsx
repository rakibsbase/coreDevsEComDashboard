'use client';

import { useEffect, useState } from 'react';
import ManageReviews from '@/components/pages/ManageReviews';
import ManageReviewsSkeleton from '@/components/skeletons/ManageReviewsSkeleton';

export default function ManageReviewsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <ManageReviewsSkeleton />;
  return <ManageReviews />;
}
