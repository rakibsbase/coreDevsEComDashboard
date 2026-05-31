import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function ManageReviewsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Stats Breakdown Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Rating Aggregate */}
        <div className="md:col-span-4 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[202px]">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>

          <div className="py-2 flex items-baseline gap-2">
            <Skeleton className="h-12 w-16" />
            <Skeleton className="h-4 w-10" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </div>

        {/* Right Side: Progress bars */}
        <div className="md:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs flex flex-col justify-between h-[202px]">
          <Skeleton className="h-4 w-32" />

          <div className="space-y-3 mt-4 flex-1 flex flex-col justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-2.5 flex-1 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review list controller table */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Controls row */}
        <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-9 w-full sm:w-80 rounded-xl" />
          <Skeleton className="h-9 w-64 rounded-xl" />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-55/20">
                <th className="py-3.5 px-6 w-10">
                  <Skeleton className="h-4 w-4 rounded mx-auto" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-14" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-14" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-10" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3.5 px-6 text-right w-24"><Skeleton className="h-4 w-12 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-4 px-6">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-28" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 max-w-xs">
                    <div className="space-y-2">
                      <Skeleton className="h-3.5 w-20" />
                      <Skeleton className="h-3.5 w-full" />
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <Skeleton className="h-4 w-16" />
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

        {/* Pagination indicator */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <Skeleton className="h-4.5 w-48" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
