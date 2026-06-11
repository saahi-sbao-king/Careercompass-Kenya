export type IntelligenceType =
  | 'Linguistic'
  | 'Logical-Math'
  | 'Spatial'
  | 'Bodily-Kinesthetic'
  | 'Musical'
  | 'Interpersonal'
  | 'Intrapersonal'
  | 'Naturalist'
  | 'Existential';

export interface Question {
  id: number;
  text: string;
  type: IntelligenceType;
}

export const MI_QUESTIONS: Question[] = [
  // Linguistic
  { id: 1, text: "I learn new words quickly and naturally use them in speaking or writing.", type: "Linguistic" },
  { id: 2, text: "I enjoy reading different types of materials for learning or pleasure.", type: "Linguistic" },
  { id: 3, text: "I can explain complex ideas clearly to different types of people.", type: "Linguistic" },
  { id: 4, text: "I enjoy activities that involve words, such as writing, storytelling, or word games.", type: "Linguistic" },
  { id: 5, text: "Writing or speaking helps me remember and understand information better.", type: "Linguistic" },
  // Logical-Math
  { id: 6, text: "I enjoy solving problems that require logical thinking and reasoning.", type: "Logical-Math" },
  { id: 7, text: "I am comfortable working with numbers, symbols, and abstract ideas.", type: "Logical-Math" },
  { id: 8, text: "I naturally look for patterns and relationships between things.", type: "Logical-Math" },
  { id: 9, text: "I break complex problems into smaller steps to solve them.", type: "Logical-Math" },
  { id: 10, text: "I enjoy subjects or activities that involve analysis, calculation, or experimentation.", type: "Logical-Math" },
  // Spatial
  { id: 11, text: "I easily understand visual information such as maps, diagrams, and charts.", type: "Spatial" },
  { id: 12, text: "I enjoy creating or working with visual designs, drawings, or models.", type: "Spatial" },
  { id: 13, text: "I can imagine objects from different angles in my mind.", type: "Spatial" },
  { id: 14, text: "I find it easy to navigate new places and understand directions.", type: "Spatial" },
  { id: 15, text: "I prefer visual instructions over written explanations.", type: "Spatial" },
  // Bodily-Kinesthetic
  { id: 16, text: "I learn best through hands-on activities and physical involvement.", type: "Bodily-Kinesthetic" },
  { id: 17, text: "I have good coordination and control of my body movements.", type: "Bodily-Kinesthetic" },
  { id: 18, text: "I use body language and gestures naturally when communicating.", type: "Bodily-Kinesthetic" },
  { id: 19, text: "I am skilled at working with tools, equipment, or small objects.", type: "Bodily-Kinesthetic" },
  { id: 20, text: "I find it difficult to stay still for long periods without movement.", type: "Bodily-Kinesthetic" },
  // Musical
  { id: 21, text: "I easily remember melodies and song lyrics.", type: "Musical" },
  { id: 22, text: "I am sensitive to rhythm, tone, and sound patterns.", type: "Musical" },
  { id: 23, text: "I naturally hum, tap rhythms, or engage with music unconsciously.", type: "Musical" },
  { id: 24, text: "I can recognize when sounds or music are out of tune.", type: "Musical" },
  { id: 25, text: "Music strongly affects my emotions, focus, or energy levels.", type: "Musical" },
  // Interpersonal
  { id: 26, text: "People often come to me for advice or support.", type: "Interpersonal" },
  { id: 27, text: "I easily understand other people’s emotions and intentions.", type: "Interpersonal" },
  { id: 28, text: "I work well in teams and group settings.", type: "Interpersonal" },
  { id: 29, text: "I feel comfortable starting conversations with new people.", type: "Interpersonal" },
  { id: 30, text: "I actively build and maintain social relationships.", type: "Interpersonal" },
  // Intrapersonal
  { id: 31, text: "I regularly reflect on my thoughts, feelings, and goals.", type: "Intrapersonal" },
  { id: 32, text: "I understand my strengths and weaknesses well.", type: "Intrapersonal" },
  { id: 33, text: "I engage in self-reflection activities (journaling, meditation, self-analysis).", type: "Intrapersonal" },
  { id: 34, text: "I manage my emotions well under stress or pressure.", type: "Intrapersonal" },
  { id: 35, text: "I enjoy working independently and setting my own goals.", type: "Intrapersonal" },
  // Naturalist
  { id: 36, text: "I enjoy spending time in natural environments.", type: "Naturalist" },
  { id: 37, text: "I can easily identify plants, animals, or natural features.", type: "Naturalist" },
  { id: 38, text: "I notice changes in weather, seasons, and natural patterns.", type: "Naturalist" },
  { id: 39, text: "I am interested in environmental, biological, or earth sciences.", type: "Naturalist" },
  { id: 40, text: "I enjoy collecting, observing, or classifying natural objects.", type: "Naturalist" },
  // Existential
  { id: 41, text: "I often think about the meaning and purpose of life.", type: "Existential" },
  { id: 42, text: "I am interested in philosophical or spiritual ideas.", type: "Existential" },
  { id: 43, text: "I feel connected to something greater than myself.", type: "Existential" },
  { id: 44, text: "I reflect on deep questions about existence and humanity.", type: "Existential" },
  { id: 45, text: "I think about humanity’s place in the universe and the future of life.", type: "Existential" }
];

