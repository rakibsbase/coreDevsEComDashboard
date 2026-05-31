import React, { useState, useEffect } from "react";
import { PageId, InvoiceItem } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Save,
  Clock,
  Sparkles,
  CreditCard,
  Percent,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { motion } from "motion/react";
import { confirmDelete, confirmSave, toastSuccess } from "@/utils/confirm";

interface InvoiceAddEditProps {
  setActivePage: (p: PageId) => void;
  mode: "add" | "edit";
  selectedInvoiceId: string;
}

type InvoiceStatus = InvoiceItem["status"];

export default function InvoiceAddEdit({
  setActivePage,
  mode,
  selectedInvoiceId
}: InvoiceAddEditProps) {
  const { invoices, setInvoices, triggerToast } = useApp();

  // Selected invoice to populate forms in edit mode
  const originalInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  // Form states
  const [invoiceId, setInvoiceId] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAvatar, setClientAvatar] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [dateDue, setDateDue] = useState("");
  const [discount, setDiscount] = useState(28);
  const [taxPercent, setTaxPercent] = useState(21);
  const [status, setStatus] = useState<InvoiceStatus>("Sent");

  // Options toggles on right sidebar
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days");
  const [paymentMethod, setPaymentMethod] = useState("Stripe Connected Payout");
  const [showPaymentStub, setShowPaymentStub] = useState(true);
  const [enableClientNotes, setEnableClientNotes] = useState(true);

  // Nested lines array state:
  interface InvoiceLineItem {
    name: string;
    description: string;
    hours: number;
    qty: number;
    price: number;
  }

  const [items, setItems] = useState<InvoiceLineItem[]>([]);

  // Prepopulate form on mount or load
  useEffect(() => {
    if (mode === "edit" && originalInvoice) {
      setInvoiceId(originalInvoice.id);
      setClientName(originalInvoice.clientName);
      setClientEmail(originalInvoice.email);
      setClientAvatar(originalInvoice.avatar || "");
      setDateIssued(originalInvoice.dateIssued);
      setDateDue(originalInvoice.dateDue);
      setDiscount(originalInvoice.discount || 28);
      setTaxPercent(originalInvoice.tax || 21);
      setStatus(originalInvoice.status);
      setItems(
        originalInvoice.items.map((it) => ({
          name: it.name,
          description: it.description,
          hours: it.hours || 1,
          qty: it.qty || 1,
          price: it.price || 0
        }))
      );
    } else {
      // Add mode defaults
      const nextId = String(4987 + invoices.length + 1);
      setInvoiceId(nextId);
      setClientName("Jordan Stevenson");
      setClientEmail("jordan@example.com");
      setClientAvatar("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80");
      setDateIssued("27 May 2026");
      setDateDue("26 June 2026");
      setDiscount(28);
      setTaxPercent(21);
      setStatus("Draft");
      setItems([
        {
          name: "Premium Branding Package",
          description: "Theme design guidelines and templates",
          hours: 48,
          qty: 1,
          price: 32
        }
      ]);
    }
  }, [mode, originalInvoice, invoices.length]);

  // Client Selection helper mapping dynamic profiles
  const sampleClients = [
    { name: "Jordan Stevenson", email: "don85@johnson.com", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80" },
    { name: "Stephanie Burns", email: "brenda49@taylor.info", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&auto=format&fit=crop&q=80" },
    { name: "Tony Herrera", email: "smithtiffani@powers.com", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&auto=format&fit=crop&q=80" },
    { name: "Kevin Patton", email: "mejlageorge@lee-perez.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&auto=format&fit=crop&q=80" },
    { name: "Mrs. Julie Donovan MD", email: "brandon07@pierce.com", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=50&auto=format&fit=crop&q=80" }
  ];

  const handleSelectClient = (name: string) => {
    const client = sampleClients.find(c => c.name === name);
    if (client) {
      setClientName(client.name);
      setClientEmail(client.email);
      setClientAvatar(client.avatar);
    } else {
      setClientName(name);
    }
  };

  // Line manipulations
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        name: "Custom Software Development",
        description: "Standard system design modules",
        hours: 10,
        qty: 1,
        price: 50
      }
    ]);
  };

  const handleRemoveItem = async (index: number) => {
    if (items.length <= 1) {
      triggerToast("An invoice must have at least one line item.", "blank");
      return;
    }
    const ok = await confirmDelete("line item");
    if (!ok) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleUpdateItemField = <K extends keyof InvoiceLineItem>(index: number, field: K, val: InvoiceLineItem[K]) => {
    setItems(
      items.map((it, idx) => (idx === index ? { ...it, [field]: val } : it))
    );
  };

  // Pricing math values calculated in real-time
  const subtotal = items.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
  const taxVal = Math.round(subtotal * (taxPercent / 100));
  const finalTotal = subtotal - discount + taxVal;

  const handlePublishInvoice = async () => {
    if (!clientName.trim() || !clientEmail.trim()) {
      triggerToast("Please enter a valid client name and email address.", "error");
      return;
    }
    const ok = await confirmSave("invoice");
    if (!ok) return;

    const nextInvoice: InvoiceItem = {
      id: invoiceId || String(4987 + invoices.length + 1),
      clientName,
      email: clientEmail,
      avatar: clientAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      subtotal,
      discount,
      tax: taxPercent,
      total: finalTotal,
      status,
      dateIssued,
      dateDue,
      items: items.map((i) => ({
        name: i.name,
        description: i.description,
        hours: Number(i.hours),
        qty: Number(i.qty),
        price: Number(i.price)
      }))
    };

    if (mode === "edit") {
      const revised = invoices.map((item) => (item.id === invoiceId ? nextInvoice : item));
      setInvoices(revised);
      toastSuccess(`Invoice #${invoiceId} has been successfully updated!`);
    } else {
      setInvoices([nextInvoice, ...invoices]);
      toastSuccess(`Invoice #${invoiceId} has been successfully created!`);
    }

    setActivePage("invoice-list");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <button
            onClick={() => setActivePage("invoice-list")}
            className="flex items-center text-xs font-bold text-text-secondary hover:text-primary transition-all mb-1 cursor-pointer"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to Invoice List
          </button>
          <h2 className="text-xl font-bold font-display text-text-primary">
            {mode === "add" ? "Create Invoice" : `Edit Invoice #${invoiceId}`}
          </h2>
          <p className="text-xs text-text-secondary">Keep records complete and balanced</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePage("invoice-list")}
            className="px-4 py-2 border border-border-divider hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold transition-all cursor-pointer text-text-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handlePublishInvoice}
            className="flex items-center justify-center gap-1.5 bg-primary hover:bg-purple-600 text-white rounded-xl px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-purple-500/15 transition-all cursor-pointer"
          >
            <Save size={14} />
            Publish Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Dynamic Form (Left Column: 9 parts) */}
        <div className="lg:col-span-9 bg-bg-card border border-border-divider rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header invoice metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border-divider pb-6">
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2 text-xs font-semibold text-text-primary outline-none"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                Date Issued
              </label>
              <input
                type="text"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2 text-xs font-semibold text-text-primary outline-none"
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                Date Due
              </label>
              <input
                type="text"
                value={dateDue}
                onChange={(e) => setDateDue(e.target.value)}
                className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2 text-xs font-semibold text-text-primary outline-none"
              />
            </div>
          </div>

          {/* Client select segment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border-divider pb-6">
            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                Select Client Profile
              </label>
              <select
                value={clientName}
                onChange={(e) => handleSelectClient(e.target.value)}
                className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none cursor-pointer appearance-none"
              >
                {sampleClients.map((c, i) => (
                  <option key={i} value={c.name}>
                    {c.name} ({c.email})
                  </option>
                ))}
                <option value="custom">-- Custom Client --</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none text-text-secondary">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                Client Email
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2 text-xs font-semibold text-text-primary outline-none"
              />
            </div>
          </div>

          {/* Line items list editor */}
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-text-primary text-sm flex items-center gap-2">
              Invoice Line Items
            </h3>

            <div className="space-y-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50/20 dark:bg-zinc-800/20 border border-border-divider p-4 rounded-xl relative"
                >
                  {/* Item Description */}
                  <div className="md:col-span-4 space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleUpdateItemField(idx, "name", e.target.value)}
                      className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => handleUpdateItemField(idx, "description", e.target.value)}
                      className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-3 py-1.5 text-xs font-semibold"
                    />
                  </div>

                  {/* Rate */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Rate ($)
                    </label>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handleUpdateItemField(idx, "price", Number(e.target.value))}
                      className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-3 py-1.5 text-xs font-semibold font-mono"
                    />
                  </div>

                  {/* Qty */}
                  <div className="md:col-span-1 space-y-1">
                    <label className="text-[9px] font-bold text-text-secondary uppercase tracking-wider select-none">
                      Qty
                    </label>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleUpdateItemField(idx, "qty", Number(e.target.value))}
                      className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-3 py-1.5 text-xs font-semibold text-center font-mono"
                    />
                  </div>

                  {/* Computed sum indicators */}
                  <div className="md:col-span-1 pb-2">
                    <span className="text-[11px] font-bold text-text-secondary block text-right pr-1 font-sans">
                      ${(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>

                  {/* Delete Option */}
                  <div className="md:col-span-1 pb-1 text-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1.5 hover:bg-rose-500/5 text-rose-500 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                      title="Delete Line"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddItem}
              className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline cursor-pointer pt-1"
            >
              <Plus size={14} strokeWidth={2.5} />
              Add Another Line Item
            </button>
          </div>

          {/* Pricing math calculations */}
          <div className="border-t border-border-divider pt-6 flex flex-col items-end">
            <div className="w-72 space-y-2.5 text-xs font-semibold text-text-secondary font-sans">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-text-primary font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Discount Deduction ($):</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-16 text-right bg-bg-card border border-border-divider focus:border-primary rounded px-1.5 py-0.5 text-xs text-text-primary ml-2 font-mono"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Custom Sales Tax (%):</span>
                <input
                  type="number"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value))}
                  className="w-16 text-right bg-bg-card border border-border-divider focus:border-primary rounded px-1.5 py-0.5 text-xs text-text-primary ml-2 font-mono"
                />
              </div>
              <div className="flex justify-between border-t border-border-divider pt-2 text-sm text-gray-950 dark:text-white font-extrabold">
                <span>Total Amount Due:</span>
                <span className="text-primary font-black text-base">${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Side Toggles (Right Column: 3 parts) */}
        <div className="lg:col-span-3 space-y-6 select-none">
          {/* Options card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-display font-semibold text-text-primary text-sm">Invoice Settings</h3>

            <div className="space-y-3 pt-1">
              {/* Method */}
              <div className="relative">
                <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-bg-card border border-border-divider rounded-xl px-3 py-2 text-xs font-semibold text-text-primary cursor-pointer appearance-none"
                >
                  <option value="Stripe Connected Payout">Stripe Checkout</option>
                  <option value="Direct ACH Wire">Direct Wire Transfer</option>
                  <option value="PayPal Connect">PayPal Gateway</option>
                </select>
              </div>

              {/* Terms */}
              <div className="relative pt-1.5">
                <label className="absolute top-0.5 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                  Invoice Terms
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-bg-card border border-border-divider rounded-xl px-3 py-2 text-xs font-semibold text-text-primary cursor-pointer mt-2.5 appearance-none"
                >
                  <option value="Due on Receipt">Due on Receipt</option>
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                </select>
              </div>

              {/* Status Selector */}
              <div className="relative pt-1.5">
                <label className="absolute top-0.5 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                  Record Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                  className="w-full bg-bg-card border border-border-divider rounded-xl px-3 py-2 text-xs font-semibold text-text-primary cursor-pointer mt-2.5 appearance-none"
                >
                  <option value="Paid">Paid</option>
                  <option value="Sent">Sent</option>
                  <option value="Downloaded">Downloaded</option>
                  <option value="Partial Payment">Partial Payment</option>
                  <option value="Past Due">Past Due</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional toggles card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="font-display font-semibold text-text-primary text-xs">Features Toggles</h4>

            <div className="space-y-3 text-xs font-semibold text-text-secondary">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showPaymentStub}
                  onChange={(e) => setShowPaymentStub(e.target.checked)}
                  className="rounded text-primary border-border-divider focus:ring-primary"
                />
                <span>Include Bank Payment Stub</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableClientNotes}
                  onChange={(e) => setEnableClientNotes(e.target.checked)}
                  className="rounded text-primary border-border-divider focus:ring-primary"
                />
                <span>Enable custom client reminders</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

