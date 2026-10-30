import { Link } from 'react-router-dom';
import { Home, Search, Sparkles, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import styles from './NotFound.module.css';
import buttonStyles from '../components/ui/Button.module.css';

function LinkButton({ variant = 'primary', size = 'md', rightIcon, children, to, ...props }) {
  const classNames = [
    buttonStyles.button,
    buttonStyles[variant],
    buttonStyles[size],
    props.className || '',
  ].filter(Boolean).join(' ');

  return (
    <Link to={to} className={classNames} {...props}>
      {children}
      {rightIcon && <span className={buttonStyles.iconRight} aria-hidden="true">{rightIcon}</span>}
    </Link>
  );
}

function OutlineLink({ size = 'md', children, to, ...props }) {
  const classNames = [
    buttonStyles.button,
    buttonStyles.outline,
    buttonStyles[size],
    props.className || '',
  ].filter(Boolean).join(' ');

  return (
    <Link to={to} className={classNames} {...props}>
      {children}
    </Link>
  );
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <Sparkles className="w-16 h-16" aria-hidden="true" />
          </div>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Page Not Found</h2>
          <p className={styles.description}>
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className={styles.actions}>
            <LinkButton variant="primary" size="lg" rightIcon={<ArrowLeft className="w-5 h-5" />} to="/">
              Back to Home
            </LinkButton>
            <OutlineLink size="lg" to="/scholarships">
              <Search className="w-5 h-5" />
              Browse Scholarships
            </OutlineLink>
          </div>

          <div className={styles.quickLinks}>
            <span className={styles.quickLinksLabel}>Quick Links:</span>
            <nav aria-label="Quick navigation">
              <ul className={styles.quickLinksList}>
                <li>
                  <Link to="/" className={styles.quickLink}>
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className={styles.quickLink}>
                    <Sparkles className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/scholarships" className={styles.quickLink}>
                    <Search className="w-4 h-4" />
                    Scholarships
                  </Link>
                </li>
                <li>
                  <Link to="/assistant" className={styles.quickLink}>
                    <Sparkles className="w-4 h-4" />
                    Assistant
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={styles.quickLink}>
                    <Home className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          <Badge variant="default" size="sm" className={styles.demoBadge}>
            Demo Application
          </Badge>
        </div>
      </div>
    </div>
  );
}