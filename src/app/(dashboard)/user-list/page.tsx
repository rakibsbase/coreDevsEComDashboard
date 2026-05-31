'use client';

import UserList from '@/components/pages/UserList';
import { useRouter } from 'next/navigation';

/** User list page */
export default function UserListPage() {
  const router = useRouter();
  return (
    <UserList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
