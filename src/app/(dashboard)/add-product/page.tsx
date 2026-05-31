'use client';

import { useEffect, useState } from 'react';
import AddProduct from '@/components/pages/AddProduct';
import AddProductSkeleton from '@/components/skeletons/AddProductSkeleton';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <AddProductSkeleton />;
  return (
    <AddProduct
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
