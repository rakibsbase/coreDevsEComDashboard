import React, { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { PageId, Customer } from "@/types";
import {
  Search,
  Download,
  Plus,
  Trash2,
  Eye,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Shield,
  UserCheck,
  UserX
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmAction, confirmDelete, confirmSave, toastSuccess, toastError } from "@/utils/confirm";

interface CustomersListProps {
  setActivePage: (page: PageId) => void;
  setSelectedCustomerId: (id: string) => void;
}

export default function CustomersList({ setActivePage, setSelectedCustomerId }: CustomersListProps) {
  const { customers, setCustomers, triggerToast } = useApp();

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Drawer / Add Customer Form State
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    country: "Australia",
    countryCode: "AU",
    addressLine1: "",
    addressLine2: "",
    town: "",
    stateProvince: "",
    postCode: "",
    mobileNumber: "",
    useAsBilling: true
  });

  // Country Selection mapping
  const countryList = [
    { name: "Australia", code: "AU", flag: "🇦🇺" },
    { name: "United States", code: "US", flag: "🇺🇸" },
    { name: "France", code: "FR", flag: "🇫🇷" },
    { name: "China", code: "CN", flag: "🇨🇳" },
    { name: "Brazil", code: "BR", flag: "🇧🇷" },
    { name: "United Kingdom", code: "GB", flag: "🇬🇧" },
    { name: "Canada", code: "CA", flag: "🇨🇦" }
  ];

  // Helper flag renderer
  const getFlagEmoji = (code: string) => {
    switch (code) {
      case "AU": return "🇦🇺";
      case "US": return "🇺🇸";
      case "FR": return "🇫🇷";
      case "CN": return "🇨🇳";
      case "BR": return "🇧🇷";
      case "GB": return "🇬🇧";
      case "CA": return "🇨🇦";
      default: return "🏳️";
    }
  };

  // Filtered customers list
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const query = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query)
      );
    });
  }, [customers, searchTerm]);

  // Paginated customers list
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / rowsPerPage));
  const currentCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredCustomers.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredCustomers, currentPage, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Checkbox interactions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const currentPageIds = currentCustomers.map(c => c.id);
      setSelectedIds(prev => {
        // combine previous selection with new current page ones while keeping uniqueness
        const unique = new Set([...prev, ...currentPageIds]);
        return Array.from(unique);
      });
    } else {
      const currentPageIds = currentCustomers.map(c => c.id);
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(item => item !== id));
    }
  };

  const isAllOnPageSelected = useMemo(() => {
    if (currentCustomers.length === 0) return false;
    return currentCustomers.every(c => selectedIds.includes(c.id));
  }, [currentCustomers, selectedIds]);

  // Actions
  const handleDeleteCustomer = async (id: string) => {
    const customer = customers.find(c => c.id === id);
    const ok = await confirmDelete(customer?.name || "this customer");
    if (!ok) return;
    setCustomers(customers.filter(c => c.id !== id));
    setSelectedIds(prev => prev.filter(item => item !== id));
    toastSuccess("Customer deleted successfully");
    setActiveMenuId(null);
  };

  const handleBulkDelete = async () => {
    const ok = await confirmAction("Delete Selected Customers", `Delete ${selectedIds.length} selected customer profiles?`);
    if (!ok) return;
    setCustomers(customers.filter(c => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    toastSuccess("Selected customers deleted successfully");
  };

  const toggleCustomerSuspension = async (id: string) => {
    const customer = customers.find(c => c.id === id);
    const ok = await confirmAction(
      customer?.status === "Active" ? "Suspend Customer?" : "Activate Customer?",
      customer ? `Update status for ${customer.name}?` : "Update customer status?"
    );
    if (!ok) return;
    const updated = customers.map(c => {
      if (c.id === id) {
        const nextStatus: Customer["status"] = c.status === "Active" ? "Suspended" : "Active";
        toastSuccess(`Customer is now ${nextStatus}`);
        return { ...c, status: nextStatus };
      }
      return c;
    });
    setCustomers(updated);
    setActiveMenuId(null);
  };

  // CSV Exporter
  const handleExportCSV = () => {
    try {
      const headers = ["Customer ID", "Name", "Email", "Country", "Orders", "Total Spent", "Status", "Contact"];
      const rows = filteredCustomers.map(c => [
        c.id,
        `"${c.name.replace(/"/g, '""')}"`,
        c.email,
        c.country,
        c.orderCount,
        c.totalSpent,
        c.status,
        c.contact
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CoreDevs_Customers_Export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      triggerToast("Exported customers CSV successfully", "success");
    } catch {
      triggerToast("Failed to export. Please try again", "error");
    }
  };

  const viewCustomerProfile = (id: string) => {
    setSelectedCustomerId(id);
    setActivePage("customer-details");
  };

  // Add Customer form handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "country") {
      const match = countryList.find(co => co.name === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        countryCode: match ? match.code : "AU"
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    if (!fullName || !formData.email) {
      toastError("Please provide at least a customer name and email address.");
      return;
    }

    const ok = await confirmSave("customer");
    if (!ok) return;

    // Generate novel Customer ID
    const genId = `#CG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newCustomer: Customer = {
      id: genId,
      name: fullName,
      email: formData.email,
      avatar: `https://images.unsplash.com/photo-${[
        "1534528741775-53994a69daeb",
        "1494790108377-be9c29b29330",
        "1507003211169-0a1dd7228f2d",
        "1500648767791-00dcc994a43e",
        "1544005313-94ddf0286df2",
        "1517841905240-472988babdf9",
        "1542206395-9feb3edaa68d"
      ][Math.floor(Math.random() * 7)]}?w=100&auto=format&fit=crop&q=80`,
      status: "Active",
      contact: formData.mobileNumber || "+1 (234) 555-0100",
      country: formData.country,
      countryCode: formData.countryCode,
      orderCount: 0,
      totalSpent: 0,
      joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + ", " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " (ET)",
      accountBalance: 0,
      loyaltyPoints: 0,
      loyaltyTier: "Bronze member",
      wishlistCount: 0,
      couponsCount: 0,
      orderHistory: [],
      recentDevices: [
        { browser: "Chrome on Windows", device: "Browser Session", location: formData.country, recentActivities: "Just Now Connected" }
      ],
      addresses: [
        {
          id: `adr-${Date.now()}`,
          type: "Home",
          isDefault: true,
          recipient: fullName,
          street: formData.addressLine1 || "1 Main Street",
          cityStateZip: `${formData.town}, ${formData.stateProvince} ${formData.postCode}`,
          country: formData.country
        }
      ],
      paymentMethods: [],
      notifications: {
        newForYou: { email: true, browser: false, app: false },
        accountActivity: { email: false, browser: true, app: true },
        newBrowserUsedToSignIn: { email: true, browser: true, app: true },
        newDeviceLinked: { email: false, browser: true, app: false }
      }
    };

    setCustomers([newCustomer, ...customers]);
    setIsAddDrawerOpen(false);
    toastSuccess(`Customer "${fullName}" added successfully`);

    // Reset Form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      country: "Australia",
      countryCode: "AU",
      addressLine1: "",
      addressLine2: "",
      town: "",
      stateProvince: "",
      postCode: "",
      mobileNumber: "",
      useAsBilling: true
    });
  };

  return (
    <div className="space-y-6" id="customers-module-list">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-primary uppercase font-sans">
            Customer Management
          </h1>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">
            Core Devs Premium Portal / Customers
          </p>
        </div>
      </div>

      {/* Main card panel containing searches, filters, table */}
      <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
        
        {/* Controls container */}
        <div className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border-divider bg-gray-50/10 select-none">
          {/* Action Row: Search bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search Customer Name or Email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset to page 1 on search
              }}
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold rounded-xl bg-bg-app border border-border-divider hover:border-text-secondary focus:border-primary focus:outline-hidden transition-all text-text-primary placeholder:text-text-secondary/70 placeholder:font-normal"
            />
            <Search className="absolute left-3 top-2.5 text-text-secondary w-4 h-4" />
          </div>

          {/* Action Buttons: Bulk actions, Export and + Add Customer */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-3.5 py-2 text-xs font-bold text-white bg-red-650 hover:bg-red-700 bg-red-600 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete {selectedIds.length}</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-bold text-text-secondary border border-border-divider rounded-xl flex items-center gap-1.5 hover:bg-bg-app hover:text-text-primary transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Export</span>
            </button>

            <button
              onClick={() => setIsAddDrawerOpen(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Add Customer</span>
            </button>
          </div>
        </div>

        {/* Responsive Table Layout */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left border-collapse select-none">
            <thead>
              <tr className="border-b border-border-divider text-[11px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/15">
                <th className="py-3.5 px-5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllOnPageSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded-md accent-primary border-gray-300 text-primary cursor-pointer focus:ring-primary"
                  />
                </th>
                <th className="py-3.5 px-4 font-semibold">Customers</th>
                <th className="py-3.5 px-4 font-semibold text-center w-36">Customer ID</th>
                <th className="py-3.5 px-4 font-semibold">Country</th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">Orders</th>
                <th className="py-3.5 px-4 font-semibold text-right pr-6 w-36">Total Spent</th>
                <th className="py-3.5 px-4 font-semibold text-center w-28">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {currentCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-text-secondary font-semibold font-mono">
                    No matching customer records found in memory.
                  </td>
                </tr>
              ) : (
                currentCustomers.map((cust) => {
                  const isSelected = selectedIds.includes(cust.id);
                  const isSuspended = cust.status === "Suspended";

                  return (
                    <tr
                      key={cust.id}
                      className={`hover:bg-gray-50/5 text-xs text-text-primary transition-colors ${
                        isSelected ? "bg-primary/5 hover:bg-primary/7" : ""
                      }`}
                    >
                      {/* Row Checkbox Selector */}
                      <td className="py-4 px-5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(cust.id, e.target.checked)}
                          className="h-4 w-4 rounded-md accent-primary cursor-pointer focus:ring-primary"
                        />
                      </td>

                      {/* Customer avatar stacked with user details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={cust.avatar}
                            alt={cust.name}
                            className="h-9 w-9 rounded-full object-cover shrink-0 border border-border-divider bg-bg-app"
                            onError={(e) => {
                              // Fallback on error
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${cust.name}`;
                            }}
                          />
                          <div className="flex flex-col min-w-0 max-w-xs">
                            <button
                              onClick={() => viewCustomerProfile(cust.id)}
                              className="font-bold text-text-primary hover:text-primary text-left truncate cursor-pointer hover:underline transition-all"
                            >
                              {cust.name}
                            </button>
                            <span className="text-[11px] text-text-secondary truncate mt-0.5">
                              {cust.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Monospace Customer ID */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-text-primary/95 text-[11px]">
                        {cust.id}
                      </td>

                      {/* Country emoji stacked with text */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 font-semibold">
                          <span className="text-base select-none">{getFlagEmoji(cust.countryCode)}</span>
                          <span className="truncate max-w-[140px] text-xs text-text-secondary hover:text-text-primary">
                            {cust.country}
                          </span>
                        </div>
                      </td>

                      {/* Orders quantity */}
                      <td className="py-3 px-4 text-center font-mono font-bold text-text-primary">
                        {cust.orderCount}
                      </td>

                      {/* Total Spent Currency Block */}
                      <td className="py-3 px-4 text-right pr-6 font-mono font-bold text-text-primary">
                        ${cust.totalSpent.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Status pill element */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isSuspended
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}
                        >
                          {cust.status}
                        </span>
                      </td>

                      {/* Direct actions trigger and menu options dropdown */}
                      <td className="py-3 px-4 text-center">
                        <div className="relative inline-block text-left">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              title="View Details"
                              onClick={() => viewCustomerProfile(cust.id)}
                              className="p-1 px-1.5 text-text-secondary hover:text-primary rounded-lg hover:bg-bg-app transition-colors cursor-pointer"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === cust.id ? null : cust.id)}
                              className="p-1 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-app transition-colors cursor-pointer"
                            >
                              <MoreVertical size={14} />
                            </button>
                          </div>

                          {/* Quick single-row menu popover */}
                          <AnimatePresence>
                            {activeMenuId === cust.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setActiveMenuId(null)}
                                />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  transition={{ duration: 0.12 }}
                                  className="absolute right-0 mt-1 w-36 rounded-xl bg-bg-card border border-border-divider shadow-lg z-40 py-1 overflow-hidden font-semibold text-[11px] text-text-primary text-left"
                                >
                                  <button
                                    onClick={() => viewCustomerProfile(cust.id)}
                                    className="w-full px-4 py-2 hover:bg-bg-app hover:text-primary flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    <Shield size={12} />
                                    <span>Profile Card</span>
                                  </button>
                                  <button
                                    onClick={() => toggleCustomerSuspension(cust.id)}
                                    className="w-full px-4 py-2 hover:bg-bg-app text-left flex items-center gap-2 cursor-pointer transition-colors"
                                  >
                                    {isSuspended ? (
                                      <>
                                        <UserCheck size={12} className="text-emerald-500" />
                                        <span className="text-emerald-500">Unsuspend</span>
                                      </>
                                    ) : (
                                      <>
                                        <UserX size={12} className="text-amber-500" />
                                        <span className="text-amber-500">Suspend</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCustomer(cust.id)}
                                    className="w-full px-4 py-2 hover:bg-rose-500/10 text-red-500 text-left flex items-center gap-2 cursor-pointer border-t border-border-divider/50 transition-colors"
                                  >
                                    <Trash2 size={12} />
                                    <span>Delete</span>
                                  </button>
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Controls */}
        <div className="p-4 px-6 border-t border-border-divider flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/5 select-none text-xs text-text-secondary font-semibold">
          {/* Total count details */}
          <div>
            Showing <span className="text-text-primary font-bold">{(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredCustomers.length)}</span> of <span className="text-text-primary font-bold">{filteredCustomers.length}</span> record{filteredCustomers.length !== 1 && "s"}
          </div>

          <div className="flex items-center gap-6">
            {/* Rows per page toggle */}
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset to page 1
                }}
                className="py-1 pl-2 pr-6 rounded-lg bg-bg-app border border-border-divider text-text-primary font-bold text-xs focus:ring-1 focus:ring-primary focus:outline-hidden cursor-pointer"
              >
                {[10, 20, 50].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            {/* Selector caret actions */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="p-1 px-1.5 border border-border-divider bg-bg-card rounded-lg hover:bg-bg-app disabled:opacity-40 disabled:hover:bg-bg-card transition-all cursor-pointer text-text-primary"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="font-mono text-text-primary select-none font-bold">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="p-1 px-1.5 border border-border-divider bg-bg-card rounded-lg hover:bg-bg-app disabled:opacity-40 disabled:hover:bg-bg-card transition-all cursor-pointer text-text-primary"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-over Drawer containing Add-Customer workflow */}
      <AnimatePresence>
        {isAddDrawerOpen && (
          <>
            {/* Backdrop cover overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
              onClick={() => setIsAddDrawerOpen(false)}
            />

            {/* Main drawer slider */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-bg-card border-l border-border-divider shadow-2xl z-55 flex flex-col"
            >
              <div className="p-5 border-b border-border-divider flex items-center justify-between bg-gray-50/10">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider font-sans">
                  Add a Customer
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="p-1.5 hover:bg-bg-app rounded-xl text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleAddSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Basic Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border-divider pb-1 mb-2">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                    >
                      {countryList.map((co) => (
                        <option key={co.code} value={co.name}>
                          {co.flag} {co.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Shipping info Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest border-b border-border-divider pb-1 mb-2">
                    Shipping Information
                  </h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Address Line 1 <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="e.g. 100 Collins St"
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-text-secondary uppercase">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Suite, Apartment number etc."
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        Town / City <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        placeholder="Melbourne"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        State / Province <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="stateProvince"
                        value={formData.stateProvince}
                        onChange={handleInputChange}
                        placeholder="Victoria"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        Post Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="postCode"
                        value={formData.postCode}
                        onChange={handleInputChange}
                        placeholder="3000"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-text-secondary uppercase">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="+61 400 123 456"
                        className="w-full text-xs font-semibold p-2.5 rounded-xl border border-border-divider bg-bg-app text-text-primary focus:border-primary focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggle logic */}
                <div className="flex items-center justify-between p-4 bg-bg-app border border-border-divider rounded-xl">
                  <div className="text-left pr-4">
                    <p className="text-[11px] font-bold text-text-primary">Use as a billing address?</p>
                    <p className="text-[9px] text-text-secondary mt-0.5 font-mono">Use details above for payments too.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.useAsBilling}
                      onChange={(e) => setFormData(prev => ({ ...prev, useAsBilling: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-zinc-300 dark:bg-zinc-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Submitting Buttons Row */}
                <div className="pt-4 flex gap-3 border-t border-border-divider justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddDrawerOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-red-500 border border-red-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer bg-transparent"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-xl shadow-sm transition-all cursor-pointer"
                  >
                    Add
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

