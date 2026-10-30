/**
 * Tests for scholarshipMatcher.js
 * Run with: node src/utils/scholarshipMatcher.test.js
 * (No test framework installed per task requirements)
 */

import { 
  matchStudentToScholarship, 
  matchStudentToScholarships,
  MATCH_STATUS,
  getStatusLabel,
  getStatusVariant,
  parseAcademicMarks,
  parseScholarshipMinimumMarks,
  parseStudentIncomeRange,
  checkCourseMatch,
  checkStateMatch,
  checkIncomeMatch,
  checkMarksMatch,
} from './scholarshipMatcher.js';

// Test scholarship records (mirroring mockScholarships.js structure)
const demoScholarships = [
  {
    id: 'demo-001',
    name: 'Demo Merit Scholarship for Engineering Students',
    eligibleCourses: ['B.Tech', 'B.E.', 'M.Tech', 'M.E.'],
    eligibleStates: ['All India'],
    incomeLimit: null,
    minimumMarks: '75% or 7.5 CGPA',
    verificationStatus: 'DEMO_DATA',
    isVerified: false,
  },
  {
    id: 'demo-002',
    name: 'Demo Need-Based Scholarship for Undergraduate Students',
    eligibleCourses: ['B.A.', 'B.Sc.', 'B.Com.', 'B.Tech', 'B.E.', 'MBBS', 'BDS'],
    eligibleStates: ['Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi'],
    incomeLimit: 400000,
    minimumMarks: '60% or 6.0 CGPA',
    verificationStatus: 'DEMO_DATA',
    isVerified: false,
  },
  {
    id: 'demo-003',
    name: 'Demo Category Scholarship for SC/ST Students',
    eligibleCourses: ['All recognized courses'],
    eligibleStates: ['All India'],
    incomeLimit: 800000,
    minimumMarks: '50% or 5.0 CGPA',
    verificationStatus: 'DEMO_DATA',
    isVerified: false,
  },
];

// Test student profiles
const testProfiles = {
  // Strong engineering student from Maharashtra
  engineeringStudent: {
    fullName: 'Alex Sharma',
    state: 'maharashtra',
    studyLevel: 'undergraduate',
    course: 'B.Tech Computer Science',
    institution: 'College of Engineering, Pune',
    incomeRange: '500000-800000',
    academicMarks: '85%',
    category: 'obc',
  },
  
  // Low income arts student from Karnataka
  artsStudentLowIncome: {
    fullName: 'Priya Patel',
    state: 'karnataka',
    studyLevel: 'undergraduate',
    course: 'B.A. Economics',
    institution: 'University of Mysore',
    incomeRange: '0-100000',
    academicMarks: '70%',
    category: 'general',
  },
  
  // High income student exceeding limits
  highIncomeStudent: {
    fullName: 'Rich Student',
    state: 'delhi',
    studyLevel: 'undergraduate',
    course: 'B.Tech Mechanical',
    institution: 'Delhi Tech University',
    incomeRange: '1500000+',
    academicMarks: '90%',
    category: 'general',
  },
  
  // Student with missing details
  incompleteProfile: {
    fullName: 'Incomplete User',
    state: '',
    studyLevel: '',
    course: '',
    institution: '',
    incomeRange: '',
    academicMarks: '',
    category: '',
  },
  
  // Student with CGPA format
  cgpaStudent: {
    fullName: 'CGPA Student',
    state: 'tamil-nadu',
    studyLevel: 'undergraduate',
    course: 'B.Sc. Physics',
    institution: 'Madras University',
    incomeRange: '0-100000',
    academicMarks: '8.2 CGPA',
    category: 'sc',
  },
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message) {
  const pass = actual === expected;
  if (pass) {
    console.log(`✓ PASS: ${message} (${actual})`);
    passed++;
  } else {
    console.error(`✗ FAIL: ${message} — expected "${expected}", got "${actual}"`);
    failed++;
  }
}

console.log('=== Parsing Tests ===');

