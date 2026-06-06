const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── Religion-keyed data ────────────────────────────────────────────────────
// Each religion carries its own names, surnames, castes, mother tongues,
// diet defaults, manglik applicability, and horoscope preference so that
// every field is internally consistent.

const RELIGION_DATA = {
  Hindu: {
    weight: 55, // % of pool
    male:   ['Rahul', 'Arjun', 'Vikram', 'Siddharth', 'Rohan', 'Aditya', 'Nikhil', 'Ankit',
              'Tarun', 'Yash', 'Amit', 'Varun', 'Manish', 'Sanket', 'Deepak', 'Karan',
              'Shubham', 'Gaurav', 'Vivek', 'Harsh'],
    female: ['Priya', 'Ananya', 'Kavya', 'Sneha', 'Pooja', 'Riya', 'Ishita', 'Nisha',
              'Divya', 'Shruti', 'Neha', 'Sakshi', 'Anika', 'Meera', 'Kritika', 'Payal',
              'Tanu', 'Aarohi', 'Shreya', 'Ankita'],
    surnames: ['Sharma', 'Verma', 'Gupta', 'Joshi', 'Tiwari', 'Mishra', 'Yadav', 'Pandey',
                'Chaudhary', 'Singh', 'Dubey', 'Shukla', 'Tripathi', 'Aggarwal', 'Malhotra',
                'Kapoor', 'Bose', 'Kulkarni', 'Patil', 'Desai'],
    castes:  ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Rajput', 'Jat', 'Maratha', 'Reddy'],
    motherTongues: ['Hindi', 'Marathi', 'Telugu', 'Kannada', 'Bengali', 'Odia'],
    dietOptions:   ['Vegetarian', 'Non-Vegetarian', 'Eggetarian'],
    manglikApplicable: true,
    horoscopeOptions:  ['Required', 'Not Required'],
  },

  Jain: {
    weight: 8,
    male:   ['Raj', 'Dev', 'Priyank', 'Nishant', 'Kartik', 'Saurabh', 'Kunal', 'Jatin',
              'Parth', 'Dhruv'],
    female: ['Payal', 'Nidhi', 'Ridhi', 'Juhi', 'Khushi', 'Drashti', 'Foram', 'Disha',
              'Maitri', 'Prachi'],
    surnames: ['Shah', 'Mehta', 'Jain', 'Kothari', 'Lodha', 'Doshi', 'Sanghvi', 'Parekh',
                'Gandhi', 'Sancheti'],
    castes:  ['Digambar', 'Shwetambar', 'Oswal', 'Porwal', 'Agarwal'],
    motherTongues: ['Gujarati', 'Rajasthani', 'Hindi', 'Marwari'],
    dietOptions:   ['Vegetarian'],        // Jains are strictly vegetarian
    manglikApplicable: false,
    horoscopeOptions:  ['Required', 'Not Required'],
  },

  Sikh: {
    weight: 8,
    male:   ['Gurpreet', 'Harpreet', 'Manpreet', 'Jaspreet', 'Navjot', 'Rajveer', 'Amarjit',
              'Balvinder', 'Dilpreet', 'Sukhdeep'],
    female: ['Simran', 'Gurleen', 'Harleen', 'Manleen', 'Jasleen', 'Navneet', 'Prabhjot',
              'Amritpal', 'Kaur', 'Ravneet'],
    surnames: ['Singh', 'Kaur', 'Gill', 'Sidhu', 'Grewal', 'Dhaliwal', 'Sandhu', 'Brar',
                'Randhawa', 'Cheema'],
    castes:  ['Jat Sikh', 'Khatri', 'Arora', 'Ramgarhia', 'Saini'],
    motherTongues: ['Punjabi', 'Hindi'],
    dietOptions:   ['Non-Vegetarian', 'Vegetarian'],
    manglikApplicable: false,
    horoscopeOptions:  ['Not Required'],  // Sikhs traditionally don't use horoscopes
  },

  Muslim: {
    weight: 15,
    male:   ['Aryan', 'Zaid', 'Omar', 'Faraz', 'Imran', 'Kabir', 'Raza', 'Adil',
              'Faisal', 'Hamza', 'Junaid', 'Sameer', 'Tariq', 'Usman', 'Wasim'],
    female: ['Ayesha', 'Zara', 'Sana', 'Nadia', 'Rehana', 'Aliya', 'Farah', 'Hina',
              'Ruqaiya', 'Shabana', 'Tabassum', 'Uzma', 'Yasmin', 'Zeba', 'Mariam'],
    surnames: ['Khan', 'Sheikh', 'Ansari', 'Siddiqui', 'Qureshi', 'Pathan', 'Malik',
                'Mirza', 'Rizvi', 'Hashmi', 'Baig', 'Chaudhry', 'Shaikh', 'Hussain', 'Ali'],
    castes:  ['Syed', 'Sheikh', 'Pathan', 'Mughal', 'Ansari', 'Qureshi', 'Bohra', 'Memon'],
    motherTongues: ['Urdu', 'Hindi', 'Bengali', 'Gujarati'],
    dietOptions:   ['Non-Vegetarian', 'Eggetarian'],
    manglikApplicable: false,
    horoscopeOptions:  ['Not Required'],
  },

  Christian: {
    weight: 8,
    male:   ['Aaron', 'Brian', 'Christopher', 'Daniel', 'Edwin', 'Francis', 'George',
              'Henry', 'Ivan', 'Jerome', 'Kevin', 'Leonard', 'Martin', 'Nathan', 'Peter'],
    female: ['Angela', 'Bridget', 'Carol', 'Diana', 'Eleanor', 'Florence', 'Grace',
              'Helen', 'Irene', 'Jessica', 'Karen', 'Linda', 'Maria', 'Nancy', 'Olivia'],
    surnames: ['D\'Souza', 'Fernandes', 'Pereira', 'Rodrigues', 'Gomes', 'Menezes',
                'Thomas', 'Philip', 'Mathew', 'Joseph', 'John', 'George', 'Paul', 'James', 'Peter'],
    castes:  ['Roman Catholic', 'Church of South India', 'Syrian Christian', 'Protestant', 'Baptist'],
    motherTongues: ['English', 'Malayalam', 'Tamil', 'Konkani', 'Hindi'],
    dietOptions:   ['Non-Vegetarian', 'Vegetarian', 'Eggetarian'],
    manglikApplicable: false,
    horoscopeOptions:  ['Not Required'],
  },
};

