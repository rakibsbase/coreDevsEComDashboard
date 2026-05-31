import { useState } from "react";
import { PageId } from "@/types";
import {
  Star,
  Search,
  Check,
  X,
  Trash2,
  ThumbsUp,
  MessageCircle,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion } from "motion/react";
import { confirmAction, confirmDelete, toastSuccess } from "@/utils/confirm";
import { EmptyState } from "@/components/common/EmptyState";
import { useApp } from "@/context/AppContext";

export default function ManageReviews() {
  const { reviews, setReviews } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Local approval action
  const handleApprove = async (id: string) => {
    const ok = await confirmAction("Approve Review?", "Mark as Published?");
    if (!ok) return;
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: "Published" } : r)));
    toastSuccess("Review published successfully");
  };

  // Local reject action
  const handleReject = async (id: string) => {
    const ok = await confirmAction("Reject Review?", "Mark as Pending?");
    if (!ok) return;
    setReviews(reviews.map(r => (r.id === id ? { ...r, status: "Pending" } : r)));
    toastSuccess("Review marked as pending");
  };

  const handleToggleStatus = (id: string, current: string) => {
    if (current === "Pending") {
      handleApprove(id);
    } else {
      setReviews(reviews.map(r => (r.id === id ? { ...r, status: "Pending" } : r)));
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await confirmDelete("this review");
    if (!ok) return;
    setReviews(reviews.filter(r => r.id !== id));
    toastSuccess("Review deleted successfully");
  };

  const filtered = reviews.filter(rev => {
    const matchQuery =
      rev.reviewer.toLowerCase().includes(search.toLowerCase()) ||
      rev.productName.toLowerCase().includes(search.toLowerCase()) ||
      rev.reviewText.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "All" || rev.status === statusFilter;

    return matchQuery && matchStatus;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-text-primary">Manage Reviews</h2>
          <p className="text-xs text-text-secondary font-sans">Moderation of customer reviews and ratings</p>
        </div>
      </div>

      {/* Stats Breakdown Row (screenshot exact replica) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Rating Aggregate */}
        <div className="md:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-widest">Aggregate Reviews</h3>
            <p className="text-[11px] text-text-secondary">Calculated based on 12.4k reviews</p>
          </div>

          <div className="py-6 flex items-baseline gap-2">
            <span className="text-5xl font-extrabold font-display text-primary leading-none">4.8</span>
            <span className="text-sm font-semibold text-text-secondary">/ 5.0</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={15} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-text-secondary font-semibold leading-relaxed">
              92% of buyers recommend this store to friends.
            </p>
          </div>
        </div>

        {/* Right Side: Progress bars */}
        <div className="md:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-text-primary uppercase tracking-widest">Star Distribution</span>

          <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
            {/* 5 star */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary gap-4">
              <span className="w-10">5 Star</span>
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[85%] rounded-full"></div>
              </div>
              <span className="w-10 text-right">8,524</span>
            </div>

            {/* 4 star */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary gap-4">
              <span className="w-10">4 Star</span>
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full w-[10%] rounded-full"></div>
              </div>
              <span className="w-10 text-right">1,213</span>
            </div>

            {/* 3 star */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary gap-4">
              <span className="w-10">3 Star</span>
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-yellow-400 h-full w-[3%] rounded-full"></div>
              </div>
              <span className="w-10 text-right">412</span>
            </div>

            {/* 2 star */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary gap-4">
              <span className="w-10">2 Star</span>
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-orange-400 h-full w-[1.5%] rounded-full"></div>
              </div>
              <span className="w-10 text-right">187</span>
            </div>

            {/* 1 star */}
            <div className="flex items-center justify-between text-xs font-semibold text-text-secondary gap-4">
              <span className="w-10">1 Star</span>
              <div className="flex-1 bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full w-[0.5%] rounded-full"></div>
              </div>
              <span className="w-10 text-right">64</span>
            </div>
          </div>
        </div>
      </div>

      {/* Review list controller table */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Controls row */}
        <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search reviewer or products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-border-divider rounded-xl text-xs font-semibold text-text-primary outline-none focus:bg-bg-card focus:border-primary transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest mr-2">Status:</span>
            {["All", "Published", "Pending"].map((statusOption) => (
              <button
                key={statusOption}
                type="button"
                onClick={() => setStatusFilter(statusOption)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all cursor-pointer ${
                  statusFilter === statusOption
                    ? "bg-primary text-white border-primary shadow-xs"
                    : "border-border-divider text-text-secondary hover:bg-gray-50"
                }`}
              >
                {statusOption}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider text-[10px] font-bold text-text-secondary uppercase tracking-wider bg-gray-50/20">
                <th className="py-3.5 px-6 w-10">
                  <input type="checkbox" className="rounded text-primary border-gray-300" />
                </th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Review</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={MessageCircle} title="No reviews found" description="Review search and status filters did not match any records." />
                  </td>
                </tr>
              ) : filtered.map((rev) => (
                <tr key={rev.id} className="hover:bg-gray-50/50 transition-all text-xs text-text-primary font-medium whitespace-normal">
                  <td className="py-4 px-6">
                    <input type="checkbox" className="rounded text-primary border-gray-300" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={rev.productImage} className="h-9 w-9 rounded-xl object-cover border border-border-divider flex-shrink-0" />
                      <div className="max-w-[140px]">
                        <h4 className="font-bold text-text-primary leading-tight truncate">{rev.productName}</h4>
                        <span className="text-[10px] text-text-secondary">Electronics</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={rev.reviewerAvatar} alt={rev.reviewer} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <h4 className="font-semibold text-text-primary leading-tight">{rev.reviewer}</h4>
                        <p className="text-[10px] text-text-secondary">{rev.reviewEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-1">
                      {/* stars reviews */}
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < rev.stars ? "fill-amber-400 text-amber-400" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <p className="text-text-secondary font-sans leading-relaxed text-[11px] font-medium line-clamp-2">
                        {rev.reviewText}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-text-secondary whitespace-nowrap font-sans">{rev.reviewDate}</td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-0.5 text-[10px] font-bold rounded-lg ${
                      rev.status === "Published"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      {rev.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      {rev.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(rev.id)}
                            className="p-1 px-1.5 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Approve Review"
                          >
                            <Check size={13} />
                          </button>
                          <button
                            onClick={() => handleReject(rev.id)}
                            className="p-1 px-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                            title="Reject Review"
                          >
                            <X size={13} />
                          </button>
                        </>
                      )}
                      
                      {rev.status !== "Pending" && (
                        <button
                          onClick={() => handleToggleStatus(rev.id, rev.status)}
                          className="p-1 px-1.5 text-primary hover:bg-primary-light rounded-lg text-[10px] font-bold"
                        >
                          Reset
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(rev.id)}
                        className="p-1 px-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination indicator */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <span className="text-xs text-text-secondary font-semibold font-sans">Showing 1-10 of 124 moderators</span>
          <div className="flex gap-1">
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary"><ChevronLeft size={14} /></button>
            <button className="p-1.5 border border-border-divider rounded-lg text-text-secondary bg-gray-50"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

