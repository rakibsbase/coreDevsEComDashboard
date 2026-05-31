'use client';

import AddProduct from '@/components/pages/AddProduct';
import { useRouter } from 'next/navigation';

/** Add product page */
export default function AddProductPage() {
  const router = useRouter();
  return (
    <AddProduct
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
