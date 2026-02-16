import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { addPayment } from '../services/payment.service';
import { useData } from '../contexts/DataContext';

function PaymentEntry() {
  const { bills, loadingBills, billError, fetchBills } = useData();
  const [formData, setFormData] = useState({
    bill_id: '',
    amount_paid: '',
    payment_date: '',
    payment_mode: '',
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
    fetchBills();
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
      });

      setSuccess('Payment saved successfully!');
      setFormData({
        bill_id: '',
        amount_paid: '',
        payment_date: '',
        payment_mode: '',
      });
      setErrors({});
      // Refresh bills list
      fetchBills();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save payment. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const billOptions = [
    { value: '', label: 'Select Bill' },
    ...bills.map(b => ({ value: b.bill_id, label: `Bill #${b.bill_number} - ₹${b.bill_amount}` }))
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Payment Entry</h2>
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
        <h3>Record Payment</h3>

        {loadingBills ? (
          <div style={styles.loadingField}>
            <div style={styles.spinner}></div>
            <span>Loading bills...</span>
          </div>
        ) : (
          <FormInput
            label="Bill Reference *"
            type="select"
            name="bill_id"
            value={formData.bill_id}
            onChange={handleChange}
            error={errors.bill_id}
            options={billOptions}
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
            { value: 'NEFT', label: 'NEFT / Bank Transfer' }
          ]}
        />

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