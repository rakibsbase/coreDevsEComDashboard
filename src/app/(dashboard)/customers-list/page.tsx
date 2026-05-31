'use client';

import { useEffect, useState } from 'react';
import CustomersList from '@/components/pages/CustomersList';
import CustomersListSkeleton from '@/components/skeletons/CustomersListSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function CustomersListPage() {
  const router = useRouter();
  const { setSelectedCustomerId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <CustomersListSkeleton />;
  return (
    <CustomersList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedCustomerId={setSelectedCustomerId}
    />
  );
}
