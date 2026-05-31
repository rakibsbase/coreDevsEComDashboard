'use client';

import { useEffect, useState } from 'react';
import UserView from '@/components/pages/UserView';
import UserViewSkeleton from '@/components/skeletons/UserViewSkeleton';
import { useRouter } from 'next/navigation';

export default function UserViewPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <UserViewSkeleton />;
  return (
    <UserView
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