export const PASSION_LIST: Record<IntelligenceType, string[]> = {
  Linguistic: ["Creative Writing", "Public Speaking", "Poetry", "Debate", "Storytelling", "Journalism", "Blogging", "Language Learning"],
  'Logical-Math': ["Coding", "Robotics", "AI Research", "Scientific Discovery", "Core/Essential Mathematics", "Problem Solving", "Strategy Games"],
  Spatial: ["Photography", "Architecture", "Graphic Design", "3D Animation", "Art Direction", "Interior Design", "Navigation"],
  'Bodily-Kinesthetic': ["Athletics", "Football", "Dance", "Culinary Arts", "Mechanics", "Surgery", "Martial Arts", "Crafting"],
  Musical: ["Music Production", "Singing", "Instrumental Performance", "Sound Engineering", "DJing", "Composition"],
  Interpersonal: ["Leadership", "Community Service", "Mentorship", "Diplomacy", "Psychology", "Politics", "Event Planning"],
  Intrapersonal: ["Self-Development", "Journaling", "Meditation", "Philosophy", "Goal Setting", "Spiritual Growth", "Solitary Research"],
  Naturalist: ["Environmental Conservation", "Wildlife Protection", "Agribusiness", "Marine Biology", "Farming", "Renewable Energy"],
  Existential: ["Human Rights Advocacy", "Theology", "Historical Research", "Space Exploration", "Cosmology", "Global Ethics"]
};

export const ABILITY_LIST: Record<IntelligenceType, string[]> = {
  Linguistic: ["Communication", "Fluency", "Persuasion", "Editing", "Translation", "Exposition"],
  'Logical-Math': ["Analysis", "Calculation", "Deduction", "Data Management", "Programming", "Critical Thinking"],
  Spatial: ["Visualization", "Drafting", "Spatial Reasoning", "Layout Design", "Visualizing Patterns"],
  'Bodily-Kinesthetic': ["Coordination", "Manual Dexterity", "Physical Endurance", "Handling Tools", "Agility"],
  Musical: ["Rhythm Analysis", "Tone Sensitivity", "Auditory Memory", "Melody Composition"],
  Interpersonal: ["Conflict Resolution", "Teamwork", "Empathy", "Networking", "Negotiation"],
  Intrapersonal: ["Self-Discipline", "Metacognition", "Emotional Regulation", "Independence"],
  Naturalist: ["Species Identification", "Ecological Awareness", "Scientific Observation", "Sustainable Planning"],
  Existential: ["Abstract Thinking", "Ethical Reasoning", "Contextual Analysis", "Philosophical Inquiry"]
};

export const INTEREST_LIST: Record<IntelligenceType, string[]> = {
  Linguistic: ["Literature Clubs", "TED Talks", "Reading", "Publishing", "Writing Workshops"],
  'Logical-Math': ["Hackathons", "Chess", "Math Fairs", "Crypto Trends", "Innovation Labs"],
  Spatial: ["Exhibitions", "Drones", "VR/AR", "Modern Architecture", "Sketching"],
  'Bodily-Kinesthetic': ["Sports Tournaments", "DIY Projects", "Outdoor Activities", "Acting"],
  Musical: ["Concerts", "Studios", "Instrument Tutorials", "Audio Gear"],
  Interpersonal: ["Volunteerism", "Leadership Summits", "Social Networking", "Group Projects"],
  Intrapersonal: ["Philosophy Books", "Journaling Apps", "Quiet Spaces", "Meditation Retreats"],
  Naturalist: ["Wildlife Parks", "Sustainable Farming", "Botanical Gardens", "Climate Action"],
  Existential: ["History Documentaries", "Ethics Forums", "Space Missions", "Humanitarian Aid"]
};

