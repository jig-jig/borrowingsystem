import React, { useState, useEffect } from 'react';
import SummaryStats from './components/SummaryStats';
import BorrowingsTable from './components/BorrowingsTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import BorrowingForm from '../../features/borrowings/components/BorrowingForm';
import ReturnBorrowingModal from '../../features/borrowings/components/ReturnBorrowingModal';
import { useBorrowingsDashboard } from '../../features/borrowings/hooks';

export default function DashboardPage() {
  // 1. Data Hydration & Fetch State Hooks
  const { data, loading, error, refresh } = useBorrowingsDashboard();
  
  // 2. Local State for Reusable Modal Boundaries
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // 3. Automated Initial Ledger Sync
  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased pb-28 md:pb-8">
      
      {/* 🏛️ SYSTEM STICKY HEADER NAVBAR */}
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex justify-between items-center gap-4">
          <div className="min-w-0 flex items-center gap-3 sm:gap-4">
            {/* Replace this monogram with the organization's logo image when ready. */}
            <div
              className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/20"
              aria-label="Borrowing System logo placeholder"
            >
              <span className="font-display text-sm sm:text-base font-bold tracking-tight">BS</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-black tracking-tight text-gray-900 md:text-2xl truncate">BORROWING SYSTEM DASHBOARD</h1>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider hidden sm:block mt-0.5">
              A system developed to record and manage the borrowing of properties from Legislative Department.
            </p>
            </div>
          </div>
          
          {/* Action layout view optimized for Desktop/Tablet displays */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="secondary" 
              onClick={() => setIsReturnModalOpen(true)}
            >
              📷 Scan Return
            </Button>
            <Button 
              variant="primary" 
              onClick={() => setIsBorrowModalOpen(true)}
            >
              ➕ Add Borrow Transaction
            </Button>
          </div>
        </div>
      </header>

      {/* 📊 DYNAMIC CONTENT CANVAS */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8">
        
        {/* Dynamic Context Network Failures Interface */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600 flex items-center justify-between">
            <span>⚠ Connection Alert: {error}</span>
            <button 
              onClick={refresh} 
              className="text-red-700 underline hover:text-red-900 font-bold transition-colors ml-4"
            >
              Force Sync
            </button>
          </div>
        )}

        {/* Dynamic Aggregated Metric Analytics Cards Viewport */}
        <SummaryStats metrics={data.metrics} loading={loading} />

        {/* Operational Records Tracking Ledger Table Viewport */}
        <BorrowingsTable transactions={data.transactions} loading={loading} />

      </main>

      {/* 📱 MOBILE FLOATING DOCK BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-md border-t border-gray-100 p-4 flex gap-3 md:hidden z-40 shadow-xs">
        <button 
          onClick={() => setIsReturnModalOpen(true)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors text-center"
        >
          📷 Scan Return
        </button>
        <button 
          onClick={() => setIsBorrowModalOpen(true)}
          className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors text-center shadow-md shadow-blue-600/10"
        >
          ➕ New Borrow
        </button>
      </div>

      {/* 🔲 MODAL ATOM 1: INPUT DATA MANUAL TRANSACTION FORM */}
      <Modal 
        isOpen={isBorrowModalOpen} 
        onClose={() => setIsBorrowModalOpen(false)}
        title="Add Borrow Transaction"
      >
        <BorrowingForm 
          onSaveSuccess={refresh} 
          onCancel={() => setIsBorrowModalOpen(false)} 
        />
      </Modal>

      {/* 📷 MODAL ATOM 2: HARDWARE CAMERA SCANNED RETURN VIEWFINDER */}
      <ReturnBorrowingModal 
        isOpen={isReturnModalOpen} 
        onClose={() => setIsReturnModalOpen(false)} 
        onRefreshData={refresh} 
      />

    </div>
  );
}
