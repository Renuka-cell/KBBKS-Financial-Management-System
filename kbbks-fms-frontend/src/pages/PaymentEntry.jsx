import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import LogoSelect from '../components/LogoSelect';
import SubmitButton from '../components/SubmitButton';
import { addPayment } from '../services/payment.service';
import { useData } from '../contexts/DataContext';
import { useDarkMode } from '../contexts/DarkModeContext';

function PaymentEntry() {
  const { bills, loadingBills, billError, fetchBills } = useData();
  const { isDarkMode } = useDarkMode();
  const [formData, setFormData] = useState({
    bill_id: '',
    amount_paid: '',
    payment_date: '',
    payment_mode: '',
    reference_no: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(billError);
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

  useEffect(() => {
    fetchBills({ pendingOnly: true });
  }, []);

  const validateFields = () => {
    const newErrors = {};
    
    if (!formData.bill_id) {
      newErrors.bill_id = 'Bill selection is required';
    }
    
    if (!formData.payment_date) {
      newErrors.payment_date = 'Payment date is required';
    }
    
    if (!formData.amount_paid || parseFloat(formData.amount_paid) <= 0) {
      newErrors.amount_paid = 'Amount paid must be greater than 0';
    }
    
    if (!formData.payment_mode) {
      newErrors.payment_mode = 'Payment mode is required';
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
      const response = await addPayment({
        bill_id: parseInt(formData.bill_id),
        amount_paid: parseFloat(formData.amount_paid),
        payment_date: formData.payment_date,
        payment_mode: formData.payment_mode,
        reference_no: formData.reference_no || null,
      });

      setSuccess('Payment saved successfully!');
      setFormData({
        bill_id: '',
        amount_paid: '',
        payment_date: '',
        payment_mode: '',
        reference_no: '',
      });
      setErrors({});
      // Refresh bills list
      fetchBills({ pendingOnly: true });
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save payment. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const billOptions = [
    { value: '', label: 'Select Bill', logo: null },
    ...bills.map(b => ({ value: b.bill_id, label: `Bill #${b.bill_number} - ₹${b.bill_amount}`, logo: b.vendor_logo }))
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
        <h2>Payment Entry</h2>
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
        <h3>Record Payment</h3>

        {loadingBills ? (
          <div style={isDarkMode ? styles.loadingFieldDark : styles.loadingField}>
            <div style={isDarkMode ? styles.spinnerDark : styles.spinner}></div>
            <span>Loading bills...</span>
          </div>
        ) : (
          <LogoSelect
            name="bill_id"
            value={formData.bill_id}
            onChange={handleChange}
            options={billOptions}
            placeholder="Select Bill"
          />
        )}

        <FormInput
          label="Payment Mode *"
          type="select"
          name="payment_mode"
          value={formData.payment_mode}
          onChange={handleChange}
          error={errors.payment_mode}
          options={[
            { value: '', label: 'Select Mode' },
            { value: 'Cash', label: 'Cash' },
            { value: 'Cheque', label: 'Cheque' },
            { value: 'NEFT', label: 'NEFT / Bank Transfer' },
            { value: 'UPI', label: 'UPI Payment' },
          ]}
        />

        {(formData.payment_mode === 'Cheque' || formData.payment_mode === 'NEFT' || formData.payment_mode === 'UPI') && (
          <FormInput
            label="Reference No."
            type="text"
            name="reference_no"
            value={formData.reference_no}
            onChange={handleChange}
            error={errors.reference_no}
            placeholder="Cheque / UTR / Transaction reference"
          />
        )}

        <FormInput
          label="Payment Date *"
          type="date"
          name="payment_date"
          value={formData.payment_date}
          onChange={handleChange}
          error={errors.payment_date}
        />

        <FormInput
          label="Amount Paid *"
          type="number"
          name="amount_paid"
          value={formData.amount_paid}
          onChange={handleChange}
          error={errors.amount_paid}
          placeholder="Enter amount"
          step="0.01"
          min="0.01"
        />

        <SubmitButton
          loading={loading}
          text="Save Payment"
          loadingText="Saving..."
          disabled={loading || loadingBills}
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
}

export default PaymentEntry
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