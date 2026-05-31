import { PageId } from "@/types";
import {
  ChevronLeft,
  Truck,
  Heart,
  Edit,
  Trash2,
  CheckCircle2,
  CircleAlert,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ClipboardList
} from "lucide-react";
import { motion } from "motion/react";
import { useApp } from "@/context/AppContext";
import { confirmDelete, toastSuccess } from "@/utils/confirm";

interface OrderDetailsProps {
  orderId: string;
  setActivePage: (p: PageId) => void;
}

export default function OrderDetails({ orderId, setActivePage }: OrderDetailsProps) {
  const { orders, setOrders, setSelectedOrderId } = useApp();
  // Ordered items data list
  const orderedItems = [
    { name: "OnePlus 7 Pro", brand: "OnePlus", price: 799, qty: 1, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=80&auto=format&fit=crop&q=80" },
    { name: "Magic Mouse", brand: "Google", price: 89, qty: 1, image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=80&auto=format&fit=crop&q=80" },
    { name: "Wooden Chair", brand: "Insofar", price: 289, qty: 2, image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=80&auto=format&fit=crop&q=80" },
    { name: "Air Jordan", brand: "Nike", price: 299, qty: 2, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=80&auto=format&fit=crop&q=80" }
  ];

  const subtotal = 2093;
  const shippingFee = 2;
  const tax = 28;
  const total = 2113;

  const activities = [
    { title: "Order was placed (Order ID: 5434)", desc: "Your order has been placed successfully", time: "Tuesday 11:29 AM", active: true },
    { title: "Pick-up", desc: "Pick-up scheduled with courier", time: "Wednesday 11:29 AM", active: true },
    { title: "Dispatched", desc: "Item has been picked up by courier", time: "Thursday 8:15 AM", active: true },
    { title: "Package arrived", desc: "Package arrived at an Amazon facility, NY", time: "Saturday 15:20 AM", active: true },
    { title: "Dispatched for delivery", desc: "Package has left an Amazon facility, NY", time: "Today 14:12 PM", active: true },
    { title: "Delivery", desc: "Package will be delivered by tomorrow", time: "Pending", active: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => setActivePage("orders-list")}
            className="flex items-center text-xs font-bold text-text-secondary hover:text-primary transition-all mb-1 cursor-pointer"
          >
            <ChevronLeft size={14} className="mr-1" />
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display text-text-primary">Order {orderId || "#5434"}</h2>
            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold bg-green-50 text-green-600 border border-green-100 rounded-lg">
              Delivered
            </span>
            <span className="inline-flex px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-100 rounded-lg">
              Paid
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Mon May 16 2022, 2:11 AM (ET)</p>
        </div>

        <button
          onClick={async () => {
            const ok = await confirmDelete(`Order ${orderId || "#5434"}`);
            if (!ok) return;
            setOrders(orders.filter((order) => order.id !== orderId));
            setSelectedOrderId(null);
            toastSuccess(`Order ${orderId || "#5434"} deleted successfully`);
            setActivePage("orders-list");
          }}
          className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
        >
          Delete Order
        </button>
      </div>

      {/* Main Grid Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: items grid */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-text-primary text-sm">Order Details</h3>
              <button className="text-xs font-bold text-primary hover:underline">Edit</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-divider text-[10.5px] font-bold text-text-secondary uppercase tracking-wider">
                    <th className="py-2.5 px-2 w-10">
                      <input type="checkbox" className="rounded text-primary border-border-divider" />
                    </th>
                    <th className="py-2.5 px-2">Product</th>
                    <th className="py-2.5 px-2">Price</th>
                    <th className="py-2.5 px-2">QTY</th>
                    <th className="py-2.5 px-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/80">
                  {orderedItems.map((item, idx) => (
                    <tr key={idx} className="text-xs text-text-primary font-medium">
                      <td className="py-3.5 px-2">
                        <input type="checkbox" className="rounded text-primary border-border-divider" />
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <img src={item.image} alt="" className="h-9 w-9 rounded-lg object-cover border border-border-divider" />
                          <div>
                            <h4 className="font-semibold text-text-primary leading-tight">{item.name}</h4>
                            <p className="text-[10px] text-text-secondary mt-0.5">{item.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-semibold">${item.price}</td>
                      <td className="py-3.5 px-2 font-bold text-text-secondary">{item.qty}</td>
                      <td className="py-3.5 px-2 text-right font-bold text-text-primary">
                        ${(item.price * item.qty).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations summaries */}
            <div className="border-t border-border-divider pt-4 flex justify-end">
              <div className="w-64 space-y-2 text-xs font-semibold text-text-secondary">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-text-primary font-bold">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="text-text-primary font-bold">${shippingFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span className="text-text-primary font-bold">${tax}</span>
                </div>
                <div className="flex justify-between border-t border-border-divider pt-2 text-sm text-text-primary font-bold">
                  <span>Total:</span>
                  <span className="text-primary font-extrabold">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping activity timeline */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-display font-bold text-text-primary text-sm">Shipping Activity</h3>

            <div className="relative border-l border-border-divider pl-6 ml-3 space-y-6">
              {activities.map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Status bullets */}
                  <span className={`absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-white flex-shrink-0 ${
                    act.active ? "bg-primary shadow-sm" : "bg-gray-200"
                  }`}></span>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <h4 className={`text-xs font-bold ${act.active ? "text-text-primary" : "text-text-secondary"}`}>
                        {act.title}
                      </h4>
                      <p className="text-[10px] text-text-secondary font-medium mt-0.5">{act.desc}</p>
                    </div>
                    <span className="text-[10px] text-text-secondary font-semibold">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer accounts details */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-text-primary text-sm">Customer details</h3>
            
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
                alt="Gabrielle Feyer"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-xs font-bold text-text-primary leading-tight">Gabrielle Feyer</h4>
                <p className="text-[10px] text-text-secondary">Customer ID: #47389</p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-border-divider text-[11px] font-semibold text-text-secondary">
              <div className="flex justify-between items-center">
                <span>Contact info</span>
                <button className="text-primary hover:underline font-bold">Edit</button>
              </div>
              <div className="text-text-primary space-y-1">
                <p className="truncate">Email: gfeyer0@nyu.edu</p>
                <p>Mobile: +1 (609) 972-22-22</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3 text-[11px] font-semibold text-text-secondary">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-display font-bold text-text-primary text-xs">Shipping Address</h3>
              <button className="text-primary hover:underline font-bold">Edit</button>
            </div>
            <div className="text-text-primary leading-relaxed font-sans font-medium">
              <p>45 Roker Terrace</p>
              <p>Latheronwheel</p>
              <p>KW5 8NW, London</p>
              <p>UK</p>
            </div>
          </div>

          {/* Billing Address and Mastercard info */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3 text-[11px] font-semibold text-text-secondary">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-display font-bold text-text-primary text-xs">Billing Address</h3>
              <button className="text-primary hover:underline font-bold">Edit</button>
            </div>
            <div className="text-text-primary leading-relaxed font-sans font-medium">
              <p>45 Roker Terrace</p>
              <p>Latheronwheel</p>
              <p>KW5 8NW, London</p>
              <p>UK</p>
            </div>

            <div className="border-t border-border-divider pt-3 text-text-primary font-sans font-medium">
              <h4 className="font-bold text-xs text-text-primary mb-1">Mastercard</h4>
              <p className="text-text-secondary">Card Number:  ******4291</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

