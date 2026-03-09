import { useDarkMode } from '../contexts/DarkModeContext'

function Footer() {
  const { isDarkMode } = useDarkMode()
  const currentYear = new Date().getFullYear()

  return (
    <div style={isDarkMode ? styles.footerDark : styles.footer}>
      <div style={styles.footerContent}>
        <div style={styles.footerBranding}>
          <div style={styles.brandName}>KBBKS FMS</div>
          <p style={styles.brandDescription}>Financial Management System for NGOs</p>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.copyright}>© {currentYear} KBBKS NGO. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <span style={styles.link}>Privacy Policy</span>
            <span style={styles.separator}>•</span>
            <span style={styles.link}>Terms of Service</span>
            <span style={styles.separator}>•</span>
            <span style={styles.link}>Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    padding: '30px 35px',
    boxShadow: '0 -6px 25px rgba(59, 130, 246, 0.2)',
    borderTop: '2px solid rgba(255, 255, 255, 0.1)',
    marginTop: '60px',
  },
  footerDark: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: '#ffffff',
    padding: '30px 35px',
    boxShadow: '0 -6px 25px rgba(59, 130, 246, 0.35)',
    borderTop: '2px solid rgba(255, 255, 255, 0.15)',
    marginTop: '60px',
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  footerBranding: {
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  },
  brandName: {
    fontSize: '16px',
    fontWeight: '800',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  brandDescription: {
    fontSize: '12px',
    opacity: 0.9,
    margin: '0',
    fontWeight: '500',
  },
  footerBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyright: {
    fontSize: '12px',
    margin: '0',
    fontWeight: '600',
    opacity: 0.9,
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '11px',
    fontWeight: '500',
  },
  link: {
    cursor: 'pointer',
    opacity: 0.85,
    transition: 'opacity 0.3s ease',
  },
  separator: {
    opacity: 0.6,
  },
}

export default Footer
