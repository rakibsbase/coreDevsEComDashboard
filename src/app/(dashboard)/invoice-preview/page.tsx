'use client';

import InvoicePreview from '@/components/pages/InvoicePreview';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Invoice preview page */
export default function InvoicePreviewPage() {
  const router = useRouter();
  const { selectedInvoiceId, setSelectedInvoiceId } = useApp();
  return (
    <InvoicePreview
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      selectedInvoiceId={selectedInvoiceId}
      setSelectedInvoiceId={setSelectedInvoiceId}
    />
  );
}
