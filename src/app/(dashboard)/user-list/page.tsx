'use client';

import { useEffect, useState } from 'react';
import UserList from '@/components/pages/UserList';
import UserListSkeleton from '@/components/skeletons/UserListSkeleton';
import { useRouter } from 'next/navigation';

export default function UserListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <UserListSkeleton />;
  return (
    <UserList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
