import { useState } from 'react'
import { useAuth, AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { DarkModeProvider } from './contexts/DarkModeContext'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import VendorMaster from './pages/VendorMaster'
import VendorProfile from './pages/VendorProfile'
import ExpenseEntry from './pages/ExpenseEntry'
import PaymentEntry from './pages/PaymentEntry'
import Login from './pages/Login'

function AppContent() {
  const { isAuthenticated, user, loading, logout } = useAuth()
  const [page, setPage] = useState('dashboard')
  const [selectedVendor, setSelectedVendor] = useState(null)

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
  }

  function renderPage() {
    if (page === 'dashboard') return <Dashboard />
    if (page === 'vendors') return <VendorMaster openProfile={(id) => { setSelectedVendor(id); setPage('vendor-profile'); }} />
    if (page === 'vendor-profile') return <VendorProfile vendorId={selectedVendor} back={() => setPage('vendors')} />
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
    <DarkModeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </DarkModeProvider>
  )
}

export default App
