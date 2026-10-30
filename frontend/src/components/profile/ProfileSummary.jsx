import { useState } from 'react';
import { GraduationCap, MapPin, IndianRupee, User, Award, AlertCircle, CheckCircle, HelpCircle, Edit, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge, StatusBadge } from '../ui/Badge';
import Button from '../ui/Button';
import styles from './ProfileSummary.module.css';

const mockProfile = {
  personal: {
    fullName: 'Alexandra Sharma',
    email: 'alex.sharma@student.edu',
    dateOfBirth: '2003-03-15',
    gender: 'Female',
    category: 'OBC',
    subCategory: 'Non-Creamy Layer',
    disability: null,
    disabilityPercentage: null,
  },
  financial: {
    annualFamilyIncome: 650000,
    incomeCertificateNumber: 'INC/2024/04521',
    incomeCertificateDate: '2024-01-15',
  },
  domicile: {
    state: 'Maharashtra',
    district: 'Pune',
    certificateNumber: 'DOM/MH/2024/001234',
  },
  banking: {
    accountNumber: '**** **** **** 1234',
    ifscCode: 'SBIN0001234',
    accountHolderName: 'Alexandra Sharma',
  },
  education: [
    {
      id: 1,
      level: '12th',
      institutionName: 'St. Mary\'s Higher Secondary School',
      board: 'CBSE',
      stream: 'Science (PCM)',
      yearOfPassing: 2021,
      percentage: 92.4,
      isCurrent: false,
    },
    {
      id: 2,
      level: 'Undergraduate',
      institutionName: 'College of Engineering, Pune',
      board: 'Savitribai Phule Pune University',
      courseName: 'B.Tech Computer Science',
      stream: 'Computer Science',
      yearOfPassing: 2025,
      percentage: 8.7,
      isCurrent: true,
    },
  ],
};

const sectionStatus = {
  personal: { complete: true, required: 7, filled: 7 },
  financial: { complete: true, required: 3, filled: 3 },
  domicile: { complete: true, required: 3, filled: 3 },
  banking: { complete: true, required: 3, filled: 3 },
  education: { complete: true, required: 2, filled: 2 },
};

export default function ProfileSummary({ editable = false, onEdit }) {
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    financial: true,
    domicile: true,
    banking: true,
    education: true,
  });

  const totalRequired = Object.values(sectionStatus).reduce((sum, s) => sum + s.required, 0);
  const totalFilled = Object.values(sectionStatus).reduce((sum, s) => sum + s.filled, 0);
  const completionPercent = Math.round((totalFilled / totalRequired) * 100);

  return (
    <div className={styles.profileSummary}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span>A</span>
        </div>
        <div className={styles.nameInfo}>
          <h2 className={styles.fullName}>{mockProfile.personal.fullName}</h2>
          <p className={styles.email}>{mockProfile.personal.email}</p>
        </div>
        <div className={styles.completion}>
          <div className={styles.completionCircle} style={{ '--progress': completionPercent }}>
            <span className={styles.completionValue}>{completionPercent}%</span>
          </div>
          <p className={styles.completionLabel}>Profile Complete</p>
        </div>
      </div>

      <div className={styles.sections}>
        <ProfileSection
          title="Personal Information"
          icon={<User className="w-5 h-5" />}
          status={sectionStatus.personal}
          expanded={expandedSections.personal}
          onToggle={() => setExpandedSections(p => ({ ...p, personal: !p.personal }))}
          onEdit={() => onEdit?.('personal')}
          editable={editable}
        >
          <div className={styles.infoGrid}>
            <InfoRow label="Full Name" value={mockProfile.personal.fullName} icon={<User className="w-4 h-4" />} />
            <InfoRow label="Date of Birth" value={formatDate(mockProfile.personal.dateOfBirth)} icon={<Award className="w-4 h-4" />} />
            <InfoRow label="Gender" value={mockProfile.personal.gender} icon={<User className="w-4 h-4" />} />
            <InfoRow label="Category" value={mockProfile.personal.category} icon={<Award className="w-4 h-4" />}>
              <StatusBadge status={mockProfile.personal.category.toLowerCase() === 'general' ? 'eligible' : 'conditionally-eligible'} size="sm" />
            </InfoRow>
            <InfoRow label="Sub-category" value={mockProfile.personal.subCategory || '—'} icon={<HelpCircle className="w-4 h-4" />} />
            {mockProfile.personal.disability && (
              <InfoRow label="Disability" value={`${mockProfile.personal.disability} (${mockProfile.personal.disabilityPercentage}%)`} icon={<AlertCircle className="w-4 h-4" />} />
            )}
          </div>
        </ProfileSection>

        <ProfileSection
          title="Financial Information"
          icon={<IndianRupee className="w-5 h-5" />}
          status={sectionStatus.financial}
          expanded={expandedSections.financial}
          onToggle={() => setExpandedSections(p => ({ ...p, financial: !p.financial }))}
          onEdit={() => onEdit?.('financial')}
          editable={editable}
        >
          <div className={styles.infoGrid}>
            <InfoRow label="Annual Family Income" value={formatCurrency(mockProfile.financial.annualFamilyIncome)} icon={<IndianRupee className="w-4 h-4" />} />
            <InfoRow label="Income Certificate No." value={mockProfile.financial.incomeCertificateNumber} icon={<Award className="w-4 h-4" />} />
            <InfoRow label="Certificate Date" value={formatDate(mockProfile.financial.incomeCertificateDate)} icon={<Calendar className="w-4 h-4" />} />
          </div>
        </ProfileSection>

        <ProfileSection
          title="Domicile Information"
          icon={<MapPin className="w-5 h-5" />}
          status={sectionStatus.domicile}
          expanded={expandedSections.domicile}
          onToggle={() => setExpandedSections(p => ({ ...p, domicile: !p.domicile }))}
          onEdit={() => onEdit?.('domicile')}
          editable={editable}
        >
          <div className={styles.infoGrid}>
            <InfoRow label="State" value={mockProfile.domicile.state} icon={<MapPin className="w-4 h-4" />} />
            <InfoRow label="District" value={mockProfile.domicile.district} icon={<MapPin className="w-4 h-4" />} />
            <InfoRow label="Certificate No." value={mockProfile.domicile.certificateNumber} icon={<Award className="w-4 h-4" />} />
          </div>
        </ProfileSection>

        <ProfileSection
          title="Banking Details"
          icon={<IndianRupee className="w-5 h-5" />}
          status={sectionStatus.banking}
          expanded={expandedSections.banking}
          onToggle={() => setExpandedSections(p => ({ ...p, banking: !p.banking }))}
          onEdit={() => onEdit?.('banking')}
          editable={editable}
        >
          <div className={styles.infoGrid}>
            <InfoRow label="Account Holder" value={mockProfile.banking.accountHolderName} icon={<User className="w-4 h-4" />} />
            <InfoRow label="Account Number" value={mockProfile.banking.accountNumber} icon={<IndianRupee className="w-4 h-4" />} />
            <InfoRow label="IFSC Code" value={mockProfile.banking.ifscCode} icon={<MapPin className="w-4 h-4" />} />
          </div>
        </ProfileSection>

        <ProfileSection
          title="Educational Background"
          icon={<GraduationCap className="w-5 h-5" />}
          status={sectionStatus.education}
          expanded={expandedSections.education}
          onToggle={() => setExpandedSections(p => ({ ...p, education: !p.education }))}
          onEdit={() => onEdit?.('education')}
          editable={editable}
        >
          <div className={styles.educationList}>
            {mockProfile.education.map((edu) => (
              <EducationRow key={edu.id} education={edu} />
            ))}
          </div>
        </ProfileSection>
      </div>

      <div className={styles.actions}>
        {editable && (
          <Button variant="primary" onClick={() => onEdit?.('all')}>
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>
        )}
        <Button variant="secondary" onClick={() => onEdit?.('download')}>
          Download Profile
        </Button>
      </div>
    </div>
  );
}

