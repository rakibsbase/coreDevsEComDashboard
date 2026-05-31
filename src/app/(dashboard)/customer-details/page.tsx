'use client';

import CustomerDetails from '@/components/pages/CustomerDetails';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Customer details page */
export default function CustomerDetailsPage() {
  const router = useRouter();
  const { selectedCustomerId } = useApp();
  return (
    <CustomerDetails
      customerId={selectedCustomerId}
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
