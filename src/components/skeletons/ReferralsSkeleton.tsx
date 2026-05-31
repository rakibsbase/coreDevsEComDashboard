import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function ReferralsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-bg-card rounded-2xl border border-border-divider p-5 flex items-center justify-between shadow-xs h-[88px]">
            <div className="space-y-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-3.5 w-24" />
            </div>
            <Skeleton className="h-11 w-11 rounded-2xl" />
          </div>
        ))}
      </div>

      {/* Invite Friends Block */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card: Copy Referral Link */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs flex flex-col justify-between h-[216px]">
          <div className="space-y-2">
            <Skeleton className="h-4.5 w-32" />
            <Skeleton className="h-3.5 w-full" />
          </div>

          <div className="my-4">
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>

        {/* Right Card: Quick Campaign Analytics */}
        <div className="bg-bg-card rounded-2xl border border-border-divider p-6 shadow-xs flex flex-col justify-between h-[216px]">
          <div className="space-y-2">
            <Skeleton className="h-4.5 w-36" />
            <Skeleton className="h-3.5 w-full" />
          </div>

          <div className="space-y-3 my-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>

          <Skeleton className="h-[38px] w-full rounded-xl" />
        </div>
      </div>

      {/* Referred Users Table */}
      <div className="bg-bg-card rounded-2xl border border-border-divider shadow-xs overflow-hidden">
        <div className="p-6 border-b border-border-divider flex items-center justify-between">
          <Skeleton className="h-4.5 w-28" />
          <Skeleton className="h-6 w-24 rounded-xl" />
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-divider bg-gray-55/20">
                <th className="py-3 px-6 w-10">
                  <Skeleton className="h-4 w-4 rounded mx-auto" />
                </th>
                <th className="py-3 px-4"><Skeleton className="h-4 w-10" /></th>
                <th className="py-3 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3 px-4"><Skeleton className="h-4 w-20" /></th>
                <th className="py-3 px-4 text-center"><Skeleton className="h-4 w-14 mx-auto" /></th>
                <th className="py-3 px-4"><Skeleton className="h-4 w-12" /></th>
                <th className="py-3 px-6 text-right"><Skeleton className="h-4 w-20 ml-auto" /></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50/80">
              {[1, 2, 3, 4, 5].map((idx) => (
                <tr key={idx}>
                  <td className="py-3.5 px-6">
                    <Skeleton className="h-4 w-4 rounded mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4.5 w-20" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Skeleton className="h-4.5 w-12 mx-auto" />
                  </td>
                  <td className="py-3.5 px-4">
                    <Skeleton className="h-5 w-16 rounded-md" />
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <Skeleton className="h-4.5 w-16 ml-auto" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 px-6 border-t border-border-divider flex items-center justify-between">
          <Skeleton className="h-4.5 w-48" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