function ProfileSection({ title, icon, status, expanded, onToggle, onEdit, editable, children }) {
  const isComplete = status.filled === status.required;

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleWrapper}>
          <div className={styles.sectionIcon}>{icon}</div>
          <div>
            <h3 className={styles.sectionTitle}>{title}</h3>
            <div className={styles.sectionProgress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${(status.filled / status.required) * 100}%` }} />
              </div>
              <span className={styles.progressText}>
                {status.filled} of {status.required} fields
              </span>
            </div>
          </div>
        </div>
        <div className={styles.sectionActions}>
          {isComplete ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="w-3 h-3" />
              Complete
            </Badge>
          ) : (
            <Badge variant="warning" size="sm">
              <AlertCircle className="w-3 h-3" />
              Incomplete
            </Badge>
          )}
          <button
            className={styles.toggleButton}
            onClick={onToggle}
            aria-expanded={expanded}
            aria-label={expanded ? `Collapse ${title}` : `Expand ${title}`}
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {editable && (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      <div className={`${styles.sectionContent} ${expanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon, children }) {
  return (
    <div className={styles.infoRow}>
      <div className={styles.infoLabel}>
        {icon && <span className={styles.infoIcon}>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className={styles.infoValue}>
        <span>{value}</span>
        {children}
      </div>
    </div>
  );
}

function EducationRow({ education }) {
  const isCurrent = education.isCurrent;
  const levelLabels = {
    '10th': '10th Grade',
    '12th': '12th Grade',
    diploma: 'Diploma',
    undergraduate: 'Undergraduate',
    postgraduate: 'Postgraduate',
    phd: 'PhD / Doctoral',
    professional: 'Professional Course',
  };

  return (
    <div className={styles.eduRow}>
      <div className={styles.eduIcon}>
        <GraduationCap className="w-5 h-5" />
      </div>
      <div className={styles.eduDetails}>
        <div className={styles.eduHeader}>
          <span className={styles.eduLevel}>{levelLabels[education.level] || education.level}</span>
          {isCurrent && <Badge variant="info" size="sm">Current</Badge>}
        </div>
        <p className={styles.eduInstitution}>{education.institutionName}</p>
        <div className={styles.eduMeta}>
          <span>{education.board || education.university}</span>
          {education.stream && <span>• {education.stream}</span>}
          <span>• {education.yearOfPassing}</span>
        </div>
        <div className={styles.eduScore}>
          {education.percentage ? (
            education.percentage > 10 ? (
              <span>CGPA: {education.percentage}/10</span>
            ) : (
              <span>{education.percentage}%</span>
            )
          ) : (
            <span className={styles.noScore}>Score not added</span>
          )}
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatCurrency(amount) {
  if (!amount) return '—';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}