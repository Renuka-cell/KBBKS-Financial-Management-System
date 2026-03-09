import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDarkMode } from '../contexts/DarkModeContext'
import { loginUser, registerUser } from '../services/auth.service'

function Login() {
  const { login } = useAuth()
  const { isDarkMode } = useDarkMode()
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Login form
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Register form
  const [name, setName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [role, setRole] = useState('Accountant')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await loginUser(email, password)
      
      if (response.status) {
        login(
          {
            user_id: response.user_id,
            name: response.name,
            email: email,
            role: response.role
          },
          response.token
        )
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!name || !registerEmail || !registerPassword) {
      setError('All fields are required')
      return
    }

    setLoading(true)

    try {
      const response = await registerUser({
        name,
        email: registerEmail,
        password: registerPassword,
        role
      })

      if (response.status) {
        setError('')
        setName('')
        setRegisterEmail('')
        setRegisterPassword('')
        setRole('Accountant')
        setIsRegistering(false)
        setError('User registered successfully! You can now login.')
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={isDarkMode ? styles.containerDark : styles.container}>
      <div style={styles.background}></div>
      
      <div style={styles.contentWrapper}>
        {/* Left Side - Branding */}
        <div style={isDarkMode ? styles.brandingAreaDark : styles.brandingArea}>
          <div style={styles.brandingContent}>
            <div style={styles.logo}>🎯</div>
            <h1 style={styles.brandingTitle}>KBBKS</h1>
            <p style={styles.brandingSubtitle}>Financial Management</p>
            <p style={styles.brandingDescription}>Streamlined Financial Operations for NGOs</p>
            
            <div style={styles.features}>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                <span>Easy to use interface</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                <span>Secure & Reliable</span>
              </div>
              <div style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                <span>Real-time reporting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div style={isDarkMode ? styles.formAreaDark : styles.formArea}>
          <div style={isDarkMode ? styles.formContainerDark : styles.formContainer}>
            {error && (
              <div style={error.includes('successfully') ? (isDarkMode ? styles.successDark : styles.success) : (isDarkMode ? styles.errorDark : styles.error)}>
                {error}
              </div>
            )}

            {!isRegistering ? (
              <>
                <h2 style={isDarkMode ? styles.formTitleDark : styles.formTitle}>Welcome Back</h2>
                <p style={isDarkMode ? styles.formSubtitleDark : styles.formSubtitle}>Sign in to your account</p>
                
                <form onSubmit={handleLogin} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>📧 Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={isDarkMode ? styles.inputDark : styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>🔐 Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={isDarkMode ? styles.inputDark : styles.input}
                    />
                  </div>

                  <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? '⏳ Logging in...' : '🚀 Login'}
                  </button>
                </form>

                <div style={isDarkMode ? styles.dividerDark : styles.divider}>
                  <span>Don't have an account?</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  style={isDarkMode ? styles.secondaryButtonDark : styles.secondaryButton}
                >
                  ✍️ Create Account
                </button>

                <div style={isDarkMode ? styles.testUsersDark : styles.testUsers}>
                  <p style={styles.testUsersTitle}>📝 Demo Credentials:</p>
                  <p style={styles.testUserEmail}>admin@test.com</p>
                  <p style={styles.testUserPassword}>password123</p>
                </div>
              </>
            ) : (
              <>
                <h2 style={isDarkMode ? styles.formTitleDark : styles.formTitle}>Create New Account</h2>
                <p style={isDarkMode ? styles.formSubtitleDark : styles.formSubtitle}>Join KBBKS FMS</p>
                
                <form onSubmit={handleRegister} style={styles.form}>
                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>👤 Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={isDarkMode ? styles.inputDark : styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>📧 Email Address</label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      style={isDarkMode ? styles.inputDark : styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>🔐 Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      style={isDarkMode ? styles.inputDark : styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={isDarkMode ? styles.labelDark : styles.label}>💼 Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      style={isDarkMode ? styles.inputDark : styles.input}
                      required
                    >
                      <option value="Admin">👑 Admin</option>
                      <option value="Accountant">📊 Accountant</option>
                      <option value="Viewer">👁️ Viewer</option>
                    </select>
                  </div>

                  <button type="submit" disabled={loading} style={styles.submitButton}>
                    {loading ? '⏳ Creating account...' : '✨ Create Account'}
                  </button>
                </form>

                <div style={isDarkMode ? styles.dividerDark : styles.divider}>
                  <span>Already have an account?</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false)
                    setError('')
                  }}
                  style={isDarkMode ? styles.secondaryButtonDark : styles.secondaryButton}
                >
                  🔓 Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#f8fafc',
    overflow: 'hidden',
    position: 'relative',
  },
  containerDark: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#0f172a',
    overflow: 'hidden',
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1e40af 100%)',
    opacity: 0.05,
    pointerEvents: 'none',
  },
  contentWrapper: {
    display: 'flex',
    width: '100%',
    zIndex: 1,
  },
  brandingArea: {
    flex: 1,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    padding: '40px',
  },
  brandingAreaDark: {
    flex: 1,
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    padding: '40px',
  },
  brandingContent: {
    textAlign: 'center',
    maxWidth: '400px',
  },
  logo: {
    fontSize: '64px',
    marginBottom: '24px',
  },
  brandingTitle: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    letterSpacing: '2px',
  },
  brandingSubtitle: {
    fontSize: '24px',
    fontWeight: '600',
    margin: '0 0 16px 0',
    opacity: 0.95,
  },
  brandingDescription: {
    fontSize: '14px',
    margin: '0 0 48px 0',
    opacity: 0.85,
    fontWeight: '500',
  },
  features: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  featureItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '15px',
    fontWeight: '500',
  },
  featureIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    fontWeight: '700',
  },
  formArea: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#ffffff',
  },
  formAreaDark: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    backgroundColor: '#1f2937',
  },
  formContainer: {
    width: '100%',
    maxWidth: '420px',
  },
  formContainerDark: {
    width: '100%',
    maxWidth: '420px',
  },
  formTitle: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    color: '#111827',
    letterSpacing: '0.5px',
  },
  formTitleDark: {
    fontSize: '28px',
    fontWeight: '800',
    margin: '0 0 8px 0',
    color: '#ffffff',
    letterSpacing: '0.5px',
  },
  formSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: '0 0 32px 0',
    fontWeight: '500',
  },
  formSubtitleDark: {
    fontSize: '15px',
    color: '#d1d5db',
    margin: '0 0 32px 0',
    fontWeight: '500',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    fontSize: '13px',
    color: '#374151',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  labelDark: {
    fontWeight: '600',
    fontSize: '13px',
    color: '#e5e7eb',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#ffffff',
    color: '#111827',
  },
  inputDark: {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #374151',
    borderRadius: '10px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    backgroundColor: '#111827',
    color: '#f3f4f6',
  },
  submitButton: {
    padding: '14px 16px',
    backgroundColor: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    width: '100%',
    marginTop: '8px',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
  },
  secondaryButton: {
    padding: '14px 16px',
    backgroundColor: 'transparent',
    color: '#3b82f6',
    border: '2px solid #3b82f6',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  secondaryButtonDark: {
    padding: '14px 16px',
    backgroundColor: 'transparent',
    color: '#60a5fa',
    border: '2px solid #60a5fa',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    width: '100%',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 20px 0',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '600',
  },
  dividerDark: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '24px 0 20px 0',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: '600',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '2px solid #fecaca',
    textAlign: 'center',
    fontWeight: '600',
  },
  errorDark: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '2px solid rgba(239, 68, 68, 0.3)',
    textAlign: 'center',
    fontWeight: '600',
  },
  success: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '2px solid #bbf7d0',
    textAlign: 'center',
    fontWeight: '600',
  },
  successDark: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#86efac',
    padding: '14px 16px',
    borderRadius: '10px',
    marginBottom: '20px',
    fontSize: '14px',
    border: '2px solid rgba(34, 197, 94, 0.3)',
    textAlign: 'center',
    fontWeight: '600',
  },
  testUsers: {
    backgroundColor: '#f3f4f6',
    padding: '16px',
    borderRadius: '10px',
    marginTop: '24px',
    fontSize: '12px',
    textAlign: 'center',
    color: '#374151',
    border: '2px solid #e5e7eb',
    fontWeight: '600',
  },
  testUsersDark: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '16px',
    borderRadius: '10px',
    marginTop: '24px',
    fontSize: '12px',
    textAlign: 'center',
    color: '#bfdbfe',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    fontWeight: '600',
  },
  testUsersTitle: {
    margin: '0 0 8px 0',
    fontSize: '13px',
    fontWeight: '700',
  },
  testUserEmail: {
    margin: '0',
    fontSize: '13px',
    fontWeight: '600',
  },
  testUserPassword: {
    margin: '0',
    fontSize: '13px',
    fontWeight: '600',
  },
}

export default Login
