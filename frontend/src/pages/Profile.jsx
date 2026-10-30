import { useState, useEffect } from 'react';
import { User, MapPin, GraduationCap, Building2, IndianRupee, Award, AlertCircle, CheckCircle, RotateCcw, Save, Eye, EyeOff } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import styles from './Profile.module.css';

const STORAGE_KEY = 'scholarpath_student_profile';

const studyLevels = [
  { value: '', label: 'Select study level' },
  { value: '10th', label: '10th / Secondary' },
  { value: '12th', label: '12th / Higher Secondary' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'undergraduate', label: 'Undergraduate (Bachelor\'s)' },
  { value: 'postgraduate', label: 'Postgraduate (Master\'s)' },
  { value: 'phd', label: 'PhD / Doctoral' },
  { value: 'professional', label: 'Professional Course' },
];

const incomeRanges = [
  { value: '', label: 'Select income range' },
  { value: '0-100000', label: 'Below ₹1,00,000' },
  { value: '100000-250000', label: '₹1,00,000 – ₹2,50,000' },
  { value: '250000-500000', label: '₹2,50,000 – ₹5,00,000' },
  { value: '500000-800000', label: '₹5,00,000 – ₹8,00,000' },
  { value: '800000-1500000', label: '₹8,00,000 – ₹15,00,000' },
  { value: '1500000+', label: 'Above ₹15,00,000' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const categories = [
  { value: '', label: 'Select category' },
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC (Other Backward Classes)' },
  { value: 'sc', label: 'SC (Scheduled Castes)' },
  { value: 'st', label: 'ST (Scheduled Tribes)' },
  { value: 'ews', label: 'EWS (Economically Weaker Section)' },
  { value: 'minority', label: 'Minority' },
  { value: 'pwd', label: 'PwD (Persons with Disability)' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
];

const states = [
  { value: '', label: 'Select state / UT' },
  { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
  { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
  { value: 'assam', label: 'Assam' },
  { value: 'bihar', label: 'Bihar' },
  { value: 'chhattisgarh', label: 'Chhattisgarh' },
  { value: 'goa', label: 'Goa' },
  { value: 'gujarat', label: 'Gujarat' },
  { value: 'haryana', label: 'Haryana' },
  { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
  { value: 'jharkhand', label: 'Jharkhand' },
  { value: 'karnataka', label: 'Karnataka' },
  { value: 'kerala', label: 'Kerala' },
  { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
  { value: 'maharashtra', label: 'Maharashtra' },
  { value: 'manipur', label: 'Manipur' },
  { value: 'meghalaya', label: 'Meghalaya' },
  { value: 'mizoram', label: 'Mizoram' },
  { value: 'nagaland', label: 'Nagaland' },
  { value: 'odisha', label: 'Odisha' },
  { value: 'punjab', label: 'Punjab' },
  { value: 'rajasthan', label: 'Rajasthan' },
  { value: 'sikkim', label: 'Sikkim' },
  { value: 'tamil-nadu', label: 'Tamil Nadu' },
  { value: 'telangana', label: 'Telangana' },
  { value: 'tripura', label: 'Tripura' },
  { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
  { value: 'uttarakhand', label: 'Uttarakhand' },
  { value: 'west-bengal', label: 'West Bengal' },
  { value: 'delhi', label: 'Delhi' },
  { value: 'jammu-kashmir', label: 'Jammu & Kashmir' },
  { value: 'ladakh', label: 'Ladakh' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'puducherry', label: 'Puducherry' },
];

const initialFormState = {
  fullName: '',
  state: '',
  studyLevel: '',
  course: '',
  institution: '',
  incomeRange: '',
  academicMarks: '',
  category: '',
};

function loadFromStorage() {
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

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (_) {
    return false;
  }
}

export default function Profile() {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [storageAvailable] = useState(() => {
    try {
      localStorage.setItem('__test__', '__test__');
      localStorage.removeItem('__test__');
      return true;
    } catch (_) {
      return false;
    }
  });

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setFormData((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.state) {
      newErrors.state = 'Please select your state of residence';
    }
    if (!formData.studyLevel) {
      newErrors.studyLevel = 'Please select your current study level';
    }
    if (!formData.course.trim()) {
      newErrors.course = 'Course name is required';
    }
    if (!formData.institution.trim()) {
      newErrors.institution = 'Institution name is required';
    }
    if (!formData.incomeRange) {
      newErrors.incomeRange = 'Please select an income range';
    }
    if (!formData.academicMarks.trim()) {
      newErrors.academicMarks = 'Academic marks or percentage is required';
    }
    if (!formData.category) {
      newErrors.category = 'Please select your category';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
      return;
    }
    setIsSubmitting(true);
    const saved = saveToStorage(formData);
    setIsSubmitting(false);
    if (saved) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } else {
      setShowError(true);
      setTimeout(() => setShowError(false), 4000);
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
    setShowSuccess(false);
    setShowError(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const getIncomeRangeLabel = (value) => {
    const found = incomeRanges.find((r) => r.value === value);
    return found ? found.label : value;
  };

  const getCategoryLabel = (value) => {
    const found = categories.find((c) => c.value === value);
    return found ? found.label : value;
  };

  const getStudyLevelLabel = (value) => {
    const found = studyLevels.find((s) => s.value === value);
    return found ? found.label : value;
  };

  const getStateLabel = (value) => {
    const found = states.find((s) => s.value === value);
    return found ? found.label : value;
  };

  const hasSavedData = Object.values(formData).some((v) => v && v !== '');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Student Profile</h1>
            <p className={styles.subtitle}>
              Manage your profile information for personalized scholarship matching.
              Data is stored locally in your browser for this demo.
            </p>
          </div>
          {hasSavedData && (
            <Badge variant="success" size="sm" className={styles.savedBadge}>
              <CheckCircle className="w-3 h-3" />
              Profile saved locally
            </Badge>
          )}
        </div>
      </header>

      {!storageAvailable && (
        <div className={styles.storageWarning} role="alert">
          <AlertCircle className="w-4 h-4" />
          <span>
            <strong>Local storage unavailable.</strong> Your profile will not persist after page reload.
            Enable localStorage or use a supported browser for data persistence.
          </span>
        </div>
      )}

      {showSuccess && (
        <div className={`${styles.toast} ${styles.success}`} role="status" aria-live="polite">
          <CheckCircle className="w-5 h-5" />
          <span>Profile saved successfully! Your information is stored locally in this browser.</span>
        </div>
      )}

      {showError && (
        <div className={`${styles.toast} ${styles.error}`} role="alert" aria-live="assertive">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to save profile. Please try again.</span>
        </div>
      )}

      <form onSubmit={handleSave} className={styles.form} noValidate>
        <div className={styles.formGrid}>
          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic details used for scholarship matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                error={errors.fullName}
                required
                autoComplete="name"
                leftIcon={<User className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <MapPin className="w-5 h-5" />
                Domicile
              </CardTitle>
              <CardDescription>
                State of residence for state-specific scholarships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="State / Union Territory"
                placeholder="Select your state"
                options={states}
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
                error={errors.state}
                required
                leftIcon={<MapPin className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <GraduationCap className="w-5 h-5" />
                Current Education
              </CardTitle>
              <CardDescription>
                Your ongoing or most recent academic program
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.educationFields}>
              <Select
                label="Study Level"
                placeholder="Select study level"
                options={studyLevels}
                value={formData.studyLevel}
                onChange={(e) => handleChange('studyLevel', e.target.value)}
                error={errors.studyLevel}
                required
                leftIcon={<GraduationCap className="w-4 h-4" />}
              />
              <Input
                label="Course / Program"
                placeholder="e.g., B.Tech Computer Science, B.A. Economics"
                value={formData.course}
                onChange={(e) => handleChange('course', e.target.value)}
                error={errors.course}
                required
                leftIcon={<GraduationCap className="w-4 h-4" />}
              />
              <Input
                label="Institution Name"
                placeholder="e.g., College of Engineering, Pune"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                error={errors.institution}
                required
                leftIcon={<Building2 className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <IndianRupee className="w-5 h-5" />
                Family Income
              </CardTitle>
              <CardDescription>
                Annual household income for need-based scholarship eligibility
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="Annual Family Income Range"
                placeholder="Select income range"
                options={incomeRanges}
                value={formData.incomeRange}
                onChange={(e) => handleChange('incomeRange', e.target.value)}
                error={errors.incomeRange}
                required
                leftIcon={<IndianRupee className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <Award className="w-5 h-5" />
                Academic Performance
              </CardTitle>
              <CardDescription>
                Latest percentage or CGPA for merit-based scholarships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                label="Marks / Percentage / CGPA"
                placeholder="e.g., 85% or 8.7 CGPA"
                value={formData.academicMarks}
                onChange={(e) => handleChange('academicMarks', e.target.value)}
                error={errors.academicMarks}
                required
                helperText="Enter percentage (e.g., 85%) or CGPA (e.g., 8.7/10)"
                leftIcon={<Award className="w-4 h-4" />}
              />
            </CardContent>
          </Card>

          <Card variant="default" padding="md" className={styles.card}>
            <CardHeader>
              <CardTitle as="h2">
                <Award className="w-5 h-5" />
                Category
              </CardTitle>
              <CardDescription>
                Social category for reservation-based scholarships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                label="Category"
                placeholder="Select your category"
                options={categories}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                error={errors.category}
                required
                leftIcon={<Award className="w-4 h-4" />}
              />
            </CardContent>
          </Card>
        </div>

        <CardFooter className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleReset} disabled={isSubmitting}>
            <RotateCcw className="w-4 h-4" />
            Reset Form
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting} disabled={isSubmitting}>
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        </CardFooter>
      </form>

      <div className={styles.disclaimer}>
        <div className={styles.disclaimerIcon}>
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className={styles.disclaimerContent}>
          <h3>Demo Notice — Important</h3>
          <ul>
            <li>
              <strong>Local storage only:</strong> Profile data is saved in your browser's localStorage.
              It is <strong>not sent to any server</strong> and persists only on this device/browser.
            </li>
            <li>
              <strong>No real eligibility check:</strong> This demo does not calculate actual scholarship
              eligibility. Match scores shown elsewhere are simulated for UI demonstration.
            </li>
            <li>
              <strong>Not verified:</strong> All scholarship data in this application is fictional demo data.
              Always verify eligibility, deadlines, and requirements on official provider websites.
            </li>
            <li>
              <strong>Privacy:</strong> We do not collect or transmit personal information in this demo.
              In a production system, data would be encrypted and protected per applicable privacy laws.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}