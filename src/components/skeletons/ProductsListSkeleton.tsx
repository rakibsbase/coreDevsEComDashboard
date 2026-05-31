import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function ProductsListSkeleton() {
  return (
    <div className="space-y-6">
      {/* SECTION 1: Top Stat Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs flex items-center justify-between h-[96px]"
          >
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-11 w-11 rounded-xl" />
          </div>
        ))}
      </div>

      {/* SECTION 2: Filters Row */}
      <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs space-y-5">
        <Skeleton className="h-4 w-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[45px] w-full rounded-xl" />
          <Skeleton className="h-[45px] w-full rounded-xl" />
          <Skeleton className="h-[45px] w-full rounded-xl" />
        </div>
      </div>

      {/* SECTION 3: Action Row & Data Table List */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action controls row */}
        <div className="p-6 border-b border-border-divider flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Skeleton className="h-9 w-full md:w-80 rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
          </div>
        </div>

        {/* Data Table Skeleton */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[950px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-50/15">
                <th className="py-3.5 px-6 w-10">
                  <Skeleton className="h-4 w-4 rounded" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-3.5 px-4 text-center"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-10" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-10" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-14" /></th>
                <th className="py-3.5 px-6 text-right w-24"><Skeleton className="h-4 w-16" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider/50">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-4 rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3.5">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3.5 w-60" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-6 w-6 rounded-md" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <Skeleton className="h-5 w-9 rounded-full" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-8" />
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-5 w-16 rounded-md" />
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

        {/* Pagination controls */}
        <div className="p-4 px-6 border-t border-border-divider/75 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-8 w-32 rounded-lg" />
          <Skeleton className="h-8 w-48 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
