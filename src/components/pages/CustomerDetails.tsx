import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { PageId, Customer, CustomerAddress, CustomerPaymentMethod } from "@/types";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Lock,
  Bell,
  Trash2,
  Check,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Globe,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  X,
  Sparkles,
  ShoppingBag,
  Coins,
  Heart,
  Gift,
  Plus,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmAction, confirmDelete, confirmSave, toastSuccess, toastError } from "@/utils/confirm";

interface CustomerDetailsProps {
  customerId: string;
  setActivePage: (page: PageId) => void;
}

export default function CustomerDetails({ customerId, setActivePage }: CustomerDetailsProps) {
  const { customers, setCustomers, triggerToast } = useApp();

  // Find targeted customer
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === customerId) || customers[0];
  }, [customers, customerId]);

  // Tab State: Overview, Security, Address & Billing, Notifications
  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "billing", label: "Address & Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell }
  ];
  const [activeTab, setActiveTab] = useState("overview");

  // Dynamic search state inside Overview specific table
  const [orderSearchText, setOrderSearchText] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState(10);

  // Security variables
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // Notifications values
  const [notifStates, setNotifStates] = useState(() => {
    if (currentCustomer) {
      return { ...currentCustomer.notifications };
    }
    return {
      newForYou: { email: true, browser: false, app: false },
      accountActivity: { email: false, browser: true, app: true },
      newBrowserUsedToSignIn: { email: true, browser: true, app: true },
      newDeviceLinked: { email: false, browser: true, app: false }
    };
  });

  // Toggle sections collapse in address book & payment methods
  const [expandedAddressId, setExpandedAddressId] = useState<string | null>("adr-1");
  const [expandedPaymentId, setExpandedPaymentId] = useState<string | null>("pm-1");

  // Edit Details Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    contact: "",
    country: "",
    status: "Active" as "Active" | "Suspended"
  });

  // Add Address Modal
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState({
    type: "Home" as "Home" | "Office" | "Family",
    recipient: "",
    street: "",
    cityStateZip: "",
    country: "Australia"
  });

  // Add Payment Card Modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({
    type: "Mastercard" as "Mastercard" | "Visa" | "American Express",
    last4: "",
    expiry: "",
    name: "",
    issuer: ""
  });

  // Fallback safety
  if (!currentCustomer) {
    return (
      <div className="py-12 text-center text-xs text-text-secondary select-none font-mono">
        Customer data not found. Return to <button onClick={() => setActivePage("customers-list")} className="text-primary font-bold underline">customer catalog</button>
      </div>
    );
  }

  // Orders filters
  const filteredOrders = useMemo(() => {
    return currentCustomer.orderHistory.filter(ord => {
      return (
        ord.id.toLowerCase().includes(orderSearchText.toLowerCase()) ||
        ord.status.toLowerCase().includes(orderSearchText.toLowerCase()) ||
        ord.date.toLowerCase().includes(orderSearchText.toLowerCase())
      );
    });
  }, [currentCustomer.orderHistory, orderSearchText]);

  // Order Paginations
  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / orderRowsPerPage));
  const currentOrders = useMemo(() => {
    const startIndex = (orderPage - 1) * orderRowsPerPage;
    return filteredOrders.slice(startIndex, startIndex + orderRowsPerPage);
  }, [filteredOrders, orderPage, orderRowsPerPage]);

  const handleOrderPageChange = (p: number) => {
    if (p >= 1 && p <= totalOrderPages) {
      setOrderPage(p);
    }
  };

  // Profile triggers
  const handleDeleteCustomer = async () => {
    const ok = await confirmDelete(currentCustomer.name);
    if (!ok) return;
    const updated = customers.filter(c => c.id !== currentCustomer.id);
    setCustomers(updated);
    toastSuccess("Customer profile deleted");
    setActivePage("customers-list");
  };

  const handleToggleSuspended = async () => {
    const nextStatus: Customer["status"] = currentCustomer.status === "Active" ? "Suspended" : "Active";
    const ok = await confirmAction(
      currentCustomer.status === "Active" ? "Suspend Customer?" : "Activate Customer?",
      `Change ${currentCustomer.name} to ${nextStatus}?`
    );
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess(`Customer status updated to ${nextStatus}`);
  };

  // Form submit operations
  const openEditModal = () => {
    setEditFormData({
      name: currentCustomer.name,
      email: currentCustomer.email,
      contact: currentCustomer.contact,
      country: currentCustomer.country,
      status: currentCustomer.status
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.email) {
      toastError("Please provide the customer name and email address.");
      return;
    }
    const ok = await confirmSave("customer profile");
    if (!ok) return;

    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          name: editFormData.name,
          email: editFormData.email,
          contact: editFormData.contact,
          country: editFormData.country,
          status: editFormData.status
        };
      }
      return c;
    });

    setCustomers(updated);
    setIsEditModalOpen(false);
    toastSuccess("Customer details updated");
  };

  // Change Password triggers
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.password) {
      triggerToast("Please input a valid password", "error");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      triggerToast("Passwords do not match", "error");
      return;
    }
    triggerToast("Customer portal password updated", "success");
    setPasswordForm({ password: "", confirmPassword: "" });
  };

  // Address dynamic actions
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.recipient || !newAddr.street || !newAddr.cityStateZip) {
      toastError("Missing address parameters.");
      return;
    }
    const ok = await confirmSave("address");
    if (!ok) return;

    const newAddressObj: CustomerAddress = {
      id: `adr-${Date.now()}`,
      type: newAddr.type,
      isDefault: currentCustomer.addresses.length === 0,
      recipient: newAddr.recipient,
      street: newAddr.street,
      cityStateZip: newAddr.cityStateZip,
      country: newAddr.country
    };

    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          addresses: [...c.addresses, newAddressObj]
        };
      }
      return c;
    });

    setCustomers(updated);
    setIsAddressModalOpen(false);
    setExpandedAddressId(newAddressObj.id);
    toastSuccess("Added new customer address successfully");
    setNewAddr({ type: "Home", recipient: "", street: "", cityStateZip: "", country: "Australia" });
  };

  const handleMakeAddressDefault = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirmAction("Set Default Address?", "Use this as the default address?");
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          addresses: c.addresses.map(a => ({ ...a, isDefault: a.id === addrId }))
        };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess("Default shipping address set");
  };

  const handleDeleteAddress = async (addrId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirmDelete("address");
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          addresses: c.addresses.filter(a => a.id !== addrId)
        };
      }
      return c;
    });
    setCustomers(updated);
    if (expandedAddressId === addrId) setExpandedAddressId(null);
    toastSuccess("Address record removed");
  };

  // Payment Dynamic actions
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCard.name || !newCard.last4 || !newCard.expiry) {
      toastError("Missing payment parameters.");
      return;
    }
    const ok = await confirmSave("payment card");
    if (!ok) return;

    const newCardObj: CustomerPaymentMethod = {
      id: `pm-${Date.now()}`,
      type: newCard.type,
      isDefault: currentCustomer.paymentMethods.length === 0,
      last4: newCard.last4.slice(-4),
      expiry: newCard.expiry,
      name: newCard.name,
      issuer: newCard.issuer || "UNIVERSAL",
      billingCountry: currentCustomer.country,
      origin: "United States",
      status: "Passed",
      phone: currentCustomer.contact,
      email: currentCustomer.email
    };

    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          paymentMethods: [...c.paymentMethods, newCardObj]
        };
      }
      return c;
    });

    setCustomers(updated);
    setIsPaymentModalOpen(false);
    setExpandedPaymentId(newCardObj.id);
    toastSuccess("New payment card added successfully");
    setNewCard({ type: "Mastercard", last4: "", expiry: "", name: "", issuer: "" });
  };

  const handleMakeCardDefault = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirmAction("Set Default Card?", "Use this as the default payment method?");
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          paymentMethods: c.paymentMethods.map(p => ({ ...p, isDefault: p.id === cardId }))
        };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess("Default payment card linked");
  };

  const handleDeleteCard = async (cardId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirmDelete("payment card");
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          paymentMethods: c.paymentMethods.filter(p => p.id !== cardId)
        };
      }
      return c;
    });
    setCustomers(updated);
    if (expandedPaymentId === cardId) setExpandedPaymentId(null);
    toastSuccess("Payment method card deleted");
  };

  // Save changes notifications
  const handleSaveNotifications = async () => {
    const ok = await confirmSave("notification preferences");
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          notifications: { ...notifStates }
        };
      }
      return c;
    });
    setCustomers(updated);
    toastSuccess("Notification priorities saved");
  };

  const handleDiscardNotifications = () => {
    setNotifStates({ ...currentCustomer.notifications });
    triggerToast("Discarded unsaved changes", "info");
  };

  // Flags emojis lookup helper
  const getFlagEmoji = (code: string) => {
    switch (code) {
      case "AU": return "🇦🇺";
      case "US": return "🇺🇸";
      case "FR": return "🇫🇷";
      case "CN": return "🇨🇳";
      case "BR": return "🇧🇷";
      default: return "🏳️";
    }
  };

  return (
    <div className="space-y-6" id="customers-module-detail">
      
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-divider/50 pb-5 select-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-text-primary tracking-tight font-sans">
              Customer ID {currentCustomer.id}
            </h1>
            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
              currentCustomer.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            }`}>
              {currentCustomer.status}
            </span>
          </div>
          <p className="text-[11px] text-text-secondary mt-0.5 font-mono">
            Joined Platform: <span className="text-text-primary font-bold">{currentCustomer.joinedDate}</span>
          </p>
        </div>

        {/* Header Right Action Area */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActivePage("customers-list")}
            className="px-4 py-2 text-xs font-bold text-text-primary border border-border-divider hover:bg-bg-card rounded-xl transition-all cursor-pointer bg-transparent"
          >
            ← Catalog
          </button>
          
          <button
            onClick={handleDeleteCustomer}
            className="px-4 py-2 text-xs font-bold text-red-500 border border-red-500/30 hover:border-red-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer bg-transparent"
          >
            Delete Customer
          </button>
        </div>
      </div>

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Customer Profile Cards */}
        <div className="lg:col-span-4 space-y-6 select-none">
          
          {/* Main info profile block inside card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs relative text-center">
            
            <div className="flex flex-col items-center">
              {/* Profile high-res circular avatar photo */}
              <div className="relative">
                <img
                  src={currentCustomer.avatar}
                  alt={currentCustomer.name}
                  className="w-20 h-20 rounded-2xl object-cover shrink-0 border-2 border-primary/20 bg-bg-app shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${currentCustomer.name}`;
                  }}
                />
                <span className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-bg-card ${
                  currentCustomer.status === "Active" ? "bg-emerald-500" : "bg-rose-500"
                }`} />
              </div>

              {/* Stack items */}
              <h2 className="text-base font-extrabold text-text-primary mt-4 tracking-tight">
                {currentCustomer.name}
              </h2>
              <p className="text-[11px] text-text-secondary font-semibold font-mono bg-bg-app/80 px-2.5 py-1 rounded-full border border-border-divider/50 mt-1.5 inline-block">
                Customer ID {currentCustomer.id}
              </p>
            </div>

            {/* Quick mini-metrics grid of orders and spent */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-divider/50 my-6 py-5">
              <div className="flex items-center gap-3 justify-center border-r border-border-divider/50">
                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                  <ShoppingBag size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-primary font-mono">{currentCustomer.orderCount}</p>
                  <p className="text-[9px] font-bold text-text-secondary uppercase">Orders</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center pl-2">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <Coins size={18} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-text-primary font-mono">
                    ${Math.round(currentCustomer.totalSpent).toLocaleString()}
                  </p>
                  <p className="text-[9px] font-bold text-text-secondary uppercase">Spent</p>
                </div>
              </div>
            </div>

            {/* Detailed Parameters container info list */}
            <div className="space-y-4 text-left">
              <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-wider">
                Details
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-semibold">Username:</span>
                  <span className="text-text-primary font-bold">{currentCustomer.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-semibold">Billing Email:</span>
                  <span className="text-text-primary font-bold font-mono text-[11px] select-all">
                    {currentCustomer.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-semibold">Status:</span>
                  <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                    currentCustomer.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                  }`}>
                    {currentCustomer.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-semibold">Contact:</span>
                  <span className="text-text-primary font-bold font-mono">{currentCustomer.contact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary font-semibold">Country:</span>
                  <span className="text-text-primary font-bold flex items-center gap-1.5">
                    <span>{getFlagEmoji(currentCustomer.countryCode)}</span>
                    <span>{currentCustomer.country}</span>
                  </span>
                </div>
              </div>

              {/* Left Column interactive triggers below details */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-divider/30">
                <button
                  type="button"
                  onClick={handleToggleSuspended}
                  className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer bg-transparent ${
                    currentCustomer.status === "Active"
                      ? "text-orange-500 border-orange-500/30 hover:bg-orange-500/10"
                      : "text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
                  }`}
                >
                  {currentCustomer.status === "Active" ? "Suspend" : "Activate"}
                </button>

                <button
                  type="button"
                  onClick={openEditModal}
                  className="w-full py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Edit Details
                </button>
              </div>
            </div>
          </div>

          {/* Premium banner upgrade container widget */}
          <div className="bg-linear-to-br from-primary/95 to-purple-900 rounded-2xl p-5 text-white shadow-xs flex items-center justify-between relative overflow-hidden gap-4">
            {/* Ambient bubble decorations */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-6 -mt-6 select-none" />
            
            <div className="z-10 text-left">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider mb-2">
                <Sparkles size={10} /> Pro Membership
              </span>
              <h4 className="text-xs font-extrabold tracking-tight">Upgrade to premium</h4>
              <p className="text-[10px] text-white/80 mt-1 leading-normal">
                Upgrade customer to premium membership to access pro features.
              </p>
              <button className="mt-3.5 bg-white text-primary hover:bg-white/95 text-[10px] font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer border-0">
                Upgrade To Premium
              </button>
            </div>

            <div className="shrink-0 z-10 self-center max-w-[80px]">
              <span className="text-5xl select-none">🚀</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive multi-tabs viewport */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          
          {/* Tabs navigation array container */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1 select-none">
            {tabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition-all relative cursor-pointer ${
                    isActive
                      ? "text-primary dark:text-purple-450 bg-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-app"
                  }`}
                >
                  <IconComp size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Render Active View tab elements */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.18 }}
                className="w-full h-full"
              >
                
                {/* CASE 1: OVERVIEW TAB */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* BENTO GRID (4 metric cells) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* CARD 1: Account Balance */}
                      <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center gap-4 text-left select-none">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                          <Coins size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase">
                            Account Balance
                          </p>
                          <p className="text-lg font-mono font-black text-text-primary mt-1">
                            ${currentCustomer.accountBalance.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-text-secondary mt-0.5">
                            Credit left for next purchase
                          </p>
                        </div>
                      </div>

                      {/* CARD 2: Loyalty Tier */}
                      <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center gap-4 text-left select-none">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shrink-0">
                          <Gift size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase">
                            Loyalty Program
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block">
                              {currentCustomer.loyaltyTier}
                            </span>
                          </div>
                          <p className="text-[10px] text-text-secondary mt-1">
                            {currentCustomer.loyaltyPoints} points to next premium tier
                          </p>
                        </div>
                      </div>

                      {/* CARD 3: Wishlist items */}
                      <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center gap-4 text-left select-none">
                        <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-500 shrink-0">
                          <Heart size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase">
                            Wishlist Category
                          </p>
                          <p className="text-base font-extrabold text-text-primary mt-1">
                            {currentCustomer.wishlistCount} Items Saved
                          </p>
                          <p className="text-[10px] text-text-secondary mt-0.5">
                            Receive notifications on price drops
                          </p>
                        </div>
                      </div>

                      {/* CARD 4: Coupons wins */}
                      <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center gap-4 text-left select-none">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 shrink-0">
                          <Sparkles size={22} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-text-secondary uppercase">
                            Coupons & Prizes
                          </p>
                          <p className="text-base font-extrabold text-text-primary mt-1">
                            {currentCustomer.couponsCount} Coupons Claimed
                          </p>
                          <p className="text-[10px] text-text-secondary mt-0.5">
                            Use current voucher on next purchase
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* MAIN SUB-TABLE: Orders history list */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
                      
                      <div className="p-5 border-b border-border-divider flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-50/10 select-none">
                        <h3 className="text-xs font-black text-text-primary uppercase tracking-wider font-sans">
                          Orders Placed
                        </h3>
                        
                        {/* Search input specific for orders */}
                        <div className="relative w-full sm:w-60">
                          <input
                            type="text"
                            placeholder="Search Order No. or Status..."
                            value={orderSearchText}
                            onChange={(e) => {
                              setOrderSearchText(e.target.value);
                              setOrderPage(1);
                            }}
                            className="w-full pl-8 pr-4 py-1.5 text-xs font-semibold bg-bg-app border border-border-divider rounded-lg text-text-primary focus:border-primary focus:outline-hidden"
                          />
                          <Search className="absolute left-2.5 top-2.5 text-text-secondary w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Sub-table elements */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse select-none">
                          <thead>
                            <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/5">
                              <th className="py-3 px-5 text-center w-24">Order</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4 text-center w-36">Status</th>
                              <th className="py-3 px-4 text-right w-28">Spent</th>
                              <th className="py-3 px-4 text-center w-20">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-divider text-xs">
                            {currentOrders.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-10 text-center font-mono text-text-secondary font-semibold">
                                  No transaction records found for this user.
                                </td>
                              </tr>
                            ) : (
                              currentOrders.map((ord) => {
                                // Status colored badges mapping helper
                                let statusStyles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
                                if (ord.status === "Ready to Pickup") {
                                  statusStyles = "bg-blue-500/10 text-blue-500 border-blue-500/20";
                                } else if (ord.status === "Out for Delivery") {
                                  statusStyles = "bg-purple-500/10 text-purple-500 border-purple-500/20";
                                } else if (ord.status === "Dispatched") {
                                  statusStyles = "bg-amber-500/10 text-amber-500 border-amber-500/20";
                                }

                                return (
                                  <tr key={ord.id} className="hover:bg-gray-50/5">
                                    <td className="py-3.5 px-5 text-center font-mono font-bold text-primary select-all cursor-pointer">
                                      {ord.id}
                                    </td>
                                    <td className="py-3.5 px-4 font-semibold text-text-secondary">
                                      {ord.date}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyles}`}>
                                        {ord.status}
                                      </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right font-mono font-bold text-text-primary pr-6">
                                      ${ord.spent.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3.5 px-4 text-center">
                                      <button
                                        onClick={() => {
                                          triggerToast(`Routing to invoices portal for ${ord.id}`, "info");
                                          setActivePage("invoice-list");
                                        }}
                                        className="p-1 hover:bg-bg-app rounded-md text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
                                      >
                                        <MoreVertical size={13} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })
                            )}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination segment */}
                      <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between select-none text-[11px] text-text-secondary font-semibold bg-gray-50/5">
                        <div>
                          Showing <span className="text-text-primary font-bold">{(orderPage - 1) * orderRowsPerPage + 1}-{Math.min(orderPage * orderRowsPerPage, filteredOrders.length)}</span> of <span className="text-text-primary font-bold">{filteredOrders.length}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            disabled={orderPage === 1}
                            onClick={() => handleOrderPageChange(orderPage - 1)}
                            className="p-1 border border-border-divider rounded-md bg-bg-card text-text-primary disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronLeft size={13} />
                          </button>
                          <span className="font-mono text-text-primary font-bold">{orderPage} / {totalOrderPages}</span>
                          <button
                            disabled={orderPage === totalOrderPages}
                            onClick={() => handleOrderPageChange(orderPage + 1)}
                            className="p-1 border border-border-divider rounded-md bg-bg-card text-text-primary disabled:opacity-40 cursor-pointer"
                          >
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 2: SECURITY TAB */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    
                    {/* Change Password Panel */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-left">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary border-b border-border-divider pb-2 mb-4">
                        Change Password
                      </h3>
                      
                      {/* Alert banner warning */}
                      <div className="p-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl mb-5 flex items-start gap-3 select-none">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold">Ensure that these requirements are met</p>
                          <p className="text-[10px] mt-0.5 leading-normal opacity-90">
                            Minimum 8 characters long, uppercase & symbol should be present.
                          </p>
                        </div>
                      </div>

                      {/* Password input form fields */}
                      <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-text-secondary uppercase">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                required
                                type={showPwd ? "text" : "password"}
                                value={passwordForm.password}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, password: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary pr-9 focus:border-primary focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                              >
                                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold text-text-secondary uppercase">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                required
                                type={showConfirmPwd ? "text" : "password"}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                placeholder="••••••••"
                                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary pr-9 focus:border-primary focus:outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                                className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                              >
                                {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="px-5 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors cursor-pointer"
                        >
                          Change Password
                        </button>
                      </form>
                    </div>

                    {/* Two Step Authentication panel view */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-left">
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary border-b border-border-divider pb-2 mb-2">
                        Two-step verification
                      </h3>
                      <p className="text-[11px] text-text-secondary">
                        Keep your account secure with authentication step.
                      </p>

                      <div className="mt-5 space-y-2 select-none">
                        <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">
                          SMS Verification Line
                        </label>
                        <div className="flex gap-2 items-center max-w-sm">
                          <input
                            type="text"
                            defaultValue="+1(968) 819-2547"
                            className="flex-1 text-xs font-mono font-bold p-2.5 pb-2 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                          />
                          <button
                            title="Edit"
                            onClick={() => triggerToast("Updated phone configuration", "success")}
                            className="p-2 border border-border-divider rounded-xl hover:bg-bg-app text-text-secondary hover:text-primary transition-all cursor-pointer bg-white"
                          >
                            <User size={13} />
                          </button>
                          <button
                            title="Reset"
                            onClick={() => triggerToast("Security token refreshed", "info")}
                            className="p-2 border border-border-divider rounded-xl hover:bg-bg-app text-text-secondary hover:text-red-500 transition-all cursor-pointer bg-white"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="text-[10px] text-text-secondary leading-normal pt-1 flex items-start gap-1 font-mono">
                          Two-factor authentication adds an additional layer of security... <button onClick={() => triggerToast("Opening help logs", "info")} className="text-primary hover:underline">Learn more.</button>
                        </p>
                      </div>
                    </div>

                    {/* Devices list table */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden text-left">
                      <div className="p-5 border-b border-border-divider bg-gray-50/10">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary">
                          Recent Devices
                        </h3>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse select-none text-xs">
                          <thead>
                            <tr className="border-b border-border-divider text-[10px] font-extrabold text-text-secondary uppercase tracking-wider bg-gray-55/10">
                              <th className="py-3 px-5">Browser</th>
                              <th className="py-3 px-4">Device</th>
                              <th className="py-3 px-4">Location</th>
                              <th className="py-3 px-4">Recent Activities</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-divider font-semibold text-text-primary">
                            {currentCustomer.recentDevices.map((dev, i) => (
                              <tr key={i} className="hover:bg-gray-50/5">
                                <td className="py-3.5 px-5 flex items-center gap-2">
                                  {dev.browser.toLowerCase().includes("windows") || dev.browser.toLowerCase().includes("macos") ? (
                                    <Laptop size={14} className="text-text-secondary" />
                                  ) : (
                                    <Smartphone size={14} className="text-text-secondary" />
                                  )}
                                  <span>{dev.browser}</span>
                                </td>
                                <td className="py-3.5 px-4 text-text-secondary">{dev.device}</td>
                                <td className="py-3.5 px-4 flex items-center gap-1.5">
                                  <Globe size={13} className="text-text-secondary" />
                                  <span>{dev.location}</span>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-text-secondary text-[11px]">
                                  {dev.recentActivities}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 3: ADDRESS & BILLING TAB */}
                {activeTab === "billing" && (
                  <div className="space-y-6">
                    
                    {/* Address Book Stack Card */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-left">
                      <div className="flex justify-between items-center border-b border-border-divider pb-3 mb-4 select-none">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary">
                          Address Book
                        </h3>
                        
                        {/* Add address trigger */}
                        <button
                          onClick={() => setIsAddressModalOpen(true)}
                          className="px-3 py-1.5 text-[11px] font-bold text-primary border border-primary/20 hover:bg-primary/10 rounded-xl flex items-center gap-1 transition-all cursor-pointer bg-transparent"
                        >
                          <Plus size={12} />
                          <span>Add New Address</span>
                        </button>
                      </div>

                      {/* Stacked Accordion Panels */}
                      <div className="space-y-2.5">
                        {currentCustomer.addresses.length === 0 ? (
                          <p className="py-6 text-center text-xs text-text-secondary font-semibold font-mono">
                            No billing addresses found. Tap "+ Add New Address" above.
                          </p>
                        ) : (
                          currentCustomer.addresses.map((addr) => {
                            const isExpanded = expandedAddressId === addr.id;

                            return (
                              <div
                                key={addr.id}
                                className="border border-border-divider rounded-xl overflow-hidden shadow-xs transition-all bg-bg-app/10"
                              >
                                {/* Header Toggle Trigger */}
                                <div
                                  onClick={() => setExpandedAddressId(isExpanded ? null : addr.id)}
                                  className="p-4 flex justify-between items-center hover:bg-bg-app/30 cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-xs text-text-primary uppercase tracking-wider">
                                      {addr.type} Address
                                    </span>
                                    {addr.isDefault && (
                                      <span className="px-2 py-0.5 text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                        Default Address
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </div>
                                </div>

                                {/* Address Expandable Body */}
                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="overflow-hidden border-t border-border-divider bg-bg-card p-4 text-xs space-y-2 relative"
                                    >
                                      {/* Control Buttons on expanded right */}
                                      <div className="absolute right-4 top-4 flex items-center gap-2 select-none">
                                        {!addr.isDefault && (
                                          <button
                                            onClick={(e) => handleMakeAddressDefault(addr.id, e)}
                                            className="px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer bg-white"
                                          >
                                            Set Default
                                          </button>
                                        )}
                                        <button
                                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                                          className="p-1 px-1.5 hover:bg-rose-500/10 text-red-500 rounded-lg shrink-0 transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>

                                      {/* Info text fields */}
                                      <p className="text-text-primary font-bold text-sm leading-none pt-0.5">{addr.recipient}</p>
                                      <p className="text-text-secondary font-medium pt-1 font-mono text-[11px]">{addr.street}</p>
                                      <p className="text-text-secondary font-medium font-mono text-[11px]">
                                        {addr.cityStateZip}, {addr.country}
                                      </p>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Payment methods section card */}
                    <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-left">
                      <div className="flex justify-between items-center border-b border-border-divider pb-3 mb-4 select-none">
                        <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary">
                          Payment Methods
                        </h3>
                        
                        <button
                          onClick={() => setIsPaymentModalOpen(true)}
                          className="px-3 py-1.5 text-[11px] font-bold text-primary border border-primary/20 hover:bg-primary/10 rounded-xl flex items-center gap-1 transition-all cursor-pointer bg-transparent"
                        >
                          <Plus size={12} />
                          <span>New Payment Methods</span>
                        </button>
                      </div>

                      {/* Payment stacked collapsible list */}
                      <div className="space-y-2.5">
                        {currentCustomer.paymentMethods.length === 0 ? (
                          <p className="py-6 text-center text-xs text-text-secondary font-semibold font-mono">
                            No credit cards linked. Touch "+ New Payment Methods" above.
                          </p>
                        ) : (
                          currentCustomer.paymentMethods.map((pm) => {
                            const isPmExpanded = expandedPaymentId === pm.id;

                            return (
                              <div
                                key={pm.id}
                                className="border border-border-divider rounded-xl overflow-hidden shadow-xs transition-all bg-bg-app/10"
                              >
                                {/* Pm header */}
                                <div
                                  onClick={() => setExpandedPaymentId(isPmExpanded ? null : pm.id)}
                                  className="p-4 flex justify-between items-center hover:bg-bg-app/30 cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-2.5 font-bold text-xs text-text-primary">
                                    <span className="text-lg">💳</span>
                                    <span>{pm.type} (**** {pm.last4})</span>
                                    {pm.isDefault && (
                                      <span className="px-2 py-0.5 text-[8px] font-black uppercase text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                        Default Card
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3 text-text-secondary">
                                    <span className="text-[10px] font-mono font-bold">Expires: {pm.expiry}</span>
                                    {isPmExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                  </div>
                                </div>

                                {/* Pm body details expanded */}
                                <AnimatePresence>
                                  {isPmExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.15 }}
                                      className="overflow-hidden border-t border-border-divider bg-bg-card p-4 text-xs space-y-4 relative"
                                    >
                                      {/* Action Buttons top right */}
                                      <div className="absolute right-4 top-4 flex items-center gap-2 select-none">
                                        {!pm.isDefault && (
                                          <button
                                            onClick={(e) => handleMakeCardDefault(pm.id, e)}
                                            className="px-2.5 py-1 text-[10px] font-bold text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/10 rounded-lg transition-colors cursor-pointer bg-white"
                                          >
                                            Set Default
                                          </button>
                                        )}
                                        <button
                                          onClick={(e) => handleDeleteCard(pm.id, e)}
                                          className="p-1 px-1.5 hover:bg-rose-500/10 text-red-500 rounded-lg shrink-0 transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      </div>

                                      {/* Premium details fields block as represented in screenshot */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                                        <div className="space-y-2">
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Name:</span>
                                            <span className="text-text-primary font-bold text-right">{pm.name}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Number:</span>
                                            <span className="text-text-primary font-bold font-mono">**** **** **** {pm.last4}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Expires:</span>
                                            <span className="text-text-primary font-bold font-mono">{pm.expiry}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Type:</span>
                                            <span className="text-text-primary font-bold">{pm.type}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Issuer:</span>
                                            <span className="text-text-primary font-bold uppercase font-mono">{pm.issuer}</span>
                                          </div>
                                        </div>

                                        <div className="space-y-2 border-l border-border-divider/50 pl-4">
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Billing Address:</span>
                                            <span className="text-text-primary font-bold text-right">{pm.billingCountry}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Origin Bank:</span>
                                            <span className="text-text-primary font-bold flex items-center gap-1 font-mono">
                                              <span>{pm.origin}</span>
                                              <span>🇺🇸</span>
                                            </span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Phone Contact:</span>
                                            <span className="text-text-primary font-bold font-mono">{pm.phone}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">Email:</span>
                                            <span className="text-text-primary font-bold font-mono truncate max-w-[200px] select-all">{pm.email}</span>
                                          </div>
                                          <div className="flex justify-between max-w-xs">
                                            <span className="text-text-secondary font-semibold">CVC Verification:</span>
                                            <span className="text-emerald-500 font-extrabold flex items-center gap-1 font-mono">
                                              <Check size={12} strokeWidth={3} /> {pm.status}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 4: NOTIFICATIONS TAB */}
                {activeTab === "notifications" && (
                  <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-left">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-text-primary border-b border-border-divider pb-2 mb-2">
                      Notifications
                    </h3>
                    <p className="text-[11px] text-text-secondary">
                      You will receive notification for the below selected items.
                    </p>

                    {/* Matrix table */}
                    <div className="mt-6 overflow-x-auto border border-border-divider rounded-xl">
                      <table className="w-full text-left border-collapse select-none text-xs">
                        <thead>
                          <tr className="border-b border-border-divider text-[10px] font-extrabold text-text-secondary uppercase tracking-widest bg-gray-55/10">
                            <th className="py-3 px-5">Notification Type</th>
                            <th className="py-3 px-4 text-center w-28">Email</th>
                            <th className="py-3 px-4 text-center w-28">Browser</th>
                            <th className="py-3 px-4 text-center w-28 font-sans">App</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-divider font-semibold text-text-primary">
                          
                          {/* Row 1: New for you */}
                          <tr className="hover:bg-gray-50/5">
                            <td className="py-4 px-5">New for you</td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newForYou.email}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newForYou: { ...p.newForYou, email: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newForYou.browser}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newForYou: { ...p.newForYou, browser: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newForYou.app}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newForYou: { ...p.newForYou, app: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                          </tr>

                          {/* Row 2: Account activity */}
                          <tr className="hover:bg-gray-50/5">
                            <td className="py-4 px-5">Account activity</td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.accountActivity.email}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  accountActivity: { ...p.accountActivity, email: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.accountActivity.browser}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  accountActivity: { ...p.accountActivity, browser: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.accountActivity.app}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  accountActivity: { ...p.accountActivity, app: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                          </tr>

                          {/* Row 3: New browser signup */}
                          <tr className="hover:bg-gray-50/5">
                            <td className="py-4 px-5">A new browser used to sign in</td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newBrowserUsedToSignIn.email}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newBrowserUsedToSignIn: { ...p.newBrowserUsedToSignIn, email: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newBrowserUsedToSignIn.browser}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newBrowserUsedToSignIn: { ...p.newBrowserUsedToSignIn, browser: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newBrowserUsedToSignIn.app}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newBrowserUsedToSignIn: { ...p.newBrowserUsedToSignIn, app: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                          </tr>

                          {/* Row 4: New device */}
                          <tr className="hover:bg-gray-50/5">
                            <td className="py-4 px-5">A new device is linked</td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newDeviceLinked.email}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newDeviceLinked: { ...p.newDeviceLinked, email: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newDeviceLinked.browser}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newDeviceLinked: { ...p.newDeviceLinked, browser: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                            <td className="py-4 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={notifStates.newDeviceLinked.app}
                                onChange={(e) => setNotifStates(p => ({
                                  ...p,
                                  newDeviceLinked: { ...p.newDeviceLinked, app: e.target.checked }
                                }))}
                                className="h-4 w-4 rounded-md accent-primary cursor-pointer"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Notification Form Actions */}
                    <div className="mt-6 flex justify-end gap-3 select-none">
                      <button
                        type="button"
                        onClick={handleDiscardNotifications}
                        className="px-4 py-2 text-xs font-bold text-text-secondary border border-border-divider rounded-xl hover:bg-bg-app transition-colors bg-white cursor-pointer"
                      >
                        Discard
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveNotifications}
                        className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ALL MODAL OVERLAYS */}

      {/* 1. EDIT CUSTOMER DETAILS POPUP MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-card border border-border-divider rounded-2xl shadow-2xl overflow-hidden p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-border-divider/60 pb-3 mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Edit Customer Profile
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1 hover:bg-bg-app rounded-lg text-text-secondary hover:text-text-primary transition-all cursor-pointer bg-transparent border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Billing Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={editFormData.contact}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, contact: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Country Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Account Status
                  </label>
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, status: e.target.value as "Active" | "Suspended" }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:outline-hidden cursor-pointer"
                  >
                    <option value="Active">🟢 Active</option>
                    <option value="Suspended">🔴 Suspended</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4 border-t border-border-divider/50 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-text-secondary border border-border-divider hover:bg-bg-app rounded-xl bg-transparent transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Save Details
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. ADD NEW ADDRESS MODAL OVERLAY */}
      <AnimatePresence>
        {isAddressModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddressModalOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-card border border-border-divider rounded-2xl shadow-2xl overflow-hidden p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-border-divider/60 pb-3 mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Add New Address
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="p-1 hover:bg-bg-app rounded-lg text-text-secondary hover:text-text-primary cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Address Label Type
                  </label>
                  <select
                    value={newAddr.type}
                    onChange={(e) => setNewAddr(p => ({ ...p, type: e.target.value as CustomerAddress["type"] }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary cursor-pointer focus:outline-hidden"
                  >
                    <option value="Home">Home Address</option>
                    <option value="Office">Office Address</option>
                    <option value="Family">Family Address</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Recipient Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Violet Mendoza"
                    value={newAddr.recipient}
                    onChange={(e) => setNewAddr(p => ({ ...p, recipient: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Street Address & No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="23 Shatinon Mekalan"
                    value={newAddr.street}
                    onChange={(e) => setNewAddr(p => ({ ...p, street: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    City, State & Postal Zip <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Melbourne, VIC 3000"
                    value={newAddr.cityStateZip}
                    onChange={(e) => setNewAddr(p => ({ ...p, cityStateZip: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Country location
                  </label>
                  <input
                    type="text"
                    placeholder="Australia"
                    value={newAddr.country}
                    onChange={(e) => setNewAddr(p => ({ ...p, country: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-border-divider/50 justify-end select-none">
                  <button
                    type="button"
                    onClick={() => setIsAddressModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-text-secondary border border-border-divider hover:bg-bg-app rounded-xl bg-transparent transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Add Address
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. ADD NEW PAYMENT CARD MODAL OVERLAY */}
      <AnimatePresence>
        {isPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-black cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-card border border-border-divider rounded-2xl shadow-2xl overflow-hidden p-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-border-divider/60 pb-3 mb-4">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
                  Link Payment Card
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="p-1 hover:bg-bg-app rounded-lg text-text-secondary hover:text-text-primary cursor-pointer border-0"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Credit Card Type
                  </label>
                  <select
                    value={newCard.type}
                    onChange={(e) => setNewCard(p => ({ ...p, type: e.target.value as CustomerPaymentMethod["type"] }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary cursor-pointer focus:outline-hidden"
                  >
                    <option value="Mastercard">Mastercard</option>
                    <option value="Visa">Visa</option>
                    <option value="American Express">American Express</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Cardholder Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Violet Mendoza"
                    value={newCard.name}
                    onChange={(e) => setNewCard(p => ({ ...p, name: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Card Number (Last 4) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      maxLength={4}
                      placeholder="4487"
                      value={newCard.last4}
                      onChange={(e) => setNewCard(p => ({ ...p, last4: e.target.value }))}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Expiry Date (MM/YYYY) <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="08/2028"
                      value={newCard.expiry}
                      onChange={(e) => setNewCard(p => ({ ...p, expiry: e.target.value }))}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-secondary uppercase">
                    Issuer Bank name
                  </label>
                  <input
                    type="text"
                    placeholder="VICBANK"
                    value={newCard.issuer}
                    onChange={(e) => setNewCard(p => ({ ...p, issuer: e.target.value }))}
                    className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary"
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t border-border-divider/50 justify-end select-none">
                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-text-secondary border border-border-divider hover:bg-bg-app rounded-xl bg-transparent transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

