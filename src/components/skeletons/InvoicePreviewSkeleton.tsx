import React from "react";
import Skeleton from "@/components/ui/Skeleton";

export default function InvoicePreviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3.5 w-32" />
          </div>
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3.5 w-56" />
        </div>

        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Grid columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Main printable Invoice Card (Left side: 8 cols) */}
        <div className="lg:col-span-8 bg-bg-card border border-border-divider rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border-divider pb-8 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-xl" />
                <Skeleton className="h-5 w-28" />
              </div>
              <div className="space-y-2 pt-1">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3.5 w-40" />
                <Skeleton className="h-3.5 w-56" />
              </div>
            </div>

            <div className="text-left sm:text-right space-y-3">
              <Skeleton className="h-5 w-32 sm:ml-auto" />
              <div className="space-y-2 sm:ml-auto">
                <Skeleton className="h-3.5 w-36 sm:ml-auto" />
                <Skeleton className="h-3.5 w-36 sm:ml-auto" />
              </div>
            </div>
          </div>

          {/* Block of addresses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-2">
            {/* Invoice to details */}
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-20 uppercase tracking-widest" />
              <Skeleton className="h-4.5 w-36" />
              <Skeleton className="h-3.5 w-28" />
              <div className="space-y-1.5 pt-1">
                <Skeleton className="h-3.5 w-48" />
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-3.5 w-40" />
              </div>
            </div>

            {/* Bill to details */}
            <div className="space-y-2.5">
              <Skeleton className="h-3 w-16 uppercase tracking-widest" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-3.5 w-20" />
                    <Skeleton className="h-3.5 w-32" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Itemized list of services/products */}
          <div className="border-t border-border-divider/70 pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-divider">
                    <th className="py-2.5 px-2 w-1/4"><Skeleton className="h-3 w-12" /></th>
                    <th className="py-2.5 px-2 w-1/3"><Skeleton className="h-3 w-20" /></th>
                    <th className="py-2.5 px-2 text-right"><Skeleton className="h-3 w-10 ml-auto" /></th>
                    <th className="py-2.5 px-2 text-center"><Skeleton className="h-3 w-8 mx-auto" /></th>
                    <th className="py-2.5 px-2 text-right"><Skeleton className="h-3 w-12 ml-auto" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-divider">
                  {[1, 2, 3].map((r) => (
                    <tr key={r}>
                      <td className="py-4 px-2"><Skeleton className="h-4 w-28" /></td>
                      <td className="py-4 px-2"><Skeleton className="h-3.5 w-40" /></td>
                      <td className="py-4 px-2 text-right"><Skeleton className="h-3.5 w-8 ml-auto" /></td>
                      <td className="py-4 px-2 text-center"><Skeleton className="h-3.5 w-6 mx-auto" /></td>
                      <td className="py-4 px-2 text-right"><Skeleton className="h-4 w-16 ml-auto" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing summarizer totals */}
          <div className="border-t border-border-divider/70 pt-6 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3.5 w-32" />
            </div>

            <div className="w-64 space-y-3 font-sans">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-16" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-10" />
                <Skeleton className="h-3.5 w-8" />
              </div>
              <div className="flex justify-between border-t border-border-divider/80 pt-2 items-center">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>
          </div>

          {/* Note section */}
          <div className="border-t border-border-divider/50 pt-4 p-4 rounded-xl space-y-1.5 bg-bg-app/10">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
        </div>

        {/* Action column (Right side: 4 cols) */}
        <div className="lg:col-span-4 space-y-6 select-none">
          {/* Box of Actions */}
          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3">
            <Skeleton className="h-3.5 w-24 uppercase" />

            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-10 w-full rounded-xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          <div className="bg-bg-card border border-border-divider rounded-2xl p-5 shadow-xs space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-5/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
