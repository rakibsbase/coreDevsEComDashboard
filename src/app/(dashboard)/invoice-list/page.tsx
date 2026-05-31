'use client';

import { useEffect, useState } from 'react';
import InvoiceList from '@/components/pages/InvoiceList';
import InvoiceListSkeleton from '@/components/skeletons/InvoiceListSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function InvoiceListPage() {
  const router = useRouter();
  const { setSelectedInvoiceId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <InvoiceListSkeleton />;
  return (
    <InvoiceList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedInvoiceId={setSelectedInvoiceId}
    />
  );
}
