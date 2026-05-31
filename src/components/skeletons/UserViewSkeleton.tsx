import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function UserViewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Section / Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: User Card & Quick Specs */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main User Card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs text-center">
            <div className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-2xl" />
              <Skeleton className="h-5 w-36 mt-4" />
              <Skeleton className="h-5 w-24 mt-2 rounded-full" />
            </div>

            {/* Quick mini-metrics */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-divider/50 my-6 py-5">
              <div className="flex items-center gap-3 justify-center border-r border-border-divider/50">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-8" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
              <div className="flex items-center gap-3 justify-center pl-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-3 w-10" />
                </div>
              </div>
            </div>

            {/* User Parameters list */}
            <div className="space-y-4 text-left">
              <Skeleton className="h-3 w-16" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-3.5 w-28" />
                  </div>
                ))}
              </div>

              {/* Action Buttons below details */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-divider/30">
                <Skeleton className="h-[38px] w-full rounded-xl" />
                <Skeleton className="h-[38px] w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Views tab viewport */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-xl" />
            ))}
          </div>

          {/* Account Tab Content Fallback */}
          <div className="space-y-6">
            {/* Activity Timeline logs */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-40" />
              </div>

              <div className="relative border-l border-border-divider pl-6 ml-3 space-y-6 pt-2">
                {[1, 2, 3].map((ev) => (
                  <div key={ev} className="relative">
                    <span className="absolute -left-[30px] top-1 bg-gray-200 dark:bg-zinc-800 h-3.5 w-3.5 rounded-full border-2 border-bg-card" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-72" />
                      </div>
                      <Skeleton className="h-4.5 w-20 rounded-md shrink-0 self-start sm:self-center" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* User projects list */}
            <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-5 w-48" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-divider bg-gray-55/10">
                      <th className="py-2.5"><Skeleton className="h-4 w-24" /></th>
                      <th className="py-2.5"><Skeleton className="h-4 w-28" /></th>
                      <th className="py-2.5"><Skeleton className="h-4 w-12" /></th>
                      <th className="py-2.5 text-right"><Skeleton className="h-4 w-14 ml-auto" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider/50">
                    {[1, 2, 3].map((proj, i) => (
                      <tr key={i}>
                        <td className="py-3.5"><Skeleton className="h-4 w-32" /></td>
                        <td className="py-3.5"><Skeleton className="h-4 w-24" /></td>
                        <td className="py-3.5"><Skeleton className="h-4 w-10" /></td>
                        <td className="py-3.5 text-right"><Skeleton className="h-5 w-16 rounded-md ml-auto" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
