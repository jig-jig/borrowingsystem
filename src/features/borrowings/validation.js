export function validateBorrowingForm(data) {
  const errors = {};

  if (!data.item_name || data.item_name.trim().length === 0) {
    errors.item_name = 'Item specific name description is required.';
  }
  
  if (!data.borrower_name || data.borrower_name.trim().length === 0) {
    errors.borrower_name = "Borrower's official identification name is required.";
  }

  if (!data.office_name || data.office_name.trim().length === 0) {
    errors.office_name = 'Target department or corporate office name is required.';
  }

  if (!data.date_borrowed) {
    errors.date_borrowed = 'Lending check-out timestamp is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
