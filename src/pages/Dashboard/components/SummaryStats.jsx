import React from 'react';

export default function SummaryStats({ metrics, loading }) {
  // Graceful fallback to zero counts if the server payload is still processing
  const activeCount = metrics?.active ?? 0;
  const returnedCount = metrics?.returned ?? 0;
  const totalBorrowers = metrics?.uniqueBorrowers ?? 0;

  // Reusable skeletal loading element to prevent layout shifting
  const Skeleton = () => (
    <div className="h-8 w-16 bg-gray-100 rounded-md animate-pulse mt-2" />
  );

  return (
    <section className="flex gap-4 overflow-x-auto pb-3 snap-x scrollbar-none md:grid md:grid-cols-3 md:pb-0">
      
      {/* Metrics Card: Items Not Returned */}
      <div className="min-w-[260px] flex-1 snap-start p-6 bg-white border border-gray-200 rounded-xl shadow-xs transition-all duration-200 hover:border-blue-200">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Not Returned</div>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="mt-2 text-3xl font-black text-gray-900 tracking-tight">{activeCount}</div>
        )}
        <div className="mt-1.5 text-xs text-amber-600 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span> 
          Currently Out
        </div>
      </div>

      {/* Metrics Card: Items Returned */}
      <div className="min-w-[260px] flex-1 snap-start p-6 bg-white border border-gray-200 rounded-xl shadow-xs transition-all duration-200 hover:border-blue-200">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Items Returned</div>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="mt-2 text-3xl font-black text-gray-900 tracking-tight">{returnedCount}</div>
        )}
        <div className="mt-1.5 text-xs text-green-600 font-semibold flex items-center gap-1">
          ✓ Total check-ins cleared
        </div>
      </div>

      {/* Metrics Card: Borrower Counts */}
      <div className="min-w-[260px] flex-1 snap-start p-6 bg-white border border-gray-200 rounded-xl shadow-xs transition-all duration-200 hover:border-blue-200">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Borrowers</div>
        {loading ? (
          <Skeleton />
        ) : (
          <div className="mt-2 text-3xl font-black text-gray-900 tracking-tight">{totalBorrowers}</div>
        )}
        <div className="mt-1.5 text-xs text-blue-600 font-semibold flex items-center gap-1">
          👥 Unique departments & personnel
        </div>
      </div>

    </section>
  );
}
