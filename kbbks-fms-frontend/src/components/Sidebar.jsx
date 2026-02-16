function Sidebar({ setPage, currentRole }) {
  const ROLES = {
    ADMIN: 'Admin',
    ACCOUNTANT: 'Accountant',
    USER: 'User',
    VIEWER: 'Viewer'
  }

  const menuItems = [
    { label: 'Dashboard', page: 'dashboard', roles: [ROLES.ADMIN, ROLES.ACCOUNTANT, ROLES.USER, ROLES.VIEWER] },
    { label: 'Vendor Master', page: 'vendors', roles: [ROLES.ADMIN] },
    { label: 'Expense Entry', page: 'expense', roles: [ROLES.ADMIN, ROLES.ACCOUNTANT] },
    { label: 'Payment Entry', page: 'payment', roles: [ROLES.ADMIN, ROLES.ACCOUNTANT] }
  ]

  return (
    <div style={styles.sidebar}>
      <ul style={styles.menu}>
        {menuItems
          .filter(item => item.roles.includes(currentRole))
          .map(item => (
            <li key={item.page} onClick={() => setPage(item.page)} style={styles.menuItem}>
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '250px',
    backgroundColor: '#ecf0f1',
    padding: '25px 0',
    cursor: 'pointer',
    borderRight: '2px solid #bdc3c7',
    minHeight: 'calc(100vh - 70px)',
  },
  menu: {
    listStyle: 'none',
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    margin: 0,
  },
  menuItem: {
    padding: '12px 16px',
    backgroundColor: '#fff',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '500',
    textAlign: 'left',
    border: '1px solid transparent',
  }
}

export default Sidebar
