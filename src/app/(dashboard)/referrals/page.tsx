'use client';

import { useEffect, useState } from 'react';
import Referrals from '@/components/pages/Referrals';
import ReferralsSkeleton from '@/components/skeletons/ReferralsSkeleton';

export default function ReferralsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <ReferralsSkeleton />;
  return <Referrals />;
}