// Build a weighted religion-pick array (e.g. 55 Hindu entries, 8 Jain, etc.)
const RELIGION_POOL = Object.entries(RELIGION_DATA).flatMap(([rel, d]) =>
  Array(d.weight).fill(rel)
);

// ─── Shared / neutral data ──────────────────────────────────────────────────
const cities      = ['Mumbai', 'Pune', 'Bangalore', 'Hyderabad', 'Chennai', 'Delhi', 'Ahmedabad'];
const professions = ['Software Engineer', 'Product Manager', 'Doctor', 'Lawyer', 'Entrepreneur',
                     'Consultant', 'Data Scientist', 'CA'];
const colleges    = ['IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'NIT Trichy', 'COEP',
                     'VJTI', 'IIM Ahmedabad', 'ISB Hyderabad'];
const incomes     = [8, 10, 12, 15, 18, 22, 25, 30, 40, 50];
const statuses    = ['New', 'Active Search', 'Match Sent', 'Meeting Scheduled', 'Engaged'];
const familyValues = ['Traditional', 'Moderate', 'Liberal'];
const lifestyles  = ['Simple', 'Active', 'Luxurious', 'Balanced'];
const personalities = ['Introvert', 'Extrovert', 'Ambivert'];
const companies   = ['TCS', 'Infosys', 'Google', 'Flipkart', 'Zomato', 'HDFC Bank',
                     'Apollo Hospitals', 'Wipro', 'Amazon', 'Deloitte'];
const designations = ['Senior Engineer', 'Manager', 'Director', 'Associate',
                      'Partner', 'Founder', 'Analyst', 'Consultant'];
