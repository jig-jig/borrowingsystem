import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      {/* Background Mask Click Capture Handler */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Surface Box */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto transform transition-all z-10">
        
        {/* Modal Window Title Header Row */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-medium transition-colors cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Dynamic Inner Form Body Content */}
        <div>{children}</div>

      </div>
    </div>
  );
}
