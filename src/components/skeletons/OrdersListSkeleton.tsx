import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function OrdersListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Top micro metric summaries */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs h-[88px]">
            <div className="space-y-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-11 w-11 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Main Datatable Card */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action controls row */}
        <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-9 w-full sm:w-80 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-50/20">
                <th className="py-3.5 px-6 w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-10" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-14" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-6 text-right"><Skeleton className="h-4 w-12" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-4 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4.5 w-16 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-5 w-20 rounded-md" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <Skeleton className="h-7 w-7 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
