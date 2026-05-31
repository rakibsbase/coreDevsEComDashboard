import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Banner / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* ==================== LEFT TABS BAR (lg:col-span-1) ==================== */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex lg:flex-col bg-bg-card border border-border-divider rounded-2xl p-2.5 shadow-xs overflow-x-auto gap-2">
            {[1, 2, 3].map((tab) => (
              <div key={tab} className="flex items-center gap-3 px-4 py-3.5 rounded-xl w-full">
                <Skeleton className="h-4.5 w-4.5 rounded-md" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="hidden lg:block bg-bg-card border border-border-divider/75 p-5 rounded-2xl shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-md" />
              <Skeleton className="h-4.5 w-32" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/5" />
          </div>
        </div>

        {/* ==================== RIGHT VIEW SHEETS (lg:col-span-3) ==================== */}
        <div className="lg:col-span-3 space-y-6">
          {/* Visual Avatar Manager Row */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center gap-6">
            <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />

            <div className="flex-1 text-center sm:text-left space-y-4">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <Skeleton className="h-9 w-36 rounded-xl" />
                <Skeleton className="h-9 w-20 rounded-xl" />
              </div>
              <Skeleton className="h-3.5 w-5/6 max-w-sm mx-auto sm:mx-0" />
            </div>
          </div>

          {/* Account Settings Forms Card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4.5 w-40" />
              <Skeleton className="h-3.5 w-64" />
            </div>

            {/* Dual columns grid with responsive stacks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((field) => (
                <div key={field} className="border border-border-divider rounded-xl px-4 pt-5 pb-2.5 bg-bg-app/10 space-y-2 h-[58px]">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
              <div className="border border-border-divider rounded-xl px-4 pt-5 pb-2.5 bg-bg-app/10 space-y-2 h-[58px] sm:col-span-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>

            {/* Save and Revert Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-10 w-36 rounded-xl" />
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>

          {/* Gated Account Deactivation Card */}
          <div className="bg-bg-card border border-rose-100 dark:border-rose-950/30 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4.5 w-44" />
              <Skeleton className="h-3.5 w-80 max-w-full" />
            </div>

            {/* Warning box */}
            <div className="flex items-start gap-3 bg-red-50/10 dark:bg-rose-950/5 p-4 rounded-xl border border-rose-100/20 dark:border-rose-950/10 h-[68px]">
              <Skeleton className="h-4.5 w-4.5 rounded" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
              </div>
            </div>

            <div>
              <Skeleton className="h-10 w-40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
