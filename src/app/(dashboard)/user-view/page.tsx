'use client';

import UserView from '@/components/pages/UserView';
import { useRouter } from 'next/navigation';

/** User view page */
export default function UserViewPage() {
  const router = useRouter();
  return (
    <UserView
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
