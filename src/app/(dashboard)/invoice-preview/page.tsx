'use client';

import { useEffect, useState } from 'react';
import InvoicePreview from '@/components/pages/InvoicePreview';
import InvoicePreviewSkeleton from '@/components/skeletons/InvoicePreviewSkeleton';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function InvoicePreviewPage() {
  const router = useRouter();
  const { selectedInvoiceId, setSelectedInvoiceId } = useApp();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <InvoicePreviewSkeleton />;
  return (
    <InvoicePreview
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      selectedInvoiceId={selectedInvoiceId}
      setSelectedInvoiceId={setSelectedInvoiceId}
    />
  );
}
