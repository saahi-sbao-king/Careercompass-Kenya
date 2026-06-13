/**
 * @fileOverview The definitive career database for CareerCompass Kenya.
 * Mapped to the official Ministry of Education Senior School Catalogue.
 */

export interface Career {
  id: string;
  title: string;
  cluster: string;
  description: string;
  salaryKES: string;
  demand: number; // 1-10
  requiredSubjects: string[];
  recommendedCourses: string[];
  institutions: string[];
}

export const SUBJECTS = {
  STEM: [
    "Biology", "Chemistry", "Physics", "Computer Science", 
    "Agriculture", "Geography", "Aviation", "Marine & Fisheries"
  ],
  SOCIAL_SCIENCES: [
    "History", "Literature in English", "Fasihi ya Kiswahili", 
    "CRE", "IRE", "Business Studies", "French", "German"
  ],
  ARTS_SPORTS: [
    "Sports and Recreation", "Music and Dance", 
    "Theatre and Film", "Fine Arts"
  ]
};

export const CAREER_DATABASE: Career[] = [
  // --- HEALTH SCIENCES ---
  {
    id: "doctor",
    title: "Medical Doctor",
    cluster: "Health Sciences",
    description: "Diagnosing and treating human illnesses through advanced medical practice.",
    salaryKES: "120,000 - 350,000",
    demand: 10,
    requiredSubjects: ["Biology", "Chemistry", "Physics"],
    recommendedCourses: ["Bachelor of Medicine and Bachelor of Surgery (MBChB)"],
    institutions: ["UoN", "Kenyatta University", "Moi University", "Egerton"]
  },
  {
    id: "pharmacist",
    title: "Pharmacist",
    cluster: "Health Sciences",
    description: "Specializing in the preparation and dispensing of medicinal drugs.",
    salaryKES: "80,000 - 200,000",
    requiredSubjects: ["Biology", "Chemistry", "Physics"],
    demand: 9,
    recommendedCourses: ["Bachelor of Pharmacy"],
    institutions: ["UoN", "JKUAT", "Mount Kenya University"]
  },
  // --- TECHNOLOGY ---
  {
    id: "software-engineer",
    title: "Software Engineer",
    cluster: "Technology",
    description: "Designing and developing complex digital systems and applications.",
    salaryKES: "150,000 - 500,000",
    demand: 10,
    requiredSubjects: ["Computer Science", "Physics", "Core/Essential Mathematics"],
    recommendedCourses: ["BSc. Computer Science", "BSc. Software Engineering"],
    institutions: ["JKUAT", "Strathmore", "UoN", "USIU-A"]
  },
  {
    id: "ai-engineer",
    title: "AI & Machine Learning Engineer",
    cluster: "Technology",
    description: "Architecting neural networks and automated intelligence solutions.",
    salaryKES: "200,000 - 750,000",
    demand: 10,
    requiredSubjects: ["Computer Science", "Physics", "Core/Essential Mathematics"],
    recommendedCourses: ["BSc. Artificial Intelligence", "BSc. Data Science"],
    institutions: ["JKUAT", "Dedan Kimathi University", "Strathmore"]
  },
  // --- AVIATION ---
  {
    id: "commercial-pilot",
    title: "Commercial Pilot",
    cluster: "Aviation",
    description: "Operating commercial aircraft for national and international airlines.",
    salaryKES: "250,000 - 850,000",
    demand: 10,
    requiredSubjects: ["Aviation", "Physics", "Geography"],
    recommendedCourses: ["Commercial Pilot License (CPL)", "BSc. Aviation"],
    institutions: ["Kenya School of Flying", "East African School of Aviation"]
  },
  // --- ENGINEERING ---
  {
    id: "mechatronics-engineer",
    title: "Mechatronics Engineer",
    cluster: "Engineering",
    description: "Combining mechanical, electrical, and computer engineering for automation.",
    salaryKES: "100,000 - 450,000",
    demand: 9,
    requiredSubjects: ["Physics", "Computer Science", "Core/Essential Mathematics"],
    recommendedCourses: ["BSc. Mechatronic Engineering"],
    institutions: ["JKUAT", "Dedan Kimathi University"]
  },
  // --- LAW & PUBLIC SERVICE ---
  {
    id: "advocate",
    title: "Advocate of the High Court",
    cluster: "Law",
    description: "Representing clients and providing professional legal counsel.",
    salaryKES: "120,000 - 600,000",
    demand: 9,
    requiredSubjects: ["History", "Literature in English", "CRE/IRE"],
    recommendedCourses: ["Bachelor of Laws (LLB)"],
    institutions: ["UoN", "Strathmore", "Kenyatta University", "Riara"]
  },
  {
    id: "diplomat",
    title: "Diplomat",
    cluster: "Public Service",
    description: "Representing Kenya's interests in international relations and policy.",
    salaryKES: "150,000 - 550,000",
    demand: 8,
    requiredSubjects: ["History", "French", "Business Studies"],
    recommendedCourses: ["BSc. International Relations", "BSc. Political Science"],
    institutions: ["UoN", "USIU-A", "Strathmore"]
  }
];

export const UNIVERSITIES = [
  { id: "uon", name: "University of Nairobi", type: "Public" },
  { id: "jkuat", name: "Jomo Kenyatta University of Agriculture and Technology", type: "Public" },
  { id: "ku", name: "Kenyatta University", type: "Public" },
  { id: "strathmore", name: "Strathmore University", type: "Private" },
  { id: "usiu", name: "United States International University Africa", type: "Private" }
];

export const TVETS = [
  { id: "kabete", name: "Kabete National Polytechnic", location: "Nairobi" },
  { id: "nyeri", name: "Nyeri National Polytechnic", location: "Nyeri" },
  { id: "eldoret", name: "Eldoret National Polytechnic", location: "Eldoret" }
];