// parseAcademicMarks
assert(parseAcademicMarks('85%')?.value === 85 && parseAcademicMarks('85%')?.type === 'percentage', 'parseAcademicMarks: percentage with %');
assert(parseAcademicMarks('85')?.value === 85 && parseAcademicMarks('85')?.type === 'percentage', 'parseAcademicMarks: percentage without %');
assert(parseAcademicMarks('8.7 CGPA')?.value === 8.7 && parseAcademicMarks('8.7 CGPA')?.type === 'cgpa', 'parseAcademicMarks: CGPA format');
assert(parseAcademicMarks('8.7/10')?.value === 8.7 && parseAcademicMarks('8.7/10')?.type === 'cgpa', 'parseAcademicMarks: fraction format');
// Plain number > 10 treated as percentage, <= 10 as CGPA
assert(parseAcademicMarks('9.5')?.value === 9.5 && parseAcademicMarks('9.5')?.type === 'cgpa', 'parseAcademicMarks: plain CGPA <= 10');
assert(parseAcademicMarks('85')?.value === 85 && parseAcademicMarks('85')?.type === 'percentage', 'parseAcademicMarks: plain percentage > 10');
assertEqual(parseAcademicMarks(''), null, 'parseAcademicMarks: empty string');
assertEqual(parseAcademicMarks(null), null, 'parseAcademicMarks: null');
assertEqual(parseAcademicMarks('invalid'), null, 'parseAcademicMarks: invalid string');

// parseScholarshipMinimumMarks
const minMarks1 = parseScholarshipMinimumMarks('75% or 7.5 CGPA');
assert(minMarks1?.percentage === 75 && minMarks1?.cgpa === 7.5, 'parseScholarshipMinimumMarks: both percentage and CGPA');

const minMarks2 = parseScholarshipMinimumMarks('60% or 6.0 CGPA');
assert(minMarks2?.percentage === 60 && minMarks2?.cgpa === 6.0, 'parseScholarshipMinimumMarks: second scholarship');

const minMarks3 = parseScholarshipMinimumMarks('50% or 5.0 CGPA');
assert(minMarks3?.percentage === 50 && minMarks3?.cgpa === 5.0, 'parseScholarshipMinimumMarks: third scholarship');

assertEqual(parseScholarshipMinimumMarks(''), null, 'parseScholarshipMinimumMarks: empty');
assertEqual(parseScholarshipMinimumMarks(null), null, 'parseScholarshipMinimumMarks: null');

// parseStudentIncomeRange
assertEqual(parseStudentIncomeRange('0-100000'), 100000, 'parseStudentIncomeRange: low range');
assertEqual(parseStudentIncomeRange('500000-800000'), 800000, 'parseStudentIncomeRange: mid range');
assertEqual(parseStudentIncomeRange('1500000+'), 1500001, 'parseStudentIncomeRange: high range with + (strictly greater)');
assertEqual(parseStudentIncomeRange('prefer-not-to-say'), null, 'parseStudentIncomeRange: prefer not to say');
assertEqual(parseStudentIncomeRange(''), null, 'parseStudentIncomeRange: empty');
assertEqual(parseStudentIncomeRange(null), null, 'parseStudentIncomeRange: null');

console.log('\n=== Criteria Matching Tests ===');

// checkCourseMatch
assert(checkCourseMatch('B.Tech Computer Science', ['B.Tech', 'B.E.']) === true, 'checkCourseMatch: exact match B.Tech');
assert(checkCourseMatch('B.E. Mechanical', ['B.Tech', 'B.E.']) === true, 'checkCourseMatch: exact match B.E.');
assert(checkCourseMatch('B.A. History', ['B.Tech', 'B.E.']) === false, 'checkCourseMatch: no match');
assert(checkCourseMatch('B.Tech CS', ['All recognized courses']) === true, 'checkCourseMatch: broad eligibility');
assert(checkCourseMatch('', ['B.Tech']) === null, 'checkCourseMatch: empty student course');
assert(checkCourseMatch('B.Tech', []) === null, 'checkCourseMatch: empty eligible courses');
assert(checkCourseMatch(null, ['B.Tech']) === null, 'checkCourseMatch: null student course');

