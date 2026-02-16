import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

function MainLayout({ children, setPage, onLogout }) {
  const { user } = useAuth()
  
  const ROLES = {
    ADMIN: 'Admin',
    ACCOUNTANT: 'Accountant',
    USER: 'User',
    VIEWER: 'Viewer'
  }
  
  const currentRole = user?.role || ROLES.USER

  return (
    <div style={styles.container}>
      <Header onLogout={onLogout} currentRole={currentRole} userName={user?.name} />
      <div style={styles.body}>
        <Sidebar setPage={setPage} currentRole={currentRole} />
        <div style={styles.content}>{children}</div>
      </div>
      <Footer />
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8f9fa',
  },
  body: {
    display: 'flex',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: '30px 35px',
    overflow: 'auto',
  },
}

export default MainLayout
