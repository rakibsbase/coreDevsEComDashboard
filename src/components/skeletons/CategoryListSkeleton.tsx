import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function CategoryListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        {/* Action Row */}
        <div className="p-6 border-b border-border-divider flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Skeleton className="h-[40px] w-full sm:w-80 rounded-xl" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-[40px] w-24 rounded-xl" />
            <Skeleton className="h-[40px] w-36 rounded-xl" />
          </div>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[850px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-55/10">
                <th className="py-3.5 px-6 w-10">
                  <Skeleton className="h-4 w-4 rounded mx-auto" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></th>
                <th className="py-3.5 px-4 text-right"><Skeleton className="h-4 w-24 ml-auto" /></th>
                <th className="py-3.5 px-6 text-right w-24"><Skeleton className="h-4 w-12 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider/50">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-4.5 px-6">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </td>
                  <td className="py-4.5 px-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-xl" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4.5 px-4 text-right">
                    <Skeleton className="h-4.5 w-16 ml-auto" />
                  </td>
                  <td className="py-4.5 px-4 text-right">
                    <Skeleton className="h-4.5 w-20 ml-auto" />
                  </td>
                  <td className="py-4.5 px-6 text-right">
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
        <div className="p-4 px-6 border-t border-border-divider/70 flex items-center justify-between">
          <Skeleton className="h-4.5 w-48" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
