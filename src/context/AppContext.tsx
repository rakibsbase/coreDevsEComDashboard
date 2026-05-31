'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import * as actions from '@/store/slices/appSlice';
import toast from 'react-hot-toast';
import { PageId } from '@/types';

/** Hook wrapper to bridge original context API with Redux Toolkit */
export function useApp() {
  const dispatch = useAppDispatch();
  
  // Select all state variables from Redux app state
  const appState = useAppSelector((state) => state.app);
  
  // Define setters that dispatch the appropriate Redux actions
  const setTransactions = (txs: any) => dispatch(actions.setTransactions(txs));
  const setMeetings = (meets: any) => dispatch(actions.setMeetings(meets));
  const setClientBalances = (balances: any) => dispatch(actions.setClientBalances(balances));
  const setProducts = (prods: any) => dispatch(actions.setProducts(prods));
  const setSelectedProduct = (prod: any) => dispatch(actions.setSelectedProduct(prod));
  const setOrders = (orders: any) => dispatch(actions.setOrders(orders));
  const setSelectedOrderId = (id: any) => dispatch(actions.setSelectedOrderId(id));
  const setReviews = (revs: any) => dispatch(actions.setReviews(revs));
  const setReferrals = (refs: any) => dispatch(actions.setReferrals(refs));
  const setInvoices = (invs: any) => dispatch(actions.setInvoices(invs));
  const setUsers = (users: any) => dispatch(actions.setUsers(users));
  const setSelectedUser = (user: any) => dispatch(actions.setSelectedUser(user));
  const setCustomers = (custs: any) => dispatch(actions.setCustomers(custs));
  const setDarkMode = (val: boolean) => dispatch(actions.setDarkMode(val));
  const setSidebarOpen = (val: boolean) => dispatch(actions.setSidebarOpen(val));
  const setSelectedInvoiceId = (val: string) => dispatch(actions.setSelectedInvoiceId(val));
  const setSelectedCustomerId = (val: string) => dispatch(actions.setSelectedCustomerId(val));
  const setActivePage = (val: PageId) => dispatch(actions.setActivePage(val));

  // Authentication helpers
  const login = (email: string, password: string) => {
    const isValid =
      email.trim().toLowerCase() === 'admin@coredevs.com' &&
      password === 'coredevs2026';

    if (isValid) {
      dispatch(actions.setIsAuthenticated(true));
      dispatch(actions.setSidebarOpen(false));
    }
    return isValid;
  };

  const logout = () => {
    dispatch(actions.setIsAuthenticated(false));
    dispatch(actions.setSidebarOpen(false));
  };

  // Toast trigger (reused)
  const triggerToast = (msg: string, type: 'success' | 'error' | 'blank' | 'info' = 'success') => {
    if (type === 'success') {
      toast.success(msg, {
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-divider)',
          fontSize: '13px',
          fontWeight: '600',
        },
        iconTheme: {
          primary: 'var(--primary)',
          secondary: 'white',
        },
      });
    } else if (type === 'error') {
      toast.error(msg, {
        style: {
          background: 'var(--bg-card)',
          color: 'rgb(220 38 38)',
          border: '1px solid rgb(254 202 202)',
          fontSize: '13px',
          fontWeight: '600',
        },
      });
    } else {
      toast(msg, {
        style: {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          fontSize: '13px',
        },
      });
    }
  };

  // confirmAction helper
  const confirmAction = (options: {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    type?: 'danger' | 'warning' | 'success' | 'info';
    onConfirm: () => void;
    onCancel?: () => void;
  }) => {
    dispatch(actions.setConfirmModal(options));
  };

  return {
    ...appState,
    setTransactions,
    setMeetings,
    setClientBalances,
    setProducts,
    setSelectedProduct,
    setOrders,
    setSelectedOrderId,
    setReviews,
    setReferrals,
    setInvoices,
    setUsers,
    setSelectedUser,
    setCustomers,
    setSelectedInvoiceId,
    setSelectedCustomerId,
    setActivePage,
    setDarkMode,
    setSidebarOpen,
    login,
    logout,
    triggerToast,
    confirmAction,
  };
}
