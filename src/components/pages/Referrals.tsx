import { useState } from "react";
import { PageId } from "@/types";
import {
  DollarSign,
  Gift,
  AlertCircle,
  Copy,
  Check,
  Send,
  Linkedin,
  Twitter,
  Facebook,
  Award,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { toastSuccess } from "@/utils/confirm";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";

export default function Referrals() {
  const { referrals } = useApp();
  const [isCopied, setIsCopied] = useState(false);
  const referralLink = "https://referral.coredevs.com/invite/john_doe_2026";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Referrals</h2>
          <p className="text-xs text-text-secondary">Manage and track referral link campaigns and commissions</p>
        </div>
      </div>

      {/* Stats row (exact replica to screenshot list) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-2xl font-extrabold font-display text-text-primary leading-none">$4,856.85</h3>
            <p className="text-[11px] text-text-secondary font-semibold uppercase mt-2">Total Earning</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-2xl font-extrabold font-display text-text-primary leading-none">$150.00</h3>
            <p className="text-[11px] text-text-secondary font-semibold uppercase mt-2">Referral Commission</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-primary-light text-primary flex items-center justify-center">
            <Gift size={20} />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-2xl font-extrabold font-display text-text-primary leading-none">$32.00</h3>
            <p className="text-[11px] text-text-secondary font-semibold uppercase mt-2">Refund Commission</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs">
          <div>
            <h3 className="text-2xl font-extrabold font-display text-text-primary leading-none">$1,213.00</h3>
            <p className="text-[11px] text-text-secondary font-semibold uppercase mt-2">Unpaid Commission</p>
          </div>
          <div className="h-11 w-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <Award size={20} />
          </div>
        </div>
      </div>

      {/* Invite Friends Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Copy Referral Link */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-text-primary text-sm">Invite your friends</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Copy your unique referral campaign code URL below, then share with colleagues and clients.
            </p>
          </div>

          <div className="my-6">
            <div className="flex bg-gray-50 border border-border-divider rounded-xl p-1.5 focus-within:border-primary transition-colors">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-transparent px-3 text-xs font-semibold text-text-primary outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex-shrink-0 p-2.5 rounded-xl text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isCopied ? "bg-green-500 shadow-md shadow-green-500/10" : "bg-primary hover:bg-primary-hover shadow-md shadow-primary/10"
                }`}
              >
                {isCopied ? <Check size={14} /> : <Copy size={14} />}
                <span className="text-xs px-1">{isCopied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs font-semibold text-text-secondary">
            <span>Or share on:</span>
            <div className="flex gap-2">
              <button className="p-2 border border-border-divider hover:bg-gray-50 text-sky-500 rounded-xl transition-all cursor-pointer"><Twitter size={14} /></button>
              <button className="p-2 border border-border-divider hover:bg-gray-50 text-blue-700 rounded-xl transition-all cursor-pointer"><Facebook size={14} /></button>
              <button className="p-2 border border-border-divider hover:bg-gray-50 text-blue-600 rounded-xl transition-all cursor-pointer"><Linkedin size={14} /></button>
            </div>
          </div>
        </div>

        {/* Right Card: Quick Campaign Analytics */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="font-display font-semibold text-text-primary text-sm">Commission Rules</h3>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              Verify terms and payout details with the Core Devs affiliate committee before publishing codes.
            </p>
          </div>

          <div className="space-y-3 my-4">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Base Commission Level:</span>
              <span className="text-primary font-bold">15% Net Payout</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Cookie Retention Tracking:</span>
              <span className="text-gray-950 font-bold">90 Days</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-text-secondary">Minimum payout cap:</span>
              <span className="text-gray-950 font-bold">$100 USD</span>
            </div>
          </div>

          <button
            onClick={() => toastSuccess("Loading advanced rules sheet...")}
            className="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 text-text-secondary text-xs font-bold rounded-xl border border-border-divider transition-all cursor-pointer"
          >
            Read Terms of Service
          </button>
        </div>
      </div>

      {/* Referred Users Table */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border-divider flex items-center justify-between">
          <h3 className="font-display font-semibold text-text-primary text-sm">Referred Users</h3>
          <span className="px-3 py-1 bg-primary-light text-primary font-bold text-xs rounded-xl">
            Active Members
          </span>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/20">
                <th className="py-3 px-6 w-10">
                  <input type="checkbox" className="rounded text-primary border-gray-300" />
                </th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Referred Date</th>
                <th className="py-3 px-4 text-center">Value %</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Net Payouts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {referrals.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Award} title="No referrals found" description="Referral members will appear here once they join." />
                  </td>
                </tr>
              ) : referrals.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-all text-xs text-text-primary font-medium">
                  <td className="py-3.5 px-6">
                    <input type="checkbox" className="rounded text-primary border-gray-300" />
                  </td>
                  <td className="py-3.5 px-4 font-bold text-text-primary">{r.name}</td>
                  <td className="py-3.5 px-4 text-text-secondary font-sans">{r.email}</td>
                  <td className="py-3.5 px-4 text-text-secondary font-sans">{r.referredId}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-primary">
                    ${r.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                      r.status === "Paid"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right font-bold text-text-primary">
                    ${r.earning.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <span className="text-xs text-text-secondary font-semibold font-sans">Showing 1-6 of 32 referrals</span>
          <div className="flex gap-1">
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary"><ChevronLeft size={14} /></button>
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

