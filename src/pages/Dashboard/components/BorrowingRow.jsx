import React from 'react';

export default function BorrowingRow({ transaction }) {
  const { item_name, office_name, borrower_name, date_borrowed, date_returned } = transaction;

  // Simple localized helper to standardize time visualization arrays smoothly
  const formatTimestamp = (isoString) => {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isReturned = !!date_returned;

  return (
    <tr className="hover:bg-gray-50/40 transition-colors duration-150">
      {/* Column: Item Name Specific description */}
      <td className="px-6 py-4 font-semibold text-gray-900">{item_name}</td>
      
      {/* Column: Office / Corporate Department name layout anchor */}
      <td className="px-6 py-4 text-gray-600 font-medium">{office_name}</td>
      
      {/* Column: Borrower Name handle */}
      <td className="px-6 py-4 text-gray-500">{borrower_name}</td>
      
      {/* Column: Checkout historical validation timestamp */}
      <td className="px-6 py-4 text-xs font-medium text-gray-400">
        {formatTimestamp(date_borrowed)}
      </td>
      
      {/* Column: Visual Status Token Badge UI element */}
      <td className="px-6 py-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide transition-colors ${
          isReturned 
            ? 'bg-green-50 text-green-700 border border-green-100' 
            : 'bg-amber-50 text-amber-700 border border-amber-100'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isReturned ? 'bg-green-500' : 'bg-amber-500'}`} />
          {isReturned ? 'Returned' : 'Borrowed'}
        </span>
      </td>
      
      {/* Column: Returns logging verification block */}
      <td className={`px-6 py-4 text-xs font-mono font-medium ${isReturned ? 'text-gray-500' : 'text-gray-300'}`}>
        {formatTimestamp(date_returned)}
      </td>
    </tr>
  );
}
