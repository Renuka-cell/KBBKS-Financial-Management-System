function Header({ onLogout, currentRole, userName }) {
  return (
    <div style={styles.header}>
      <h3>KBBKS – FMS</h3>
      <div style={styles.rightSection}>
        <span style={styles.userInfo}>{userName} • {currentRole}</span>
        <button onClick={onLogout} style={styles.logoutButton}>Logout</button>
      </div>
    </div>
  )
}

const styles = {
  header: {
    height: '70px',
    backgroundColor: '#2c3e50',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    borderBottom: '3px solid #3498db',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    color: '#ecf0f1',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '25px',
    fontSize: '14px',
    color: '#ecf0f1',
  },
  userInfo: {
    fontSize: '14px',
    color: '#ecf0f1',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '8px 16px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
  },
}

export default Header
