import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, AlertCircle, CheckCircle, Clock, Filter, Sparkles } from 'lucide-react';
import { mockScholarships } from '../data/mockScholarships';
import { matchStudentToScholarships, getStatusLabel, getStatusVariant, MATCH_STATUS } from '../utils/scholarshipMatcher';
import ProfileSummary from '../components/profile/ProfileSummary';
import ScholarshipCard from '../components/scholarship/ScholarshipCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Badge, StatusBadge } from '../components/ui/Badge';
import styles from './Dashboard.module.css';
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

const STORAGE_KEY = 'scholarpath_student_profile';

function loadProfileFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (_) {
    // localStorage unavailable or corrupted
  }
  return null;
}

function transformScholarshipForCard(scholarship) {
  return {
    ...scholarship,
    title: scholarship.name,
    providerName: scholarship.provider,
    applicationEndDate: scholarship.deadline,
    applicationStartDate: null,
  };
}

function convertMatchResultToMatchData(matchResult) {
  // Convert the matcher's status to the format expected by ScholarshipCard/StatusBadge
  const statusMap = {
    [MATCH_STATUS.ELIGIBLE]: 'eligible',
    [MATCH_STATUS.POTENTIALLY_ELIGIBLE]: 'conditionally-eligible',
    [MATCH_STATUS.INELIGIBLE]: 'not-eligible',
    [MATCH_STATUS.NEEDS_VERIFICATION]: 'needs-verification',
  };
  
  return {
    matchScore: matchResult.matchScore,
    eligibilityStatus: statusMap[matchResult.status] || 'needs-verification',
    matchedCriteriaCount: matchResult.passedCriteria,
    totalMandatoryCriteriaCount: matchResult.evaluatedCriteria,
    matchExplanation: matchResult.reasons.join('; '),
  };
}

