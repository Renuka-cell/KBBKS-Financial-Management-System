import React, { useState, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { getVendorSummary } from '../services/report.service';
import defaultAvatar from '../pictures/avatardefault_92824.png';

function VendorProfile({ vendorId, back }) {
  const { isDarkMode } = useDarkMode();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({ year: '', month: '' });

  useEffect(() => {
    if (vendorId) fetchSummary(filters);
  }, [vendorId, filters]);

  const fetchSummary = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getVendorSummary(vendorId, params);
      const data = res.data.data || res.data;
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load vendor summary');
    } finally {
      setLoading(false);
    }
  };

  if (!vendorId) return <div>Please select a vendor.</div>;

  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let y = 2022; y <= currentYear; y++) yearOptions.push(y);

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    containerDark: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#121212',
      color: '#e0e0e0'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      marginBottom: '20px'
    },
    cardDark: {
      backgroundColor: '#1e1e1e',
      borderRadius: '10px',
      padding: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
      marginBottom: '20px'
    },
    backBtn: {
      marginBottom: '15px',
      padding: '6px 12px',
      cursor: 'pointer',
      border: 'none',
      borderRadius: '4px',
      backgroundColor: '#2196F3',
      color: '#fff',
      fontWeight: '600',
      transition: 'background 0.2s'
    },
    filterRow: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      backgroundColor: '#f3f3f3',
      padding: '10px',
      borderRadius: '6px'
    },
    filterRowDark: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px',
      alignItems: 'center',
      flexWrap: 'wrap',
      backgroundColor: '#1a1a1a',
      padding: '10px',
      borderRadius: '6px'
    },
    select: {
      padding: '6px 8px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minWidth: '100px'
    },
    selectDark: {
      padding: '6px 8px',
      borderRadius: '4px',
      border: '1px solid #444',
      minWidth: '100px',
      backgroundColor: '#2a2a2a',
      color: '#fff'
    },
    statsCard: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '15px',
      marginBottom: '20px'
    },
    statBox: {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      transition: 'transform 0.2s',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    statBoxDark: {
      padding: '15px',
      borderRadius: '8px',
      textAlign: 'center',
      transition: 'transform 0.2s',
      boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
    },
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px'
    },
    trendsContainer: {
      display: 'flex',
      gap: '20px',
      flexWrap: 'wrap'
    },
    trendBox: {
      flex: '1 1 300px',
      backgroundColor: '#fafafa',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
    },
    trendBoxDark: {
      flex: '1 1 300px',
      backgroundColor: '#1f1f1f',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.6)'
    },
    barContainer: {
      height: '12px',
      backgroundColor: '#ddd',
      borderRadius: '6px',
      overflow: 'hidden',
      marginTop: '4px'
    },
    barContainerDark: {
      height: '12px',
      backgroundColor: '#444',
      borderRadius: '6px',
      overflow: 'hidden',
      marginTop: '4px'
    },
    bar: {
      height: '12px',
      borderRadius: '6px'
    }
  };

  return (
    <div style={isDarkMode ? styles.containerDark : styles.container}>
      <button
        onClick={back}
        style={styles.backBtn}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1976D2')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2196F3')}
      >
        ← Back to Vendors
      </button>

      <div style={isDarkMode ? styles.cardDark : styles.card}>
        <h2 style={{ textAlign: 'center' }}>Vendor Financial Profile</h2>

        <div style={isDarkMode ? styles.filterRowDark : styles.filterRow}>
          <label>
            Year:
            <select
              value={filters.year}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  year: e.target.value ? parseInt(e.target.value, 10) : ''
                })
              }
              style={isDarkMode ? styles.selectDark : styles.select}
            >
              <option value="">All</option>
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>

          <label>
            Month:
            <select
              value={filters.month}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  month: e.target.value ? parseInt(e.target.value, 10) : ''
                })
              }
              style={isDarkMode ? styles.selectDark : styles.select}
            >
              <option value="">All</option>
              {[...Array(12).keys()].map((m) => {
                const num = m + 1;
                return (
                  <option key={num} value={num}>
                    {num}
                  </option>
                );
              })}
            </select>
          </label>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summary && (
        <div style={isDarkMode ? styles.cardDark : styles.card}>
          <div style={styles.logoWrapper}>
            <img
              src={
                summary.logo && summary.logo.includes('/uploads/vendor_logos/default.png')
                  ? defaultAvatar
                  : (summary.logo || defaultAvatar)
              }
              alt="Vendor logo"
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
              onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <h3>{summary.vendor_name}</h3>
          </div>

          <div style={styles.statsCard}>
            {[
              { label: 'Total Expense', value: summary.total_expense, color: isDarkMode ? '#3a1f1f' : '#ffebee' },
              { label: 'Total Payment', value: summary.total_payment, color: isDarkMode ? '#1f3a24' : '#e8f5e9' },
              { label: 'Outstanding', value: summary.outstanding_amount, color: isDarkMode ? '#3a2d1f' : '#fff3e0' },
              { label: 'Total Bills', value: summary.total_bills, color: isDarkMode ? '#1f2a3a' : '#e3f2fd' }
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  ...(isDarkMode ? styles.statBoxDark : styles.statBox),
                  backgroundColor: item.color
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                <strong>{item.label}</strong>
                <div>{item.label.includes('Bills') ? item.value : `₹${item.value}`}</div>
              </div>
            ))}
          </div>

          {Array.isArray(summary.bills) && summary.bills.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <h3>Vendor Bills</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Bill No</th>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Date</th>
                      <th style={{ textAlign: 'right', padding: '8px', borderBottom: '1px solid #ccc' }}>Amount</th>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Status</th>
                      <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ccc' }}>Bill File</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.bills.map((bill) => (
                      <tr key={bill.bill_id}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{bill.bill_number}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{bill.bill_date}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right' }}>₹{bill.bill_amount}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{bill.status}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
                          {bill.bill_file_url ? (
                            <a
                              href={bill.bill_file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                padding: '6px 12px',
                                backgroundColor: '#2196F3',
                                color: '#fff',
                                borderRadius: '4px',
                                textDecoration: 'none',
                                fontSize: '13px',
                                fontWeight: 600,
                              }}
                            >
                              View Bill
                            </a>
                          ) : (
                            <span style={{ fontSize: '12px', color: '#777' }}>No file</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VendorProfile;