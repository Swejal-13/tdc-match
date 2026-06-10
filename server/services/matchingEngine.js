/**
 * TDC Matching Engine
 * Gender-specific compatibility scoring algorithm
 */

function calcMaleScore(customer, match) {
  let score = 0;
  const reasons = [];

  // Age Compatibility (25 pts) — prefer younger women
  const ageDiff = match.age - customer.age;
  if (ageDiff <= 0 && ageDiff >= -8) {
    score += 25;
    reasons.push(`${match.firstName} is ${Math.abs(ageDiff)} years younger — ideal age compatibility`);
  } else if (ageDiff > 0 && ageDiff <= 3) {
    score += 15;
    reasons.push('Age difference is within acceptable range');
  } else {
    score += 5;
    reasons.push('Age difference is larger than preferred');
  }

  // Height Compatibility (15 pts) — prefer shorter women
  if (match.height < customer.height) {
    score += 15;
    reasons.push(`${match.firstName} at ${match.height}cm is shorter — preferred height compatibility`);
  } else {
    score += 8;
  }

  // Income Compatibility (20 pts) — prefer lower income
  if (match.income <= customer.income) {
    score += 20;
    reasons.push('Income compatibility is excellent — balanced financial dynamic');
  } else {
    score += 10;
    reasons.push('Income levels are comparable');
  }

  // Children Preference (25 pts) — exact match required
  if (customer.wantsKids === match.wantsKids) {
    score += 25;
    reasons.push(`Both ${customer.wantsKids ? 'want' : 'do not want'} children — strong alignment on family planning`);
  } else {
    reasons.push('Differing views on children — requires discussion');
  }

  // Location Compatibility (15 pts)
  if (customer.city === match.city) {
    score += 15;
    reasons.push(`Both are based in ${customer.city} — convenient for meetings`);
  } else {
    score += 0;
    reasons.push(`Distance between ${customer.city} and ${match.city} — relocation discussion needed`);
  }

  return { score: Math.min(98, score), reasons };
}

function calcFemaleScore(customer, match) {
  let score = 0;
  const reasons = [];

  // Career Compatibility (25 pts)
  const highCareer = ['Doctor', 'Lawyer', 'Entrepreneur', 'Product Manager', 'Data Scientist'];
  if (highCareer.includes(match.profession)) {
    score += 25;
    reasons.push(`${match.firstName} is a ${match.profession} — strong career profile`);
  } else if (match.profession === customer.profession) {
    score += 20;
    reasons.push('Shared professional background creates strong common ground');
  } else {
    score += 12;
    reasons.push(`${match.firstName}'s career in ${match.profession} offers a complementary perspective`);
  }

  // Education Compatibility (20 pts)
  const topColleges = ['IIT Bombay', 'IIT Delhi', 'IIM Ahmedabad', 'ISB Hyderabad', 'BITS Pilani'];
  if (topColleges.includes(match.college)) {
    score += 20;
    reasons.push(`${match.firstName} holds a degree from ${match.college} — premium educational background`);
  } else {
    score += 14;
    reasons.push(`${match.firstName} is well-educated from ${match.college}`);
  }

  // Values Compatibility (20 pts)
  if (match.familyValues === customer.familyValues) {
    score += 20;
    reasons.push(`Shared ${customer.familyValues.toLowerCase()} family values — foundational compatibility`);
  } else if (
    (customer.familyValues === 'Traditional' && match.familyValues === 'Moderate') ||
    (customer.familyValues === 'Liberal' && match.familyValues === 'Moderate')
  ) {
    score += 12;
    reasons.push('Compatible but slightly different family values — room for growth');
  } else {
    score += 5;
    reasons.push('Different family value orientations — requires understanding');
  }

  // Location Compatibility (15 pts)
  if (customer.city === match.city) {
    score += 15;
    reasons.push(`Both in ${customer.city} — logistically convenient`);
  } else {
    score += 8;
    reasons.push(`Different cities — one partner may need to relocate`);
  }

  // Relocation Compatibility (10 pts)
  if (customer.openToRelocate) {
    score += 10;
    reasons.push('Open to relocation — expands match possibilities significantly');
  } else {
    score += 5;
  }

  // Lifestyle Compatibility (10 pts)
  if (match.lifestyle === customer.lifestyle) {
    score += 10;
    reasons.push(`Matching ${customer.lifestyle.toLowerCase()} lifestyle — day-to-day harmony`);
  } else {
    score += 5;
    reasons.push('Lifestyle differences can be bridged with communication');
  }

  return { score: Math.min(98, score), reasons };
}

function getCompatibilityLevel(score) {
  if (score >= 90) return 'Exceptional Match';
  if (score >= 80) return 'High Potential Match';
  if (score >= 70) return 'Good Match';
  if (score >= 60) return 'Moderate Match';
  return 'Weak Match';
}

function calculateCompatibility(customer, match) {
  let result;
  if (customer.gender === 'Male') {
    result = calcMaleScore(customer, match);
  } else {
    result = calcFemaleScore(customer, match);
  }

  return {
    score: result.score,
    compatibilityLevel: getCompatibilityLevel(result.score),
    reasons: result.reasons,
  };
}

module.exports = { calculateCompatibility, getCompatibilityLevel };
