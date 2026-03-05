import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import LogoSelect from '../components/LogoSelect';
import SubmitButton from '../components/SubmitButton';
import { addExpense } from '../services/expense.service';
import { useData } from '../contexts/DataContext';
import { useDarkMode } from '../contexts/DarkModeContext';

function ExpenseEntry() {
  const { vendors, loadingVendors, vendorError } = useData();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    expense_date: '',
    vendor_id: '',
    description: '',
    amount: '',
    category: '',
    category_other: '',
  });
  const [billFile, setBillFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(vendorError);
  const [success, setSuccess] = useState(null);

  const CATEGORY_OTHER_VALUE = '__OTHER__';
  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'Stationery', label: 'Stationery' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Rent', label: 'Rent' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Fuel', label: 'Fuel' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Salaries', label: 'Salaries' },
    { value: 'Food & Refreshments', label: 'Food & Refreshments' },
    { value: 'Software & Subscriptions', label: 'Software & Subscriptions' },
    { value: CATEGORY_OTHER_VALUE, label: 'Other' },
  ];

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
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    } else if (formData.category === CATEGORY_OTHER_VALUE) {
      if (!formData.category_other || formData.category_other.trim().length < 2) {
        newErrors.category_other = 'Please enter a valid category (min 2 characters)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // If user switches away from "Other", clear the custom category field
    if (name === 'category' && value !== CATEGORY_OTHER_VALUE) {
      setFormData({ ...formData, category: value, category_other: '' });
      if (errors.category_other) {
        setErrors({ ...errors, category_other: null });
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user edits it
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleBillFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setBillFile(file);
    if (errors.bill_file) {
      setErrors({ ...errors, bill_file: null });
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
      const finalCategory =
        formData.category === CATEGORY_OTHER_VALUE
          ? (formData.category_other || '').trim()
          : formData.category;

      const payload = {
        expense_date: formData.expense_date,
        vendor_id: parseInt(formData.vendor_id),
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: finalCategory,
      };

      const response = await addExpense(payload, billFile);

      setSuccess('Expense saved successfully!');
      setFormData({
        expense_date: '',
        vendor_id: '',
        description: '',
        amount: '',
        category: '',
        category_other: '',
      });
      setBillFile(null);
      setErrors({});
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save expense. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const vendorOptions = [
    { value: '', label: 'Select Vendor', logo: null },
    ...vendors.map(v => ({ value: v.vendor_id, label: v.vendor_name, logo: v.logo }))
  ];

  const logoStyles = {
    logoPreviewWrapper: {
      marginTop: '8px',
    },
    logoPreview: {
      width: '40px',
      height: '40px',
      objectFit: 'cover',
      borderRadius: '4px',
      border: '1px solid #ccc'
    }
  };

  return (
    <div style={isDarkMode ? styles.containerDark : styles.container}>
      <div style={isDarkMode ? styles.headerDark : styles.header}>
        <h2>Expense Entry</h2>
      </div>

      {/* Messages */}
      {error && (
        <div style={isDarkMode ? styles.errorAlertDark : styles.errorAlert}>
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}
      {success && (
        <div style={isDarkMode ? styles.successAlertDark : styles.successAlert}>
          <strong>Success:</strong> {success}
          <button onClick={() => setSuccess(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}

      {/* Form */}
      <form style={isDarkMode ? styles.formDark : styles.form} onSubmit={handleSubmit}>
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
          <div style={isDarkMode ? styles.loadingFieldDark : styles.loadingField}>
            <div style={isDarkMode ? styles.spinnerDark : styles.spinner}></div>
            <span>Loading vendors...</span>
          </div>
        ) : (
          <LogoSelect
            name="vendor_id"
            value={formData.vendor_id}
            onChange={handleChange}
            options={vendorOptions}
            placeholder="Select Vendor"
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={isDarkMode ? { color: '#e0e0e0', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' } : { color: '#2c3e50', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase' }}>
            Upload Bill (Image/PDF, max 2MB)
          </label>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleBillFileChange}
            style={isDarkMode ? styles.fileInputDark : styles.fileInput}
          />
          {errors.bill_file && (
            <p style={isDarkMode ? styles.errorDark : styles.error}>{errors.bill_file}</p>
          )}
        </div>

        <FormInput
          label="Category *"
          type="select"
          name="category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          options={categoryOptions}
        />

        {formData.category === CATEGORY_OTHER_VALUE && (
          <FormInput
            label="Other Category *"
            type="text"
            name="category_other"
            value={formData.category_other}
            onChange={handleChange}
            error={errors.category_other}
            placeholder="Enter category"
          />
        )}

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
  containerDark: {
    padding: '0',
    backgroundColor: 'transparent',
    borderRadius: '0',
    maxWidth: '100%',
    margin: '0',
  },
  header: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: 'none',
  },
  headerDark: {
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: 'none',
    color: '#e0e0e0',
  },
  errorAlert: {
    backgroundColor: '#fee',
    border: 'none',
    borderLeft: '5px solid #e74c3c',
    color: '#c0392b',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    animation: 'slideIn 0.3s ease',
  },
  errorAlertDark: {
    backgroundColor: '#3a1f1f',
    border: 'none',
    borderLeft: '5px solid #e74c3c',
    color: '#ff9a9a',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    animation: 'slideIn 0.3s ease',
  },
  successAlert: {
    backgroundColor: '#efe',
    border: 'none',
    borderLeft: '5px solid #27ae60',
    color: '#1e8449',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    animation: 'slideIn 0.3s ease',
  },
  successAlertDark: {
    backgroundColor: '#1f3a1f',
    border: 'none',
    borderLeft: '5px solid #27ae60',
    color: '#7aff7a',
    padding: '16px 20px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    animation: 'slideIn 0.3s ease',
  },
  closeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: 'inherit',
    padding: '0 5px',
    fontWeight: 'bold',
  },
  form: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formDark: {
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  loadingField: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    color: '#2c3e50',
    fontSize: '14px',
    border: '2px solid #e8e8e8',
  },
  loadingFieldDark: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 18px',
    backgroundColor: '#3a3a3a',
    borderRadius: '8px',
    color: '#e0e0e0',
    fontSize: '14px',
    border: '2px solid #555555',
  },
  spinner: {
    border: '3px solid #e8e8e8',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 1s linear infinite',
  },
  spinnerDark: {
    border: '3px solid #555555',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    animation: 'spin 1s linear infinite',
  },
  logoPreviewWrapper: {
    marginTop: '8px',
  },
  logoPreview: {
    width: '40px',
    height: '40px',
    objectFit: 'cover',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  fileInput: {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #e0e0e0',
    fontSize: '14px',
  },
  fileInputDark: {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid #555555',
    fontSize: '14px',
    backgroundColor: '#3a3a3a',
    color: '#e0e0e0',
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