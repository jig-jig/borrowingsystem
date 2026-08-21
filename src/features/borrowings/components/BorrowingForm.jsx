import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useCreateBorrowing } from '../hooks';
import { validateBorrowingForm } from '../validation';
import BorrowingDetails from './BorrowingDetails';

export default function BorrowingForm({ onSaveSuccess, onCancel }) {
  const { createTransaction, loading, error: serverError } = useCreateBorrowing();
  const [errors, setErrors] = useState({});
  const [generatedId, setGeneratedId] = useState(null);
  const [borrowerName, setBorrowerName] = useState('');

  const [formData, setFormData] = useState({
    item_name: '',
    borrower_name: '',
    office_name: '',
    date_borrowed: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateBorrowingForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const res = await createTransaction(formData);
    if (res.success) {
      setBorrowerName(formData.borrower_name);
      setGeneratedId(res.transactionId);
      onSaveSuccess(); // Trigger automatic background polling dashboard metrics update
    }
  };

  // Switch to the QR Code screen if a valid Transaction ID is generated
  if (generatedId) {
    return (
      <BorrowingDetails 
        transactionId={generatedId} 
        borrowerName={borrowerName} 
        onClose={onCancel} 
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
          ⚠ {serverError}
        </div>
      )}

      <Input 
        label="Item Specific Name" 
        name="item_name" 
        value={formData.item_name} 
        onChange={handleChange} 
        error={errors.item_name}
        placeholder="e.g., Sony Projector B"
      />

      <Input 
        label="Borrower's Full Name" 
        name="borrower_name" 
        value={formData.borrower_name} 
        onChange={handleChange} 
        error={errors.borrower_name}
        placeholder="e.g., Alex Mercer"
      />

      <Input 
        label="Department / Office" 
        name="office_name" 
        value={formData.office_name} 
        onChange={handleChange} 
        error={errors.office_name}
        placeholder="e.g., Procurement Dept"
      />

      <Input 
        label="Date Borrowed" 
        type="date" 
        name="date_borrowed" 
        value={formData.date_borrowed} 
        onChange={handleChange} 
        error={errors.date_borrowed}
      />

      <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          Save Transaction and Generate QR
        </Button>
      </div>
    </form>
  );
}
