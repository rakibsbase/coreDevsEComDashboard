'use client';

import OrdersList from '@/components/pages/OrdersList';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Orders list page */
export default function OrdersListPage() {
  const router = useRouter();
  const { setSelectedOrderId } = useApp();
  return (
    <OrdersList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedOrderId={setSelectedOrderId}
    />
  );
}
