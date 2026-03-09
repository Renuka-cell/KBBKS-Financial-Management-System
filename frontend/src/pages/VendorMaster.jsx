import React, { useState, useEffect } from 'react';
import FormInput from '../components/FormInput';
import SubmitButton from '../components/SubmitButton';
import { getVendors, addVendor, editVendor, deleteVendor } from '../services/vendor.service';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useData } from '../contexts/DataContext';
import defaultAvatar from '../pictures/avatardefault_92824.png';

function VendorMaster({ openProfile }) {
  const { isDarkMode } = useDarkMode()
  const { fetchVendors: refreshGlobalVendors } = useData()
  const [formData, setFormData] = useState({
    vendor_name: '',
    contact_person: '',
    phone: '',
    email: '',
  });
  const [logoFile, setLogoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingLogoUrl, setEditingLogoUrl] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

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
    const { name, value, files } = e.target;
    if (name === 'logo' && files) {
      setLogoFile(files[0]);
      return;
    }
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
    setEditingLogoUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      let payload;
      if (logoFile) {
        payload = new FormData();
        Object.entries(formData).forEach(([k,v]) => { if(v !== null && v !== undefined) payload.append(k, v); });
        payload.append('logo', logoFile);
      } else {
        payload = { ...formData };
      }

      if (isEditing && editingId) {
        response = await editVendor(editingId, payload);
        if (response?.status || response?.data) {
          setSuccess('Vendor updated successfully!');
        }
      } else {
        response = await addVendor(payload);
        if (response?.status || response?.data) {
          setSuccess('Vendor added successfully!');
        }
      }

      // Reset form
      setFormData({ vendor_name: '', contact_person: '', phone: '', email: '' });
      setErrors({});
      setIsEditing(false);
      setEditingId(null);
      setEditingLogoUrl(null);

      // Refresh vendor list - both local and global
      await fetchVendors();
      await refreshGlobalVendors();
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
    setEditingLogoUrl(vendor.logo || null);
    setIsEditing(true);
    setEditingId(vendor.vendor_id);
    setError(null);
    setSuccess(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    // nothing additional here
    if (!window.confirm('Are you sure you want to delete this vendor?')) return;

    try {
      setError(null);
      await deleteVendor(id);
      setSuccess('Vendor deleted successfully!');
      await fetchVendors();
      await refreshGlobalVendors();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete vendor. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div style={isDarkMode ? styles.containerDark : styles.container}>
      <div style={isDarkMode ? styles.headerDark : styles.header}>
        <h2>Vendor Master</h2>
        {isEditing && (
          <span style={isDarkMode ? styles.editingLabelDark : styles.editingLabel}>✎ Editing Mode</span>
        )}
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
      <form onSubmit={handleSubmit} style={isDarkMode ? styles.formDark : styles.form}>
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
          label="Logo"
          type="file"
          name="logo"
          onChange={handleChange}
          accept="image/png,image/jpeg"
        />
        {isEditing && editingLogoUrl && (
          <div style={{...styles.editLogoPreviewWrapper, justifyContent:'flex-start', alignItems:'center', background:'#fff', borderRadius:8, minHeight:62, boxShadow:'0 1px 4px rgba(0,0,0,0.07)'}}>
            <img
              src={editingLogoUrl}
              alt="Current logo"
              style={{...styles.editLogoPreview, objectFit:'contain', background:'#fff', display:'block', margin:'0 8px 0 0'}}
            />
            <span style={styles.editLogoLabel}>Current logo</span>
          </div>
        )}

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

        <div style={isDarkMode ? styles.buttonGroupDark : styles.buttonGroup}>
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
              style={isDarkMode ? styles.cancelButtonDark : styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Vendors Table */}
      <div style={isDarkMode ? styles.tableContainerDark : styles.tableContainer}>
        <h3>Vendors List</h3>
        
        {loadingVendors ? (
          <div style={isDarkMode ? styles.loadingContainerDark : styles.loadingContainer}>
            <div style={isDarkMode ? styles.spinnerDark : styles.spinner}></div>
            <p>Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div style={isDarkMode ? styles.emptyStateDark : styles.emptyState}>
            <p>No vendors found</p>
            <small>Start by adding a new vendor using the form above</small>
          </div>
        ) : (
          <div style={isDarkMode ? styles.tableWrapperDark : styles.tableWrapper}>
            <table style={isDarkMode ? styles.tableDark : styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Logo</th>
                  <th style={styles.th}>Vendor Name</th>
                  <th style={styles.th}>Contact Person</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v, idx) => (
                  <tr
                    key={v.vendor_id}
                    onMouseEnter={() => setHoveredRow(v.vendor_id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      ...(hoveredRow === v.vendor_id ? (isDarkMode ? styles.rowHoverDark : styles.rowHover) : {}),
                      ...(idx % 2 === 0 ? (isDarkMode ? styles.rowAltDark : styles.rowAlt) : {})
                    }}
                  >
                    <td style={styles.td}>
                      <div
                        style={isDarkMode ? styles.logoBadgeDark : styles.logoBadge}
                        onClick={() => openProfile(v.vendor_id)}
                        title="View profile"
                      >
                        <img
                          src={v.logo || defaultAvatar}
                          alt=""
                          style={styles.badgeImage}
                          onError={(e) => { e.target.src = defaultAvatar; }}
                        />
                      </div>
                    </td>
                    <td
                      onClick={() => openProfile(v.vendor_id)}
                      style={{ cursor: 'pointer', ...styles.td }}
                    >
                      <strong>{v.vendor_name}</strong>
                    </td>
                    <td style={styles.td}>{v.contact_person || '-'}</td>
                    <td style={styles.td}>{v.phone || '-'}</td>
                    <td style={styles.td}>{v.email || '-'}</td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(v)}
                        style={isDarkMode ? styles.editButtonDark : styles.editButton}
                        title="Edit vendor"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(v.vendor_id)}
                        style={isDarkMode ? styles.deleteButtonDark : styles.deleteButton}
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
  containerDark: {
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
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: 'none',
  },
  headerDark: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: 'none',
    color: '#e0e0e0',
  },
  editingLabel: {
    backgroundColor: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(243, 156, 18, 0.3)',
  },
  editingLabelDark: {
    background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(243, 156, 18, 0.4)',
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
    marginBottom: '35px',
    maxWidth: '100%',
  },
  formDark: {
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    marginBottom: '35px',
    maxWidth: '100%',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
  },
  buttonGroupDark: {
    display: 'flex',
    gap: '15px',
    marginTop: '25px',
  },
  cancelButton: {
    padding: '12px 26px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },
  cancelButtonDark: {
    padding: '12px 26px',
    backgroundColor: '#666666',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
  },
  tableContainer: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
  },
  tableContainerDark: {
    backgroundColor: '#2d2d2d',
    color: '#e0e0e0',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  tableWrapper: {
    overflowX: 'auto',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  tableWrapperDark: {
    overflowX: 'auto',
    backgroundColor: '#2d2d2d',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    minWidth: '600px'
  },
  tableDark: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    minWidth: '600px'
  },
  rowHover: {
    backgroundColor: '#f5f5f5'
  },
  rowHoverDark: {
    backgroundColor: '#393939'
  },
  rowAlt: {
    backgroundColor: '#fafafa'
  },
  rowAltDark: {
    backgroundColor: '#2e2e2e'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    minHeight: '250px',
    color: '#7f8c8d',
  },
  loadingContainerDark: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    minHeight: '250px',
    color: '#999999',
  },
  spinner: {
    border: '4px solid #ecf0f1',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  spinnerDark: {
    border: '4px solid #555555',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px',
    color: '#95a5a6',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontSize: '15px',
  },
  emptyStateDark: {
    textAlign: 'center',
    padding: '60px',
    color: '#777777',
  },
  th: {
    textAlign: 'left',
    padding: '12px 10px',
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  td: {
    padding: '10px 8px',
    verticalAlign: 'middle',
    fontSize: '14px'
  },
  editButton: {
    padding: '10px 18px',
    marginRight: '10px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  editButtonDark: {
    padding: '10px 18px',
    marginRight: '10px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  deleteButton: {
    padding: '10px 18px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  deleteButtonDark: {
    padding: '10px 18px',
    backgroundColor: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(192, 57, 43, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  logoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0',
    borderRadius: '8px',
    width: '50px',
    height: '50px',
    minWidth: '50px',
    textAlign: 'center',
    cursor: 'default',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid rgba(0,0,0,0.1)',
  },
  logoBadgeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '0',
    borderRadius: '8px',
    width: '50px',
    height: '50px',
    minWidth: '50px',
    textAlign: 'center',
    cursor: 'default',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.2)',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  editLogoPreviewWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '8px',
  },
  editLogoPreview: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  editLogoLabel: {
    fontSize: '12px',
    color: '#555',
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