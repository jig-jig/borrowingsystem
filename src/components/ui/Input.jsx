import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">{label}</label>}
      <input 
        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-hidden focus:border-blue-600 text-sm font-medium transition-colors text-gray-900 ${error ? 'border-red-400 focus:border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-semibold">{error}</p>}
    </div>
  );
}
