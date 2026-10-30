/**
 * DEMO DATA ONLY — NOT REAL SCHOLARSHIPS
 *
 * These records are fictional placeholders for UI development and demonstration.
 * They do not represent actual government or institutional scholarship programs.
 * Always verify eligibility, deadlines, and details on official provider websites.
 */

export const mockScholarships = [
  {
    id: 'demo-001',
    name: 'Demo Merit Scholarship for Engineering Students',
    slug: 'demo-merit-engineering',
    provider: 'Demo Scholarship Foundation (Fictional)',
    providerType: 'private',
    description: 'A fictional merit-based scholarship for demonstration purposes only. This scholarship does not exist in reality. Do not apply to this program.',
    shortDescription: 'Fictional merit scholarship for engineering students with strong academic records.',
    eligibleCourses: ['B.Tech', 'B.E.', 'M.Tech', 'M.E.'],
    eligibleStates: ['All India'],
    incomeLimit: null,
    minimumMarks: '75% or 7.5 CGPA',
    deadline: '2025-12-31',
    benefit: '₹50,000 per year (DEMO — NOT REAL)',
    currency: 'INR',
    frequency: 'Annual',
    durationMonths: 12,
    applicationMode: 'Online',
    applicationUrl: 'https://example.com/demo-scholarship-001',
    officialNotificationUrl: 'https://example.com/demo-scholarship-001-notification',
    contactEmail: 'demo@example.com',
    contactPhone: '+91-0000000000',
    academicYear: '2024-25',
    scholarshipType: 'merit',
    amountMin: 50000,
    amountMax: 50000,
    amountDescription: '₹50,000 per year (DEMO — NOT REAL)',
    isVerified: false,
    verificationStatus: 'DEMO_DATA',
    lastVerifiedAt: null,
    verifiedBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requiredDocuments: [
      'Mark sheets (10th, 12th, current semester)',
      'Income certificate (if applicable)',
      'Category certificate (if applicable)',
      'Domicile certificate',
      'Bank account details',
      'Aadhaar card',
    ],
    sources: [
      {
        sourceType: 'DEMO',
        sourceUrl: 'https://example.com/demo-scholarship-001',
        sourceTitle: 'Demo Scholarship Page (Fictional)',
        isOfficial: false,
        verificationStatus: 'DEMO_DATA',
      },
    ],
  },
  {
    id: 'demo-002',
    name: 'Demo Need-Based Scholarship for Undergraduate Students',
    slug: 'demo-need-undergrad',
    provider: 'Demo Education Trust (Fictional)',
    providerType: 'ngo',
    description: 'A fictional need-based scholarship for demonstration purposes only. This scholarship does not exist in reality. Do not apply to this program.',
    shortDescription: 'Fictional need-based scholarship for low-income undergraduate students.',
    eligibleCourses: ['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech', 'B.E.', 'MBBS', 'BDS'],
    eligibleStates: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'],
    incomeLimit: 400000,
    minimumMarks: '60% or 6.0 CGPA',
    deadline: '2025-11-30',
    benefit: '₹25,000 per year (DEMO — NOT REAL)',
    currency: 'INR',
    frequency: 'Annual',
    durationMonths: 12,
    applicationMode: 'Online',
    applicationUrl: 'https://example.com/demo-scholarship-002',
    officialNotificationUrl: 'https://example.com/demo-scholarship-002-notification',
    contactEmail: 'demo2@example.com',
    contactPhone: '+91-0000000001',
    academicYear: '2024-25',
    scholarshipType: 'need',
    amountMin: 25000,
    amountMax: 25000,
    amountDescription: '₹25,000 per year (DEMO — NOT REAL)',
    isVerified: false,
    verificationStatus: 'DEMO_DATA',
    lastVerifiedAt: null,
    verifiedBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requiredDocuments: [
      'Mark sheets (10th, 12th, current semester)',
      'Income certificate (mandatory)',
      'Category certificate (if applicable)',
      'Domicile certificate',
      'Bank account details',
      'Aadhaar card',
      'BPL/AAY card (if applicable)',
    ],
    sources: [
      {
        sourceType: 'DEMO',
        sourceUrl: 'https://example.com/demo-scholarship-002',
        sourceTitle: 'Demo Scholarship Page (Fictional)',
        isOfficial: false,
        verificationStatus: 'DEMO_DATA',
      },
    ],
  },
  {
    id: 'demo-003',
    name: 'Demo Category Scholarship for SC/ST Students',
    slug: 'demo-category-sc-st',
    provider: 'Demo Social Welfare Department (Fictional)',
    providerType: 'government',
    description: 'A fictional category-based scholarship for demonstration purposes only. This scholarship does not exist in reality. Do not apply to this program.',
    shortDescription: 'Fictional scholarship for SC/ST category students pursuing higher education.',
    eligibleCourses: ['All recognized courses'],
    eligibleStates: ['All India'],
    incomeLimit: 800000,
    minimumMarks: '50% or 5.0 CGPA',
    deadline: '2026-01-15',
    benefit: '₹75,000 per year (DEMO — NOT REAL)',
    currency: 'INR',
    frequency: 'Annual',
    durationMonths: 12,
    applicationMode: 'Online',
    applicationUrl: 'https://example.com/demo-scholarship-003',
    officialNotificationUrl: 'https://example.com/demo-scholarship-003-notification',
    contactEmail: 'demo3@example.com',
    contactPhone: '+91-0000000002',
    academicYear: '2024-25',
    scholarshipType: 'minority',
    amountMin: 75000,
    amountMax: 75000,
    amountDescription: '₹75,000 per year (DEMO — NOT REAL)',
    isVerified: false,
    verificationStatus: 'DEMO_DATA',
    lastVerifiedAt: null,
    verifiedBy: 'System',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requiredDocuments: [
      'Mark sheets (10th, 12th, current semester)',
      'Caste certificate (SC/ST)',
      'Income certificate',
      'Domicile certificate',
      'Bank account details',
      'Aadhaar card',
      'Disability certificate (if applicable)',
    ],
    sources: [
      {
        sourceType: 'DEMO',
        sourceUrl: 'https://example.com/demo-scholarship-003',
        sourceTitle: 'Demo Scholarship Page (Fictional)',
        isOfficial: false,
        verificationStatus: 'DEMO_DATA',
      },
    ],
  },
];

export function getScholarshipById(id) {
  return mockScholarships.find((s) => s.id === id || s.slug === id);
}

export function getScholarshipsBySlug(slug) {
  return mockScholarships.find((s) => s.slug === slug);
}

export function searchScholarships(query) {
  const lowerQuery = query.toLowerCase();
  return mockScholarships.filter((s) =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.provider.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.eligibleCourses.some((c) => c.toLowerCase().includes(lowerQuery)) ||
    s.eligibleStates.some((st) => st.toLowerCase().includes(lowerQuery))
  );
}