/**
 * Scholarship Matching Utility
 * Pure JavaScript utility for evaluating student eligibility against scholarship criteria.
 * 
 * Rules:
 * - Only evaluate criteria explicitly provided in the scholarship record
 * - Handle missing student details as unknown (never silently pass/fail)
 * - If criteria are ambiguous or required details missing, explain what needs verification
 * - Do not invent rules from names, providers, or category labels
 * - Demo records are marked clearly
 */

// Status constants
export const MATCH_STATUS = {
  ELIGIBLE: 'eligible',
  POTENTIALLY_ELIGIBLE: 'potentially-eligible',
  INELIGIBLE: 'ineligible',
  NEEDS_VERIFICATION: 'needs-verification',
};

/**
 * Parse academic marks string (e.g., "85%" or "8.7 CGPA" or "8.7/10")
 * Returns { value: number, type: 'percentage' | 'cgpa' } or null if invalid
 */
export function parseAcademicMarks(marksStr) {
  if (!marksStr || typeof marksStr !== 'string') return null;
  
  const trimmed = marksStr.trim();
  
  // Try CGPA format first: "8.7 CGPA" or "8.7/10" or plain number <= 10
  const cgpaMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*(?:CGPA|\/10)?$/i);
  if (cgpaMatch) {
    const value = parseFloat(cgpaMatch[1]);
    if (value <= 10) {
      return { value, type: 'cgpa' };
    }
  }
  
  // Try percentage format: "85%" or "85 %" (requires % sign)
  const percentMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*%$/);
  if (percentMatch) {
    const value = parseFloat(percentMatch[1]);
    if (value <= 100) {
      return { value, type: 'percentage' };
    }
  }
  
  // Try plain number > 10 as percentage (e.g., "85" = 85%)
  const plainNumberMatch = trimmed.match(/^(\d+(?:\.\d+)?)$/);
  if (plainNumberMatch) {
    const value = parseFloat(plainNumberMatch[1]);
    if (value > 10 && value <= 100) {
      return { value, type: 'percentage' };
    }
  }
  
  // Try "X/Y" format
  const fractionMatch = trimmed.match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    if (denominator > 0) {
      return { value: (numerator / denominator) * 100, type: 'percentage' };
    }
  }
  
  return null;
}

/**
 * Parse scholarship minimum marks requirement (e.g., "75% or 7.5 CGPA")
 * Returns { percentage: number, cgpa: number } or null if not parseable
 */
export function parseScholarshipMinimumMarks(marksStr) {
  if (!marksStr || typeof marksStr !== 'string') return null;
  
  const result = { percentage: null, cgpa: null };
  const lower = marksStr.toLowerCase();
  
  // Extract percentage
  const percentMatch = lower.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) {
    result.percentage = parseFloat(percentMatch[1]);
  }
  
  // Extract CGPA
  const cgpaMatch = lower.match(/(\d+(?:\.\d+)?)\s*cgpa/);
  if (cgpaMatch) {
    result.cgpa = parseFloat(cgpaMatch[1]);
  }
  
  // If no explicit CGPA but has percentage, we can estimate CGPA (roughly percentage/10)
  // But we'll only use what's explicitly provided
  
  return (result.percentage !== null || result.cgpa !== null) ? result : null;
}

/**
 * Parse income range from student profile (e.g., "250000-500000")
 * Returns max value in rupees or null if not parseable/prefer-not-to-say
 * For "X+" format, returns X+1 to indicate strictly greater than X
 */
export function parseStudentIncomeRange(incomeRange) {
  if (!incomeRange || incomeRange === 'prefer-not-to-say') return null;
  
  // Handle "1500000+" format - strictly greater than the value
  if (incomeRange.endsWith('+')) {
    return parseInt(incomeRange.replace('+', ''), 10) + 1;
  }
  
  // Handle "min-max" format, return max
  const parts = incomeRange.split('-');
  if (parts.length === 2) {
    return parseInt(parts[1], 10);
  }
  
  // Single value
  return parseInt(incomeRange, 10) || null;
}

/**
 * Check if student's course matches scholarship eligible courses
 * Returns: true (matches), false (doesn't match), null (unknown/missing)
 */
