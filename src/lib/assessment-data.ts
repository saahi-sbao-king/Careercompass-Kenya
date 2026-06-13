export type IntelligenceType =
  | 'Linguistic'
  | 'Logical-Math'
  | 'Visual-Spatial'
  | 'Bodily-Kinesthetic'
  | 'Musical'
  | 'Interpersonal'
  | 'Intrapersonal'
  | 'Naturalistic'
  | 'Existential';

export interface Question {
  id: number;
  text: string;
  type: IntelligenceType;
}

export const MI_QUESTIONS: Question[] = [
  // Linguistic (Word Smart)
  { id: 1, text: "I enjoy reading books, articles, or stories.", type: "Linguistic" },
  { id: 2, text: "I find it easy to express my thoughts in writing.", type: "Linguistic" },
  { id: 3, text: "I enjoy learning new words and their meanings.", type: "Linguistic" },
  { id: 4, text: "I like telling stories or giving presentations.", type: "Linguistic" },
  { id: 5, text: "I learn best through reading and discussion.", type: "Linguistic" },
  // Logical-Math (Number Smart)
  { id: 6, text: "I enjoy solving puzzles and brain teasers.", type: "Logical-Math" },
  { id: 7, text: "I like working with numbers and calculations.", type: "Logical-Math" },
  { id: 8, text: "I enjoy identifying patterns and relationships.", type: "Logical-Math" },
  { id: 9, text: "I prefer logical explanations over guesses.", type: "Logical-Math" },
  { id: 10, text: "I enjoy science and experimentation.", type: "Logical-Math" },
  // Visual-Spatial (Picture Smart)
  { id: 11, text: "I can easily visualize objects in my mind.", type: "Visual-Spatial" },
  { id: 12, text: "I enjoy drawing, designing, or sketching.", type: "Visual-Spatial" },
  { id: 13, text: "Maps and diagrams help me learn better.", type: "Visual-Spatial" },
  { id: 14, text: "I notice details in images and surroundings.", type: "Visual-Spatial" },
  { id: 15, text: "I enjoy photography, architecture, or graphic design.", type: "Visual-Spatial" },
  // Bodily-Kinesthetic (Body Smart)
  { id: 16, text: "I learn best by doing rather than reading.", type: "Bodily-Kinesthetic" },
  { id: 17, text: "I enjoy sports and physical activities.", type: "Bodily-Kinesthetic" },
  { id: 18, text: "I use gestures when communicating.", type: "Bodily-Kinesthetic" },
  { id: 19, text: "I enjoy building or making things.", type: "Bodily-Kinesthetic" },
  { id: 20, text: "I prefer hands-on learning experiences.", type: "Bodily-Kinesthetic" },
  // Musical (Music Smart)
  { id: 21, text: "I enjoy listening to music regularly.", type: "Musical" },
  { id: 22, text: "I can easily recognize rhythms and melodies.", type: "Musical" },
  { id: 23, text: "Music helps me concentrate or relax.", type: "Musical" },
  { id: 24, text: "I enjoy singing, playing instruments, or composing music.", type: "Musical" },
  { id: 25, text: "I often remember information through songs.", type: "Musical" },
  // Interpersonal (People Smart)
  { id: 26, text: "I enjoy working in teams.", type: "Interpersonal" },
  { id: 27, text: "I can easily understand other people's feelings.", type: "Interpersonal" },
  { id: 28, text: "Friends often seek my advice.", type: "Interpersonal" },
  { id: 29, text: "I enjoy helping resolve conflicts.", type: "Interpersonal" },
  { id: 30, text: "I communicate well with different types of people.", type: "Interpersonal" },
  // Intrapersonal (Self Smart)
  { id: 31, text: "I understand my strengths and weaknesses.", type: "Intrapersonal" },
  { id: 32, text: "I enjoy setting personal goals.", type: "Intrapersonal" },
  { id: 33, text: "I reflect on my experiences regularly.", type: "Intrapersonal" },
  { id: 34, text: "I am comfortable working independently.", type: "Intrapersonal" },
  { id: 35, text: "I understand my emotions well.", type: "Intrapersonal" },
  // Naturalistic (Nature Smart)
  { id: 36, text: "I enjoy spending time outdoors.", type: "Naturalistic" },
  { id: 37, text: "I am interested in plants, animals, or the environment.", type: "Naturalistic" },
  { id: 38, text: "I can easily identify different species or natural features.", type: "Naturalistic" },
  { id: 39, text: "I care deeply about environmental conservation.", type: "Naturalistic" },
  { id: 40, text: "Nature helps me feel energized and inspired.", type: "Naturalistic" },
  // Existential (Life Smart)
  { id: 41, text: "I often think about the meaning of life.", type: "Existential" },
  { id: 42, text: "I enjoy discussing philosophical questions.", type: "Existential" },
  { id: 43, text: "I am curious about different cultures and beliefs.", type: "Existential" },
  { id: 44, text: "I think about humanity's future and purpose.", type: "Existential" },
  { id: 45, text: "I enjoy exploring deep and complex ideas.", type: "Existential" }
];

