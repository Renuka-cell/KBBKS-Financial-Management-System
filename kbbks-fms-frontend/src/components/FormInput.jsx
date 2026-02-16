function FormInput({ label, type = 'text', name, value, onChange, error, placeholder, options = [], step, min, max }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
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
          style={styles.input}
        />
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#2c3e50',
    textAlign: 'left',
  },
  input: {
    padding: '11px 12px',
    border: '1px solid #bdc3c7',
    borderRadius: '6px',
    fontSize: '14px',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s ease',
  },
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    margin: '0',
    fontWeight: '500',
  },
};

export default FormInput;