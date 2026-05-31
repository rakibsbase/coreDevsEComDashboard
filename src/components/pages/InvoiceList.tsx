import React, { useState, useMemo } from "react";
import { PageId, InvoiceItem, ClientBalance } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  Search,
  Plus,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  ArrowDown,
  Clock,
  Mail,
  AlertCircle,
  Users,
  FileText,
  CreditCard,
  TrendingDown,
  Circle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { confirmAction, confirmDelete, toastSuccess } from "@/utils/confirm";

interface InvoiceListProps {
  setActivePage: (p: PageId) => void;
  setSelectedInvoiceId: (id: string) => void;
}

export default function InvoiceList({ setActivePage, setSelectedInvoiceId }: InvoiceListProps) {
  const { invoices, setInvoices, triggerToast } = useApp();

  // Search and status filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("none");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);

  // Status mapping to icons and colors
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "Paid":
        return (
          <div className="h-6 w-6 rounded-full bg-green-150/60 dark:bg-green-950/40 text-green-500 flex items-center justify-center" title="Paid">
            <Check size={11} strokeWidth={3} />
          </div>
        );
      case "Downloaded":
        return (
          <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center" title="Downloaded">
            <ArrowDown size={11} strokeWidth={3} />
          </div>
        );
      case "Draft":
        return (
          <div className="h-6 w-6 rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-500 flex items-center justify-center" title="Draft">
            <Clock size={11} strokeWidth={3} />
          </div>
        );
      case "Sent":
        return (
          <div className="h-6 w-6 rounded-full bg-purple-100 dark:bg-purple-950/40 text-primary flex items-center justify-center" title="Sent">
            <Mail size={11} strokeWidth={2.5} />
          </div>
        );
      case "Past Due":
        return (
          <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center" title="Past Due">
            <AlertCircle size={11} strokeWidth={3} />
          </div>
        );
      default:
        return (
          <div className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center" title="Pending">
            <Clock size={11} strokeWidth={2.5} />
          </div>
        );
    }
  };

  // Balance generator helper matching specific screenshot items:
  const renderBalance = (inv: InvoiceItem) => {
    // Exact mapping matching the client balance displays
    if (inv.id === "4987") return <span className="text-text-primary">$724</span>;
    if (inv.id === "4991") return <span className="text-text-primary">$815</span>;
    if (inv.id === "4993") return <span className="text-text-primary">$407</span>;
    if (inv.id === "4994") return <span className="text-red-500">-$205</span>;
    if (inv.id === "4996") return <span className="text-text-primary">$305</span>;

    // Remaining defaults are marked as Paid badge
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[11px] font-bold bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
        Paid
      </span>
    );
  };

  // Filter computation
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchSearch =
        inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.id.includes(searchQuery) ||
        inv.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === "none" || inv.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Pagination bounds
  const paginatedInvoices = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, currentPage, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / rowsPerPage));

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedInvoices.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    const ok = await confirmDelete(`Invoice #${id}`);
    if (!ok) return;
    setInvoices(invoices.filter((inv) => inv.id !== id));
    toastSuccess(`Invoice #${id} has been deleted successfully.`);
  };

  const handleCreateNewInvoice = () => {
    setActivePage("invoice-add");
  };

  const viewInvoiceDetail = (id: string) => {
    setSelectedInvoiceId(id);
    setActivePage("invoice-preview");
  };

  // Bulk delete selected items
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ok = await confirmAction("Delete Selected Invoices", `Delete ${selectedIds.length} selected invoices?`);
    if (!ok) return;
    setInvoices(invoices.filter((inv) => !selectedIds.includes(inv.id)));
    setSelectedIds([]);
    toastSuccess("Selected invoices removed successfully");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* SaaS High-fidelity Stat Cards at top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat card 1: Clients */}
        <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary font-sans leading-none">24</h3>
            <p className="text-xs text-text-secondary font-medium">Clients</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-text-secondary">
            <Users size={18} />
          </div>
        </div>

        {/* Stat card 2: Invoices */}
        <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary font-sans leading-none">165</h3>
            <p className="text-xs text-text-secondary font-medium">Invoices</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-text-secondary">
            <FileText size={18} />
          </div>
        </div>

        {/* Stat card 3: Paid */}
        <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary font-sans leading-none">$2.46k</h3>
            <p className="text-xs text-text-secondary font-medium">Paid</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-text-secondary">
            <CreditCard size={18} />
          </div>
        </div>

        {/* Stat card 4: Unpaid */}
        <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-text-primary font-sans leading-none">$876</h3>
            <p className="text-xs text-text-secondary font-medium">Unpaid</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-text-secondary">
            <FileText size={18} className="text-amber-500" />
          </div>
        </div>
      </div>

      {/* Primary interactive datatable section card */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action controllers bar */}
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-divider bg-bg-card/40">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCreateNewInvoice}
              className="flex items-center justify-center gap-1.5 bg-primary text-white hover:bg-purple-600 rounded-xl px-4 py-2 text-xs font-bold shadow-md hover:shadow-purple-500/20 transition-all cursor-pointer"
            >
              <Plus size={14} strokeWidth={3} />
              Create Invoice
            </button>

            {selectedIds.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 size={13} />
                Delete Selected ({selectedIds.length})
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search Invoice"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-4 pr-9 py-2 bg-bg-app border border-border-divider rounded-xl text-xs font-medium text-text-primary outline-none focus:border-primary focus:bg-bg-card transition-all"
              />
              <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-text-secondary" />
            </div>

            {/* Select Status Dropdown in Purple Floating style */}
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold uppercase tracking-wider text-primary dark:text-purple-400 pointer-events-none z-10">
                Invoice Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 bg-bg-card border border-primary/40 dark:border-purple-500/40 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-text-primary outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-all appearance-none"
              >
                <option value="none">none</option>
                <option value="Downloaded">Downloaded</option>
                <option value="Draft">Draft</option>
                <option value="Paid">Paid</option>
                <option value="Partial Payment">Partial Payment</option>
                <option value="Past Due">Past Due</option>
                <option value="Sent">Sent</option>
              </select>
              <div className="absolute right-3.5 top-3 pointer-events-none text-text-secondary">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-gray-50/10 dark:bg-zinc-800/20 select-none">
                <th className="py-3.5 px-6 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={paginatedInvoices.length > 0 && selectedIds.length === paginatedInvoices.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-3.5 w-3.5 rounded text-primary border-border-divider focus:ring-primary"
                  />
                </th>
                <th className="py-3.5 px-4 w-20">#</th>
                <th className="py-3.5 px-3 uppercase text-center w-16">Status</th>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Issued Date</th>
                <th className="py-3.5 px-4">Balance</th>
                <th className="py-3.5 px-6 text-right w-36">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {paginatedInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-secondary text-xs">
                    No matching invoices found in your Core Devs panel.
                  </td>
                </tr>
              ) : (
                paginatedInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/[0.4] dark:hover:bg-zinc-800/[0.2] transition-colors text-xs text-text-primary">
                    <td className="py-3.5 px-6 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(inv.id)}
                        onChange={(e) => handleSelectRow(inv.id, e.target.checked)}
                        className="h-3.5 w-3.5 rounded text-primary border-border-divider focus:ring-primary"
                      />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-primary">
                      <button
                        type="button"
                        onClick={() => viewInvoiceDetail(inv.id)}
                        className="hover:underline text-[12px] cursor-pointer"
                      >
                        #{inv.id}
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center justify-center">
                        {renderStatusIcon(inv.status)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={inv.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-text-primary text-[12px] truncate leading-normal">{inv.clientName}</h4>
                          <p className="text-[10px] text-text-secondary truncate mt-0.5">{inv.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">
                      ${inv.total}
                    </td>
                    <td className="py-3.5 px-4 text-text-secondary font-medium font-sans">
                      {inv.dateIssued}
                    </td>
                    <td className="py-3.5 px-4 font-bold font-sans">
                      {renderBalance(inv)}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedInvoiceId(inv.id);
                            setActivePage("invoice-edit");
                          }}
                          className="p-1 px-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => viewInvoiceDetail(inv.id)}
                          className="p-1 px-2.5 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                          title="Preview"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteInvoice(inv.id)}
                          className="p-1 px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 rounded-lg transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Unified high-fidelity bottom pagination bar */}
        <div className="p-4 px-6 border-t border-border-divider bg-bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-4 text-xs text-text-secondary font-semibold">
            <span>Showing {filteredInvoices.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}-{Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of {filteredInvoices.length} entries</span>
            
            <div className="hidden sm:flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-bg-app border border-border-divider rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none cursor-pointer text-text-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-border-divider rounded-lg text-text-secondary hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageIdx = idx + 1;
              return (
                <button
                  key={pageIdx}
                  onClick={() => setCurrentPage(pageIdx)}
                  className={`w-7 h-7 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    currentPage === pageIdx
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-gray-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {pageIdx}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-border-divider rounded-lg text-text-secondary hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-40 disabled:hover:bg-transparent transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

