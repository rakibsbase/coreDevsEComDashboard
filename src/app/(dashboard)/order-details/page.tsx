'use client';

import OrderDetails from '@/components/pages/OrderDetails';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Order details page */
export default function OrderDetailsPage() {
  const router = useRouter();
  const { selectedOrderId } = useApp();
  return (
    <OrderDetails
      orderId={selectedOrderId || '#5434'}
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
