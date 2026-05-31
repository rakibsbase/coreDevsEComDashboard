import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function AddProductSkeleton() {
  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Sticky Header Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-divider/50 pb-5">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-3.5 w-64" />
        </div>

        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-20 rounded-xl" />
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* SECTION 2: Responsive Two-Column Responsive Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Main specifications cards (size 8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card A: Product Information */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
            <Skeleton className="h-5 w-40" />

            <div className="space-y-5">
              <Skeleton className="h-[45px] w-full rounded-xl" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Skeleton className="h-[45px] w-full rounded-xl" />
                <Skeleton className="h-[45px] w-full rounded-xl" />
              </div>

              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-24" />
                <div className="border border-border-divider rounded-xl overflow-hidden">
                  <div className="bg-gray-50/75 dark:bg-zinc-800/20 border-b border-border-divider px-3 py-2 flex gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-5 w-8 rounded-md" />
                    ))}
                  </div>
                  <Skeleton className="h-28 w-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Card B: Media (Drag & Drop) */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-36" />
            </div>

            <div className="border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center space-y-3 h-[180px]">
              <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
              <Skeleton className="h-4 w-56" />
              <Skeleton className="h-7 w-28 rounded-xl" />
            </div>
          </div>

          {/* Card C: Product Variants */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-36" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <Skeleton className="h-[42px] w-full rounded-xl" />
              </div>
              <div className="md:col-span-7">
                <Skeleton className="h-[42px] w-full rounded-xl" />
              </div>
              <div className="md:col-span-1">
                <Skeleton className="h-9 w-9 rounded-lg mx-auto" />
              </div>
            </div>

            <Skeleton className="h-4 w-32 mt-2" />
          </div>

          {/* Card D: Product Sub-Settings */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <Skeleton className="h-5 w-44" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
              <div className="md:col-span-4 space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[38px] w-full rounded-xl" />
                ))}
              </div>
              <div className="md:col-span-8 space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-[45px] w-full rounded-xl" />
                  <Skeleton className="h-[45px] w-full rounded-xl" />
                </div>
                <Skeleton className="h-[45px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameters / Categories / Tags */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
            <Skeleton className="h-5 w-40" />

            <div className="space-y-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-[45px] w-full rounded-xl" />
                </div>
              ))}

              <div className="border-t border-border-divider/50 pt-5 space-y-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-[45px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
