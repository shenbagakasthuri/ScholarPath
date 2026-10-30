import { Link, useLocation, NavLink } from 'react-router-dom';
import { Menu, X, BookOpen, GraduationCap, Search, User, LogOut, Mic, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import styles from './Header.module.css';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';

const navItems = [
  { path: '/', label: 'Home', icon: <HomeIcon /> },
  { path: '/scholarships', label: 'Scholarships', icon: <BookOpen className="w-5 h-5" /> },
  { path: '/dashboard', label: 'Dashboard', icon: <GraduationCap className="w-5 h-5" /> },
  { path: '/assistant', label: 'Assistant', icon: <MessageSquare className="w-5 h-5" /> },
];

function HomeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthenticated = true; // Demo mode

  return (
    <header className={styles.header} role="banner">
      <div className={styles.container}>
        <Link to="/" className={styles.logo} aria-label="ScholarPath Home">
          <svg className={styles.logoIcon} viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="currentColor" />
            <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.logoText}>ScholarPath</span>
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`} role="navigation" aria-label="Main navigation">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className={styles.navActions}>
            {isAuthenticated ? (
              <div className={styles.userMenu}>
                <button
                  className={styles.userButton}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <span className={styles.userAvatar} aria-hidden="true">A</span>
                  <span className={styles.userName}>Alex Student</span>
                  <svg className={styles.chevron} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className={styles.userDropdown} role="menu">
                    <Link to="/profile" className={styles.dropdownItem} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" aria-hidden="true" />
                      Profile
                    </Link>
                    <Link to="/settings" className={styles.dropdownItem} role="menuitem" onClick={() => setUserMenuOpen(false)}>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 21.46a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 1 4.6 9a1.65 1.65 0 0 1 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 1-.33 1.82V9a1.65 1.65 0 0 1 1.51-1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 1-1.51 1z" /></svg>
                      Settings
                    </Link>
                    <hr className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} role="menuitem">
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authButtons}>
                <Link to="/login" className={`${styles.authLink} ${styles.authLinkSecondary}`}>
                  Sign In
                </Link>
                <Link to="/register" className={`${styles.authLink} ${styles.authLinkPrimary}`}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </nav>

        <button
          className={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="main-nav"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
    </header>
  );
}