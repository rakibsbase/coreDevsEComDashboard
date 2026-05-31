'use client';

import { useEffect, useState } from 'react';
import InvoiceAddEdit from '@/components/pages/InvoiceAddEdit';
import InvoiceAddEditSkeleton from '@/components/skeletons/InvoiceAddEditSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function InvoiceEditPage() {
  const router = useRouter();
  const { selectedInvoiceId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <InvoiceAddEditSkeleton />;
  return (
    <InvoiceAddEdit
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      mode="edit"
      selectedInvoiceId={selectedInvoiceId}
    />
  );
}