export function checkCourseMatch(studentCourse, eligibleCourses) {
  if (!studentCourse || !eligibleCourses || eligibleCourses.length === 0) {
    return null; // Unknown - can't evaluate
  }
  
  const studentCourseLower = studentCourse.toLowerCase().trim();
  
  // Check for "All recognized courses" or similar broad eligibility
  const hasBroadEligibility = eligibleCourses.some(c => 
    c.toLowerCase().includes('all') || 
    c.toLowerCase().includes('any')
  );
  if (hasBroadEligibility) return true;
  
  // Check if any eligible course is contained in student's course or vice versa
  for (const ec of eligibleCourses) {
    const ecLower = ec.toLowerCase().trim();
    if (studentCourseLower.includes(ecLower) || ecLower.includes(studentCourseLower)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Check if student's state matches scholarship eligible states
 * Returns: true (matches), false (doesn't match), null (unknown/missing)
 */
export function checkStateMatch(studentState, eligibleStates) {
  if (!studentState || !eligibleStates || eligibleStates.length === 0) {
    return null; // Unknown
  }
  
  // "All India" means all states eligible
  const hasAllIndia = eligibleStates.some(s => 
    s.toLowerCase().includes('all india') || 
    s.toLowerCase() === 'all'
  );
  if (hasAllIndia) return true;
  
  return eligibleStates.some(s => 
    s.toLowerCase() === studentState.toLowerCase()
  );
}

/**
 * Check if student's income is within scholarship limit
 * Returns: true (within limit), false (exceeds limit), null (unknown/missing)
 */
export function checkIncomeMatch(studentIncomeRange, scholarshipIncomeLimit) {
  if (scholarshipIncomeLimit === null || scholarshipIncomeLimit === undefined) {
    return null; // No income limit specified by scholarship
  }
  
  const studentMaxIncome = parseStudentIncomeRange(studentIncomeRange);
  if (studentMaxIncome === null) {
    return null; // Student didn't provide income or prefers not to say
  }
  
  return studentMaxIncome <= scholarshipIncomeLimit;
}

/**
 * Check if student's academic marks meet scholarship minimum
 * Returns: true (meets), false (doesn't meet), null (unknown/missing)
 */
export function checkMarksMatch(studentMarksStr, scholarshipMinMarksStr) {
  if (!scholarshipMinMarksStr) {
    return null; // No minimum marks specified by scholarship
  }
  
  const studentMarks = parseAcademicMarks(studentMarksStr);
  const scholarshipMin = parseScholarshipMinimumMarks(scholarshipMinMarksStr);
  
  if (!studentMarks || !scholarshipMin) {
    return null; // Can't parse one or both
  }
  
  if (studentMarks.type === 'percentage' && scholarshipMin.percentage !== null) {
    return studentMarks.value >= scholarshipMin.percentage;
  }
  
  if (studentMarks.type === 'cgpa' && scholarshipMin.cgpa !== null) {
    return studentMarks.value >= scholarshipMin.cgpa;
  }
  
  // Cross-type comparison: if student has percentage but scholarship has CGPA, convert
  if (studentMarks.type === 'percentage' && scholarshipMin.cgpa !== null) {
    const studentCgpa = studentMarks.value / 10;
    return studentCgpa >= scholarshipMin.cgpa;
  }
  
  // If student has CGPA but scholarship has percentage
  if (studentMarks.type === 'cgpa' && scholarshipMin.percentage !== null) {
    const studentPercentage = studentMarks.value * 10;
    return studentPercentage >= scholarshipMin.percentage;
  }
  
  return null;
}

/**
 * Main matching function
 * @param {Object} studentProfile - Student profile from localStorage/form
 * @param {Object} scholarship - Scholarship record from mockScholarships
 * @returns {Object} Match result with status, reasons, isDemo
 */
export function matchStudentToScholarship(studentProfile, scholarship) {
  const reasons = [];
  let hasFailingCriteria = false;
  let hasUnknownCriteria = false;
  let hasVerifiedFailures = false;
  let evaluatedCriteria = 0;
  let passedCriteria = 0;
  
  // Determine if demo data
  const isDemo = scholarship.verificationStatus === 'DEMO_DATA' || 
                 scholarship.isVerified === false ||
                 (scholarship.provider?.includes('(Fictional)') === true && 
                  scholarship.verificationStatus !== 'VERIFIED' && 
                  scholarship.isVerified !== true);
  
  // 1. Course matching
  if (scholarship.eligibleCourses && scholarship.eligibleCourses.length > 0) {
    evaluatedCriteria++;
    const courseMatch = checkCourseMatch(studentProfile.course, scholarship.eligibleCourses);
    if (courseMatch === true) {
      passedCriteria++;
      reasons.push(`✓ Course "${studentProfile.course || 'your course'}" matches eligible courses: ${scholarship.eligibleCourses.join(', ')}`);
    } else if (courseMatch === false) {
      hasFailingCriteria = true;
      reasons.push(`✗ Course "${studentProfile.course || 'your course'}" does not match eligible courses: ${scholarship.eligibleCourses.join(', ')}`);
    } else {
      hasUnknownCriteria = true;
      reasons.push(`? Course eligibility unclear — scholarship requires: ${scholarship.eligibleCourses.join(', ')}. Please verify if your course qualifies.`);
    }
  }
  
  // 2. State/Domicile matching
  if (scholarship.eligibleStates && scholarship.eligibleStates.length > 0) {
    evaluatedCriteria++;
    const stateMatch = checkStateMatch(studentProfile.state, scholarship.eligibleStates);
    if (stateMatch === true) {
      passedCriteria++;
      reasons.push(`✓ Your state "${studentProfile.state || 'selected state'}" is eligible for this scholarship`);
    } else if (stateMatch === false) {
      hasFailingCriteria = true;
      reasons.push(`✗ Your state "${studentProfile.state || 'selected state'}" is not in eligible states: ${scholarship.eligibleStates.join(', ')}`);
    } else {
      hasUnknownCriteria = true;
      reasons.push(`? State eligibility unclear — eligible states: ${scholarship.eligibleStates.join(', ')}. Please verify your domicile.`);
    }
  }
  
  // 3. Income limit
  if (scholarship.incomeLimit !== null && scholarship.incomeLimit !== undefined) {
    evaluatedCriteria++;
    const incomeMatch = checkIncomeMatch(studentProfile.incomeRange, scholarship.incomeLimit);
    if (incomeMatch === true) {
      passedCriteria++;
      reasons.push(`✓ Your income range is within the ₹${scholarship.incomeLimit.toLocaleString()} limit`);
    } else if (incomeMatch === false) {
      hasFailingCriteria = true;
      reasons.push(`✗ Your income range exceeds the ₹${scholarship.incomeLimit.toLocaleString()} limit`);
    } else {
      hasUnknownCriteria = true;
      reasons.push(`? Income verification needed — scholarship limit: ₹${scholarship.incomeLimit.toLocaleString()}. Please provide income certificate.`);
    }
  }
  
  // 4. Minimum marks
  if (scholarship.minimumMarks) {
    evaluatedCriteria++;
    const marksMatch = checkMarksMatch(studentProfile.academicMarks, scholarship.minimumMarks);
    if (marksMatch === true) {
      passedCriteria++;
      reasons.push(`✓ Your marks (${studentProfile.academicMarks}) meet the minimum requirement (${scholarship.minimumMarks})`);
    } else if (marksMatch === false) {
      hasFailingCriteria = true;
      reasons.push(`✗ Your marks (${studentProfile.academicMarks}) do not meet the minimum requirement (${scholarship.minimumMarks})`);
    } else {
      hasUnknownCriteria = true;
      reasons.push(`? Marks verification needed — minimum required: ${scholarship.minimumMarks}. Please provide mark sheets.`);
    }
  }
  
  // Determine overall status
  let status;
  if (hasFailingCriteria) {
    status = MATCH_STATUS.INELIGIBLE;
  } else if (hasUnknownCriteria) {
    status = MATCH_STATUS.NEEDS_VERIFICATION;
  } else if (evaluatedCriteria > 0 && passedCriteria === evaluatedCriteria) {
    status = MATCH_STATUS.ELIGIBLE;
  } else if (evaluatedCriteria === 0) {
    status = MATCH_STATUS.NEEDS_VERIFICATION;
    reasons.push('No explicit eligibility criteria found in scholarship record. Manual verification required.');
  } else {
    status = MATCH_STATUS.POTENTIALLY_ELIGIBLE;
  }
  
  // Build summary
  const matchScore = evaluatedCriteria > 0 ? Math.round((passedCriteria / evaluatedCriteria) * 100) : 0;
  
  return {
    status,
    reasons,
    isDemo,
    matchScore,
    evaluatedCriteria,
    passedCriteria,
    hasUnknownCriteria,
    hasFailingCriteria,
  };
}

/**
 * Match student profile against multiple scholarships
 * @param {Object} studentProfile 
 * @param {Array} scholarships 
 * @returns {Array} Array of { scholarship, matchResult }
 */
export function matchStudentToScholarships(studentProfile, scholarships) {
  if (!studentProfile || !scholarships || !Array.isArray(scholarships)) {
    return [];
  }
  
  return scholarships.map(scholarship => ({
    scholarship,
    matchResult: matchStudentToScholarship(studentProfile, scholarship),
  })).sort((a, b) => {
    // Sort by: eligible first, then potentially-eligible, then needs-verification, then ineligible
    const statusOrder = {
      [MATCH_STATUS.ELIGIBLE]: 0,
      [MATCH_STATUS.POTENTIALLY_ELIGIBLE]: 1,
      [MATCH_STATUS.NEEDS_VERIFICATION]: 2,
      [MATCH_STATUS.INELIGIBLE]: 3,
    };
    const aOrder = statusOrder[a.matchResult.status] ?? 4;
    const bOrder = statusOrder[b.matchResult.status] ?? 4;
    if (aOrder !== bOrder) return aOrder - bOrder;
    // Then by match score descending
    return b.matchResult.matchScore - a.matchResult.matchScore;
  });
}

/**
 * Get human-readable status label
 */
export function getStatusLabel(status) {
  const labels = {
    [MATCH_STATUS.ELIGIBLE]: 'Eligible',
    [MATCH_STATUS.POTENTIALLY_ELIGIBLE]: 'Potentially Eligible',
    [MATCH_STATUS.INELIGIBLE]: 'Not Eligible',
    [MATCH_STATUS.NEEDS_VERIFICATION]: 'Needs Verification',
  };
  return labels[status] || 'Unknown';
}

/**
 * Get status variant for Badge component
 */
export function getStatusVariant(status) {
  const variants = {
    [MATCH_STATUS.ELIGIBLE]: 'success',
    [MATCH_STATUS.POTENTIALLY_ELIGIBLE]: 'warning',
    [MATCH_STATUS.INELIGIBLE]: 'error',
    [MATCH_STATUS.NEEDS_VERIFICATION]: 'info',
  };
  return variants[status] || 'default';
}