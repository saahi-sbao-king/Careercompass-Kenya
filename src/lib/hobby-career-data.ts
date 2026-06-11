/**
 * @fileOverview Exhaustive database of hobbies mapped to professional personalities.
 * Standardized to CBE terminology: "Core/Essential Mathematics", "Compulsory Subjects".
 * Sector IDs: tech, health, agri, law, finance, edu, creative, aviation.
 */

export interface HobbyPersona {
  matchRating: number;
  topAlignment: string;
  marketDemand: number;
  salaryRangeKES: string;
  description: string;
  alignedSubjects: string[];
  alternatives: string[];
  sectorId: string;
}

export const HOBBY_MAP: Record<string, HobbyPersona> = {
  // --- 🎨 CREATIVE & ARTS (1–200) ---
  "drawing": {
    "matchRating": 94,
    "topAlignment": "Professional Illustrator",
    "marketDemand": 8,
    "salaryRangeKES": "60,000 - 220,000",
    "description": "Translates conceptual ideas into high-fidelity visual assets for publishing and tech industries.",
    "alignedSubjects": ["Fine Arts", "Media Technology", "Physics"],
    "alternatives": ["Concept Artist", "UX Designer"],
    "sectorId": "creative"
  },
  "painting": {
    "matchRating": 90,
    "topAlignment": "Fine Artist",
    "marketDemand": 7,
    "salaryRangeKES": "50,000 - 300,000",
    "description": "Specializes in traditional media to create high-value physical art for galleries and public spaces.",
    "alignedSubjects": ["Fine Arts", "History & Citizenship", "Chemistry"],
    "alternatives": ["Art Restorer", "Muralist"],
    "sectorId": "creative"
  },
  "digital art": {
    "matchRating": 98,
    "topAlignment": "Graphic Designer",
    "marketDemand": 10,
    "salaryRangeKES": "80,000 - 350,000",
    "description": "Engineers digital visual assets for entertainment, advertising, and digital products.",
    "alignedSubjects": ["Computer Science", "Fine Arts", "Media Technology"],
    "alternatives": ["Visual Identity Lead", "UI Designer"],
    "sectorId": "tech"
  },
  "sculpting": {
    "matchRating": 88,
    "topAlignment": "Sculptor",
    "marketDemand": 7,
    "salaryRangeKES": "70,000 - 250,000",
    "description": "Uses physical and digital tools to create three-dimensional forms for art and industrial prototype development.",
    "alignedSubjects": ["Fine Arts", "Physics", "Woodwork"],
    "alternatives": ["3D Modeler", "Set Designer"],
    "sectorId": "creative"
  },
  "photography": {
    "matchRating": 95,
    "topAlignment": "Photographer",
    "marketDemand": 9,
    "salaryRangeKES": "60,000 - 400,000",
    "description": "Masters the technical and artistic aspects of light and composition to produce high-impact imagery.",
    "alignedSubjects": ["Media Technology", "Physics", "Business Studies"],
    "alternatives": ["Photojournalist", "Fashion Photographer"],
    "sectorId": "creative"
  },
  "filmmaking": {
    "matchRating": 92,
    "topAlignment": "Film Director",
    "marketDemand": 8,
    "salaryRangeKES": "100,000 - 600,000+",
    "description": "Leads the creative vision and production of cinematic stories for the global entertainment market.",
    "alignedSubjects": ["Theatre and Film", "Literature in English", "History & Citizenship"],
    "alternatives": ["Screenwriter", "Producer"],
    "sectorId": "creative"
  },
  "video editing": {
    "matchRating": 96,
    "topAlignment": "Video Editor",
    "marketDemand": 10,
    "salaryRangeKES": "75,000 - 450,000",
    "description": "Captures and edits motion imagery for media, marketing, and digital storytelling.",
    "alignedSubjects": ["Media Technology", "Theatre and Film", "Computer Science"],
    "alternatives": ["Motion Designer", "VFX Artist"],
    "sectorId": "creative"
  },
  "animation": {
    "matchRating": 97,
    "topAlignment": "Animator",
    "marketDemand": 10,
    "salaryRangeKES": "90,000 - 450,000",
    "description": "Breathes life into characters and objects through timing, weight, and digital frame sequencing.",
    "alignedSubjects": ["Computer Science", "Fine Arts", "Physics"],
    "alternatives": ["VFX Artist", "3D Generalist"],
    "sectorId": "tech"
  },
  "calligraphy": {
    "matchRating": 89,
    "topAlignment": "Calligrapher",
    "marketDemand": 6,
    "salaryRangeKES": "40,000 - 180,000",
    "description": "Masters the art of beautiful writing and structural letterforms for branding and fine art.",
    "alignedSubjects": ["Fine Arts", "History & Citizenship", "Arabic"],
    "alternatives": ["Typeface Designer", "Graphic Designer"],
    "sectorId": "creative"
  },
  "fashion design": {
    "matchRating": 96,
    "topAlignment": "Fashion Designer",
    "marketDemand": 9,
    "salaryRangeKES": "70,000 - 500,000",
    "description": "Designs and develops innovative garments and accessories for the global fashion market.",
    "alignedSubjects": ["Fine Arts", "Business Studies", "Home Science"],
    "alternatives": ["Fashion Stylist", "Textile Designer"],
    "sectorId": "creative"
  },
  "writing poetry": {
    "matchRating": 91,
    "topAlignment": "Poet",
    "marketDemand": 5,
    "salaryRangeKES": "Variable",
    "description": "Uses linguistic artistry to explore human experience and cultural narratives.",
    "alignedSubjects": ["Literature in English", "Fasihi ya Kiswahili", "History & Citizenship"],
    "alternatives": ["Spoken Word Artist", "Lyricist"],
    "sectorId": "creative"
  },
  "creative writing": {
    "matchRating": 96,
    "topAlignment": "Author",
    "marketDemand": 8,
    "salaryRangeKES": "50,000 - 400,000",
    "description": "Produces original written works for publishing, media, or institutional documentation.",
    "alignedSubjects": ["Literature in English", "Fasihi ya Kiswahili", "History & Citizenship"],
    "alternatives": ["Editor", "Journalist"],
    "sectorId": "creative"
  },

  // --- 💻 TECH & DIGITAL (201–400) ---
  "coding": {
    "matchRating": 98,
    "topAlignment": "Software Developer",
    "marketDemand": 10,
    "salaryRangeKES": "150,000 - 500,000",
    "description": "Engineers high-fidelity digital solutions for the global tech market.",
    "alignedSubjects": ["Computer Science", "Physics", "Core/Essential Mathematics"],
    "alternatives": ["Systems Architect", "Backend Engineer"],
    "sectorId": "tech"
  },
  "web development": {
    "matchRating": 97,
    "topAlignment": "Full-Stack Developer",
    "marketDemand": 10,
    "salaryRangeKES": "100,000 - 400,000",
    "description": "Designs and builds responsive, interactive interfaces for the modern web.",
    "alignedSubjects": ["Computer Science", "Physics", "Media Technology"],
    "alternatives": ["Frontend Lead", "Fullstack Engineer"],
    "sectorId": "tech"
  },
  "ethical hacking": {
    "matchRating": 99,
    "topAlignment": "Cybersecurity Analyst",
    "marketDemand": 10,
    "salaryRangeKES": "180,000 - 600,000",
    "description": "Protects organizational data and network infrastructure from digital threats and breaches.",
    "alignedSubjects": ["Computer Science", "Physics", "History & Citizenship"],
    "alternatives": ["Security Architect", "Network Engineer"],
    "sectorId": "tech"
  },
  "machine learning": {
    "matchRating": 98,
    "topAlignment": "AI Engineer",
    "marketDemand": 10,
    "salaryRangeKES": "200,000 - 750,000",
    "description": "Architects neural networks and automated decision engines for industrial scale AI solutions.",
    "alignedSubjects": ["Computer Science", "Physics", "Core/Essential Mathematics"],
    "alternatives": ["ML Ops Specialist", "AI Ethicist"],
    "sectorId": "tech"
  },
  "blockchain": {
    "matchRating": 98,
    "topAlignment": "Blockchain Developer",
    "marketDemand": 9,
    "salaryRangeKES": "200,000 - 800,000",
    "description": "Engineers decentralized ledger protocols and smart contracts for the future economy.",
    "alignedSubjects": ["Computer Science", "Business Studies", "Physics"],
    "alternatives": ["Web3 Architect", "Smart Contract Auditor"],
    "sectorId": "tech"
  },

  // --- 🧠 EDUCATION & THINKING ---
  "debate": {
    "matchRating": 98,
    "topAlignment": "Advocate",
    "marketDemand": 9,
    "salaryRangeKES": "120,000 - 600,000",
    "description": "Masters persuasive argument and logical reasoning to represent clients in judicial environments.",
    "alignedSubjects": ["History & Citizenship", "Literature in English", "French"],
    "alternatives": ["Litigator", "Legal Consultant"],
    "sectorId": "law"
  },
  "science experiments": {
    "matchRating": 98,
    "topAlignment": "Research Scientist",
    "marketDemand": 10,
    "salaryRangeKES": "120,000 - 500,000",
    "description": "Leads empirical research and experimental testing to advance institutional knowledge.",
    "alignedSubjects": ["Biology", "Chemistry", "Physics"],
    "alternatives": ["Lab Scientist", "Medical Researcher"],
    "sectorId": "health"
  },

  // --- 🏃 SPORTS & FITNESS ---
  "football": {
    "matchRating": 95,
    "topAlignment": "Professional Athlete",
    "marketDemand": 8,
    "salaryRangeKES": "Variable",
    "description": "Competes at elite levels in national and international leagues while maintaining peak physical performance.",
    "alignedSubjects": ["Sports and Recreation", "Biology", "Physics"],
    "alternatives": ["National Team Player", "Sports Analyst"],
    "sectorId": "health"
  },

  // --- ✈️ AVIATION ECOSYSTEM (NEW) ---
  "flight simulation": {
    "matchRating": 96,
    "topAlignment": "Commercial Pilot",
    "marketDemand": 10,
    "salaryRangeKES": "250,000 - 850,000",
    "description": "Masters flight deck procedures and navigation through high-fidelity simulation, preparing for professional cockpit operations.",
    "alignedSubjects": ["Aviation", "Physics", "Core/Essential Mathematics"],
    "alternatives": ["Flight Instructor", "Ground School Trainer"],
    "sectorId": "aviation"
  },
  "private flying": {
    "matchRating": 94,
    "topAlignment": "Private Pilot",
    "marketDemand": 7,
    "salaryRangeKES": "150,000 - 450,000",
    "description": "Operates aircraft for non-commercial purposes, focusing on navigation and personal transport mastery.",
    "alignedSubjects": ["Aviation", "Geography", "Physics"],
    "alternatives": ["Charter Pilot", "Recreational Pilot"],
    "sectorId": "aviation"
  },
  "aircraft mechanics": {
    "matchRating": 97,
    "topAlignment": "Aircraft Maintenance Engineer",
    "marketDemand": 10,
    "salaryRangeKES": "100,000 - 500,000",
    "description": "Ensures the airworthiness of aircraft through rigorous diagnostics, repairs, and technical inspections.",
    "alignedSubjects": ["Physics", "Power Mechanics", "Electricity"],
    "alternatives": ["Avionics Technician", "Ground Engineer"],
    "sectorId": "aviation"
  },
  "aerodynamics": {
    "matchRating": 98,
    "topAlignment": "Aerospace Engineer",
    "marketDemand": 10,
    "salaryRangeKES": "180,000 - 700,000",
    "description": "Designs and optimizes aircraft and propulsion systems based on fluid dynamics and structural integrity.",
    "alignedSubjects": ["Physics", "Core/Essential Mathematics", "Computer Science"],
    "alternatives": ["Aeronautical Researcher", "Systems Designer"],
    "sectorId": "aviation"
  },
  "studying flight paths": {
    "matchRating": 99,
    "topAlignment": "Air Traffic Controller",
    "marketDemand": 10,
    "salaryRangeKES": "150,000 - 600,000",
    "description": "Manages safe aircraft separation and flow within controlled airspace using radar and communication protocols.",
    "alignedSubjects": ["Geography", "Core/Essential Mathematics", "English"],
    "alternatives": ["Flight Dispatcher", "Operations Manager"],
    "sectorId": "aviation"
  },
  "meteorology": {
    "matchRating": 95,
    "topAlignment": "Aviation Meteorologist",
    "marketDemand": 9,
    "salaryRangeKES": "90,000 - 350,000",
    "description": "Analyzes atmospheric conditions to provide critical weather intelligence for safe flight operations.",
    "alignedSubjects": ["Geography", "Physics", "Biology"],
    "alternatives": ["Climate Analyst", "Flight Planner"],
    "sectorId": "aviation"
  },
  "plane spotting": {
    "matchRating": 92,
    "topAlignment": "Aviation Journalist",
    "marketDemand": 7,
    "salaryRangeKES": "60,000 - 250,000",
    "description": "Captures and documents aircraft movements, liveries, and industry developments for specialized media.",
    "alignedSubjects": ["Media Technology", "Literature in English", "History & Citizenship"],
    "alternatives": ["Aviation Photographer", "Industry Blogger"],
    "sectorId": "creative"
  },
  "military aviation": {
    "matchRating": 98,
    "topAlignment": "Fighter Pilot",
    "marketDemand": 9,
    "salaryRangeKES": "Officer Scale",
    "description": "Executes high-stakes tactical missions and air defense operations within national security frameworks.",
    "alignedSubjects": ["Physics", "History & Citizenship", "Sports and Recreation"],
    "alternatives": ["Defense Specialist", "Drone Operator"],
    "sectorId": "aviation"
  },
  "helicopter simulation": {
    "matchRating": 96,
    "topAlignment": "Helicopter Pilot",
    "marketDemand": 9,
    "salaryRangeKES": "200,000 - 650,000",
    "description": "Specializes in vertical lift operations for emergency medical services, rescue, or tactical transport.",
    "alignedSubjects": ["Aviation", "Physics", "Biology"],
    "alternatives": ["Rescue Pilot", "Police Pilot"],
    "sectorId": "aviation"
  },
  "aviation law": {
    "matchRating": 97,
    "topAlignment": "Aviation Lawyer",
    "marketDemand": 8,
    "salaryRangeKES": "150,000 - 700,000",
    "description": "Navigates the complex legal frameworks governing international air travel, safety regulations, and liability.",
    "alignedSubjects": ["History & Citizenship", "Literature in English", "Business Studies"],
    "alternatives": ["Regulatory Consultant", "Safety Inspector"],
    "sectorId": "law"
  },
  "safety inspection": {
    "matchRating": 98,
    "topAlignment": "Aviation Safety Inspector",
    "marketDemand": 10,
    "salaryRangeKES": "120,000 - 550,000",
    "description": "Enforces civil aviation standards and conducts audits to ensure the highest levels of operational safety.",
    "alignedSubjects": ["Physics", "History & Citizenship", "English"],
    "alternatives": ["Accident Investigator", "Compliance Officer"],
    "sectorId": "aviation"
  }
};

export const getHobbyPersona = (input: string): HobbyPersona | null => {
  const normalized = input.toLowerCase().trim();
  if (HOBBY_MAP[normalized]) return HOBBY_MAP[normalized];
  
  // Fuzzy match
  const key = Object.keys(HOBBY_MAP).find(k => normalized.includes(k) || k.includes(normalized));
  return key ? HOBBY_MAP[key] : null;
};
