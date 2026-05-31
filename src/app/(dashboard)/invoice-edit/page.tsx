'use client';

import InvoiceAddEdit from '@/components/pages/InvoiceAddEdit';
import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

/** Invoice edit page */
export default function InvoiceEditPage() {
  const router = useRouter();
  const { selectedInvoiceId } = useApp();
  return (
    <InvoiceAddEdit
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
      mode="edit"
      selectedInvoiceId={selectedInvoiceId}
    />
  );
}
