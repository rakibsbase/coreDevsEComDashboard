'use client';

import { useEffect, useState } from 'react';
import Dashboard from '@/components/pages/Dashboard';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <DashboardSkeleton />;
  return <Dashboard />;
}
