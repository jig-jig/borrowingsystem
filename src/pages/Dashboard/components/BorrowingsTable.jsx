import React from 'react';
import BorrowingRow from './BorrowingRow';
import EmptyState from '../../../components/ui/EmptyState';

export default function BorrowingsTable({ transactions, loading }) {
  return (
    <section className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
      
      {/* Table Header Section Banner */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
        <h2 className="text-sm font-bold text-gray-800 tracking-tight">BORROWING TRANSACTIONS TABLE</h2>
        <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
          Live Connection
        </span>
      </div>

      {/* Responsive Structural Scrolling Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-400 text-[11px] font-bold uppercase tracking-wider">
              <th className="px-6 py-3.5">Property Name</th>
              <th className="px-6 py-3.5">Office / Department</th>
              <th className="px-6 py-3.5">Borrower Name</th>
              <th className="px-6 py-3.5">Date Borrowed</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5">Date Returned</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-100 text-sm">
            {loading && transactions.length === 0 ? (
              // Simple inline row loader state
              <tr>
                <td colSpan="6" className="text-center py-12 text-xs font-semibold text-gray-400">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent mr-2 align-middle" />
                  Synchronizing record...
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              // Empty database handler hook layout
              <tr>
                <td colSpan="6" className="py-12">
                  <EmptyState message="No borrowing records found inside the current ledger partition." />
                </td>
              </tr>
            ) : (
              // Active map runtime iterator loop
              transactions.map((tx) => (
                <BorrowingRow key={tx.id} transaction={tx} />
              ))
            )}
          </tbody>
        </table>
      </div>
      
    </section>
  );
}
