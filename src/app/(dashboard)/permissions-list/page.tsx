'use client';

import { useEffect, useState } from 'react';
import PermissionsList from '@/components/pages/PermissionsList';
import { useRouter } from 'next/navigation';

export default function PermissionsListPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
    </div>
  );
  return (
    <PermissionsList
      setActivePage={(page) => router.push(page === 'dashboard' ? '/' : `/${page}`)}
    />
  );
}
