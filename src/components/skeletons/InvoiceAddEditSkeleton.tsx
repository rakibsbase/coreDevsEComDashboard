import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function InvoiceAddEditSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-3.5 w-48" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Dynamic Form (Left Column: 9 parts) */}
        <div className="lg:col-span-9 bg-bg-card border border-border-divider rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Header invoice metadata details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-border-divider pb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative border border-border-divider rounded-xl px-4 pt-5 pb-2.5 bg-bg-app/10 space-y-1.5 h-[58px]">
                <Skeleton className="h-2.5 w-16" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>

          {/* Client select segment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b border-border-divider pb-6">
            {[1, 2].map((i) => (
              <div key={i} className="relative border border-border-divider rounded-xl px-4 pt-5 pb-2.5 bg-bg-app/10 space-y-1.5 h-[58px]">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>

          {/* Line items list editor */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40" />

            <div className="space-y-4">
              {[1, 2].map((idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-gray-50/10 dark:bg-zinc-800/10 border border-border-divider p-4 rounded-xl relative"
                >
                  {/* Item Name */}
                  <div className="md:col-span-4 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                  </div>

                  {/* Description */}
                  <div className="md:col-span-3 space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                  </div>

                  {/* Rate */}
                  <div className="md:col-span-2 space-y-2">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-8 w-full rounded-xl" />
                  </div>

                  {/* Qty */}
                  <div className="md:col-span-1 space-y-2">
                    <Skeleton className="h-3 w-8" />
                    <Skeleton className="h-8 w-full rounded-xl animate-pulse" />
                  </div>

                  {/* Computed total */}
                  <div className="md:col-span-1 pb-3 text-right">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </div>

                  {/* Delete button */}
                  <div className="md:col-span-1 pb-2 text-center">
                    <Skeleton className="h-7 w-7 rounded-lg mx-auto" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-36" />
            </div>
          </div>

          {/* Pricing math calculations */}
          <div className="border-t border-border-divider pt-6 flex flex-col items-end">
            <div className="w-72 space-y-3 font-sans">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-7 w-16 rounded-lg" />
              </div>
              <div className="flex justify-between border-t border-border-divider pt-2 items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel Side Toggles (Right Column: 3 parts) */}
        <div className="lg:col-span-3 space-y-6 select-none">
          {/* Options card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-4">
            <Skeleton className="h-4 w-32" />

            <div className="space-y-4 pt-1">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="relative border border-border-divider rounded-xl px-3 pt-4 pb-2 bg-bg-app/10 space-y-1 h-[48px]">
                  <Skeleton className="h-2 w-16" />
                  <Skeleton className="h-4.5 w-5/6" />
                </div>
              ))}
            </div>
          </div>

          {/* Additional toggles card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-4">
            <Skeleton className="h-4 w-28" />

            <div className="space-y-3">
              {[1, 2].map((idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Skeleton className="h-3.5 w-3.5 rounded" />
                  <Skeleton className="h-3.5 w-44" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