// checkStateMatch
assert(checkStateMatch('maharashtra', ['Maharashtra', 'Karnataka']) === true, 'checkStateMatch: case insensitive match');
assert(checkStateMatch('Maharashtra', ['maharashtra', 'karnataka']) === true, 'checkStateMatch: case insensitive match 2');
assert(checkStateMatch('gujarat', ['Maharashtra', 'Karnataka']) === false, 'checkStateMatch: no match');
assert(checkStateMatch('punjab', ['All India']) === true, 'checkStateMatch: All India');
assert(checkStateMatch('', ['Maharashtra']) === null, 'checkStateMatch: empty student state');
assert(checkStateMatch('maharashtra', []) === null, 'checkStateMatch: empty eligible states');

// checkIncomeMatch
assert(checkIncomeMatch('500000-800000', 400000) === false, 'checkIncomeMatch: exceeds limit');
assert(checkIncomeMatch('0-100000', 400000) === true, 'checkIncomeMatch: within limit');
assert(checkIncomeMatch('250000-500000', 800000) === true, 'checkIncomeMatch: within higher limit');
assert(checkIncomeMatch('prefer-not-to-say', 400000) === null, 'checkIncomeMatch: prefer not to say');
assert(checkIncomeMatch('', 400000) === null, 'checkIncomeMatch: empty income');
assert(checkIncomeMatch('500000-800000', null) === null, 'checkIncomeMatch: no scholarship limit');

// checkMarksMatch
assert(checkMarksMatch('85%', '75% or 7.5 CGPA') === true, 'checkMarksMatch: percentage meets');
assert(checkMarksMatch('70%', '75% or 7.5 CGPA') === false, 'checkMarksMatch: percentage fails');
assert(checkMarksMatch('8.7 CGPA', '75% or 7.5 CGPA') === true, 'checkMarksMatch: CGPA meets');
assert(checkMarksMatch('7.0 CGPA', '75% or 7.5 CGPA') === false, 'checkMarksMatch: CGPA fails');
assert(checkMarksMatch('8.2 CGPA', '60% or 6.0 CGPA') === true, 'checkMarksMatch: CGPA meets lower req');
assert(checkMarksMatch('85%', '60% or 6.0 CGPA') === true, 'checkMarksMatch: percentage meets lower req');
assert(checkMarksMatch('', '75%') === null, 'checkMarksMatch: empty student marks');
assert(checkMarksMatch('85%', '') === null, 'checkMarksMatch: empty scholarship marks');

console.log('\n=== Full Matching Tests ===');

// Test 1: Engineering student matches demo-001 (merit, engineering, all India, no income limit, 75% min)
const match1 = matchStudentToScholarship(testProfiles.engineeringStudent, demoScholarships[0]);
assert(match1.status === MATCH_STATUS.ELIGIBLE, 'Engineering student: eligible for demo-001');
assert(match1.isDemo === true, 'Engineering student: demo flag set');
assert(match1.reasons.some(r => r.includes('✓')), 'Engineering student: has passing reasons');
assert(match1.matchScore === 100, 'Engineering student: 100% match score');

// Test 2: Engineering student matches demo-002 (need-based, income limit 4L, student has 5-8L)
const match2 = matchStudentToScholarship(testProfiles.engineeringStudent, demoScholarships[1]);
assert(match2.status === MATCH_STATUS.INELIGIBLE, 'Engineering student: ineligible for demo-002 (income)');
assert(match2.reasons.some(r => r.includes('exceeds')), 'Engineering student: income exceed reason');

// Test 3: Engineering student matches demo-003 (category SC/ST, student is OBC)
const match3 = matchStudentToScholarship(testProfiles.engineeringStudent, demoScholarships[2]);
// Note: The matcher doesn't check category yet, so this will be eligible/needs-verification based on other criteria
assert(match3.isDemo === true, 'Engineering student: demo flag for demo-003');

// Test 4: Arts student low income matches demo-002 (income within 4L, course B.A. eligible, state Karnataka eligible)
const match4 = matchStudentToScholarship(testProfiles.artsStudentLowIncome, demoScholarships[1]);
assert(match4.status === MATCH_STATUS.ELIGIBLE, 'Arts low income: eligible for demo-002');
assert(match4.matchScore === 100, 'Arts low income: 100% match score');

