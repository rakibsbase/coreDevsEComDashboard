import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function CustomerDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-divider/50 pb-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3.5 w-64" />
        </div>

        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Customer Profile Cards */}
        <div className="lg:col-span-4 space-y-6">
          {/* Main info profile block inside card */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-6 shadow-xs relative text-center">
            <div className="flex flex-col items-center">
              <Skeleton className="w-20 h-20 rounded-2xl" />
              <Skeleton className="h-5 w-36 mt-4" />
              <Skeleton className="h-5 w-28 mt-2 rounded-full" />
            </div>

            {/* Quick mini-metrics grid of orders and spent */}
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

            {/* Detailed Parameters container info list */}
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

              {/* Left Column interactive triggers below details */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border-divider/30">
                <Skeleton className="h-[38px] w-full rounded-xl" />
                <Skeleton className="h-[38px] w-full rounded-xl" />
              </div>
            </div>
          </div>

          {/* Premium banner upgrade container widget */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs relative overflow-hidden h-[162px]">
            <Skeleton className="h-4 w-28 rounded-full mb-2" />
            <Skeleton className="h-4.5 w-36 mb-1.5" />
            <Skeleton className="h-3 w-full mb-3" />
            <Skeleton className="h-7 w-28 rounded-lg" />
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive multi-tabs viewport */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Tabs navigation array container */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-1.5 shadow-xs flex flex-wrap gap-1">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-28 rounded-xl" />
            ))}
          </div>

          {/* Render Active View tab elements */}
          <div className="flex-1 space-y-6">
            {/* BENTO GRID (4 metric cells) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs flex items-center gap-4 h-[102px]">
                  <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>

            {/* MAIN SUB-TABLE: Orders history list */}
            <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-border-divider flex flex-col sm:flex-row items-center justify-between gap-3 bg-gray-55/10">
                <Skeleton className="h-4.5 w-32" />
                <Skeleton className="h-8.5 w-full sm:w-60 rounded-lg" />
              </div>

              {/* Sub-table elements */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-divider bg-gray-55/5">
                      <th className="py-3 px-5 text-center w-24"><Skeleton className="h-4 w-12 mx-auto" /></th>
                      <th className="py-3 px-4"><Skeleton className="h-4 w-10" /></th>
                      <th className="py-3 px-4 text-center w-36"><Skeleton className="h-4 w-12 mx-auto" /></th>
                      <th className="py-3 px-4 text-right w-28"><Skeleton className="h-4 w-14 ml-auto" /></th>
                      <th className="py-3 px-4 text-center w-20"><Skeleton className="h-4 w-10 mx-auto" /></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-divider">
                    {[1, 2, 3, 4].map((idx) => (
                      <tr key={idx}>
                        <td className="py-3.5 px-5 text-center">
                          <Skeleton className="h-4 w-14 mx-auto font-mono" />
                        </td>
                        <td className="py-3.5 px-4">
                          <Skeleton className="h-4 w-20" />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Skeleton className="h-5 w-24 rounded-full mx-auto" />
                        </td>
                        <td className="py-3.5 px-4 text-right pr-6">
                          <Skeleton className="h-4 w-16 ml-auto font-mono" />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <Skeleton className="h-7 w-7 rounded-lg mx-auto" />
                        </td>
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
