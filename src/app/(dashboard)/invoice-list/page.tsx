'use client';

import InvoiceList from '@/components/pages/InvoiceList';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Invoice list page */
export default function InvoiceListPage() {
  const router = useRouter();
  const { setSelectedInvoiceId } = useApp();
  return (
    <InvoiceList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      setSelectedInvoiceId={setSelectedInvoiceId}
    />
  );
}
