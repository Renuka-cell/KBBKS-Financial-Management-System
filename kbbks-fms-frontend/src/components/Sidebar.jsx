import { useDarkMode } from '../contexts/DarkModeContext'

function Sidebar({ setPage, currentRole }) {
  const { isDarkMode } = useDarkMode()

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
    <div style={isDarkMode ? styles.sidebarDark : styles.sidebar}>
      <ul style={styles.menu}>
        {menuItems
          .filter(item => item.roles.includes(currentRole))
          .map(item => (
            <li key={item.page} onClick={() => setPage(item.page)} style={isDarkMode ? styles.menuItemDark : styles.menuItem}>
              {item.label}
            </li>
          ))}
      </ul>
    </div>
  )
}

const styles = {
  sidebar: {
    width: '260px',
    backgroundColor: '#ffffff',
    padding: '30px 0',
    cursor: 'pointer',
    borderRight: '1px solid #e8e8e8',
    minHeight: 'calc(100vh - 75px)',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
  },
  sidebarDark: {
    width: '260px',
    backgroundColor: '#2d2d2d',
    padding: '30px 0',
    cursor: 'pointer',
    borderRight: '1px solid #444444',
    minHeight: 'calc(100vh - 75px)',
    boxShadow: '2px 0 8px rgba(0, 0, 0, 0.2)',
  },
  menu: {
    listStyle: 'none',
    padding: '0 15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    margin: 0,
  },
  menuItem: {
    padding: '12px 16px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '600',
    textAlign: 'left',
    border: '2px solid transparent',
    color: '#2c3e50',
  },
  menuItemDark: {
    padding: '12px 16px',
    backgroundColor: '#3a3a3a',
    color: '#e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '15px',
    fontWeight: '600',
    textAlign: 'left',
    border: '2px solid transparent',
  }
}

export default Sidebar
