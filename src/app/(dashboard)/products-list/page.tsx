'use client';

import ProductsList from '@/components/pages/ProductsList';
import { useRouter } from 'next/navigation';

/** Products list page */
export default function ProductsListPage() {
  const router = useRouter();
  return (
    <ProductsList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
