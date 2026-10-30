import { Link } from 'react-router-dom';
import { ArrowRight, Search, User, Shield, Sparkles, BookOpen, GraduationCap } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import styles from './Home.module.css';
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

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="hero-heading">
        <div className={styles.heroContent}>
          <Badge variant="default" size="md" className={styles.demoBadge}>
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            Demo Preview
          </Badge>
          <h1 id="hero-heading" className={styles.heroTitle}>
            Your future deserves an opportunity.
          </h1>
          <p className={styles.heroTagline}>Your Path to Scholarship Opportunities</p>
          <p className={styles.heroDescription}>
            ScholarPath helps students discover scholarships tailored to their profile —
            education, income, category, domicile, and more. Explain your situation,
            get matched, and apply with confidence.
          </p>
          <div className={styles.heroActions}>
            <LinkButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} to="/scholarships">
              Find My Scholarships
            </LinkButton>
            <OutlineLink size="lg" to="/scholarships">
              Explore All Scholarships
            </OutlineLink>
          </div>
          <p className={styles.heroNote}>
            <Shield className="w-4 h-4" aria-hidden="true" />
            No login required to browse &mdash; create a profile to save matches
          </p>
        </div>
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <Search className="w-8 h-8" />
            </div>
            <h3>Describe Your Profile</h3>
            <p>Tell us about your education, income, and background in plain text or voice.</p>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <Sparkles className="w-8 h-8" />
            </div>
            <h3>Get Matched</h3>
            <p>Our eligibility engine finds scholarships you qualify for — with explanations.</p>
          </div>
          <div className={styles.visualCard}>
            <div className={styles.visualIcon}>
              <BookOpen className="w-8 h-8" />
            </div>
            <h3>Apply with Confidence</h3>
            <p>See deadlines, required documents, and official links in one place.</p>
          </div>
        </div>
      </section>

      <section className={styles.howItWorks} aria-labelledby="how-heading">
        <div className={styles.sectionHeader}>
          <h2 id="how-heading" className={styles.sectionTitle}>How It Works</h2>
          <p className={styles.sectionSubtitle}>
            Three steps to scholarship opportunities that fit you
          </p>
        </div>
        <div className={styles.steps}>
          <StepCard
            number="01"
            icon={<User className="w-6 h-6" />}
            title="Build Your Profile"
            description="Add your education, family income, category, domicile, and academic scores. We only ask for what's needed to match scholarships."
          />
          <StepCard
            number="02"
            icon={<Sparkles className="w-6 h-6" />}
            title="Get Personalized Matches"
            description="Our deterministic eligibility engine checks every criterion against official scholarship rules. See exactly why you match — or don't."
          />
          <StepCard
            number="03"
            icon={<GraduationCap className="w-6 h-6" />}
            title="Apply & Track"
            description="View deadlines, required documents, and official application links. Save scholarships and get reminders before they expire."
          />
        </div>
      </section>

      <section className={styles.matching} aria-labelledby="matching-heading">
        <div className={styles.matchingContent}>
          <div className={styles.matchingVisual} aria-hidden="true">
            <div className={styles.matchDiagram}>
              <div className={`${styles.matchNode} ${styles.profile}`}>
                <User className="w-5 h-5" />
                <span>Your Profile</span>
              </div>
              <div className={styles.matchArrow}>
                <span className={styles.arrow}>&rarr;</span>
                <Sparkles className="w-4 h-4" />
              </div>
              <div className={`${styles.matchNode} ${styles.scholarship}`}>
                <BookOpen className="w-5 h-5" />
                <span>Scholarships</span>
              </div>
            </div>
            <div className={styles.matchFeatures}>
              <MatchFeature icon={<Shield className="w-5 h-5" />} title="Verified Criteria" desc="Eligibility rules sourced from official notifications" />
              <MatchFeature icon={<Sparkles className="w-5 h-5" />} title="Transparent Scoring" desc="See exactly which criteria you meet and which need verification" />
              <MatchFeature icon={<BookOpen className="w-5 h-5" />} title="Source Links" desc="Every recommendation links to the official government or institution page" />
            </div>
          </div>
          <div className={styles.matchingInfo}>
            <Badge variant="default" size="md" className={styles.matchingBadge}>
              <Sparkles className="w-3 h-3" />
              Smart Matching
            </Badge>
            <h2 id="matching-heading" className={styles.matchingTitle}>
              Scholarships that actually fit your situation
            </h2>
            <p className={styles.matchingDescription}>
              Stop scrolling through endless lists. ScholarPath analyzes your complete profile —
              academic performance, family income, category (SC/ST/OBC/EWS/General), domicile state,
              disability status, and course of study — against every scholarship's official eligibility criteria.
            </p>
            <ul className={styles.matchingList}>
              <li>
                <strong>Deterministic eligibility engine</strong> — no AI hallucinations on hard rules
              </li>
              <li>
                <strong>Missing information highlighted</strong> — know exactly what documents you need
              </li>
              <li>
                <strong>Verification status shown</strong> — distinguish verified data from unverified sources
              </li>
              <li>
                <strong>No false promises</strong> — we show match scores, not guaranteed awards
              </li>
            </ul>
            <LinkButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} to="/scholarships">
              Start Your Search
            </LinkButton>
          </div>
        </div>
      </section>

      <section className={styles.cta} aria-labelledby="cta-heading">
        <div className={styles.ctaContent}>
          <h2 id="cta-heading" className={styles.ctaTitle}>Ready to find your scholarships?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of students discovering opportunities they didn't know existed.
            It's free to browse and only takes a few minutes to get started.
          </p>
          <div className={styles.ctaActions}>
            <LinkButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />} to="/scholarships">
              Browse Scholarships
            </LinkButton>
            <OutlineLink size="lg" to="/assistant">
              Try the Assistant
            </OutlineLink>
          </div>
        </div>
      </section>
    </div>
  );
}

function StepCard({ number, icon, title, description }) {
  return (
    <article className={styles.stepCard}>
      <div className={styles.stepNumber}>{number}</div>
      <div className={styles.stepIcon}>{icon}</div>
      <h3 className={styles.stepTitle}>{title}</h3>
      <p className={styles.stepDescription}>{description}</p>
    </article>
  );
}

function MatchFeature({ icon, title, desc }) {
  return (
    <div className={styles.matchFeature}>
      <div className={styles.matchFeatureIcon}>{icon}</div>
      <h4 className={styles.matchFeatureTitle}>{title}</h4>
      <p className={styles.matchFeatureDesc}>{desc}</p>
    </div>
  );
}