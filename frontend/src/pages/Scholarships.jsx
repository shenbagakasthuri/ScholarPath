import { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, Sparkles } from 'lucide-react';
import { mockScholarships } from '../data/mockScholarships';
import ScholarshipCard from '../components/scholarship/ScholarshipCard';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import Input from '../components/ui/Input';
import styles from './Scholarships.module.css';

function transformScholarshipForCard(scholarship) {
  return {
    ...scholarship,
    title: scholarship.name,
    providerName: scholarship.provider,
    applicationEndDate: scholarship.deadline,
    applicationStartDate: null,
  };
}

export default function Scholarships() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');

  const filteredScholarships = useMemo(() => {
    let result = mockScholarships;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((s) =>
        s.name.toLowerCase().includes(query) ||
        s.provider.toLowerCase().includes(query) ||
        s.shortDescription.toLowerCase().includes(query)
      );
    }

    if (selectedType !== 'all') {
      result = result.filter((s) => s.scholarshipType === selectedType);
    }

    if (selectedProvider !== 'all') {
      result = result.filter((s) => s.providerType === selectedProvider);
    }

    return result;
  }, [searchQuery, selectedType, selectedProvider]);

  const types = useMemo(() => [...new Set(mockScholarships.map((s) => s.scholarshipType))], []);
  const providers = useMemo(() => [...new Set(mockScholarships.map((s) => s.providerType))], []);

  const formatType = (type) => {
    const labels = {
      merit: 'Merit-based',
      need: 'Need-based',
      merit_need: 'Merit & Need',
      sports: 'Sports',
      minority: 'Minority/Category',
      disability: 'Disability',
      women: 'Women',
      general: 'General',
    };
    return labels[type] || type;
  };

  const formatProvider = (provider) => {
    const labels = {
      government: 'Government',
      state: 'State Government',
      central: 'Central Government',
      university: 'University',
      private: 'Private',
      ngo: 'NGO/Foundation',
      corporate: 'Corporate',
      international: 'International',
    };
    return labels[provider] || provider;
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Explore Scholarships</h1>
            <p className={styles.subtitle}>
              Browse {mockScholarships.length} demo scholarship opportunities. Filter by type, provider, or search keywords.
            </p>
          </div>
          <Badge variant="warning" size="md" className={styles.demoBadge}>
            <AlertCircle className="w-3 h-3" />
            Demo Data — Not Verified
          </Badge>
        </div>
      </header>

      <div className={styles.filtersBar}>
        <div className={styles.searchWrapper}>
          <Input
            placeholder="Search by name, provider, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <div className={styles.filterGroup}>
          <select
            className={styles.filterSelect}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            aria-label="Filter by scholarship type"
          >
            <option value="all">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>{formatType(type)}</option>
            ))}
          </select>
          <select
            className={styles.filterSelect}
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            aria-label="Filter by provider type"
          >
            <option value="all">All Providers</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>{formatProvider(provider)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <span>{filteredScholarships.length} of {mockScholarships.length} scholarships</span>
        {searchQuery && (
          <button
            className={styles.clearSearch}
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <Sparkles className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {filteredScholarships.length > 0 ? (
        <div className={styles.grid} role="list" aria-label="Scholarship listings">
          {filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={transformScholarshipForCard(scholarship)}
              compact={false}
              showMatchScore={false}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Filter className="w-12 h-12" />}
          title="No scholarships found"
          description="Try adjusting your search or filters to find matching opportunities."
          action={
            <button
              className={styles.resetButton}
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setSelectedProvider('all');
              }}
            >
              <Sparkles className="w-4 h-4" />
              Reset Filters
            </button>
          }
        />
      )}

      <DemoDisclaimer />
    </div>
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

function DemoDisclaimer() {
  return (
    <div className={styles.demoDisclaimer}>
      <Sparkles className="w-4 h-4" />
      <div>
        <strong>Demo Notice:</strong> All scholarships shown are fictional demo records for UI development.
        They do not represent real programs. Provider names, amounts, deadlines, and eligibility criteria
        are simulated. Always verify information on official government or institution websites before applying.
      </div>
    </div>
  );
}