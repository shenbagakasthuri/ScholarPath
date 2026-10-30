import { Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Shield, Globe, Mail, X, Link as LinkIcon, GitBranch } from 'lucide-react';
import styles from './Footer.module.css';

const footerLinks = {
  product: [
    { label: 'Find Scholarships', href: '/scholarships' },
    { label: 'Eligibility Checker', href: '/eligibility' },
    { label: 'Application Guide', href: '/guide' },
    { label: 'Deadlines Calendar', href: '/calendar' },
  ],
  resources: [
    { label: 'Blog & Updates', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Data Protection', href: '/data-protection' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
  connect: [
    { label: 'About Us', href: '/about' },
    { label: 'Partnerships', href: '/partners' },
    { label: 'Press Kit', href: '/press' },
    { label: 'Careers', href: '/careers' },
  ],
};

const socialLinks = [
  { icon: X, href: 'https://x.com', label: 'X' },
  { icon: LinkIcon, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: GitBranch, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:hello@scholarpath.example', label: 'Email' },
];

const features = [
  { icon: BookOpen, title: 'Verified Data', desc: 'Official scholarship sources only' },
  { icon: GraduationCap, title: 'Smart Matching', desc: 'AI-powered eligibility analysis' },
  { icon: Shield, title: 'Privacy First', desc: 'Your data stays secure' },
  { icon: Globe, title: 'Global Reach', desc: 'Scholarships worldwide' },
];

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link to="/" className={styles.logo} aria-label="ScholarPath Home">
              <svg className={styles.logoIcon} viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path d="M8 16L14 22L24 10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className={styles.logoText}>ScholarPath</span>
            </Link>
            <p className={styles.tagline}>
              Your trusted path to scholarship opportunities. Discover, verify, and apply with confidence.
            </p>
            <div className={styles.social}>
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} className={styles.socialLink} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav className={styles.linksSection} aria-label="Product links">
            <h3 className={styles.sectionTitle}>Product</h3>
            <ul className={styles.linkList}>
              {footerLinks.product.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.linksSection} aria-label="Resource links">
            <h3 className={styles.sectionTitle}>Resources</h3>
            <ul className={styles.linkList}>
              {footerLinks.resources.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.linksSection} aria-label="Legal links">
            <h3 className={styles.sectionTitle}>Legal</h3>
            <ul className={styles.linkList}>
              {footerLinks.legal.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.linksSection} aria-label="Connect links">
            <h3 className={styles.sectionTitle}>Connect</h3>
            <ul className={styles.linkList}>
              {footerLinks.connect.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className={styles.link}>{label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresTitle}>Why ScholarPath?</h3>
          <div className={styles.featuresGrid}>
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h4 className={styles.featureTitle}>{title}</h4>
                <p className={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} ScholarPath. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            <strong>Demo Notice:</strong> This is a demonstration application. Scholarship data shown is for UI/UX demonstration purposes only and may not reflect current official information. Always verify eligibility and deadlines on official scholarship provider websites.
          </p>
        </div>
      </div>
    </footer>
  );
}