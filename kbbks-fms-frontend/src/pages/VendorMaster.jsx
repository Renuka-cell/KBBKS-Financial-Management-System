import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { getVendors, addVendor, editVendor, deleteVendor } from '../services/vendor.service';

function VendorMaster() {
  const [formData, setFormData] = useState({
    vendor_name: '',
    contact_person: '',
    phone: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Auto-dismiss messages after 4 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateFields = () => {
    const newErrors = {};

    if (!formData.vendor_name?.trim()) {
      newErrors.vendor_name = 'Vendor name is required';
    } else if (formData.vendor_name.length < 2) {
      newErrors.vendor_name = 'Vendor name must be at least 2 characters';
    }

    if (formData.phone && !/^\d{10,15}$/.test(formData.phone.replace(/\s|-/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCancel = () => {
    setFormData({ vendor_name: '', contact_person: '', phone: '', email: '' });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let response;
      if (isEditing && editingId) {
        response = await editVendor(editingId, formData);
        if (response?.status || response?.data) {
          setSuccess('Vendor updated successfully!');
        }
      } else {
        response = await addVendor(formData);
        if (response?.status || response?.data) {
          setSuccess('Vendor added successfully!');
        }
      }

      // Reset form
      setFormData({ vendor_name: '', contact_person: '', phone: '', email: '' });
      setErrors({});
      setIsEditing(false);
      setEditingId(null);

      // Refresh vendor list
      await fetchVendors();
    } catch (err) {
      console.error('Error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save vendor. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    setLoadingVendors(true);
    setError(null);
    try {
      const res = await getVendors();
      const data = res?.data?.data || res?.data || [];
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load vendors. Please try again.';
      setError(errorMessage);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleEdit = (vendor) => {
    setFormData({
      vendor_name: vendor.vendor_name || '',
      contact_person: vendor.contact_person || '',
      phone: vendor.phone || '',
      email: vendor.email || '',
    });
    setIsEditing(true);
    setEditingId(vendor.vendor_id);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      setError(null);
      await deleteVendor(id);
      setSuccess('Vendor deleted successfully!');
      await fetchVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete vendor. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Vendor Master</h2>
        {isEditing && (
          <span style={styles.editingLabel}>✎ Editing Mode</span>
        )}
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
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{isEditing ? 'Edit Vendor' : 'Add New Vendor'}</h3>

        <FormInput
          label="Vendor Name *"
          type="text"
          name="vendor_name"
          value={formData.vendor_name}
          onChange={handleChange}
          error={errors.vendor_name}
          placeholder="Enter vendor name"
        />

        <FormInput
          label="Contact Person"
          type="text"
          name="contact_person"
          value={formData.contact_person}
          onChange={handleChange}
          placeholder="Enter contact person name"
        />

        <FormInput
          label="Phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="10-15 digit phone number"
        />

        <FormInput
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Enter email address"
        />

        <div style={styles.buttonGroup}>
          <SubmitButton
            loading={loading}
            text={isEditing ? 'Save Changes' : 'Add Vendor'}
            loadingText={isEditing ? 'Saving...' : 'Adding...'}
            disabled={loading}
          />
          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Vendors Table */}
      <div style={styles.tableContainer}>
        <h3>Vendors List</h3>
        
        {loadingVendors ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p>Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div style={styles.emptyState}>
            <p>No vendors found</p>
            <small>Start by adding a new vendor using the form above</small>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Contact Person</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.vendor_id}>
                    <td><strong>{v.vendor_name}</strong></td>
                    <td>{v.contact_person || '-'}</td>
                    <td>{v.phone || '-'}</td>
                    <td>{v.email || '-'}</td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleEdit(v)}
                        style={styles.editButton}
                        title="Edit vendor"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.vendor_id)}
                        style={styles.deleteButton}
                        title="Delete vendor"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
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
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '2px solid #3498db',
  },
  editingLabel: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px 18px',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
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
    marginBottom: '35px',
    maxWidth: '100%',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '18px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px',
    minHeight: '250px',
    color: '#7f8c8d',
  },
  spinner: {
    border: '4px solid #ecf0f1',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '45px',
    height: '45px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '50px',
    color: '#95a5a6',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '15px',
  },
  editButton: {
    padding: '8px 14px',
    marginRight: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  deleteButton: {
    padding: '8px 14px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
}

export default VendorMaster

// Add global CSS animation for spinner
const style = document.createElement('style');
style.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);