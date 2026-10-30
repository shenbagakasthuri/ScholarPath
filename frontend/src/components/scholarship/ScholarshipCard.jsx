import { Link } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Clock, CheckCircle, AlertCircle, XCircle, HelpCircle, ExternalLink, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/Card';
import { Badge, StatusBadge } from '../ui/Badge';
import styles from './ScholarshipCard.module.css';

const typeLabels = {
  merit: 'Merit-based',
  need: 'Need-based',
  merit_need: 'Merit & Need',
  sports: 'Sports',
  minority: 'Minority',
  disability: 'Disability',
  women: 'Women',
  general: 'General',
};

const providerTypeLabels = {
  government: 'Government',
  state: 'State Government',
  central: 'Central Government',
  university: 'University',
  private: 'Private',
  ngo: 'NGO/Foundation',
  corporate: 'Corporate',
  international: 'International',
};

const isDemoScholarship = (scholarship) => {
  return scholarship.verificationStatus === 'DEMO_DATA' || 
         scholarship.provider?.includes('(Fictional)') ||
         scholarship.isVerified === false;
};

export default function ScholarshipCard({
  scholarship,
  matchData,
  compact = false,
  showMatchScore = true,
  onApplyClick,
}) {
  const {
    id,
    title,
    slug,
    shortDescription,
    providerName,
    providerType,
    scholarshipType,
    amountMin,
    amountMax,
    amountDescription,
    currency = 'INR',
    applicationStartDate,
    applicationEndDate,
    applicationMode,
    applicationUrl,
    isVerified,
    verificationStatus,
    academicYear,
  } = scholarship;

  const isExpired = applicationEndDate && new Date(applicationEndDate) < new Date();
  const daysLeft = applicationEndDate
    ? Math.ceil((new Date(applicationEndDate) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const isDemo = isDemoScholarship(scholarship);

  const formatAmount = () => {
    if (amountDescription) return amountDescription;
    if (amountMin && amountMax) {
      return `\u20B9${amountMin.toLocaleString()} - \u20B9${amountMax.toLocaleString()}`;
    }
    if (amountMax) {
      return `Up to \u20B9${amountMax.toLocaleString()}`;
    }
    return 'Amount not specified';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not specified';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <article className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <div className={styles.cardInner}>
        <div className={styles.header}>
          <div className={styles.providerInfo}>
            <span className={styles.providerType}>
              {providerTypeLabels[providerType] || providerType}
            </span>
            {isDemo && (
              <Badge variant="warning" size="sm" className={styles.demoBadge}>
                <ShieldAlert className="w-3 h-3" aria-hidden="true" />
                DEMO — Not Verified
              </Badge>
            )}
            {isVerified && !isDemo && (
              <Badge variant="success" size="sm">
                <CheckCircle className="w-3 h-3" aria-hidden="true" />
                Verified
              </Badge>
            )}
            {!isVerified && !isDemo && verificationStatus === 'PENDING' && (
              <Badge variant="warning" size="sm">
                <HelpCircle className="w-3 h-3" aria-hidden="true" />
                Unverified
              </Badge>
            )}
          </div>
          <div className={styles.typeBadges}>
            <Badge variant="default" size="sm">
              {typeLabels[scholarshipType] || scholarshipType}
            </Badge>
            <Badge variant="default" size="sm">
              {academicYear}
            </Badge>
          </div>
        </div>

        <Link to={`/scholarships/${slug}`} className={styles.titleLink} aria-label={`View details for ${title}`}>
          <h3 className={styles.title}>{title}</h3>
        </Link>

        {shortDescription && (
          <p className={styles.description}>{shortDescription}</p>
        )}

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <IndianRupee className="w-4 h-4" aria-hidden="true" />
            <span>{formatAmount()}</span>
          </div>
          {applicationEndDate && (
            <div className={`${styles.metaItem} ${daysLeft !== null && daysLeft <= 7 ? styles.urgent : ''}`}>
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <span>
                {isExpired ? 'Expired' : `Deadline: ${formatDate(applicationEndDate)}`}
                {daysLeft !== null && !isExpired && daysLeft > 0 && (
                  <span className={styles.daysLeft}>({daysLeft} day{daysLeft !== 1 ? 's' : ''} left)</span>
                )}
              </span>
            </div>
          )}
          {applicationMode && (
            <div className={styles.metaItem}>
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>{applicationMode}</span>
            </div>
          )}
        </div>

        {matchData && showMatchScore && (
          <div className={styles.matchSection}>
            <div className={styles.matchScore}>
              <span className={styles.matchLabel}>Match Score</span>
              <div className={styles.scoreCircle} style={{ '--score': `${matchData.matchScore}%` }}>
                <span className={styles.scoreValue}>{Math.round(matchData.matchScore)}%</span>
              </div>
            </div>
            <StatusBadge status={matchData.eligibilityStatus} size="sm" />
            {matchData.matchedCriteriaCount !== undefined && (
              <div className={styles.criteriaSummary}>
                {matchData.matchedCriteriaCount} of {matchData.totalMandatoryCriteriaCount} mandatory criteria met
              </div>
            )}
          </div>
        )}

        <CardFooter className={styles.actions}>
          <Link
            to={`/scholarships/${slug}`}
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
          >
            View Details
          </Link>
          {applicationUrl && (
            <a
              href={applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
              onClick={(e) => {
                e.stopPropagation();
                onApplyClick?.(scholarship);
              }}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Apply Now
            </a>
          )}
        </CardFooter>

        {!compact && (
          <div className={styles.verificationNotice}>
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
            <span>
              <strong>Verification Status:</strong> {isDemo ? 'Fictional demo data — not a real scholarship' : (isVerified ? 'Verified against official sources' : 'Not yet verified - please verify on official website')}
              {' '}
              <a href="#" className={styles.verifyLink}>Learn more</a>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}