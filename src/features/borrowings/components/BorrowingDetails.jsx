import React from "react";
import { QRCodeSVG } from "qrcode.react";
import Button from "../../../components/ui/Button";

export default function BorrowingDetails({
  transactionId,
  borrowerName,
  onClose,
}) {
  return (
    <div className="flex flex-col items-center text-center py-2 animate-fade-in">
      <span className="px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-xs font-bold rounded-full mb-5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Transaction Saved Successfully
      </span>

      {/* High contrast, scannable QR footprint layout */}
      <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-inner mb-4">
        <QRCodeSVG
          value={String(transactionId)} // Encodes the unique primary key serial integer
          size={210}
          level="M"
          includeMargin={true}
        />
      </div>

      <p className="text-xs text-gray-500 leading-relaxed px-2 mb-2">
        Forward this custom qr receipt to{" "}
        <strong className="text-gray-800">{borrowerName}</strong>. They must
        present this qr code to complete the return process.
      </p>

      <Button
        variant="primary"
        className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
}
