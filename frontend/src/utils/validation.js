// Validation utilities
export const validateRequired = (value, fieldName) => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required.`;
  }
  return null;
};

export const validateAmount = (value) => {
  if (!value || value <= 0) {
    return 'Amount must be a number greater than 0.';
  }
  return null;
};

export const validateExpenseForm = (formData) => {
  const errors = {};
  const dateError = validateRequired(formData.date, 'Expense date');
  if (dateError) errors.date = dateError;

  const vendorError = validateRequired(formData.vendor, 'Vendor');
  if (vendorError) errors.vendor = vendorError;

  const descError = validateRequired(formData.description, 'Description');
  if (descError) errors.description = descError;

  const amountError = validateAmount(formData.amount);
  if (amountError) errors.amount = amountError;

  return errors;
};

export const validateVendorForm = (formData) => {
  const errors = {};
  const nameError = validateRequired(formData.name, 'Vendor name');
  if (nameError) errors.name = nameError;

  const categoryError = validateRequired(formData.category, 'Category');
  if (categoryError) errors.category = categoryError;

  const contactError = validateRequired(formData.contact, 'Contact');
  if (contactError) errors.contact = contactError;

  return errors;
};

export const validatePaymentForm = (formData) => {
  const errors = {};
  const vendorError = validateRequired(formData.vendor, 'Vendor');
  if (vendorError) errors.vendor = vendorError;

  const refError = validateRequired(formData.billReference, 'Bill reference');
  if (refError) errors.billReference = refError;

  const modeError = validateRequired(formData.paymentMode, 'Payment mode');
  if (modeError) errors.paymentMode = modeError;

  const dateError = validateRequired(formData.paymentDate, 'Payment date');
  if (dateError) errors.paymentDate = dateError;

  const amountError = validateAmount(formData.amountPaid);
  if (amountError) errors.amountPaid = amountError;

  return errors;
};