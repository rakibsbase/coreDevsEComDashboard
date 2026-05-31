'use client';

import { useEffect, useState } from 'react';
import ProductsList from '@/components/pages/ProductsList';
import ProductsListSkeleton from '@/components/skeletons/ProductsListSkeleton';
import { useRouter } from 'next/navigation';

export default function ProductsListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <ProductsListSkeleton />;
  return (
    <ProductsList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
