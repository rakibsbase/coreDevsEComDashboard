import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Transaction,
  Meeting,
  ClientBalance,
  ProductItem,
  OrderItem,
  ReviewItem,
  ReferralUser,
  InvoiceItem,
  UserRow,
  Customer,
  RoleItem,
  PermissionItem,
  EmailMessage,
  PageId,
  ChatContact,
  ChatConversation,
} from '@/types';
import {
  initialTransactions,
  initialMeetings,
  initialClientBalances,
  initialProducts,
  initialOrders,
  initialReviews,
  initialReferrals,
  initialInvoices,
  initialUsers,
  initialCustomers,
  initialRoles,
  initialPermissions,
  initialEmails,
  initialChatContacts,
  initialChatConversations,
} from '@/data';

// Helper to save to local storage safely
const setStored = <T,>(key: string, value: T) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`coredevs_${key}`, JSON.stringify(value));
    } catch {}
  }
};

interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'success' | 'info';
  onConfirm: () => void;
  onCancel?: () => void;
}

export interface AppState {
  isAuthenticated: boolean;
  transactions: Transaction[];
  meetings: Meeting[];
  clientBalances: ClientBalance[];
  products: ProductItem[];
  selectedProduct: ProductItem | null;
  orders: OrderItem[];
  selectedOrderId: string | null;
  reviews: ReviewItem[];
  referrals: ReferralUser[];
  invoices: InvoiceItem[];
  users: UserRow[];
  selectedUser: UserRow | null;
  customers: Customer[];
  roles: RoleItem[];
  permissions: PermissionItem[];
  emails: EmailMessage[];
  selectedInvoiceId: string;
  selectedCustomerId: string;
  activePage: PageId;
  darkMode: boolean;
  sidebarOpen: boolean;
  confirmModal: ConfirmModalOptions | null;
  chatContacts: ChatContact[];
  chatConversations: ChatConversation[];
}

const initialState: AppState = {
  isAuthenticated: false,
  transactions: initialTransactions,
  meetings: initialMeetings,
  clientBalances: initialClientBalances,
  products: initialProducts,
  selectedProduct: null,
  orders: initialOrders,
  selectedOrderId: '#5434',
  reviews: initialReviews,
  referrals: initialReferrals,
  invoices: initialInvoices,
  users: initialUsers,
  selectedUser: null,
  customers: initialCustomers,
  roles: initialRoles,
  permissions: initialPermissions,
  emails: initialEmails,
  selectedInvoiceId: '4987',
  selectedCustomerId: '#879861',
  activePage: 'dashboard',
  darkMode: false,
  sidebarOpen: false,
  confirmModal: null,
  chatContacts: initialChatContacts,
  chatConversations: initialChatConversations,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    initializeState: (state, action: PayloadAction<Partial<AppState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (typeof window !== 'undefined') {
        if (action.payload) {
          localStorage.setItem('coredevs_authenticated', 'true');
        } else {
          localStorage.removeItem('coredevs_authenticated');
        }
      }
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.transactions = action.payload;
      setStored('transactions', action.payload);
    },
    setMeetings: (state, action: PayloadAction<Meeting[]>) => {
      state.meetings = action.payload;
      setStored('meetings', action.payload);
    },
    setClientBalances: (state, action: PayloadAction<ClientBalance[]>) => {
      state.clientBalances = action.payload;
      setStored('clientBalances', action.payload);
    },
    setProducts: (state, action: PayloadAction<ProductItem[]>) => {
      state.products = action.payload;
      setStored('products', action.payload);
    },
    setSelectedProduct: (state, action: PayloadAction<ProductItem | null>) => {
      state.selectedProduct = action.payload;
    },
    setOrders: (state, action: PayloadAction<OrderItem[]>) => {
      state.orders = action.payload;
      setStored('orders', action.payload);
    },
    setSelectedOrderId: (state, action: PayloadAction<string | null>) => {
      state.selectedOrderId = action.payload;
    },
    setReviews: (state, action: PayloadAction<ReviewItem[]>) => {
      state.reviews = action.payload;
      setStored('reviews', action.payload);
    },
    setReferrals: (state, action: PayloadAction<ReferralUser[]>) => {
      state.referrals = action.payload;
      setStored('referrals', action.payload);
    },
    setInvoices: (state, action: PayloadAction<InvoiceItem[]>) => {
      state.invoices = action.payload;
      setStored('invoices', action.payload);
    },
    setUsers: (state, action: PayloadAction<UserRow[]>) => {
      state.users = action.payload;
      setStored('users', action.payload);
    },
    setSelectedUser: (state, action: PayloadAction<UserRow | null>) => {
      state.selectedUser = action.payload;
    },
    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.customers = action.payload;
      setStored('customers', action.payload);
    },
    setSelectedInvoiceId: (state, action: PayloadAction<string>) => {
      state.selectedInvoiceId = action.payload;
    },
    setSelectedCustomerId: (state, action: PayloadAction<string>) => {
      state.selectedCustomerId = action.payload;
    },
    setActivePage: (state, action: PayloadAction<PageId>) => {
      state.activePage = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', action.payload);
      }
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setConfirmModal: (state, action: PayloadAction<ConfirmModalOptions | null>) => {
      state.confirmModal = action.payload;
    },
    setRoles: (state, action: PayloadAction<RoleItem[]>) => {
      state.roles = action.payload;
      setStored('roles', action.payload);
    },
    setPermissions: (state, action: PayloadAction<PermissionItem[]>) => {
      state.permissions = action.payload;
      setStored('permissions', action.payload);
    },
    setEmails: (state, action: PayloadAction<EmailMessage[]>) => {
      state.emails = action.payload;
      setStored('emails', action.payload);
    },
    setChatContacts: (state, action: PayloadAction<ChatContact[]>) => {
      state.chatContacts = action.payload;
      setStored('chatContacts', action.payload);
    },
    setChatConversations: (state, action: PayloadAction<ChatConversation[]>) => {
      state.chatConversations = action.payload;
      setStored('chatConversations', action.payload);
    },
  },
});

export const {
  initializeState,
  setIsAuthenticated,
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
  setConfirmModal,
  setRoles,
  setPermissions,
  setEmails,
  setChatContacts,
  setChatConversations,
} = appSlice.actions;

export default appSlice.reducer;
