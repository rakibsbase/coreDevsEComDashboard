import React, { useState } from "react";
import { PageId, InvoiceItem } from "@/types";
import { useApp } from "@/context/AppContext";
import {
  ChevronLeft,
  Mail,
  Download,
  Printer,
  Edit2,
  DollarSign,
  Briefcase,
  X,
  FileCheck,
  Check,
  Paperclip
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import CoreDevsLogo from "@/components/CoreDevsLogo";
import { confirmAction, confirmSave, toastSuccess } from "@/utils/confirm";

interface InvoicePreviewProps {
  setActivePage: (p: PageId) => void;
  selectedInvoiceId: string;
  setSelectedInvoiceId: (id: string) => void;
}

export default function InvoicePreview({
  setActivePage,
  selectedInvoiceId,
  setSelectedInvoiceId
}: InvoicePreviewProps) {
  const { invoices, setInvoices, triggerToast } = useApp();

  // Find the active invoice
  const invoice = invoices.find((inv) => inv.id === selectedInvoiceId) || invoices[0];

  // Drawer modal states
  const [isSendDrawerOpen, setIsSendDrawerOpen] = useState(false);
  const [isPaymentDrawerOpen, setIsPaymentDrawerOpen] = useState(false);

  // Send Invoice Drawer Form States
  const [sendFrom, setSendFrom] = useState("admin@coredevs.com");
  const [sendTo, setSendTo] = useState(invoice ? invoice.email : "");
  const [sendSubject, setSendSubject] = useState(`Core Devs Invoice #${invoice ? invoice.id : ""}`);
  const [sendMessage, setSendMessage] = useState(
    `Dear ${invoice ? invoice.clientName : "Customer"},\n\nThank you for your business. We have generated a new invoice for digital services in the amount of $${invoice ? invoice.total : "0.00"}.\n\nWe would appreciate payment of this invoice by ${invoice ? invoice.dateDue : "the due date"}.\n\nBest regards,\nCore Devs Team`
  );

  // Add Payment Drawer Form States
  const [paymentAmount, setPaymentAmount] = useState(invoice ? String(invoice.total) : "500");
  const [paymentDate, setPaymentDate] = useState("05/27/2026");
  const [paymentMethod, setPaymentMethod] = useState("Internet Banking");
  const [paymentNote, setPaymentNote] = useState("Automatic reconciliation sync");

  if (!invoice) {
    return (
      <div className="p-8 text-center bg-bg-card rounded-2xl border border-border-divider">
        <p className="text-sm text-text-secondary">No invoice selected.</p>
        <button
          onClick={() => setActivePage("invoice-list")}
          className="mt-4 px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Auto computations
  const discountAmount = invoice.discount || 28;
  const taxPercent = invoice.tax || 21;
  
  // Backwards compatible calculation
  const computedSubtotal = invoice.items.reduce((acc, current) => acc + (current.price * current.qty), 0);
  const computedTaxAmount = Math.round(computedSubtotal * (taxPercent / 100));
  const computedTotal = computedSubtotal - discountAmount + computedTaxAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    triggerToast(`Invoice #${invoice.id} PDF downloaded successfully (Offline Cache).`, "success");
  };

  const submitSendInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await confirmAction("Send Invoice?", "Send to client?");
    if (!ok) return;
    toastSuccess(`Invoice #${invoice.id} has been emailed to ${sendTo}.`);
    setIsSendDrawerOpen(false);
  };

  const submitAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await confirmSave("payment");
    if (!ok) return;
    
    // Update invoice status locally to Paid
    const updatedInvoices = invoices.map(item => {
      if (item.id === invoice.id) {
        return {
          ...item,
          status: "Paid" as const
        };
      }
      return item;
    });

    setInvoices(updatedInvoices);
    toastSuccess(`Payment of $${paymentAmount} captured successfully! Status updated to Paid.`);
    setIsPaymentDrawerOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="space-y-6 relative"
    >
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <button
            onClick={() => setActivePage("invoice-list")}
            className="flex items-center text-xs font-bold text-text-secondary hover:text-primary transition-all mb-1 cursor-pointer"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to Invoice List
          </button>
          <h2 className="text-xl font-bold font-display text-text-primary">Invoice Preview</h2>
          <p className="text-xs text-text-secondary">Core Devs Premium Billing Console</p>
        </div>

        <button
          onClick={() => {
            setSelectedInvoiceId(invoice.id);
            setActivePage("invoice-edit");
          }}
          className="flex items-center justify-center gap-1.5 border border-border-divider hover:border-primary text-text-primary hover:bg-primary/5 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer"
        >
          <Edit2 size={13} />
          Edit Invoice
        </button>
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main printable Invoice Card (Left side: 8 cols) */}
        <div id="printable-invoice-card" className="lg:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 sm:p-10 shadow-xs space-y-8 relative overflow-hidden">
          {/* Subtle branding banner */}
          <div className="absolute right-0 top-0 h-44 w-44 bg-primary/2 rounded-full blur-3xl pointer-events-none"></div>

          {/* Card Header matching custom layout and labels */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-divider pb-8 gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center text-white text-xs font-black">
                  CD
                </div>
                <h3 className="font-display font-extrabold text-text-primary text-lg tracking-tight">CORE DEVS</h3>
              </div>
              <div className="text-[11px] font-semibold text-text-secondary mt-2 space-y-1">
                <p>Office 149, 450 South Brand Brooklyn</p>
                <p>San Diego County, CA 91905, USA</p>
                <p className="font-mono">+1 (123) 456 7891, +44 (876) 543 2198</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-2">
              <h4 className="text-base font-extrabold text-text-primary">Invoice #{invoice.id}</h4>
              <div className="text-[11px] font-semibold text-text-secondary space-y-1 font-sans">
                <p>Date Issued: <span className="font-bold text-text-primary">{invoice.dateIssued}</span></p>
                <p>Date Due: <span className="font-bold text-text-primary">{invoice.dateDue}</span></p>
              </div>
            </div>
          </div>

          {/* Block of addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2 select-text">
            {/* Invoice to details */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-1">
                Invoice To:
              </span>
              <h4 className="text-xs font-bold text-text-primary leading-tight">{invoice.clientName}</h4>
              <p className="text-[11px] text-text-secondary font-semibold">Hall-Robbins PLC</p>
              <p className="text-[11px] text-text-secondary leading-relaxed max-w-xs mt-1">
                7777 Mendez Plains, San Diego CA USA
              </p>
              <p className="text-[11px] text-text-secondary font-mono mt-0.5">(616) 865-4180</p>
              <p className="text-[11px] text-primary font-semibold mt-1 hover:underline">{invoice.email}</p>
            </div>

            {/* Bill to details */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-text-secondary tracking-widest block mb-1">
                Bill To:
              </span>
              <div className="space-y-1 text-[11px] font-semibold text-text-secondary font-sans leading-relaxed">
                <div className="flex justify-between">
                  <span className="text-text-secondary/70">Total Due:</span>
                  <span className="font-bold text-text-primary">${computedTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary/70">Bank name:</span>
                  <span className="font-bold text-text-primary">American Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary/70">Country:</span>
                  <span className="font-bold text-text-primary">United States</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary/70">IBAN:</span>
                  <span className="font-bold text-text-primary font-mono">ETD95476213874685</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary/70">SWIFT code:</span>
                  <span className="font-bold text-text-primary font-mono">BR91905</span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized list of services/products */}
          <div className="border-t border-border-divider/70 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                    <th className="py-2.5 px-2">Item</th>
                    <th className="py-2.5 px-2">Description</th>
                    <th className="py-2.5 px-2 text-right">Hours</th>
                    <th className="py-2.5 px-2 text-center w-16">Qty</th>
                    <th className="py-2.5 px-2 text-right w-24">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/50 dark:divide-zinc-800/50">
                  {invoice.items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-xs text-text-secondary">
                        No items added on this invoice.
                      </td>
                    </tr>
                  ) : (
                    invoice.items.map((item, index) => (
                      <tr key={index} className="text-xs text-text-primary font-medium font-sans">
                        <td className="py-4 px-2 font-bold text-text-primary">{item.name}</td>
                        <td className="py-4 px-2 text-text-secondary">{item.description}</td>
                        <td className="py-4 px-2 text-right font-semibold font-mono">{item.hours || 1}</td>
                        <td className="py-4 px-2 text-center font-bold text-text-secondary">{item.qty}</td>
                        <td className="py-4 px-2 text-right font-bold text-text-primary">
                          ${(item.price * item.qty).toFixed(2)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing summarizer totals */}
          <div className="border-t border-border-divider/70 pt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-1 font-semibold text-[11px] text-text-secondary max-w-sm">
              <p>Salesperson: <span className="font-bold text-text-primary">Tommy Shelby</span></p>
              <p>Thanks for your business</p>
            </div>

            <div className="w-64 space-y-2 text-xs font-semibold text-text-secondary font-sans self-end md:self-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-text-primary font-bold">${computedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="text-red-500 font-bold">-${discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span className="text-text-primary font-bold">{taxPercent}%</span>
              </div>
              <div className="flex justify-between border-t border-border-divider/80 pt-2 text-sm text-gray-950 dark:text-white font-bold">
                <span>Total:</span>
                <span className="text-primary font-extrabold text-base">${computedTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Note section */}
          <div className="border-t border-border-divider/50 pt-4 text-[11px] font-medium text-text-secondary leading-relaxed bg-gray-50/40 dark:bg-zinc-800/10 p-4 rounded-xl">
            <span className="font-bold text-text-primary mr-1">Note:</span>
            It was a pleasure working with you and your team. We hope you will keep us in mind for future freelance projects. Thank You!
          </div>
        </div>

        {/* Action column (Right side: 4 cols) */}
        <div className="lg:col-span-4 space-y-6 select-none">
          {/* Box of Actions */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest block mb-2">
              Action Panel
            </span>

            {/* SEND INVOICE BUTTON: Solid custom Purple */}
            <button
              onClick={() => setIsSendDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-purple-600 text-white rounded-xl py-2.5 text-xs font-bold shadow-md hover:shadow-purple-500/10 transition-all cursor-pointer"
            >
              <Mail size={14} />
              Send Invoice
            </button>

            {/* DOWNLOAD BUTTON */}
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-1.5 border border-border-divider text-text-secondary hover:text-text-primary bg-gray-50/40 dark:bg-zinc-800/20 hover:bg-gray-100 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
            >
              <Download size={14} />
              Download
            </button>

            {/* PRINT & EDIT ROW */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handlePrint}
                className="w-full flex items-center justify-center gap-1.5 border border-border-divider text-text-secondary hover:text-text-primary bg-gray-50/40 dark:bg-zinc-800/20 hover:bg-gray-100 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <Printer size={13} />
                Print
              </button>

              <button
                onClick={() => {
                  setSelectedInvoiceId(invoice.id);
                  setActivePage("invoice-edit");
                }}
                className="w-full flex items-center justify-center gap-1.5 border border-border-divider text-text-secondary hover:text-text-primary bg-gray-50/40 dark:bg-zinc-800/20 hover:bg-gray-100 rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <Edit2 size={13} className="text-text-secondary" />
                Edit
              </button>
            </div>

            {/* ADD PAYMENT: Solid Green success styled pill button */}
            <button
              onClick={() => setIsPaymentDrawerOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 bg-green-400 hover:bg-green-500 text-white rounded-xl py-2.5 text-xs font-extrabold shadow-sm hover:shadow-green-500/10 transition-all cursor-pointer"
            >
              <DollarSign size={14} />
              Add Payment
            </button>
          </div>

          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs text-xs font-semibold text-text-secondary space-y-2">
            <h4 className="font-extrabold text-text-primary text-xs">Payment Information</h4>
            <p className="text-[11px] leading-relaxed">
              Accept credit card checkouts and direct ACH/Swift payments using our connected Stripe gateway. Account sync is live.
            </p>
          </div>
        </div>
      </div>

      {/* DRAWERS SECTION WITH SMOOTH SLIDERS ANIMATION */}
      <AnimatePresence>
        {/* SEND INVOICE DRAWER */}
        {isSendDrawerOpen && (
          <>
            {/* Backdrop opacity cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSendDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900 z-50 transition-opacity"
            />

            {/* Main drawer slider */}
            <motion.div
              initial={{ translateX: "100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-bg-card border-l border-border-divider shadow-2xl z-50 flex flex-col select-none"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border-divider flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Send Invoice</h3>
                <button
                  onClick={() => setIsSendDrawerOpen(false)}
                  className="p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body Form */}
              <form onSubmit={submitSendInvoice} className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* From Input */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    From
                  </label>
                  <input
                    type="email"
                    required
                    value={sendFrom}
                    onChange={(e) => setSendFrom(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none"
                  />
                </div>

                {/* To Input */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    To
                  </label>
                  <input
                    type="email"
                    required
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none"
                  />
                </div>

                {/* Subject Input */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={sendSubject}
                    onChange={(e) => setSendSubject(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none"
                  />
                </div>

                {/* Message Textarea */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    rows={12}
                    required
                    value={sendMessage}
                    onChange={(e) => setSendMessage(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl p-4 text-xs font-medium text-text-primary outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* Attachment badge */}
                <div className="bg-bg-app border border-border-divider rounded-xl p-3 flex items-center gap-2">
                  <Paperclip size={14} className="text-primary" />
                  <span className="text-[11px] font-bold text-primary">Invoice Attached ({invoice.id}.pdf)</span>
                </div>

                {/* Actions bottom row */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-purple-600 text-white rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSendDrawerOpen(false)}
                    className="flex-1 border border-border-divider hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-secondary rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}

        {/* ADD PAYMENT DRAWER */}
        {isPaymentDrawerOpen && (
          <>
            {/* Backdrop opacity cover */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentDrawerOpen(false)}
              className="fixed inset-0 bg-slate-900 z-50 transition-opacity"
            />

            {/* Main drawer slider */}
            <motion.div
              initial={{ translateX: "100%" }}
              animate={{ translateX: 0 }}
              exit={{ translateX: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-bg-card border-l border-border-divider shadow-2xl z-50 flex flex-col select-none"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-border-divider flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-tight">Add New Payment</h3>
                <button
                  onClick={() => setIsPaymentDrawerOpen(false)}
                  className="p-1.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-secondary hover:text-text-primary rounded-xl cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body Form */}
              <form onSubmit={submitAddPayment} className="flex-1 overflow-y-auto p-5 space-y-5">
                {/* Invoice Balance Indicator */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Invoice Balance
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${computedTotal}.00`}
                    className="w-full bg-bg-app border border-border-divider rounded-xl px-4 py-2.5 text-xs font-semibold text-text-secondary cursor-not-allowed"
                  />
                </div>

                {/* Payment Amount */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Payment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-xs font-bold text-text-secondary">$</span>
                    <input
                      type="number"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl pl-8 pr-4 py-2.5 text-xs font-semibold text-text-primary outline-none"
                    />
                  </div>
                </div>

                {/* Payment Date */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Payment Date
                  </label>
                  <input
                    type="text"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-2.5 text-xs font-semibold text-text-primary outline-none"
                  />
                </div>

                {/* Payment Method with Floating custom Select */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl px-4 py-3 text-xs font-semibold text-text-primary outline-none cursor-pointer appearance-none"
                  >
                    <option>Select Payment Method</option>
                    <option value="Internet Banking">Internet Banking</option>
                    <option value="Direct ACH Wire">Direct ACH Wire</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                    <option value="Stripe Payout Connect">Stripe Payout Connect</option>
                  </select>
                  <div className="absolute right-3.5 top-3.5 pointer-events-none text-text-secondary">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                {/* Internal Payment Note */}
                <div className="relative">
                  <label className="absolute -top-2 left-3 px-1.5 bg-bg-card text-[9px] font-bold text-text-secondary uppercase tracking-wider">
                    Internal Payment Note
                  </label>
                  <textarea
                    rows={6}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full bg-bg-card border border-border-divider focus:border-primary rounded-xl p-4 text-xs font-medium text-text-primary outline-none resize-none leading-relaxed"
                    placeholder="Enter secondary details..."
                  />
                </div>

                {/* Actions bottom row */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Send
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaymentDrawerOpen(false)}
                    className="flex-1 border border-border-divider hover:bg-gray-50 dark:hover:bg-zinc-800 text-text-secondary rounded-xl py-2.5 text-xs font-bold transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

