import React from 'react';

export default function Button({ children, variant = 'primary', className = '', loading, ...props }) {
  const baseStyles = "w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 text-center select-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-xs",
    secondary: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700",
    danger: "bg-red-50 hover:bg-red-100 text-red-600"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
}
