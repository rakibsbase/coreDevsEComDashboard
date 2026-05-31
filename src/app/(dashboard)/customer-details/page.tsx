'use client';

import { useEffect, useState } from 'react';
import CustomerDetails from '@/components/pages/CustomerDetails';
import CustomerDetailsSkeleton from '@/components/skeletons/CustomerDetailsSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function CustomerDetailsPage() {
  const router = useRouter();
  const { selectedCustomerId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <CustomerDetailsSkeleton />;
  return (
    <CustomerDetails
      customerId={selectedCustomerId}
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
