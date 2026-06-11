const { GoogleGenAI } = require('@google/genai');

let ai;
function getAI() {
  if (!ai) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

const MODEL = 'gemini-2.0-flash';

/**
 * Generate a human-readable match explanation
 */
async function explainMatch(customer, match, score, reasons) {
  const prompt = `You are a professional matchmaker at TDC, a premium Indian matchmaking service.

Customer Profile:
- Name: ${customer.firstName} ${customer.lastName}
- Age: ${customer.age}, Gender: ${customer.gender}
- City: ${customer.city}, Profession: ${customer.profession}
- Religion: ${customer.religion}, Family Values: ${customer.familyValues}
- Wants Kids: ${customer.wantsKids ? 'Yes' : 'No'}
- Lifestyle: ${customer.lifestyle}, Personality: ${customer.personality}

Match Profile:
- Name: ${match.firstName} ${match.lastName}
- Age: ${match.age}, Gender: ${match.gender}
- City: ${match.city}, Profession: ${match.profession}
- College: ${match.college}, Income: ₹${match.income}L
- Religion: ${match.religion}, Family Values: ${match.familyValues}

Compatibility Score: ${score}%
Key Reasons: ${reasons.join('; ')}

Write a warm, professional 2-3 sentence explanation of why this is a good match. Focus on shared values, complementary traits, and long-term compatibility. Be specific and personal. Do not use bullet points.`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.error('Gemini explainMatch error:', err.message);
    return generateFallbackExplanation(customer, match, score, reasons);
  }
}

/**
 * Generate a personalised introduction message
 */
async function generateIntroMessage(customer, match, score) {
  const prompt = `You are a professional matchmaker at TDC, a premium Indian matchmaking service.

Write a warm, personalised introduction message to send to ${customer.firstName} about their potential match ${match.firstName}.

Customer: ${customer.firstName} ${customer.lastName}, ${customer.age}, ${customer.profession} from ${customer.city}
Match: ${match.firstName} ${match.lastName}, ${match.age}, ${match.profession} from ${match.city} (${match.college})
Compatibility Score: ${score}%
Shared values: ${customer.familyValues === match.familyValues ? 'Similar family values' : 'Complementary backgrounds'}

Write exactly 2-3 sentences. Start with "Hi ${customer.firstName}," — be warm, specific, and encouraging without being pushy. Mention one specific shared quality.`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.error('Gemini generateIntroMessage error:', err.message);
    return `Hi ${customer.firstName}, we'd like to introduce ${match.firstName}, a ${match.profession} from ${match.city} who shares your ${customer.familyValues.toLowerCase()} family values and vision for the future. We believe this could be a meaningful connection worth exploring.`;
  }
}

/**
 * AI Matchmaker Assistant — answer questions about a customer
 */
async function assistantQuery(customer, question) {
  const profile = `
Customer Profile:
- Name: ${customer.firstName} ${customer.lastName}
- Age: ${customer.age}, Gender: ${customer.gender}, City: ${customer.city}
- Profession: ${customer.profession} at ${customer.company || 'N/A'}, Income: ₹${customer.income || 'N/A'}L
- College: ${customer.college}, Designation: ${customer.designation}
- Religion: ${customer.religion}, Caste: ${customer.caste}
- Marital Status: ${customer.maritalStatus}, Manglik: ${customer.manglik}
- Family Values: ${customer.familyValues}, Family Type: ${customer.familyType}
- Diet: ${customer.diet}, Smoking: ${customer.smoking}, Drinking: ${customer.drinking}
- Lifestyle: ${customer.lifestyle}, Personality: ${customer.personality}
- Wants Kids: ${customer.wantsKids ? 'Yes' : 'No'}, Open to Relocate: ${customer.openToRelocate ? 'Yes' : 'No'}
- Hobbies: ${JSON.parse(customer.hobbies || '[]').join(', ')}
- Partner Preferences: Age ${customer.prefAgeMin}–${customer.prefAgeMax}, City: ${customer.prefCity}, Religion: ${customer.prefReligion}
`;

  const prompt = `You are an expert matchmaker at TDC, a premium Indian matchmaking CRM. A colleague is asking you about a client.

${profile}

Question: ${question}

Answer professionally and helpfully in 3-5 sentences. Be specific to this profile. If asked to suggest matches, describe the ideal profile characteristics based on their preferences.`;

  try {
    const response = await getAI().models.generateContent({
      model: MODEL,
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    console.error('Gemini assistant error:', err.message);
    return generateFallbackAssistant(customer, question);
  }
}

function generateFallbackExplanation(customer, match, score, reasons) {
  const top = reasons.slice(0, 2).join(' and ');
  return `${match.firstName} and ${customer.firstName} show strong compatibility at ${score}% — ${top.toLowerCase()}. Their shared ${customer.familyValues.toLowerCase()} values and life goals suggest a strong foundation for a meaningful relationship. This pairing has excellent potential for long-term compatibility.`;
}

function generateFallbackAssistant(customer, question) {
  const q = question.toLowerCase();
  if (q.includes('summarize') || q.includes('profile')) {
    return `${customer.firstName} is a ${customer.age}-year-old ${customer.profession} from ${customer.city}, holding a degree from ${customer.college}. ${customer.gender === 'Female' ? 'She' : 'He'} is ${customer.maritalStatus.toLowerCase()} with ${customer.familyValues.toLowerCase()} family values, follows a ${customer.diet.toLowerCase()} diet, and identifies as ${customer.personality.toLowerCase()}. ${customer.gender === 'Female' ? 'She' : 'He'} ${customer.wantsKids ? 'wants children' : 'does not want children'} and ${customer.openToRelocate ? 'is open to relocation' : 'prefers to stay in ' + customer.city}.`;
  }
  if (q.includes('concern') || q.includes('consider')) {
    const concerns = [];
    if (customer.manglik === 'Yes') concerns.push('Manglik status may limit compatible profiles for traditional families');
    if (customer.smoking !== 'No') concerns.push('Smoking habit should be disclosed early');
    if (customer.maritalStatus === 'Divorced') concerns.push('Previous marriage history requires careful handling');
    concerns.push(`Income bracket of ₹${customer.income}L will influence suitable matches`);
    return concerns.join('. ') + '.';
  }
  return `Based on ${customer.firstName}'s profile — a ${customer.age}-year-old ${customer.profession} from ${customer.city} with ${customer.familyValues.toLowerCase()} values — they would benefit from matches with strong educational backgrounds, compatible religious views (${customer.religion}), and similar lifestyle preferences. Their preference for ${customer.prefCity} and age range ${customer.prefAgeMin}–${customer.prefAgeMax} should guide the shortlisting process.`;
}

module.exports = { explainMatch, generateIntroMessage, assistantQuery };
