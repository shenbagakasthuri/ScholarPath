import { forwardRef, useState, useEffect } from 'react';
import styles from './Textarea.module.css';

const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  required = false,
  disabled = false,
  maxLength,
  showCharacterCount = false,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${textareaId}-error` : undefined;
  const helperId = helperText && !error ? `${textareaId}-helper` : undefined;
  const [value, setValue] = useState(props.value || props.defaultValue || '');

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const charCount = value.length;
  const maxChars = maxLength || (showCharacterCount ? 1000 : undefined);

  return (
    <div className={`${styles.wrapper} ${className} ${error ? styles.hasError : ''} ${disabled ? styles.disabled : ''}`}>
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={styles.textarea}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={[errorId, helperId, maxChars && `${textareaId}-count`].filter(Boolean).join(' ') || undefined}
        rows={rows}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        {...props}
      />
      {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
      {helperText && !error && <p id={helperId} className={styles.helperText}>{helperText}</p>}
      {showCharacterCount && maxChars && (
        <p id={`${textareaId}-count`} className={`${styles.charCount} ${charCount > maxChars ? styles.charCountExceeded : ''}`}>
          {charCount} / {maxChars}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;