const hobbyLists  = [
  ['Reading', 'Yoga', 'Cooking'],
  ['Travelling', 'Photography', 'Music'],
  ['Cricket', 'Movies', 'Gaming'],
  ['Fitness', 'Hiking', 'Art'],
  ['Dancing', 'Singing', 'Writing'],
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick(arr, r) {
  return arr[Math.floor(r() * arr.length)];
}

// ─── Core builder ────────────────────────────────────────────────────────────
function buildCustomer(i, isPool = false) {
  const r        = seededRandom(i * 17 + (isPool ? 5003 : 31));
  const isFemale = isPool ? (i % 2 === 0) : (i >= 10);

  // 1. Pick religion first — everything else derives from it
  const religion  = pick(RELIGION_POOL, r);
  const rd        = RELIGION_DATA[religion];

  // 2. Name & surname from religion-appropriate lists
  const firstName = pick(isFemale ? rd.female : rd.male, r);
  const lastName  = pick(rd.surnames, r);

  // 3. Caste, mother tongue, diet from same religion bucket
  const caste       = pick(rd.castes, r);
  const motherTongue = pick(rd.motherTongues, r);
  const diet        = pick(rd.dietOptions, r);
  const horoscope   = pick(rd.horoscopeOptions, r);

  // Manglik only meaningful for Hindus
  const manglik = rd.manglikApplicable
    ? (r() > 0.7 ? 'Yes' : 'No')
    : 'Not Applicable';

  // 4. Everything else is religion-neutral
  const age         = 24 + Math.floor(r() * 12);
  const height      = isFemale ? 152 + Math.floor(r() * 20) : 165 + Math.floor(r() * 20);
  const city        = pick(cities, r);
  const income      = pick(incomes, r);
  const profession  = pick(professions, r);
  const college     = pick(colleges, r);
  const fv          = pick(familyValues, r);
  const ls          = pick(lifestyles, r);
  const pers        = pick(personalities, r);
  const hobbies     = pick(hobbyLists, r);
  const company     = pick(companies, r);
  const designation = pick(designations, r);
  const maritalStatus = r() > 0.82 ? 'Divorced' : 'Never Married';
  const wantsKids   = r() > 0.3;
  const relocate    = r() > 0.5;
  const smoking     = r() > 0.85 ? 'Occasional' : 'No';
  const drinking    = r() > 0.75 ? 'Occasional' : 'No';
  const familyType  = r() > 0.5 ? 'Nuclear' : 'Joint';
  const siblings    = Math.floor(r() * 3);
  const statusIdx   = isPool ? 0 : Math.floor(r() * statuses.length);
  const yearOfBirth = 2024 - age;
  const month       = String(Math.floor(r() * 12) + 1).padStart(2, '0');
  const day         = String(Math.floor(r() * 28) + 1).padStart(2, '0');
  const suffix      = isPool ? 'pool' : 'client';

  // Languages: always English + mother tongue; add Hindi if not already there
  const langs = ['English', motherTongue];
  if (motherTongue !== 'Hindi') langs.push('Hindi');

  return {
    firstName,
    lastName,
    gender:       isFemale ? 'Female' : 'Male',
    dateOfBirth:  `${yearOfBirth}-${month}-${day}`,
    age,
    height,
    country:      'India',
    city,
    languages:    JSON.stringify(langs),
    motherTongue,
    email:        `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/['\s]/g, '')}.${i}${suffix}@tdc.com`,
    phone:        `+91 9${String(Math.floor(r() * 899999999) + 100000000)}`,
    college,
    degree:       r() > 0.3 ? 'B.Tech' : 'B.Sc',
    company,
    designation,
    profession,
    income,
    maritalStatus,
    religion,
    caste,
    siblings,
    familyType,
    familyValues: fv,
    diet,
    smoking,
    drinking,
    horoscope,
    manglik,
    lifestyle:    ls,
    personality:  pers,
    hobbies:      JSON.stringify(hobbies),
    interests:    JSON.stringify(['Movies', 'Travel']),
    wantsKids,
    openToRelocate: relocate,
    openToPets:   r() > 0.6,
    prefAgeMin:   age - 3,
    prefAgeMax:   isFemale ? age + 6 : age - 1,
    prefCity:     pick(cities, r),
    prefReligion: religion,           // prefer same religion by default
    prefCaste:    r() > 0.5 ? caste : null,
    prefEducation: 'Graduate+',
    prefIncomeMin: income - 5,
    prefIncomeMax: income + 20,
    status:       isPool ? 'Pool' : statuses[statusIdx],
    journeyStep:  isPool ? 0 : statusIdx,
    colorIdx:     i % 8,
    profilePool:  isPool,
  };
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create default user
  const hashedPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { username: 'matchmaker' },
    update: {},
    create: {
      username: 'matchmaker',
      password: hashedPassword,
      name: 'Sarah Joshi',
      role: 'senior_matchmaker',
    },
  });
  console.log('✅ Created user: matchmaker / password123');

  // Create 20 main customers
  const createdCustomers = [];
  for (let i = 0; i < 20; i++) {
    const data = buildCustomer(i, false);
    const customer = await prisma.customer.create({ data });
    createdCustomers.push(customer);
  }
  console.log(`✅ Created ${createdCustomers.length} customers`);

  // Create 100 match pool profiles
  let poolCount = 0;
  for (let i = 0; i < 100; i++) {
    const data = buildCustomer(i, true);
    await prisma.customer.create({ data });
    poolCount++;
  }
  console.log(`✅ Created ${poolCount} match pool profiles`);

  // Create sample notes
  const noteData = [
    { customerId: createdCustomers[0].id, text: 'Initial consultation completed. Client has clear preferences — metropolitan city, similar professional background. Very particular about family values.', type: 'Consultation' },
    { customerId: createdCustomers[0].id, text: 'Shortlisted 3 profiles from Bangalore. Will present next week. Client seems open to outstation matches.', type: 'Shortlisting' },
    { customerId: createdCustomers[1].id, text: 'Family meeting held. Parents approve search criteria. Mother has specific caste preferences to note.', type: 'Family Meeting' },
    { customerId: createdCustomers[2].id, text: 'Client seems hesitant. May need a follow-up call to re-engage. Previous match was declined.', type: 'Follow-up' },
    { customerId: createdCustomers[3].id, text: 'Excellent candidate. Very communicative and clear about what they want. Prioritise high-income matches.', type: 'Profile Review' },
    { customerId: createdCustomers[4].id, text: 'Meeting scheduled with Match #A204. Client was very positive after the intro call.', type: 'Meeting' },
  ];

  for (const n of noteData) {
    await prisma.note.create({ data: { ...n, userId: 1 } });
  }
  console.log(`✅ Created ${noteData.length} sample notes`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('👤 Login: matchmaker / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });