'use client';

import { useEffect, useState } from 'react';
import Settings from '@/components/pages/Settings';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <SettingsSkeleton />;
  return <Settings />;
}
