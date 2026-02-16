function Footer() {
  return (
    <div style={styles.footer}>
      © 2026 KBBKS NGO
    </div>
  )
}

const styles = {
  footer: {
    height: '50px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    color: '#ecf0f1',
    borderTop: '3px solid #3498db',
    fontSize: '13px',
    fontWeight: '500',
  },
}

export default Footer
