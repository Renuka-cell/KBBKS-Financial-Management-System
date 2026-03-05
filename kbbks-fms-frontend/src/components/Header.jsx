import { useDarkMode } from '../contexts/DarkModeContext'
import { useState, useEffect } from 'react'

function Header({ onLogout, currentRole, userName }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const [showLogoModal, setShowLogoModal] = useState(false)
  const [logoImage, setLogoImage] = useState(null)

  useEffect(() => {
    const savedLogo = localStorage.getItem('fmsLogo')
    if (savedLogo) {
      setLogoImage(savedLogo)
    }
  }, [])

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target.result
        setLogoImage(imageData)
        localStorage.setItem('fmsLogo', imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveLogo = () => {
    setLogoImage(null)
    localStorage.removeItem('fmsLogo')
  }

  return (
    <>
      <div style={isDarkMode ? styles.headerDark : styles.header}>
        <div style={styles.logoSection}>
          <div onClick={() => setShowLogoModal(true)} style={isDarkMode ? styles.logoBadgeDark : styles.logoBadge}>
            {logoImage ? (
              <img src={logoImage} alt="Logo" style={styles.badgeImage} />
            ) : (
              'FMS'
            )}
          </div>
          <div>
            <h2 style={styles.logoText}>KBBKS Financial Management</h2>
            <p style={styles.logoSubtext}>NGO Financial System</p>
          </div>
        </div>
        <div style={styles.rightSection}>
          <div style={styles.userSection}>
            <div style={styles.roleIcon}>👤</div>
            <div>
              <div style={styles.userName}>{userName}</div>
              <div style={styles.userRole}>{currentRole}</div>
            </div>
          </div>
          <div style={styles.divider}></div>
          <button onClick={toggleDarkMode} style={isDarkMode ? styles.darkModeToggleDark : styles.darkModeToggle} title="Toggle Dark Mode">
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={onLogout} style={isDarkMode ? styles.logoutButtonDark : styles.logoutButton}>🚪 Logout</button>
        </div>
      </div>

      {showLogoModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLogoModal(false)}>
          <div style={isDarkMode ? styles.modalDark : styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit FMS Logo</h3>
            <p style={styles.modalSubtitle}>Upload an image to customize your FMS logo</p>
            
            <div style={styles.previewSection}>
              {logoImage && (
                <div style={styles.previewContainer}>
                  <img src={logoImage} alt="Logo Preview" style={styles.previewImage} />
                  <p style={styles.previewLabel}>Current Logo</p>
                </div>
              )}
            </div>

            <div style={styles.uploadArea}>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={styles.fileInput}
                id="logoUpload"
              />
              <label htmlFor="logoUpload" style={styles.uploadLabel}>
                📁 Click to upload or drag and drop
              </label>
            </div>

            <div style={styles.modalButtonGroup}>
              {logoImage && (
                <button onClick={handleRemoveLogo} style={styles.removeButton}>
                  ✕ Remove Logo
                </button>
              )}
              <button onClick={() => setShowLogoModal(false)} style={styles.closeButton}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const styles = {
  header: {
    height: '85px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 35px',
    boxShadow: '0 6px 25px rgba(59, 130, 246, 0.2)',
    color: '#ffffff',
    backdropFilter: 'blur(10px)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
  },
  headerDark: {
    height: '85px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 35px',
    boxShadow: '0 6px 25px rgba(59, 130, 246, 0.35)',
    color: '#ffffff',
    backdropFilter: 'blur(10px)',
    borderBottom: '2px solid rgba(255, 255, 255, 0.15)',
  },
  logoSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  logoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '800',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    width: '55px',
    height: '55px',
    minWidth: '55px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logoBadgeDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '800',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    width: '55px',
    height: '55px',
    minWidth: '55px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badgeImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '6px',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    padding: '4px',
  },
  logoText: {
    margin: '0',
    fontSize: '18px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    color: '#ffffff',
  },
  logoSubtext: {
    margin: '2px 0 0 0',
    fontSize: '12px',
    opacity: 0.85,
    fontWeight: '500',
    letterSpacing: '0.3px',
  },
  rightSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '18px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '8px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  roleIcon: {
    fontSize: '20px',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#ffffff',
  },
  userRole: {
    fontSize: '11px',
    opacity: 0.8,
    fontWeight: '500',
  },
  divider: {
    width: '1px',
    height: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButton: {
    padding: '10px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  logoutButtonDark: {
    padding: '10px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  darkModeToggle: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeToggleDark: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
    maxWidth: '500px',
    width: '90%',
    animation: 'slideUp 0.3s ease',
  },
  modalDark: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    maxWidth: '500px',
    width: '90%',
    animation: 'slideUp 0.3s ease',
    color: '#ffffff',
  },
  modalTitle: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  modalSubtitle: {
    margin: '0 0 24px 0',
    fontSize: '13px',
    opacity: 0.7,
    fontWeight: '500',
  },
  previewSection: {
    marginBottom: '24px',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: '20px',
    borderRadius: '8px',
    border: '2px dashed #3b82f6',
  },
  previewImage: {
    maxWidth: '120px',
    maxHeight: '120px',
    borderRadius: '8px',
    marginBottom: '12px',
    objectFit: 'contain',
  },
  previewLabel: {
    margin: '0',
    fontSize: '12px',
    fontWeight: '600',
    opacity: 0.7,
  },
  uploadArea: {
    marginBottom: '24px',
  },
  fileInput: {
    display: 'none',
  },
  uploadLabel: {
    display: 'block',
    padding: '20px',
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
    border: '2px dashed #3b82f6',
    borderRadius: '8px',
    textAlign: 'center',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    color: '#3b82f6',
  },
  modalButtonGroup: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  removeButton: {
    padding: '10px 18px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  },
  closeButton: {
    padding: '10px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.3s ease',
  },
}

export default Header
