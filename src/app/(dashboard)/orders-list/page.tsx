'use client';

import { useEffect, useState } from 'react';
import OrdersList from '@/components/pages/OrdersList';
import OrdersListSkeleton from '@/components/skeletons/OrdersListSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function OrdersListPage() {
  const router = useRouter();
  const { setSelectedOrderId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <OrdersListSkeleton />;
  return (
    <OrdersList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedOrderId={setSelectedOrderId}
    />
  );
}
