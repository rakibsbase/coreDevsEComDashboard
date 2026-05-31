'use client';

import { useEffect, useState } from 'react';
import OrderDetails from '@/components/pages/OrderDetails';
import OrderDetailsSkeleton from '@/components/skeletons/OrderDetailsSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function OrderDetailsPage() {
  const router = useRouter();
  const { selectedOrderId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <OrderDetailsSkeleton />;
  return (
    <OrderDetails
      orderId={selectedOrderId || '#5434'}
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
