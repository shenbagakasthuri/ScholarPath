import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

  return (
    <div className={`${styles.wrapper} ${className} ${error ? styles.hasError : ''} ${disabled ? styles.disabled : ''}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.iconLeft} aria-hidden="true">{leftIcon}</span>}
        <input
          ref={ref}
          id={inputId}
          className={styles.input}
          disabled={disabled}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {rightIcon && <span className={styles.iconRight} aria-hidden="true">{rightIcon}</span>}
      </div>
      {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
      {helperText && !error && <p id={helperId} className={styles.helperText}>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;