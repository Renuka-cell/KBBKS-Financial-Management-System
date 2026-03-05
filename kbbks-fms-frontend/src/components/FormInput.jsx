import { useDarkMode } from '../contexts/DarkModeContext'

function FormInput({ label, type = 'text', name, value, onChange, error, placeholder, options = [], step, min, max }) {
  const { isDarkMode } = useDarkMode()

  return (
    <div style={styles.inputGroup}>
      <label style={isDarkMode ? styles.labelDark : styles.label}>{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={isDarkMode ? styles.inputDark : styles.input}
        >
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              style={option.logo ? {
                backgroundImage: `url(${option.logo})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '20px 20px',
                paddingLeft: '30px'
              } : undefined}
            >
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={step}
          min={min}
          max={max}
          style={isDarkMode ? styles.inputDark : styles.input}
        />
      )}
      {error && <p style={isDarkMode ? styles.errorDark : styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  label: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#2c3e50',
    textAlign: 'left',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  labelDark: {
    fontWeight: '700',
    fontSize: '13px',
    color: '#e0e0e0',
    textAlign: 'left',
    letterSpacing: '0.3px',
    textTransform: 'uppercase',
  },
  input: {
    padding: '14px 14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    transition: 'all 0.3s ease',
    color: '#2c3e50',
  },
  inputDark: {
    padding: '14px 14px',
    border: '2px solid #555555',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#3a3a3a',
    color: '#e0e0e0',
    transition: 'all 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    margin: '0',
    fontWeight: '600',
  },
  errorDark: {
    color: '#ff9a9a',
    fontSize: '13px',
    margin: '0',
    fontWeight: '600',
  },
};

export default FormInput;