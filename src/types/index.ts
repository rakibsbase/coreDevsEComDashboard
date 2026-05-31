export type PageId =
  | "dashboard"
  | "products-list"
  | "add-product"
  | "category-list"
  | "orders-list"
  | "order-details"
  | "customers-list"
  | "customer-details"
  | "manage-reviews"
  | "referrals"
  | "settings"
  | "invoice-list"
  | "invoice-preview"
  | "invoice-edit"
  | "invoice-add"
  | "user-list"
  | "user-view";

export interface Transaction {
  id: string;
  source: string;
  method: string;
  amount: number;
  type: "credit" | "debit";
  subtitle: string;
  status: "success" | "pending" | "failed";
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  tag: "Business" | "Meditation" | "Dinner" | "Meetup";
  avatar: string;
}

export interface ClientBalance {
  id: string;
  clientName: string;
  email: string;
  avatar: string;
  total: number;
  balance: number | "Paid";
  status: "up" | "down" | "success" | "pending";
}

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  categoryIcon: string;
  inStock: boolean;
  sku: string;
  price: number;
  qty: number;
  status: "Publish" | "Scheduled" | "Inactive";
  image: string;
}

export interface OrderItem {
  id: string;
  date: string;
  customer: string;
  email: string;
  avatar: string;
  payment: "Paid" | "Cancelled" | "Failed" | "Pending";
  status: "Delivered" | "Ready to Pickup" | "Out for Delivery" | "Dispatched";
  method: "Paypal" | "Mastercard" | "Visa" | "ApplePay";
  methodDetails: string;
}

export interface ReviewItem {
  id: string;
  productName: string;
  productImage: string;
  reviewer: string;
  reviewEmail: string;
  reviewerAvatar: string;
  stars: number;
  reviewText: string;
  reviewDate: string;
  status: "Published" | "Pending";
}

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  referredId: string;
  status: "Paid" | "Unpaid";
  value: number;
  earning: number;
}

export interface InvoiceItem {
  id: string;
  clientName: string;
  email: string;
  avatar: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: "Paid" | "Draft" | "Sent" | "Past Due" | "Downloaded" | "Partial Payment";
  dateIssued: string;
  dateDue: string;
  items: Array<{
    name: string;
    description: string;
    hours: number;
    qty: number;
    price: number;
  }>;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "Admin" | "Author" | "Editor" | "Maintainer" | "Subscriber";
  plan: "Enterprise" | "Team" | "Company" | "Basic";
  status: "Active" | "Pending" | "Inactive";
  username?: string;
}

export interface CustomerOrderHistory {
  id: string;
  date: string;
  status: "Delivered" | "Ready to Pickup" | "Out for Delivery" | "Dispatched";
  spent: number;
}

export interface CustomerDevice {
  browser: string;
  device: string;
  location: string;
  recentActivities: string;
}

export interface CustomerAddress {
  id: string;
  type: "Home" | "Office" | "Family";
  isDefault: boolean;
  recipient: string;
  street: string;
  cityStateZip: string;
  country: string;
}

export interface CustomerPaymentMethod {
  id: string;
  type: "Mastercard" | "American Express" | "Visa";
  isDefault: boolean;
  last4: string;
  expiry: string;
  name: string;
  issuer: string;
  billingCountry: string;
  origin: string;
  status: string;
  phone: string;
  email: string;
}

export interface NotificationChannelPreference {
  email: boolean;
  browser: boolean;
  app: boolean;
}

export interface CustomerNotificationPrefs {
  newForYou: NotificationChannelPreference;
  accountActivity: NotificationChannelPreference;
  newBrowserUsedToSignIn: NotificationChannelPreference;
  newDeviceLinked: NotificationChannelPreference;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Suspended";
  contact: string;
  country: string;
  countryCode: string; // e.g. "AU", "US", "FR", "CN", "BR"
  orderCount: number;
  totalSpent: number;
  joinedDate: string; // "Aug 17, 2020, 5:48 (ET)"
  accountBalance: number; // e.g. 7480
  loyaltyPoints: number; // e.g. 3000
  loyaltyTier: string; // e.g. "Platinum member"
  wishlistCount: number; // e.g. 15
  couponsCount: number; // e.g. 21
  username?: string;
  orderHistory: CustomerOrderHistory[];
  recentDevices: CustomerDevice[];
  addresses: CustomerAddress[];
  paymentMethods: CustomerPaymentMethod[];
  notifications: CustomerNotificationPrefs;
}
