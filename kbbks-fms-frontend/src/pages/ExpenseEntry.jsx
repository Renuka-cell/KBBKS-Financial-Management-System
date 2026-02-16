import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { addExpense } from '../services/expense.service';
import { useData } from '../contexts/DataContext';

function ExpenseEntry() {
  const { vendors, loadingVendors, vendorError } = useData();
  const [formData, setFormData] = useState({
    expense_date: '',
    vendor_id: '',
    description: '',
    amount: '',
    category: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(vendorError);
  const [success, setSuccess] = useState(null);

  // Auto-dismiss success message after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Auto-dismiss error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateFields = () => {
    const newErrors = {};
    
    if (!formData.expense_date) {
      newErrors.expense_date = 'Expense date is required';
    }
    
    if (!formData.vendor_id) {
      newErrors.vendor_id = 'Vendor is required';
    }
    
    if (!formData.description || formData.description.trim().length < 3) {
      newErrors.description = 'Description is required and must be at least 3 characters';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.category || formData.category.trim().length < 2) {
      newErrors.category = 'Category is required and must be at least 2 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user edits it
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) {
      setError('Please fix validation errors before submitting');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await addExpense({
        expense_date: formData.expense_date,
        vendor_id: parseInt(formData.vendor_id),
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
      });

      setSuccess('Expense saved successfully!');
      setFormData({
        expense_date: '',
        vendor_id: '',
        description: '',
        amount: '',
        category: '',
      });
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save expense. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const vendorOptions = [
    { value: '', label: 'Select Vendor' },
    ...vendors.map(v => ({ value: v.vendor_id, label: v.vendor_name }))
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Expense Entry</h2>
      </div>

      {/* Messages */}
      {error && (
        <div style={styles.errorAlert}>
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}
      {success && (
        <div style={styles.successAlert}>
          <strong>Success:</strong> {success}
          <button onClick={() => setSuccess(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}

      {/* Form */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h3>New Expense</h3>

        <FormInput
          label="Expense Date *"
          type="date"
          name="expense_date"
          value={formData.expense_date}
          onChange={handleChange}
          error={errors.expense_date}
        />

        {loadingVendors ? (
          <div style={styles.loadingField}>
            <div style={styles.spinner}></div>
            <span>Loading vendors...</span>
          </div>
        ) : (
          <FormInput
            label="Vendor *"
            type="select"
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            error={errors.vendor_id}
            options={vendorOptions}
          />
        )}

        <FormInput
          label="Category *"
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          placeholder="e.g. Stationery, Travel, Office Supplies"
        />

        <FormInput
          label="Description *"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Enter detailed expense description"
        />

        <FormInput
          label="Amount *"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          placeholder="Enter amount"
          step="0.01"
          min="0.01"
        />

        <SubmitButton
          loading={loading}
          text="Save Expense"
          loadingText="Saving..."
          disabled={loading || loadingVendors}
        />
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '0',
    backgroundColor: 'transparent',
    borderRadius: '0',
    maxWidth: '100%',
    margin: '0',
  },
  header: {
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #3498db',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    border: '1px solid #f5c6cb',
    color: '#721c24',
    padding: '14px 20px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  successAlert: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    color: '#155724',
    padding: '14px 20px',
    borderRadius: '6px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0 5px',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  loadingField: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 15px',
    backgroundColor: '#ecf0f1',
    borderRadius: '6px',
    color: '#2c3e50',
    fontSize: '14px',
  },
  spinner: {
    border: '3px solid #ecf0f1',
    borderTop: '3px solid #3498db',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    animation: 'spin 1s linear infinite',
  },
}

export default ExpenseEntry
// Add global CSS animation for spinner
const style = document.createElement('style');
if (!style.textContent.includes('@keyframes spin')) {
  style.innerHTML = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}