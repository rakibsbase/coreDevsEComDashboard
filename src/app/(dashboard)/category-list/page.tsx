'use client';

import { useEffect, useState } from 'react';
import CategoryList from '@/components/pages/CategoryList';
import CategoryListSkeleton from '@/components/skeletons/CategoryListSkeleton';
import { useRouter } from 'next/navigation';

export default function CategoryListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <CategoryListSkeleton />;
  return (
    <CategoryList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
