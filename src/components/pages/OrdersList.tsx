import { useState } from "react";
import { OrderItem, PageId } from "@/types";
import {
  CreditCard,
  CheckCircle,
  Truck,
  RotateCcw,
  Search,
  Download,
  AlertCircle,
  Calendar,
  MoreVertical,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmAction, confirmDelete, toastSuccess } from "@/utils/confirm";
import { EmptyState } from "@/components/common/EmptyState";

interface OrdersListProps {
  setActivePage: (p: PageId) => void;
  setSelectedOrderId: (id: string) => void;
}

export default function OrdersList({ setActivePage, setSelectedOrderId }: OrdersListProps) {
  const { orders, setOrders } = useApp();
  const [search, setSearch] = useState("");

  const handleSelectOrder = (id: string) => {
    setSelectedOrderId(id);
    setActivePage("order-details");
  };

  const handleDeleteOrder = async (order: OrderItem) => {
    const ok = await confirmDelete(`Order ${order.id}`);
    if (!ok) return;
    setOrders(orders.filter((item) => item.id !== order.id));
    toastSuccess(`Order ${order.id} deleted successfully`);
  };

  const handleCycleStatus = async (order: OrderItem) => {
    const statuses: OrderItem["status"][] = ["Delivered", "Ready to Pickup", "Out for Delivery", "Dispatched"];
    const nextStatus = statuses[(statuses.indexOf(order.status) + 1) % statuses.length];
    const ok = await confirmAction("Update Status?", "Change order status?");
    if (!ok) return;
    setOrders(orders.map((item) => (item.id === order.id ? { ...item, status: nextStatus } : item)));
    toastSuccess(`Order ${order.id} updated to ${nextStatus}`);
  };

  const filtered = orders.filter(o =>
    o.customer.toLowerCase().includes(search.toLowerCase()) ||
    o.id.includes(search) ||
    o.payment.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Orders List</h2>
          <p className="text-xs text-text-secondary">Review status and logistics of all store orders</p>
        </div>
      </div>

      {/* Top micro metric summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Pending Payment", count: "56", color: "bg-amber-50 text-amber-500", icon: AlertCircle },
          { label: "Completed", count: "12,689", color: "bg-green-50 text-green-500", icon: CheckCircle },
          { label: "Refunded", count: "124", color: "bg-blue-50 text-blue-500", icon: RotateCcw },
          { label: "Failed", count: "32", color: "bg-red-50 text-red-500", icon: AlertCircle }
        ].map((item, idx) => (
          <div key={idx} className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs">
            <div>
              <h3 className="text-2xl font-extrabold font-display text-text-primary leading-none">{item.count}</h3>
              <p className="text-[11px] text-text-secondary font-semibold uppercase mt-2">{item.label}</p>
            </div>
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Datatable Card */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action controls row */}
        <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by order #ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-border-divider rounded-xl text-xs font-semibold text-text-primary outline-none focus:bg-bg-card focus:border-primary transition-all"
            />
          </div>

          <button
            onClick={() => toastSuccess("Orders spreadsheet downloaded.")}
            className="flex items-center justify-center gap-2 border border-border-divider rounded-xl px-4 py-2 text-xs font-bold text-text-secondary bg-gray-50/30 hover:bg-gray-100 transition-all cursor-pointer w-full sm:w-auto"
          >
            <Download size={14} />
            Export Orders
          </button>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/20">
                <th className="py-3.5 px-6 w-10">
                  <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" />
                </th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Customers</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <EmptyState icon={AlertCircle} title="No orders found" description="Try a different search or clear the current filters." />
                  </td>
                </tr>
              ) : filtered.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition-all text-xs text-text-primary font-medium">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded text-primary focus:ring-primary border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleSelectOrder(o.id)}
                      className="font-bold text-primary hover:underline"
                    >
                      {o.id}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-text-secondary font-sans">{o.date}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={o.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-text-primary leading-tight">{o.customer}</h4>
                        <p className="text-[10px] text-text-secondary mt-0.5">{o.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold ${
                      o.payment === "Paid"
                        ? "text-green-500"
                        : o.payment === "Pending"
                        ? "text-amber-500"
                        : o.payment === "Cancelled"
                        ? "text-text-secondary"
                        : "text-red-500"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        o.payment === "Paid"
                          ? "bg-green-500"
                          : o.payment === "Pending"
                          ? "bg-amber-500"
                          : o.payment === "Cancelled"
                          ? "bg-gray-400"
                          : "bg-red-500"
                      }`}></span>
                      {o.payment}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleCycleStatus(o)}
                      className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                      o.status === "Delivered"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : o.status === "Ready to Pickup"
                        ? "bg-blue-50 text-blue-600 border border-blue-100"
                        : "bg-purple-50 text-purple-600 border border-purple-100"
                    }`}>
                      {o.status}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                      <span className="font-bold text-text-primary">{o.method}</span>
                      <span className="text-[10px] text-text-secondary font-mono">{o.methodDetails}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleSelectOrder(o.id)}
                      className="p-1 px-2 hover:bg-gray-50 rounded-lg text-text-secondary hover:text-text-secondary transition-all cursor-pointer"
                    >
                      <MoreVertical size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(o)}
                      className="p-1 px-2 hover:bg-red-50 rounded-lg text-red-500 hover:text-red-600 transition-all cursor-pointer"
                      title="Delete order"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <span className="text-xs text-text-secondary font-semibold font-sans">Showing 1-8 of 100 orders</span>
          <div className="flex gap-1.5">
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary"><ChevronLeft size={14} /></button>
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

