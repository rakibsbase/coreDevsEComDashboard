'use client';

import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { initializeState } from './slices/appSlice';
import { Toaster } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from './hooks';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Read stored items on mount (client side only)
    const getStored = <T,>(key: string, fallback: T): T => {
      try {
        const stored = localStorage.getItem(`coredevs_${key}`);
        return stored ? JSON.parse(stored) : fallback;
      } catch {
        return fallback;
      }
    };

    let authenticated = false;
    try {
      authenticated = localStorage.getItem('coredevs_authenticated') === 'true';
    } catch {}

    let dark = false;
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        dark = savedTheme === 'dark';
      } else {
        dark = document.documentElement.classList.contains('dark');
      }
    } catch {}

    // Synchronize HTML element dark class
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Load initial states from local storage if available
    const transactions = getStored('transactions', undefined);
    const meetings = getStored('meetings', undefined);
    const clientBalances = getStored('clientBalances', undefined);
    const products = getStored('products', undefined);
    const orders = getStored('orders', undefined);
    const reviews = getStored('reviews', undefined);
    const referrals = getStored('referrals', undefined);
    const invoices = getStored('invoices', undefined);
    const users = getStored('users', undefined);
    const customers = getStored('customers', undefined);

    const payload: any = {
      isAuthenticated: authenticated,
      darkMode: dark,
    };

    if (transactions) payload.transactions = transactions;
    if (meetings) payload.meetings = meetings;
    if (clientBalances) payload.clientBalances = clientBalances;
    if (products) payload.products = products;
    if (orders) payload.orders = orders;
    if (reviews) payload.reviews = reviews;
    if (referrals) payload.referrals = referrals;
    if (invoices) payload.invoices = invoices;
    if (users) payload.users = users;
    if (customers) payload.customers = customers;

    dispatch(initializeState(payload));
    setHydrated(true);
  }, [dispatch]);

  const confirmModal = useAppSelector((state) => state.app.confirmModal);

  // If not hydrated yet, we can render the children or a simple loading skeleton.
  // To prevent layout flashes, we render the children, and when the effect runs, they will receive the correct state.
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      {children}

      {/* Global Confirmation Modal (replaces the one from original AppContext.tsx) */}
      <AnimatePresence>
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Glass backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (confirmModal.onCancel) confirmModal.onCancel();
                dispatch(initializeState({ confirmModal: null }));
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
            />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border-divider bg-bg-card p-6 shadow-2xl z-10 select-none"
            >
              {/* Close button */}
              <button
                onClick={() => {
                  if (confirmModal.onCancel) confirmModal.onCancel();
                  dispatch(initializeState({ confirmModal: null }));
                }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-app transition-all cursor-pointer border-0 bg-transparent"
              >
                <X size={16} />
              </button>

              {/* Icon & Details */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${
                  confirmModal.type === "danger"
                    ? "bg-rose-500/10 text-rose-500"
                    : confirmModal.type === "success"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : confirmModal.type === "warning"
                    ? "bg-amber-500/10 text-amber-500"
                    : "bg-primary/10 text-primary"
                }`}>
                  {confirmModal.type === "danger" ? (
                    <Trash2 size={24} />
                  ) : confirmModal.type === "success" ? (
                    <CheckCircle size={24} />
                  ) : confirmModal.type === "warning" ? (
                    <AlertTriangle size={24} />
                  ) : (
                    <Info size={24} />
                  )}
                </div>

                <div className="space-y-1 text-left flex-1 pr-6">
                  <h3 className="font-display text-base font-extrabold text-text-primary leading-tight">
                    {confirmModal.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-1">
                    {confirmModal.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => {
                    if (confirmModal.onCancel) confirmModal.onCancel();
                    dispatch(initializeState({ confirmModal: null }));
                  }}
                  className="px-4 py-2 border border-border-divider hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer text-text-secondary bg-transparent"
                >
                  {confirmModal.cancelLabel || "Cancel"}
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    dispatch(initializeState({ confirmModal: null }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer border-0 ${
                    confirmModal.type === "danger"
                      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/15 hover:shadow-rose-500/25"
                      : confirmModal.type === "success"
                      ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/15 hover:shadow-emerald-500/25"
                      : confirmModal.type === "warning"
                      ? "bg-amber-500 hover:bg-amber-600 shadow-amber-500/15 hover:shadow-amber-500/25"
                      : "bg-primary hover:bg-purple-600 shadow-purple-500/15 hover:shadow-purple-500/25"
                  }`}
                >
                  {confirmModal.confirmLabel || "Confirm"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrationWrapper>{children}</HydrationWrapper>
    </Provider>
  );
}