function buildProfileSummary(profile, matchResults) {
  if (!profile) return null;
  
  const eligibleCount = matchResults.filter(m => m.matchResult.status === MATCH_STATUS.ELIGIBLE).length;
  const needsVerificationCount = matchResults.filter(m => m.matchResult.status === MATCH_STATUS.NEEDS_VERIFICATION).length;
  const ineligibleCount = matchResults.filter(m => m.matchResult.status === MATCH_STATUS.INELIGIBLE).length;
  
  return (
    <div className={styles.profileSummary}>
      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Eligible</span>
        <span className={styles.summaryValue}>{eligibleCount}</span>
      </div>
      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Needs Verification</span>
        <span className={styles.summaryValue}>{needsVerificationCount}</span>
      </div>
      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Not Eligible</span>
        <span className={styles.summaryValue}>{ineligibleCount}</span>
      </div>
      <div className={styles.summaryItem}>
        <span className={styles.summaryLabel}>Total Checked</span>
        <span className={styles.summaryValue}>{matchResults.length}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const savedProfile = loadProfileFromStorage();
  
  // Build student profile for matching from stored data
  const studentProfile = savedProfile ? {
    course: savedProfile.course,
    state: savedProfile.state,
    incomeRange: savedProfile.incomeRange,
    academicMarks: savedProfile.academicMarks,
    category: savedProfile.category,
  } : null;
  
  // Get matches using the matching utility
  const matches = studentProfile 
    ? matchStudentToScholarships(studentProfile, mockScholarships)
    : [];
  
  const recommendedScholarships = matches.map(({ scholarship, matchResult }) => ({
    scholarship: transformScholarshipForCard(scholarship),
    matchData: convertMatchResultToMatchData(matchResult),
  }));

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.welcomeTitle}>
              {savedProfile?.fullName ? `Welcome back, ${savedProfile.fullName}` : 'Welcome back'}
            </h1>
            <p className={styles.welcomeSubtitle}>
              {savedProfile 
                ? 'Here\'s your scholarship dashboard — personalized matches based on your profile.'
                : 'Complete your profile to get personalized scholarship recommendations.'
              }
            </p>
          </div>
          <Badge variant="warning" size="md" className={styles.demoNotice}>
            <AlertCircle className="w-3 h-3" />
            Demo Data — Not Verified
          </Badge>
        </div>
      </header>

      <section className={styles.profileSection} aria-labelledby="profile-heading">
        <div className={styles.sectionHeader}>
          <h2 id="profile-heading" className={styles.sectionTitle}>Your Profile</h2>
          <OutlineLink size="sm" to="/profile">
            Edit Profile
          </OutlineLink>
        </div>
        <ProfileSummary editable={false} />
        {savedProfile && (
          <div className={styles.matchSummary} aria-labelledby="match-summary-heading">
            <h3 id="match-summary-heading" className={styles.summaryTitle}>Match Summary</h3>
            {buildProfileSummary(savedProfile, matches)}
          </div>
        )}
      </section>

      <section className={styles.recommendationsSection} aria-labelledby="rec-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="rec-heading" className={styles.sectionTitle}>Recommended for You</h2>
            <p className={styles.sectionSubtitle}>
              {savedProfile
                ? `Based on your profile: ${savedProfile.course || 'course'}, ${savedProfile.academicMarks || 'marks'}, ${savedProfile.category || 'category'}, ${savedProfile.state || 'state'}, ${savedProfile.incomeRange ? savedProfile.incomeRange.replace('-', '–').replace('+', '+') : 'income'}`
                : 'Complete your profile to see personalized recommendations.'
              }
            </p>
          </div>
          <OutlineLink size="sm" to="/scholarships">
            <Filter className="w-4 h-4" />
            View All Scholarships
          </OutlineLink>
        </div>

        {savedProfile ? (
          recommendedScholarships.length > 0 ? (
            <div className={styles.scholarshipsGrid} role="list" aria-label="Recommended scholarships">
              {recommendedScholarships.map(({ scholarship, matchData }) => (
                <ScholarshipCard
                  key={scholarship.id}
                  scholarship={scholarship}
                  matchData={matchData}
                  compact={false}
                  showMatchScore={true}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="w-12 h-12" />}
              title="No matches found"
              description="Your profile didn't match any current demo scholarships. Try updating your profile or browse all scholarships."
              action={<LinkButton variant="primary" to="/scholarships">Browse All</LinkButton>}
            />
          )
        ) : (
          <EmptyState
            icon={<BookOpen className="w-12 h-12" />}
            title="Complete your profile"
            description="Save your profile information to get personalized scholarship matches."
            action={<LinkButton variant="primary" to="/profile">Complete Profile</LinkButton>}
          />
        )}

        <div className={styles.demoDisclaimer}>
          <Sparkles className="w-4 h-4" />
          <span>
            <strong>Demo Notice:</strong> Recommendations are generated by a deterministic matching engine using
            the fictional demo scholarship data above. Match scores reflect criteria explicitly defined in each
            scholarship record. Results are for UI demonstration only — not real eligibility predictions.
          </span>
        </div>
      </section>

      <section className={styles.quickActions} aria-labelledby="actions-heading">
        <h2 id="actions-heading" className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <ActionCard
            icon={<Search className="w-6 h-6" />}
            title="Search All Scholarships"
            description="Browse the complete database with filters for course, category, state, and more."
            action={<OutlineLink to="/scholarships">Explore</OutlineLink>}
          />
          <ActionCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Chat with Assistant"
            description="Describe your situation in plain language and get guided scholarship suggestions."
            action={<OutlineLink to="/assistant">Open Assistant</OutlineLink>}
          />
          <ActionCard
            icon={<Clock className="w-6 h-6" />}
            title="Upcoming Deadlines"
            description="Track application deadlines for your saved scholarships and get reminders."
            action={<OutlineLink to="/calendar">View Calendar</OutlineLink>}
          />
          <ActionCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Application Checklist"
            description="See required documents for each scholarship and track your submission status."
            action={<OutlineLink to="/checklist">View Checklist</OutlineLink>}
          />
        </div>
      </section>
    </div>
  );
}

function ActionCard({ icon, title, description, action }) {
  return (
    <article className={styles.actionCard}>
      <div className={styles.actionIcon}>{icon}</div>
      <h3 className={styles.actionTitle}>{title}</h3>
      <p className={styles.actionDescription}>{description}</p>
      <div className={styles.actionFooter}>{action}</div>
    </article>
  );
}

function EmptyState({ icon, title, description, action }) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyIcon}>{icon}</div>
      <h3 className={styles.emptyTitle}>{title}</h3>
      <p className={styles.emptyDescription}>{description}</p>
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  );
}