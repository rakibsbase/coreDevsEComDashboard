'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import Login from '@/components/pages/Login';

/** Login page route with redirection guard */
export default function LoginPage() {
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router, mounted]);

  if (!mounted) {
    return null; // Prevents flashing during initial hydration
  }

  return <Login />;
}
