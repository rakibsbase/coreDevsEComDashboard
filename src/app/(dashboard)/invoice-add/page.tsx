'use client';

import InvoiceAddEdit from '@/components/pages/InvoiceAddEdit';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Invoice add page */
export default function InvoiceAddPage() {
  const router = useRouter();
  const { selectedInvoiceId } = useApp();
  return (
    <InvoiceAddEdit
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      mode="add"
      selectedInvoiceId={selectedInvoiceId}
    />
  );
}
