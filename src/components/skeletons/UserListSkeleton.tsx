import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function UserListSkeleton() {
  return (
    <div className="space-y-6">
      {/* SaaS High-fidelity Stat Cards at top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center justify-between h-[106px]">
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-11 w-11 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Filter Card */}
      <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs space-y-4">
        <Skeleton className="h-4 w-12" />
        <div className="flex flex-wrap gap-4">
          <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
          <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
          <Skeleton className="h-11 flex-1 min-w-[200px] rounded-xl" />
        </div>
      </div>

      {/* Datatable Card */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action controllers bar */}
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border-divider bg-bg-card/40">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton className="h-9 w-full sm:w-56 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-50/10 dark:bg-zinc-800/20">
                <th className="py-3.5 px-6 w-12 text-center">
                  <Skeleton className="h-3.5 w-3.5 rounded mx-auto" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-14" /></th>
                <th className="py-3.5 px-6 text-right w-24"><Skeleton className="h-4 w-12 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-6 text-center">
                    <Skeleton className="h-3.5 w-3.5 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-5 rounded-md" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
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

        {/* Bottom pagination bar */}
        <div className="p-4 px-6 border-t border-border-divider bg-bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4.5 w-48" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
