import { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import VendorMaster from './pages/VendorMaster'
import ExpenseEntry from './pages/ExpenseEntry'
import PaymentEntry from './pages/PaymentEntry'
import Login from './pages/Login'

function AppContent() {
  const { isAuthenticated, user, loading, logout } = useAuth()
  const [page, setPage] = useState('dashboard')

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  function renderPage() {
    if (page === 'dashboard') return <Dashboard />
    if (page === 'vendors') return <VendorMaster />
    if (page === 'expense') return <ExpenseEntry />
    if (page === 'payment') return <PaymentEntry />
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <DataProvider>
      <MainLayout
        setPage={setPage}
        onLogout={logout}
        user={user}
      >
        {renderPage()}
      </MainLayout>
    </DataProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
