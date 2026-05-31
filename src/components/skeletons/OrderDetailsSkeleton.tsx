import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-5 w-16 rounded-lg" />
            <Skeleton className="h-5 w-12 rounded-lg" />
          </div>
          <Skeleton className="h-3.5 w-48" />
        </div>

        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Main Grid Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section: items grid */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-8" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-divider">
                    <th className="py-2.5 px-2 w-10"><Skeleton className="h-4 w-4" /></th>
                    <th className="py-2.5 px-2"><Skeleton className="h-4 w-16" /></th>
                    <th className="py-2.5 px-2"><Skeleton className="h-4 w-10" /></th>
                    <th className="py-2.5 px-2"><Skeleton className="h-4 w-8" /></th>
                    <th className="py-2.5 px-2 text-right"><Skeleton className="h-4 w-12 ml-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/10">
                  {[1, 2, 3].map((idx) => (
                    <tr key={idx}>
                      <td className="py-3.5 px-2">
                        <Skeleton className="h-4 w-4" />
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                          <div className="space-y-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2"><Skeleton className="h-4 w-12" /></td>
                      <td className="py-3.5 px-2"><Skeleton className="h-4 w-8" /></td>
                      <td className="py-3.5 px-2 text-right"><Skeleton className="h-4 w-14 ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations summaries */}
            <div className="border-t border-border-divider pt-4 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-16" />
                  <Skeleton className="h-3.5 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-20" />
                  <Skeleton className="h-3.5 w-8" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-3.5 w-10" />
                  <Skeleton className="h-3.5 w-8" />
                </div>
                <div className="flex justify-between border-t border-border-divider pt-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping activity timeline */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs space-y-5">
            <Skeleton className="h-5 w-36" />

            <div className="relative border-l border-border-divider pl-6 ml-3 space-y-6">
              {[1, 2, 3].map((act) => (
                <div key={act} className="relative">
                  <span className="absolute -left-[30px] top-1 h-3 w-3 rounded-full border-2 border-bg-card bg-gray-200 dark:bg-zinc-800" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                    <Skeleton className="h-3.5 w-24 shrink-0" />
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
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <div className="space-y-3 pt-3 border-t border-border-divider">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-20" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3.5 w-28" />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center mb-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3.5 w-8" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </div>

          {/* Billing Address and Mastercard info */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center mb-1">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3.5 w-8" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <div className="border-t border-border-divider pt-3 space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3.5 w-36" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
