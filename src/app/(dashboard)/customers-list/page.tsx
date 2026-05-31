'use client';

import CustomersList from '@/components/pages/CustomersList';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Customers list page */
export default function CustomersListPage() {
  const router = useRouter();
  const { setSelectedCustomerId } = useApp();
  return (
    <CustomersList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedCustomerId={setSelectedCustomerId}
    />
  );
}
