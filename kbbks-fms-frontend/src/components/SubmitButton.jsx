import { useDarkMode } from '../contexts/DarkModeContext'

function SubmitButton({ loading, text, loadingText = 'Saving...', disabled }) {
  const { isDarkMode } = useDarkMode()

  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={{
        ...(isDarkMode ? styles.buttonDark : styles.button),
        ...(loading || disabled ? (isDarkMode ? styles.disabledDark : styles.disabled) : {}),
      }}
    >
      {loading ? loadingText : text}
    </button>
  );
}

const styles = {
  button: {
    padding: '13px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  },
  buttonDark: {
    padding: '13px 28px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'all 0.3s ease',
    width: '100%',
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },
  disabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
  },
  disabledDark: {
    backgroundColor: '#555555',
    color: '#888888',
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
  },
};

export default SubmitButton;