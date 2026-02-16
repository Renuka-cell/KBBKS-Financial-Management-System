function SubmitButton({ loading, text, loadingText = 'Saving...', disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      style={{
        ...styles.button,
        ...(loading || disabled ? styles.disabled : {}),
      }}
    >
      {loading ? loadingText : text}
    </button>
  );
}

const styles = {
  button: {
    padding: '12px 24px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'background-color 0.3s ease, transform 0.1s ease',
    width: '100%',
  },
  disabled: {
    backgroundColor: '#bdc3c7',
    cursor: 'not-allowed',
    transform: 'none',
  },
};

export default SubmitButton;