export const INTEL_DESCRIPTIONS: Record<IntelligenceType, { desc: string; strengths: string[]; careers: string[]; styles: string[]; strategies: string[]; growth: string[] }> = {
  Linguistic: {
    desc: "This intelligence represents your strongest area of natural ability and learning preference.",
    strengths: ["Reading and Writing", "Public Speaking", "Persuasion", "Storytelling", "Editing"],
    careers: ["Journalist", "Lawyer", "Author", "Teacher", "Public Relations Specialist"],
    styles: ["Reading books/articles", "Engaging in debates", "Writing journals"],
    strategies: ["Use acronyms", "Read notes aloud", "Write summaries"],
    growth: ["Join a debate club", "Practice creative writing"]
  },
  'Logical-Math': {
    desc: "You possess a high capacity for analyzing problems logically and scientific investigation.",
    strengths: ["Problem Solving", "Mathematical Logic", "Pattern Recognition", "Abstract Reasoning"],
    careers: ["Scientist", "Engineer", "Data Analyst", "Accountant", "Computer Programmer"],
    styles: ["Categorizing information", "Solving puzzles", "Scientific experiments"],
    strategies: ["Create outlines", "Use logic maps", "Break tasks into steps"],
    growth: ["Practice mental math", "Play strategy games"]
  },
  'Visual-Spatial': {
    desc: "You have a keen ability to perceive and transform visual information into mental models.",
    strengths: ["Mental Mapping", "Graphic Design", "3D Visualization", "Artistic Creation"],
    careers: ["Architect", "Pilot", "Artist", "Civil Engineer", "Graphic Designer"],
    styles: ["Using mind maps", "Visualizing concepts", "Drawing diagrams"],
    strategies: ["Color code notes", "Use icons/symbols", "Watch video tutorials"],
    growth: ["Learn 3D modeling", "Practice navigation without GPS"]
  },
  'Bodily-Kinesthetic': {
    desc: "You learn and express yourself best through physical movement and hands-on interaction.",
    strengths: ["Manual Dexterity", "Physical Coordination", "Tactile Learning", "Athleticism"],
    careers: ["Surgeon", "Athlete", "Mechanic", "Dancer", "Craftsperson"],
    styles: ["Hands-on projects", "Physical activity", "Building models"],
    strategies: ["Study while standing", "Use physical flashcards", "Take frequent movement breaks"],
    growth: ["Join a sports team", "Learn a new physical skill or craft"]
  },
  Musical: {
    desc: "You have a natural sensitivity to rhythm, melody, and the structure of sound.",
    strengths: ["Rhythmic Sensitivity", "Auditory Memory", "Musical Composition", "Aural Patterning"],
    careers: ["Musician", "Sound Engineer", "Music Producer", "Composer", "Speech Therapist"],
    styles: ["Listening to music", "Creating melodies", "Rhythmic patterns"],
    strategies: ["Set notes to music", "Use background music", "Listen to educational podcasts"],
    growth: ["Learn an instrument", "Practice active listening"]
  },
  Interpersonal: {
    desc: "You are exceptionally skilled at understanding and interacting with others.",
    strengths: ["Empathy", "Team Leadership", "Conflict Resolution", "Social Networking"],
    careers: ["Psychologist", "Manager", "Politician", "Social Worker", "Marketing Executive"],
    styles: ["Group discussions", "Team projects", "Mentoring others"],
    strategies: ["Study with a partner", "Discuss topics with friends", "Teach what you learn"],
    growth: ["Volunteer in leadership", "Practice active empathy"]
  },
  Intrapersonal: {
    desc: "You possess deep self-awareness and the ability to act on self-reflection.",
    strengths: ["Self-Reflection", "Goal Setting", "Metacognition", "Emotional Regulation"],
    careers: ["Strategist", "Philosopher", "Entrepreneur", "Counselor", "Researcher"],
    styles: ["Independent study", "Self-reflection", "Setting personal goals"],
    strategies: ["Reflect on progress", "Connect learning to personal life", "Set clear milestones"],
    growth: ["Keep a daily journal", "Practice mindfulness/meditation"]
  },
  Naturalistic: {
    desc: "You have a profound sensitivity to the natural world and its ecological systems.",
    strengths: ["Nature Classification", "Environmental Observation", "Ecological Mapping"],
    careers: ["Veterinarian", "Environmentalist", "Farmer", "Marine Biologist", "Chef"],
    styles: ["Field trips", "Outdoor learning", "Environmental projects"],
    strategies: ["Study in nature", "Use natural analogies", "Conduct experiments"],
    growth: ["Start a garden", "Join a conservation group"]
  },
  Existential: {
    desc: "You excel at conceptualizing deep questions about human existence and the universe.",
    strengths: ["Deep Thinking", "Cultural Sensitivity", "Philosophical Inquiry", "Ethics"],
    careers: ["Philosopher", "Historian", "Ethicist", "Theologian", "Humanitarian Leader"],
    styles: ["Philosophical inquiry", "Exploring cultures", "Ethical debates"],
    strategies: ["Look at the big picture", "Discuss ethical implications", "Research global trends"],
    growth: ["Read diverse philosophies", "Engage in community dialogue"]
  }
};

export function getLevel(score: number): string {
  if (score >= 21) return "Very Strong";
  if (score >= 16) return "Strong";
  if (score >= 11) return "Moderate";
  return "Developing";
}

export function calculatePathway(scores: Record<string, number>) {
  const stemScore = (scores['Logical-Math'] || 0) + (scores['Naturalistic'] || 0) + (scores['Visual-Spatial'] || 0);
  const artsScore = (scores['Bodily-Kinesthetic'] || 0) + (scores['Musical'] || 0) + (scores['Visual-Spatial'] || 0);
  const socialScore = (scores['Interpersonal'] || 0) + (scores['Intrapersonal'] || 0) + (scores['Linguistic'] || 0) + (scores['Existential'] || 0);
  
  if (stemScore >= artsScore && stemScore >= socialScore) return 'STEM';
  if (artsScore >= stemScore && artsScore >= socialScore) return 'Arts & Sports Science';
  return 'Social Sciences';
}
