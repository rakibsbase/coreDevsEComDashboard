import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function CustomersListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Main card panel containing searches, filters, table */}
      <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
        {/* Controls container */}
        <div className="p-5 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-border-divider bg-gray-50/10">
          <Skeleton className="h-9 w-full md:w-80 rounded-xl" />
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <Skeleton className="h-9 w-24 rounded-xl" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
        </div>

        {/* Responsive Table Layout */}
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[1000px] text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-50/15">
                <th className="py-3.5 px-5 w-10 text-center">
                  <Skeleton className="h-4 w-4 rounded mx-auto" />
                </th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-3.5 px-4 text-center w-36"><Skeleton className="h-4 w-16 mx-auto" /></th>
                <th className="py-3.5 px-4"><Skeleton className="h-4 w-16" /></th>
                <th className="py-3.5 px-4 text-center w-28"><Skeleton className="h-4 w-12 mx-auto" /></th>
                <th className="py-3.5 px-4 text-right pr-6 w-36"><Skeleton className="h-4 w-20 ml-auto" /></th>
                <th className="py-3.5 px-4 text-center w-28"><Skeleton className="h-4 w-14 mx-auto" /></th>
                <th className="py-3.5 px-4 text-center w-24"><Skeleton className="h-4 w-14 mx-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-divider">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-4 px-5 text-center">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-6" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Skeleton className="h-4 w-8 mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-right pr-6">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Skeleton className="h-5 w-16 rounded-full mx-auto" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Skeleton className="h-7 w-7 rounded-lg" />
                      <Skeleton className="h-7 w-7 rounded-lg" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 px-6 border-t border-border-divider flex flex-col sm:flex-row gap-4 items-center justify-between bg-gray-50/5">
          <Skeleton className="h-4.5 w-48" />
          <Skeleton className="h-8 w-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