// Test 5: Arts student matches demo-001 (course B.A. not in engineering courses)
const match5 = matchStudentToScholarship(testProfiles.artsStudentLowIncome, demoScholarships[0]);
assert(match5.status === MATCH_STATUS.INELIGIBLE, 'Arts student: ineligible for demo-001 (course)');
assert(match5.reasons.some(r => r.includes('does not match')), 'Arts student: course mismatch reason');

// Test 6: High income student fails income check for demo-002
const match6 = matchStudentToScholarship(testProfiles.highIncomeStudent, demoScholarships[1]);
assert(match6.status === MATCH_STATUS.INELIGIBLE, 'High income: ineligible for demo-002');
assert(match6.reasons.some(r => r.includes('exceeds')), 'High income: income exceed reason');

// Test 7: High income student for demo-003 (income limit 8L, student has 15L+)
const match7 = matchStudentToScholarship(testProfiles.highIncomeStudent, demoScholarships[2]);
assert(match7.status === MATCH_STATUS.INELIGIBLE, 'High income: ineligible for demo-003 (income)');

// Test 8: Incomplete profile - all criteria unknown
const match8 = matchStudentToScholarship(testProfiles.incompleteProfile, demoScholarships[0]);
assert(match8.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Incomplete profile: needs verification');
assert(match8.hasUnknownCriteria === true, 'Incomplete profile: has unknown criteria');
assert(match8.reasons.some(r => r.includes('unclear') || r.includes('verify')), 'Incomplete profile: verification reasons');

// Test 9: CGPA student matches demo-003 (All India, All courses, income limit 8L, min 5.0 CGPA)
const match9 = matchStudentToScholarship(testProfiles.cgpaStudent, demoScholarships[2]);
assert(match9.status === MATCH_STATUS.ELIGIBLE, 'CGPA student: eligible for demo-003');
assert(match9.matchScore === 100, 'CGPA student: 100% match score for demo-003');

// Test 10: CGPA student for demo-001 (engineering only) - should be ineligible due to course
const match10 = matchStudentToScholarship(testProfiles.cgpaStudent, demoScholarships[0]);
assert(match10.status === MATCH_STATUS.INELIGIBLE, 'CGPA student: ineligible for demo-001 (course mismatch)');
assert(match10.reasons.some(r => r.includes('does not match')), 'CGPA student: course mismatch reason for demo-001');

// Test 11: CGPA student for demo-002 (specific states, income limit 4L) - income OK but state/course issues
const match11 = matchStudentToScholarship(testProfiles.cgpaStudent, demoScholarships[1]);
assert(match11.status === MATCH_STATUS.INELIGIBLE, 'CGPA student: ineligible for demo-002 (state/course)');

console.log('\n=== Multi-Scholarship Matching Tests ===');

const allMatches = matchStudentToScholarships(testProfiles.engineeringStudent, demoScholarships);
assert(allMatches.length === 3, 'Multi-match: returns all 3 scholarships');
assert(allMatches[0].scholarship.id === 'demo-001', 'Multi-match: demo-001 first (eligible)');
assert(allMatches[1].scholarship.id === 'demo-003', 'Multi-match: demo-003 second (needs-verification or potentially)');
assert(allMatches[2].scholarship.id === 'demo-002', 'Multi-match: demo-002 last (ineligible)');

const artsMatches = matchStudentToScholarships(testProfiles.artsStudentLowIncome, demoScholarships);
assert(artsMatches[0].scholarship.id === 'demo-002', 'Arts student: demo-002 first (eligible)');
assert(artsMatches[1].scholarship.id === 'demo-003', 'Arts student: demo-003 second');
assert(artsMatches[2].scholarship.id === 'demo-001', 'Arts student: demo-001 last (ineligible)');

console.log('\n=== Status Helpers Tests ===');

assertEqual(getStatusLabel(MATCH_STATUS.ELIGIBLE), 'Eligible', 'getStatusLabel: eligible');
assertEqual(getStatusLabel(MATCH_STATUS.POTENTIALLY_ELIGIBLE), 'Potentially Eligible', 'getStatusLabel: potentially-eligible');
assertEqual(getStatusLabel(MATCH_STATUS.INELIGIBLE), 'Not Eligible', 'getStatusLabel: ineligible');
assertEqual(getStatusLabel(MATCH_STATUS.NEEDS_VERIFICATION), 'Needs Verification', 'getStatusLabel: needs-verification');

assertEqual(getStatusVariant(MATCH_STATUS.ELIGIBLE), 'success', 'getStatusVariant: eligible');
assertEqual(getStatusVariant(MATCH_STATUS.POTENTIALLY_ELIGIBLE), 'warning', 'getStatusVariant: potentially-eligible');
assertEqual(getStatusVariant(MATCH_STATUS.INELIGIBLE), 'error', 'getStatusVariant: ineligible');
assertEqual(getStatusVariant(MATCH_STATUS.NEEDS_VERIFICATION), 'info', 'getStatusVariant: needs-verification');

console.log('\n=== Edge Cases ===');

// Empty scholarship list
const emptyMatches = matchStudentToScholarships(testProfiles.engineeringStudent, []);
assert(emptyMatches.length === 0, 'Empty scholarships: returns empty array');

// Null profile
const nullMatches = matchStudentToScholarships(null, demoScholarships);
assert(nullMatches.length === 0, 'Null profile: returns empty array');

// Scholarship with no explicit criteria
const vagueScholarship = {
  id: 'vague-001',
  name: 'Vague Scholarship',
  eligibleCourses: [],
  eligibleStates: [],
  incomeLimit: null,
  minimumMarks: '',
  verificationStatus: 'PENDING',
  isVerified: false,
};
const vagueMatch = matchStudentToScholarship(testProfiles.engineeringStudent, vagueScholarship);
assert(vagueMatch.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Vague scholarship: needs verification');
assert(vagueMatch.reasons.some(r => r.includes('No explicit')), 'Vague scholarship: explains no criteria');

console.log('\n=== Additional Edge Cases ===');

// parseAcademicMarks edge cases
const m10 = parseAcademicMarks('10');
assert(m10?.value === 10 && m10?.type === 'cgpa', 'parseAcademicMarks: "10" as CGPA (<=10)');
const m10_0 = parseAcademicMarks('10.0');
assert(m10_0?.value === 10.0 && m10_0?.type === 'cgpa', 'parseAcademicMarks: "10.0" as CGPA');
const m100 = parseAcademicMarks('100');
assert(m100?.value === 100 && m100?.type === 'percentage', 'parseAcademicMarks: "100" as percentage (>10)');
const m100p = parseAcademicMarks('100%');
assert(m100p?.value === 100 && m100p?.type === 'percentage', 'parseAcademicMarks: "100%" as percentage');
assertEqual(parseAcademicMarks('105%'), null, 'parseAcademicMarks: "105%" out of range (null)');
assertEqual(parseAcademicMarks('11 CGPA'), null, 'parseAcademicMarks: "11 CGPA" out of range (null)');
assertEqual(parseAcademicMarks('-5%'), null, 'parseAcademicMarks: negative percentage (null)');
assertEqual(parseAcademicMarks('-1 CGPA'), null, 'parseAcademicMarks: negative CGPA (null)');
const m0p = parseAcademicMarks('0%');
assert(m0p?.value === 0 && m0p?.type === 'percentage', 'parseAcademicMarks: "0%" as percentage');
const m0c = parseAcademicMarks('0 CGPA');
assert(m0c?.value === 0 && m0c?.type === 'cgpa', 'parseAcademicMarks: "0 CGPA" as CGPA');
assertEqual(parseAcademicMarks('8.7/0'), null, 'parseAcademicMarks: division by zero (null)');
assertEqual(parseAcademicMarks('abc'), null, 'parseAcademicMarks: non-numeric (null)');
const mSpace = parseAcademicMarks('85 %');
assert(mSpace?.value === 85 && mSpace?.type === 'percentage', 'parseAcademicMarks: space before % (allowed by regex)');
const mTrim = parseAcademicMarks(' 85% ');
assert(mTrim?.value === 85 && mTrim?.type === 'percentage', 'parseAcademicMarks: whitespace trimmed');

// parseScholarshipMinimumMarks edge cases
const psmm1 = parseScholarshipMinimumMarks('70% or 8.0 CGPA');
assert(psmm1?.percentage === 70 && psmm1?.cgpa === 8.0, 'parseScholarshipMinimumMarks: conflicting - 8 CGPA = 80%');
const psmm2 = parseScholarshipMinimumMarks('60%');
assert(psmm2?.percentage === 60 && psmm2?.cgpa === null, 'parseScholarshipMinimumMarks: percentage only');
const psmm3 = parseScholarshipMinimumMarks('7.5 CGPA');
assert(psmm3?.percentage === null && psmm3?.cgpa === 7.5, 'parseScholarshipMinimumMarks: CGPA only');
const psmm4 = parseScholarshipMinimumMarks('minimum 75%');
assert(psmm4?.percentage === 75 && psmm4?.cgpa === null, 'parseScholarshipMinimumMarks: with prefix text');

// parseStudentIncomeRange edge cases
assertEqual(parseStudentIncomeRange('400000'), 400000, 'parseStudentIncomeRange: exact value (boundary)');
assertEqual(parseStudentIncomeRange('0-0'), 0, 'parseStudentIncomeRange: zero range');

// checkIncomeMatch boundary values
assert(checkIncomeMatch('0-400000', 400000) === true, 'checkIncomeMatch: exactly at limit (inclusive)');
assert(checkIncomeMatch('400000-400000', 400000) === true, 'checkIncomeMatch: single value at limit');
assert(checkIncomeMatch('400001', 400000) === false, 'checkIncomeMatch: just over limit');
assert(checkIncomeMatch('400000+', 400000) === false, 'checkIncomeMatch: plus format at limit (exceeds)');

// checkCourseMatch edge cases
assert(checkCourseMatch('B.Tech', ['B.Tech', 'B.E.']) === true, 'checkCourseMatch: exact match');
assert(checkCourseMatch('B.Tech CSE', ['B.Tech']) === true, 'checkCourseMatch: student course contains eligible');
assert(checkCourseMatch('B.Tech', ['B.Tech CSE']) === true, 'checkCourseMatch: eligible contains student course');
assert(checkCourseMatch('M.Tech', ['B.Tech']) === false, 'checkCourseMatch: different level');
assert(checkCourseMatch('b.tech', ['B.TECH']) === true, 'checkCourseMatch: case insensitive');
assert(checkCourseMatch('B.Tech', []) === null, 'checkCourseMatch: empty eligible courses = unknown');
assert(checkCourseMatch('', ['B.Tech']) === null, 'checkCourseMatch: empty student course = unknown');

// checkStateMatch edge cases
assert(checkStateMatch('maharashtra', ['MAHARASHTRA']) === true, 'checkStateMatch: case insensitive');
assert(checkStateMatch('Maharashtra', ['maharashtra', 'karnataka']) === true, 'checkStateMatch: in list');
assert(checkStateMatch('Gujarat', ['Maharashtra', 'Karnataka']) === false, 'checkStateMatch: not in list');
assert(checkStateMatch('', ['All India']) === null, 'checkStateMatch: empty student state = unknown even with All India');
assert(checkStateMatch('maharashtra', []) === null, 'checkStateMatch: empty eligible states = unknown');

// checkMarksMatch cross-type edge cases
assert(checkMarksMatch('80%', '8.0 CGPA') === true, 'checkMarksMatch: 80% >= 8.0 CGPA (cross-type)');
assert(checkMarksMatch('75%', '8.0 CGPA') === false, 'checkMarksMatch: 75% < 8.0 CGPA (cross-type)');
assert(checkMarksMatch('8.0 CGPA', '75%') === true, 'checkMarksMatch: 8.0 CGPA >= 75% (cross-type)');
assert(checkMarksMatch('7.0 CGPA', '75%') === false, 'checkMarksMatch: 7.0 CGPA < 75% (cross-type)');
assert(checkMarksMatch('8.5 CGPA', '75% or 7.5 CGPA') === true, 'checkMarksMatch: CGPA meets both');
assert(checkMarksMatch('7.2 CGPA', '75% or 7.5 CGPA') === false, 'checkMarksMatch: CGPA fails both');

// Matching with missing student fields - should NEVER be eligible
const partialProfile1 = { ...testProfiles.engineeringStudent, course: '' };
const matchPartial1 = matchStudentToScholarship(partialProfile1, demoScholarships[0]);
assert(matchPartial1.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Missing course: needs verification');
assert(matchPartial1.hasUnknownCriteria === true, 'Missing course: has unknown criteria');

const partialProfile2 = { ...testProfiles.engineeringStudent, incomeRange: '' };
const matchPartial2 = matchStudentToScholarship(partialProfile2, demoScholarships[1]);
assert(matchPartial2.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Missing income: needs verification (demo-002 has limit)');

const partialProfile3 = { ...testProfiles.engineeringStudent, academicMarks: '' };
const matchPartial3 = matchStudentToScholarship(partialProfile3, demoScholarships[0]);
assert(matchPartial3.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Missing marks: needs verification');

const partialProfile4 = { ...testProfiles.artsStudentLowIncome, state: '' };
const matchPartial4 = matchStudentToScholarship(partialProfile4, demoScholarships[1]);
assert(matchPartial4.status === MATCH_STATUS.NEEDS_VERIFICATION, 'Missing state: needs verification (demo-002 has state list)');
assert(matchPartial4.hasUnknownCriteria === true, 'Missing state: has unknown criteria');

// Scholarship with ambiguous criteria - "All recognized courses"
const broadScholarship = {
  ...demoScholarships[0],
  id: 'broad-001',
  eligibleCourses: ['All recognized courses', 'Any course'],
  eligibleStates: ['All India'],
  incomeLimit: null,
  minimumMarks: '50%',
};
const broadMatch = matchStudentToScholarship(testProfiles.artsStudentLowIncome, broadScholarship);
assert(broadMatch.status === MATCH_STATUS.ELIGIBLE, 'Broad course eligibility: eligible');

// Multiple criteria - one failing makes ineligible
const multiFailProfile = { ...testProfiles.engineeringStudent, incomeRange: '1500000+' };
const multiFailMatch = matchStudentToScholarship(multiFailProfile, demoScholarships[1]);
assert(multiFailMatch.status === MATCH_STATUS.INELIGIBLE, 'One failing criterion: ineligible');
assert(multiFailMatch.hasFailingCriteria === true, 'One failing criterion: has failing criteria');

// Match score calculation edge cases
const singleCriteriaScholarship = {
  ...demoScholarships[0],
  id: 'single-001',
  eligibleCourses: ['B.Tech'],
  eligibleStates: [],
  incomeLimit: null,
  minimumMarks: '',
};
const singleMatch = matchStudentToScholarship(testProfiles.engineeringStudent, singleCriteriaScholarship);
assert(singleMatch.evaluatedCriteria === 1, 'Single criteria: evaluated = 1');
assert(singleMatch.passedCriteria === 1, 'Single criteria: passed = 1');
assert(singleMatch.matchScore === 100, 'Single criteria: score = 100%');

// Demo flag detection
assert(matchStudentToScholarship(testProfiles.engineeringStudent, demoScholarships[0]).isDemo === true, 'Demo flag: DEMO_DATA verificationStatus');
assert(matchStudentToScholarship(testProfiles.engineeringStudent, { ...demoScholarships[0], verificationStatus: 'VERIFIED', isVerified: true, provider: 'Real Foundation' }).isDemo === false, 'Demo flag: verified not demo');
assert(matchStudentToScholarship(testProfiles.engineeringStudent, { ...demoScholarships[0], verificationStatus: 'VERIFIED', isVerified: true }).isDemo === false, 'Demo flag: isVerified true not demo');

// Status label and variant helpers
assert(getStatusLabel('unknown') === 'Unknown', 'getStatusLabel: unknown status returns Unknown');
assert(getStatusVariant('unknown') === 'default', 'getStatusVariant: unknown status returns default');

console.log('\n=== Summary ===');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(failed > 0 ? '\n❌ SOME TESTS FAILED' : '\n✅ ALL TESTS PASSED');

process.exit(failed > 0 ? 1 : 0);