'use client';

import CategoryList from '@/components/pages/CategoryList';
import { useRouter } from 'next/navigation';

/** Category list page */
export default function CategoryListPage() {
  const router = useRouter();
  return (
    <CategoryList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
