import styles from './Badge.module.css';

export function Badge({ children, variant = 'default', size = 'md', className = '', ...props }) {
  const classNames = [
    styles.badge,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classNames} {...props}>
      {children}
    </span>
  );
}

export function StatusBadge({ status, size = 'md', className = '' }) {
  const statusConfig = {
    eligible: { variant: 'success', label: 'Eligible' },
    'conditionally-eligible': { variant: 'warning', label: 'Conditionally Eligible' },
    'not-eligible': { variant: 'error', label: 'Not Eligible' },
    'missing-info': { variant: 'info', label: 'Missing Info' },
    'needs-verification': { variant: 'warning', label: 'Needs Verification' },
    pending: { variant: 'default', label: 'Pending' },
    active: { variant: 'success', label: 'Active' },
    expired: { variant: 'error', label: 'Expired' },
    draft: { variant: 'default', label: 'Draft' },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  );
}