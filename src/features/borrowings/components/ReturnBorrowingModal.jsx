import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Button from '../../../components/ui/Button';
import { apiClient } from '../../../lib/apiClient';

export default function ReturnBorrowingModal({ isOpen, onClose, onRefreshData }) {
  const scannerRef = useRef(null);
  const uploadInputRef = useRef(null);
  const html5QrcodeScanner = useRef(null);
  
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Configuration for mobile-first scanning performance
  const scannerConfig = {
    fps: 15,
    qrbox: (width, height) => {
      // Makes the scan target box highly optimized and square on mobile devices
      const minDimension = Math.min(width, height);
      const size = Math.floor(minDimension * 0.65);
      return { width: size, height: size };
    },
    aspectRatio: 1.0
  };

  useEffect(() => {
    // Only spin up the camera engine when the modal drops into view
    if (isOpen && scannerRef.current) {
      startScanner();
    }

    // Crucial: Kill camera resources when the component collapses or unmounts
    return () => {
      stopScanner();
    };
  }, [isOpen]);

  const startScanner = async () => {
    setError(null);
    setSuccessMsg(null);
    
    try {
      html5QrcodeScanner.current = new Html5Qrcode(scannerRef.current.id);
      
      await html5QrcodeScanner.current.start(
        { facingMode: "environment" }, // Automatically prioritizes the back camera on mobile phones
        scannerConfig,
        onScanSuccess,
        onScanFailure
      );
      setCameraActive(true);
    } catch (err) {
      console.error("Camera access failed", err);
      setError("Unable to access camera. Please ensure permissions are granted and you are using HTTPS.");
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeScanner.current && html5QrcodeScanner.current.isScanning) {
      try {
        await html5QrcodeScanner.current.stop();
        html5QrcodeScanner.current = null;
        setCameraActive(false);
      } catch (err) {
        console.error("Failed to safely release camera thread", err);
      }
    }
  };

  const onScanSuccess = async (decodedText) => {
    // Stop scanning instantly upon discovery to prevent duplicate server hits
    await stopScanner();
    await processDecodedTransaction(decodedText);
  };

  const processDecodedTransaction = async (decodedText) => {
    setLoading(true);
    setError(null);

    try {
      const qrValue = decodedText.trim();
      let transactionId = qrValue;

      // Safe Check: Extract ID if the QR was packaged as a JSON string template
      if (qrValue.startsWith('{')) {
        const parsed = JSON.parse(qrValue);
        transactionId = parsed.transactionId ?? parsed.id;
      }

      if (!/^\d+$/.test(String(transactionId).trim())) {
        throw new Error("The QR code does not contain a valid transaction ID.");
      }

      await apiClient.post(`/borrowings/${encodeURIComponent(String(transactionId).trim())}/return`);
      setSuccessMsg("Item checked in successfully! Inventory status updated.");
      onRefreshData(); // Instantly updates your DashboardTable metrics metrics array
    } catch (err) {
      setError(err.message || "Invalid transaction voucher code scanned.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadClick = () => {
    uploadInputRef.current?.click();
  };

  const handleQrUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || loading) return;

    await stopScanner();
    setUploading(true);
    setError(null);
    setSuccessMsg(null);

    let decodedText;

    try {
      const scanner = new Html5Qrcode(scannerRef.current.id);
      html5QrcodeScanner.current = scanner;
      decodedText = await scanner.scanFile(file, true);
    } catch (err) {
      setError("Unable to read a QR code from that image. Please upload a clear QR image.");
      return;
    } finally {
      html5QrcodeScanner.current = null;
      setUploading(false);
    }

    await processDecodedTransaction(decodedText);
  };

  const onScanFailure = (error) => {
    // Quietly monitor target frame passes without flooding the console log stream
  };

  const handleManualClose = async () => {
    await stopScanner();
    setError(null);
    setSuccessMsg(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-xl border border-gray-100 max-h-[95vh] flex flex-col transform transition-all">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-black text-gray-900">📷 Scan Item Return</h3>
          <button 
            onClick={handleManualClose} 
            className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-700 text-xl font-medium transition-colors"
          >
            ×
          </button>
        </div>

        {/* FEEDBACK STATUS ALERTS */}
        {error && (
          <div className="mb-4 p-3.5 bg-red-50 text-red-600 rounded-xl text-xs font-semibold border border-red-100">
            ⚠ {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-4 p-3.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold border border-green-100 flex items-center gap-2">
            ✓ {successMsg}
          </div>
        )}

        {/* CAMERA SCANNING VIEWFINDER TARGET CONTAINER */}
        <div className="relative w-full aspect-square bg-gray-900 rounded-2xl overflow-hidden shadow-inner border border-gray-100 flex flex-col items-center justify-center">
          
          {/* Native HTML Video Element Mount Point */}
          <div id="return-qr-reader" ref={scannerRef} className="w-full h-full" />

          {/* Custom Stylized Scanning Overlay Overlay Viewport HUD */}
          {cameraActive && !successMsg && !loading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[65%] h-[65%] border-2 border-dashed border-blue-500 rounded-xl animate-pulse flex items-center justify-center bg-black/10">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>
            </div>
          )}

          {/* Loader Overlay State Spinner Block */}
          {loading && (
            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-600 border-t-transparent" />
              <p className="text-xs font-bold text-gray-500">Updating Database...</p>
            </div>
          )}

          {/* Idle State / Camera Dropped Anchor Message */}
          {!cameraActive && !loading && !successMsg && !uploading && (
            <div className="text-center px-6 space-y-2">
              <p className="text-sm font-semibold text-gray-400">Camera Feed Suspended</p>
              <Button variant="primary" onClick={startScanner}>Initialize Viewfinder</Button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleUploadClick}
            loading={uploading}
          >
            Upload QR Image
          </Button>
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            onChange={handleQrUpload}
            className="hidden"
          />
        </div>

        {/* GUIDANCE MESSAGE FOOTER */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400 leading-relaxed px-4">
            Align the recipient's transaction passport QR code cleanly within the viewfinder window guidelines to process automatic collection entry.
          </p>
          
          {successMsg && (
            <Button 
              variant="primary" 
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700" 
              onClick={handleManualClose}
            >
              Close
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}