const SUBJECT_MAP: Record<IntelligenceType, Record<string, string>> = {
  'Linguistic': { 'Social Sciences': 'Literature in English', 'STEM': 'Technical Writing', 'Arts & Sports Science': 'Theatre Scripting' },
  'Logical-Math': { 'Social Sciences': 'Business Studies', 'STEM': 'Physics', 'Arts & Sports Science': 'Computer Science' },
  'Spatial': { 'Social Sciences': 'Geography', 'STEM': 'Building Construction', 'Arts & Sports Science': 'Fine Arts' },
  'Bodily-Kinesthetic': { 'Social Sciences': 'Physical Education', 'STEM': 'Agriculture', 'Arts & Sports Science': 'Sports Science' },
  'Musical': { 'Social Sciences': 'Music Theory', 'STEM': 'Acoustic Engineering', 'Arts & Sports Science': 'Music and Dance' },
  'Interpersonal': { 'Social Sciences': 'History & Citizenship', 'STEM': 'Agribusiness', 'Arts & Sports Science': 'Sports Management' },
  'Intrapersonal': { 'Social Sciences': 'Religious Education', 'STEM': 'Scientific Ethics', 'Arts & Sports Science': 'Artistic Expression' },
  'Naturalist': { 'Social Sciences': 'Geography', 'STEM': 'Biology', 'Arts & Sports Science': 'Marine Technology' },
  'Existential': { 'Social Sciences': 'History and Citizenship', 'STEM': 'Ethics in Tech', 'Arts & Sports Science': 'Philosophy of Art' }
};

const CAREER_MAP: Record<IntelligenceType, string[]> = {
  'Linguistic': ['Lawyer', 'Journalist', 'Author', 'Communications Expert'],
  'Logical-Math': ['Software Engineer', 'Data Scientist', 'Accountant', 'Research Scientist'],
  'Spatial': ['Architect', 'Pilot', 'Graphic Designer', 'Civil Engineer'],
  'Bodily-Kinesthetic': ['Professional Athlete', 'Surgeon', 'Automotive Engineer', 'Choreographer'],
  'Musical': ['Music Producer', 'Composer', 'Audio Engineer', 'Broadcaster'],
  'Interpersonal': ['Counselor', 'International Diplomat', 'Marketing Executive', 'HR Manager'],
  'Intrapersonal': ['Psychologist', 'Strategist', 'Entrepreneur', 'Life Coach'],
  'Naturalist': ['Environmentalist', 'Veterinarian', 'Agricultural Scientist', 'Conservationist'],
  'Existential': ['Philosopher', 'Historian', 'Ethicist', 'Humanitarian Leader']
};

export function calculatePathway(scores: Record<string, number>) {
  const stemScore = (scores['Logical-Math'] || 0) + (scores['Naturalist'] || 0) + (scores['Spatial'] || 0);
  const artsScore = (scores['Bodily-Kinesthetic'] || 0) + (scores['Musical'] || 0) + (scores['Spatial'] || 0);
  const socialScore = (scores['Interpersonal'] || 0) + (scores['Intrapersonal'] || 0) + (scores['Linguistic'] || 0) + (scores['Existential'] || 0);
  
  if (stemScore >= artsScore && stemScore >= socialScore) return 'STEM';
  if (artsScore >= stemScore && artsScore >= socialScore) return 'Arts & Sports Science';
  return 'Social Sciences';
}

export function getRecommendedSubjects(scores: Record<string, number>, pathway: string): string[] {
  const topIntelligences = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type as IntelligenceType);
    
  const subjects = topIntelligences.map(type => 
    SUBJECT_MAP[type]?.[pathway] || SUBJECT_MAP[type]?.['Social Sciences'] || 'General Studies'
  );
  return Array.from(new Set(subjects)); 
}

export function getRecommendedCareers(scores: Record<string, number>): string[] {
  const topIntelligences = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([type]) => type as IntelligenceType);
  return topIntelligences.map(type => CAREER_MAP[type][0]);
}

export function getRecommendedPassions(scores: Record<string, number>): string[] {
  const topIntelligences = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([type]) => type as IntelligenceType);
  const results: string[] = [];
  topIntelligences.forEach(type => results.push(...(PASSION_LIST[type] || []).slice(0, 6)));
  return Array.from(new Set(results));
}

export function getRecommendedAbilities(scores: Record<string, number>): string[] {
  const topIntelligences = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([type]) => type as IntelligenceType);
  const results: string[] = [];
  topIntelligences.forEach(type => results.push(...(ABILITY_LIST[type] || []).slice(0, 6)));
  return Array.from(new Set(results));
}

export function getRecommendedInterests(scores: Record<string, number>): string[] {
  const topIntelligences = Object.entries(scores).sort(([, a], [, b]) => b - a).slice(0, 3).map(([type]) => type as IntelligenceType);
  const results: string[] = [];
  topIntelligences.forEach(type => results.push(...(INTEREST_LIST[type] || []).slice(0, 6)));
  return Array.from(new Set(results));
}
