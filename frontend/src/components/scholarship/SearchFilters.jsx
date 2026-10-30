import { useState, useEffect } from 'react';
import { X, Filter, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Badge from '../ui/Badge';
import styles from './SearchFilters.module.css';

const scholarshipTypes = [
  { value: 'merit', label: 'Merit-based' },
  { value: 'need', label: 'Need-based' },
  { value: 'merit_need', label: 'Merit & Need' },
  { value: 'sports', label: 'Sports' },
  { value: 'minority', label: 'Minority' },
  { value: 'disability', label: 'Disability' },
  { value: 'women', label: 'Women' },
  { value: 'general', label: 'General' },
];

const providerTypes = [
  { value: 'government', label: 'Government' },
  { value: 'state', label: 'State Government' },
  { value: 'central', label: 'Central Government' },
  { value: 'university', label: 'University' },
  { value: 'private', label: 'Private' },
  { value: 'ngo', label: 'NGO/Foundation' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'international', label: 'International' },
];

const educationLevels = [
  { value: '10th', label: '10th / Secondary' },
  { value: '12th', label: '12th / Higher Secondary' },
  { value: 'diploma', label: 'Diploma' },
  { value: 'undergraduate', label: 'Undergraduate' },
  { value: 'postgraduate', label: 'Postgraduate' },
  { value: 'phd', label: 'PhD / Doctoral' },
  { value: 'professional', label: 'Professional Courses' },
];

const categories = [
  { value: 'general', label: 'General' },
  { value: 'obc', label: 'OBC' },
  { value: 'sc', label: 'SC' },
  { value: 'st', label: 'ST' },
  { value: 'ews', label: 'EWS' },
  { value: 'minority', label: 'Minority' },
  { value: 'pwd', label: 'PwD' },
];

const states = [
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

export default function SearchFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  resultCount = 0,
  isLoading = false,
}) {
  const [expandedSections, setExpandedSections] = useState({
    type: true,
    provider: false,
    education: false,
    personal: false,
    location: false,
  });
  const [searchQuery, setSearchQuery] = useState(filters.query || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, query: searchQuery });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filters, onFiltersChange]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleMultiSelectChange = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFiltersChange({ ...filters, [key]: updated });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'query') return value && value.length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== '';
  });

  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'query') return count + (value && value.length > 0 ? 1 : 0);
    if (Array.isArray(value)) return count + value.length;
    return count + (value !== undefined && value !== null && value !== '' ? 1 : 0);
  }, 0);

  return (
    <aside className={styles.filters} aria-label="Search filters">
      <div className={styles.header}>
        <h2 className={styles.title}>
          <Filter className="w-5 h-5" aria-hidden="true" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="w-4 h-4" aria-hidden="true" />
            Clear All
          </Button>
        )}
      </div>

      <div className={styles.searchBox}>
        <Input
          placeholder="Search scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>}
        />
      </div>

      <div className={styles.sections}>
        <FilterSection
          title="Scholarship Type"
          key="type"
          expanded={expandedSections.type}
          onToggle={() => toggleSection('type')}
        >
          <div className={styles.checkboxGroup}>
            {scholarshipTypes.map(({ value, label }) => (
              <label key={value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.scholarshipTypes?.includes(value) || false}
                  onChange={() => handleMultiSelectChange('scholarshipTypes', value)}
                />
                <span className={styles.checkboxText}>{label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Provider Type"
          key="provider"
          expanded={expandedSections.provider}
          onToggle={() => toggleSection('provider')}
        >
          <div className={styles.checkboxGroup}>
            {providerTypes.map(({ value, label }) => (
              <label key={value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.providerTypes?.includes(value) || false}
                  onChange={() => handleMultiSelectChange('providerTypes', value)}
                />
                <span className={styles.checkboxText}>{label}</span>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Education Level"
          key="education"
          expanded={expandedSections.education}
          onToggle={() => toggleSection('education')}
        >
          <Select
            placeholder="Select education level"
            options={educationLevels}
            value={filters.educationLevel || ''}
            onChange={(e) => onFiltersChange({ ...filters, educationLevel: e.target.value })}
          />
        </FilterSection>

        <FilterSection
          title="Category"
          key="personal"
          expanded={expandedSections.personal}
          onToggle={() => toggleSection('personal')}
        >
          <div className={styles.checkboxGroup}>
            {categories.map(({ value, label }) => (
              <label key={value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={filters.categories?.includes(value) || false}
                  onChange={() => handleMultiSelectChange('categories', value)}
                />
                <span className={styles.checkboxText}>{label}</span>
              </label>
            ))}
          </div>

          <div className={styles.inputRow}>
            <Input
              label="Min Percentage / CGPA"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 75"
              value={filters.minPercentage || ''}
              onChange={(e) => onFiltersChange({ ...filters, minPercentage: e.target.value })}
            />
            <Input
              label="Max Family Income (₹)"
              type="number"
              min="0"
              step="10000"
              placeholder="e.g., 800000"
              value={filters.maxFamilyIncome || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxFamilyIncome: e.target.value })}
            />
          </div>
        </FilterSection>

        <FilterSection
          title="Location (Domicile)"
          key="location"
          expanded={expandedSections.location}
          onToggle={() => toggleSection('location')}
        >
          <Select
            placeholder="Select state"
            options={states}
            value={filters.domicileState || ''}
            onChange={(e) => onFiltersChange({ ...filters, domicileState: e.target.value })}
          />
        </FilterSection>
      </div>

      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          <h3 className={styles.activeTitle}>Active Filters ({activeFilterCount})</h3>
          <div className={styles.activeTags}>
            {filters.query && (
              <Badge variant="default" size="sm" onRemove={() => onFiltersChange({ ...filters, query: '' })}>
                Search: "{filters.query}"
              </Badge>
            )}
            {filters.scholarshipTypes?.map((v) => (
              <Badge key={v} variant="default" size="sm" onRemove={() => handleMultiSelectChange('scholarshipTypes', v)}>
                {scholarshipTypes.find((t) => t.value === v)?.label}
              </Badge>
            ))}
            {filters.providerTypes?.map((v) => (
              <Badge key={v} variant="default" size="sm" onRemove={() => handleMultiSelectChange('providerTypes', v)}>
                {providerTypes.find((t) => t.value === v)?.label}
              </Badge>
            ))}
            {filters.educationLevel && (
              <Badge variant="default" size="sm" onRemove={() => onFiltersChange({ ...filters, educationLevel: '' })}>
                {educationLevels.find((t) => t.value === filters.educationLevel)?.label}
              </Badge>
            )}
            {filters.categories?.map((v) => (
              <Badge key={v} variant="default" size="sm" onRemove={() => handleMultiSelectChange('categories', v)}>
                {categories.find((t) => t.value === v)?.label}
              </Badge>
            ))}
            {filters.domicileState && (
              <Badge variant="default" size="sm" onRemove={() => onFiltersChange({ ...filters, domicileState: '' })}>
                {states.find((t) => t.value === filters.domicileState)?.label}
              </Badge>
            )}
            {filters.minPercentage && (
              <Badge variant="default" size="sm" onRemove={() => onFiltersChange({ ...filters, minPercentage: '' })}>
                Min %: {filters.minPercentage}%
              </Badge>
            )}
            {filters.maxFamilyIncome && (
              <Badge variant="default" size="sm" onRemove={() => onFiltersChange({ ...filters, maxFamilyIncome: '' })}>
                Max Income: ₹{Number(filters.maxFamilyIncome).toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      )}

      <div className={styles.resultsInfo}>
        {isLoading ? (
          <span className={styles.loading}>Searching...</span>
        ) : (
          <span>{resultCount} scholarship{resultCount !== 1 ? 's' : ''} found</span>
        )}
      </div>
    </aside>
  );
}

function FilterSection({ title, expanded, onToggle, children }) {
  return (
    <div className={styles.section}>
      <button
        className={styles.sectionHeader}
        onClick={onToggle}
        aria-expanded={expanded}
        type="button"
      >
        <span className={styles.sectionTitle}>{title}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      <div className={`${styles.sectionContent} ${expanded ? styles.expanded : ''}`}>
        {children}
      </div>
    </div>
  );
}