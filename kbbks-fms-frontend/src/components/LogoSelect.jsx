import { useState, useRef, useEffect } from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';
import defaultAvatar from '../pictures/avatardefault_92824.png';

/**
 * Custom dropdown that renders options with a logo badge similar to the
 * header component.  Designed for selecting vendors (or any entity with an
 * associated image).
 *
 * Props:
 * - options: array of { value, label, logo } objects
 * - value: currently selected value
 * - onChange: event handler like (e) => {} where e.target.name/e.target.value
 * - name: name to pass in the synthetic change event
 * - placeholder: text when nothing is selected
 */
function LogoSelect({ options = [], value, onChange, name, placeholder = 'Select', }) {
  const { isDarkMode } = useDarkMode();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  const handleSelect = (opt) => {
    // fire synthetic change
    onChange({ target: { name, value: opt.value } });
    setOpen(false);
  };

  return (
    <div ref={containerRef} style={styles.container}>
      <div
        style={isDarkMode ? { ...styles.selector, ...styles.selectorDark } : styles.selector}
        onClick={() => setOpen((o) => !o)}
      >
        {selected ? (
          <>
            <div style={isDarkMode ? { ...styles.logoBadge, ...styles.logoBadgeDark } : styles.logoBadge}>
              <img
                src={selected.logo || defaultAvatar}
                alt=""
                style={styles.badgeImage}
                onError={(e) => { e.target.src = defaultAvatar; }}
              />
            </div>
            <span style={isDarkMode ? { ...styles.label, color: '#e0e0e0' } : styles.label}>{selected.label}</span>
          </>
        ) : (
          <span style={isDarkMode ? { ...styles.placeholder, color: '#aaa' } : styles.placeholder}>{placeholder}</span>
        )}
        <span style={styles.arrow}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={isDarkMode ? { ...styles.dropdown, ...styles.dropdownDark } : styles.dropdown}>
          {options.map((opt) => (
            <div
              key={opt.value}
              style={isDarkMode ? { ...styles.option, color: '#e0e0e0', background: '#232323' } : styles.option}
              onClick={() => handleSelect(opt)}
            >
                  {opt.logo && (
                <div style={isDarkMode ? { ...styles.logoBadge, ...styles.logoBadgeDark } : styles.logoBadge}>
                  <img
                        src={opt.logo || defaultAvatar}
                    alt=""
                    style={styles.badgeImage}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                  />
                </div>
              )}
              <span style={isDarkMode ? { ...styles.optionLabel, color: '#e0e0e0' } : styles.optionLabel}>{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { position: 'relative', width: '100%' },
  selector: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  selectorDark: {
    border: '2px solid #555',
    backgroundColor: '#3a3a3a',
    color: '#e0e0e0',
  },
  placeholder: { color: '#888' },
  arrow: { marginLeft: 'auto', paddingLeft: '8px' },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    zIndex: 999,
  },
  dropdownDark: {
    backgroundColor: '#3a3a3a',
    border: '2px solid #555',
    color: '#e0e0e0',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  optionLabel: { marginLeft: '8px' },
  logoBadge: {
    width: '35px',
    height: '35px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa',
  },
  logoBadgeDark: {
    backgroundColor: '#232323',
    border: '2px solid #444',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  label: { marginLeft: '8px' },
};

export default LogoSelect;
