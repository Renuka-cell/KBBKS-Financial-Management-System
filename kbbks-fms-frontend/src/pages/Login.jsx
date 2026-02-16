import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { loginUser, registerUser } from '../services/auth.service'

function Login() {
  const { login } = useAuth()
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
    <div style={styles.container}>
      <h2>KBBKS – Financial Management System</h2>

      <div style={styles.form}>
        {error && (
          <div style={error.includes('successfully') ? styles.success : styles.error}>
            {error}
          </div>
        )}

        {!isRegistering ? (
          <>
            <h3>Login</h3>
            <form onSubmit={handleLogin}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p style={styles.toggleText}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={styles.linkButton}
              >
                Register here
              </button>
            </p>

            <div style={styles.testUsers}>
              <h4>Test Users:</h4>
              <p>📧 admin@test.com</p>
              <p>🔑 password123</p>
            </div>
          </>
        ) : (
          <>
            <h3>Register New User</h3>
            <form onSubmit={handleRegister}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
                style={styles.input}
              />

              <label style={styles.label}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.input}
                required
              >
                <option value="Admin">Admin</option>
                <option value="Accountant">Accountant</option>
                <option value="Viewer">Viewer</option>
              </select>

              <button type="submit" disabled={loading} style={styles.button}>
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            <p style={styles.toggleText}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(false)
                  setError('')
                }}
                style={styles.linkButton}
              >
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
  },
  form: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: 'white',
    padding: '35px',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '14px 16px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '14px',
    border: '1px solid #f5c6cb',
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '14px 16px',
    borderRadius: '6px',
    marginBottom: '12px',
    fontSize: '14px',
    border: '1px solid #c3e6cb',
    textAlign: 'center',
  },
  button: {
    padding: '12px 16px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#2c3e50',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  },
  select: {
    width: '100%',
    padding: '11px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  toggleText: {
    textAlign: 'center',
    marginTop: '15px',
    fontSize: '14px',
    color: '#7f8c8d',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '14px',
    padding: '0',
    fontWeight: '600',
  },
  testUsers: {
    backgroundColor: '#ecf0f1',
    padding: '15px',
    borderRadius: '6px',
    marginTop: '18px',
    fontSize: '13px',
    textAlign: 'center',
    color: '#2c3e50',
  },
}

export default Login
