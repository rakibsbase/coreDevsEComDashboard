'use client';

import { usePathname } from 'next/navigation';
import DashboardSkeleton from '@/components/skeletons/DashboardSkeleton';
import AddProductSkeleton from '@/components/skeletons/AddProductSkeleton';
import CategoryListSkeleton from '@/components/skeletons/CategoryListSkeleton';
import CustomerDetailsSkeleton from '@/components/skeletons/CustomerDetailsSkeleton';
import CustomersListSkeleton from '@/components/skeletons/CustomersListSkeleton';
import InvoiceAddEditSkeleton from '@/components/skeletons/InvoiceAddEditSkeleton';
import InvoiceListSkeleton from '@/components/skeletons/InvoiceListSkeleton';
import InvoicePreviewSkeleton from '@/components/skeletons/InvoicePreviewSkeleton';
import ManageReviewsSkeleton from '@/components/skeletons/ManageReviewsSkeleton';
import OrderDetailsSkeleton from '@/components/skeletons/OrderDetailsSkeleton';
import OrdersListSkeleton from '@/components/skeletons/OrdersListSkeleton';
import ProductsListSkeleton from '@/components/skeletons/ProductsListSkeleton';
import ReferralsSkeleton from '@/components/skeletons/ReferralsSkeleton';
import SettingsSkeleton from '@/components/skeletons/SettingsSkeleton';
import UserListSkeleton from '@/components/skeletons/UserListSkeleton';
import UserViewSkeleton from '@/components/skeletons/UserViewSkeleton';

export default function Loading() {
  const pathname = usePathname();
  const cleanPath = pathname ? pathname.replace(/^\//, '').replace(/\/$/, '') : '';

  switch (cleanPath) {
    case 'add-product':
      return <AddProductSkeleton />;
    case 'category-list':
      return <CategoryListSkeleton />;
    case 'customer-details':
      return <CustomerDetailsSkeleton />;
    case 'customers-list':
      return <CustomersListSkeleton />;
    case 'invoice-add':
    case 'invoice-edit':
      return <InvoiceAddEditSkeleton />;
    case 'invoice-list':
      return <InvoiceListSkeleton />;
    case 'invoice-preview':
      return <InvoicePreviewSkeleton />;
    case 'manage-reviews':
      return <ManageReviewsSkeleton />;
    case 'order-details':
      return <OrderDetailsSkeleton />;
    case 'orders-list':
      return <OrdersListSkeleton />;
    case 'products-list':
      return <ProductsListSkeleton />;
    case 'referrals':
      return <ReferralsSkeleton />;
    case 'settings':
      return <SettingsSkeleton />;
    case 'user-list':
      return <UserListSkeleton />;
    case 'user-view':
      return <UserViewSkeleton />;
    case 'dashboard':
    case '':
    default:
      return <DashboardSkeleton />;
  }
}
