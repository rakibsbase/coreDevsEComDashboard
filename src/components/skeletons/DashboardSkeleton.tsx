import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Welcome Banner & Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
        {/* Welcome Card Skeleton */}
        <div className="md:col-span-2 xl:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 flex flex-col justify-between shadow-xs h-[180px]">
          <div className="space-y-4">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-6 w-28 rounded-lg" />
          </div>
        </div>

        {/* Small Metric: Revenue Card */}
        <div className="col-span-1 xl:col-span-2 bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs h-[180px]">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Small Metric: Transactions Card */}
        <div className="col-span-1 xl:col-span-2 bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs h-[180px]">
          <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
      </div>

      {/* SECTION 2: Total Profit & Sales Donut Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Total Profit Grouped Bar Chart */}
        <div className="lg:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[360px]">
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-48" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 h-64 flex items-end gap-3 px-4">
              <Skeleton className="h-[40%] w-6" />
              <Skeleton className="h-[60%] w-6" />
              <Skeleton className="h-[30%] w-6" />
              <Skeleton className="h-[80%] w-6" />
              <Skeleton className="h-[50%] w-6" />
              <Skeleton className="h-[75%] w-6" />
              <Skeleton className="h-[90%] w-6" />
            </div>
            <div className="md:col-span-4 flex flex-col justify-between py-2 pl-0 md:pl-6 space-y-6 h-64 border-t md:border-t-0 md:border-l border-border-divider/70">
              <div className="space-y-4">
                <div>
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-3 w-40 mt-2" />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Total Sales Donut Card and Progress Columns */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-6">
          {/* Card 1: Total Sales Donut Card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex items-center justify-between h-[150px]">
            <div className="space-y-3">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-7 w-32" />
            </div>
            <Skeleton className="h-24 w-24 rounded-full" />
          </div>

          {/* Card 2 & 3: Inline Side-by-Side mini visualizers */}
          <div className="grid grid-cols-2 gap-6 h-[184px]">
            {/* Total Revenue sparkline */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>

            {/* Total Sales semi-circle progress circle */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Pipelines, Tiny metrics, Website stats block */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-6 items-stretch">
        {/* Transactions List */}
        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col h-[395px] justify-between">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dual Stacked Metrics & Visitors */}
        <div className="xl:col-span-4 flex flex-col justify-between gap-6 h-[395px]">
          <div className="grid grid-cols-2 gap-6 h-[142px]">
            {/* Logistics Widget */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>

            {/* Reports Widget */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-5 flex flex-col justify-between shadow-xs">
              <div className="flex justify-between items-center">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>

          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex justify-between items-center h-[227px]">
            <div className="space-y-3">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-7 w-28" />
            </div>
            <Skeleton className="h-28 w-[140px]" />
          </div>
        </div>

        {/* Website Traffic Statistics */}
        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col h-[395px] justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="flex justify-between items-center mb-5">
              <div className="space-y-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-3.5 w-24" />
              </div>
              <Skeleton className="h-14 w-28" />
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Dual Table Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs h-[520px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-3.5 w-64" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-12 rounded-lg" />
              <Skeleton className="h-7 w-12 rounded-lg" />
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-xl mb-4" />
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex justify-between items-center py-3 border-b border-border-divider/30">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-6 rounded-lg" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8.5 w-8.5 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="xl:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs h-[520px] flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-3.5 w-48" />
            </div>
            <Skeleton className="h-4 w-4" />
          </div>
          <div className="space-y-4 flex-1">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="p-3 border border-border-divider/50 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </div>
                <Skeleton className="h-5 w-40" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
