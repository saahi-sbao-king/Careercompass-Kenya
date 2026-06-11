
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sparkles, Heart, Search, Loader2, Compass, TrendingUp, Info, ListChecks, ShieldCheck, Laptop, HeartPulse, Shovel, Briefcase, Target, Zap, BookCheck, Activity, Gavel, Landmark, Plane, Palette, Settings, Microscope, Anchor, Coffee, GraduationCap, Users } from 'lucide-react';
import { useUser } from '@/lib/firebase/hooks';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { personalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { getHobbyPersona, type HobbyPersona } from '@/lib/hobby-career-data';

const CAREER_FIELDS = [
  { 
    id: 'tech', 
    name: 'Technology', 
    icon: '💻', 
    desc: 'Focuses on creating digital systems, software, and AI solutions for the modern digital economy.', 
    subjects: 'Computer Science, Physics, Core/Essential Mathematics',
    roles: ['Software Developer', 'AI Engineer', 'Cybersecurity Analyst'],
    skills: ['Programming', 'Problem solving', 'Logical thinking'],
  },
  { 
    id: 'aviation', 
    name: 'Aviation & Aerospace', 
    icon: '✈️', 
    desc: 'Specializes in aircraft operations, aerospace engineering, and global air traffic management.', 
    subjects: 'Aviation, Physics, Core/Essential Mathematics',
    roles: ['Commercial Pilot', 'Aerospace Engineer', 'Air Traffic Controller'],
    skills: ['Navigation', 'Technical Precision', 'Situational Awareness'],
  },
  { 
    id: 'agri', 
    name: 'Agriculture & Agribusiness', 
    icon: '🌾', 
    desc: 'Leveraging modern technology and sustainable practices to secure food systems and industrial growth.', 
    subjects: 'Agriculture, Biology, Business Studies',
    roles: ['Agribusiness Manager', 'Agricultural Scientist', 'Farm Systems Engineer'],
    skills: ['Resource Management', 'Biological Insight', 'Operations'],
  },
  { 
    id: 'law', 
    name: 'Law & Governance', 
    icon: '⚖️', 
    desc: 'Upholding justice, creating policy, and managing legal frameworks within high-stakes institutional environments.', 
    subjects: 'History & Citizenship, Literature in English, Religious Education',
    roles: ['Advocate', 'Public Administrator', 'Diplomat'],
    skills: ['Advocacy', 'Critical Thinking', 'Ethics'],
  },
  { 
    id: 'health', 
    name: 'Healthcare & Life Sciences', 
    icon: '🏥', 
    desc: 'Diagnosing, treating, and preventing illnesses within clinical and community settings.', 
    subjects: 'Biology, Chemistry, Physics',
    roles: ['Doctor', 'Pharmacist', 'Biomedical Researcher'],
    skills: ['Compassion', 'Critical thinking', 'Clinical Analysis'],
  },
  { 
    id: 'creative', 
    name: 'Creative Arts & Media', 
    icon: '🎨', 
    desc: 'Defining cultural narratives through visual, auditory, and performance-based digital storytelling.', 
    subjects: 'Fine Arts, Theatre and Film, Media Technology',
    roles: ['Creative Director', 'VFX Artist', 'Digital Illustrator'],
    skills: ['Creativity', 'Technical Proficiency', 'Storytelling'],
  },
  { 
    id: 'eng', 
    name: 'Engineering & Technical', 
    icon: '⚙️', 
    desc: 'Designing and building the physical infrastructure and mechanical systems of the future.', 
    subjects: 'Physics, Power Mechanics, Building Construction',
    roles: ['Civil Engineer', 'Mechanical Engineer', 'Structural Designer'],
    skills: ['Mathematics', 'Design Logic', 'Problem Solving'],
  },
  { 
    id: 'finance', 
    name: 'Finance & Strategy', 
    icon: '📈', 
    desc: 'Managing wealth, commercial strategy, and economic growth in the global digital marketplace.', 
    subjects: 'Business Studies, Core/Essential Mathematics, Computer Science',
    roles: ['Investment Analyst', 'Accountant', 'FinTech Consultant'],
    skills: ['Calculation', 'Strategic Planning', 'Risk Analysis'],
  },
  { 
    id: 'maritime', 
    name: 'Maritime & Blue Economy', 
    icon: '⚓', 
    desc: 'Exploring and sustainably managing oceanic resources, shipping logistics, and marine technology.', 
    subjects: 'Marine & Fisheries, Physics, Geography',
    roles: ['Marine Engineer', 'Port Operations Manager', 'Fisheries Scientist'],
    skills: ['Sustainability', 'Logistics', 'Maritime Navigation'],
  },
  { 
    id: 'hospitality', 
    name: 'Hospitality & Tourism', 
    icon: '🏨', 
    desc: 'Crafting world-class travel experiences and managing luxury service environments globally.', 
    subjects: 'Home Science, French/German/Mandarin, Business Studies',
    roles: ['Hotel Manager', 'Tourism Strategist', 'Executive Chef'],
    skills: ['Customer Experience', 'Cultural Intelligence', 'Management'],
  },
  { 
    id: 'edu', 
    name: 'Education & Research', 
    icon: '🎓', 
    desc: 'Shaping the next generation through pedagogical excellence and high-level academic research.', 
    subjects: 'English, Any Core Specialization, Psychology/Life Skills',
    roles: ['Academic Researcher', 'Curriculum Designer', 'Lead Educator'],
    skills: ['Communication', 'Analysis', 'Mentorship'],
  },
  { 
    id: 'security', 
    name: 'Public Service & Security', 
    icon: '🛡️', 
    desc: 'Enforcing national stability, managing emergency response, and strategic public administration.', 
    subjects: 'History & Citizenship, Religious Education, Physical Education',
    roles: ['Intelligence Officer', 'Public Administrator', 'Security Strategist'],
    skills: ['Tactical Planning', 'Public Policy', 'Resilience'],
  }
];

function CareerImage({ sectorId }: { sectorId?: string }) {
  const placeholder = PlaceHolderImages.find(img => img.id === sectorId) || 
                      PlaceHolderImages.find(img => img.id === 'eng') || 
                      PlaceHolderImages[0];

  return (
    <div className="relative w-full h-full min-h-[240px] bg-muted flex items-center justify-center overflow-hidden rounded-2xl border-4 border-primary/5">
      <Image 
        src={placeholder.imageUrl} 
        alt={placeholder.description} 
        width={1080}
        height={720}
        className="object-cover w-full h-full transition-all hover:scale-105 duration-700"
        data-ai-hint={placeholder.imageHint}
      />
    </div>
  );
}

export default function ExplorationPage() {
  const { user } = useUser();
  const [selectedField, setSelectedField] = useState<any>(null);
  const [interestsInput, setInterestsInput] = useState('');
  const [analysis, setAnalysis] = useState<HobbyPersona | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveInterest = async (careerName: string, desc: string = "Saved interest") => {
    if (!user) {
      toast({ title: "Sign in required", description: "Log in to save interests to your dashboard.", variant: "destructive" });
      return;
    }
    try {
      const interestId = careerName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await setDoc(doc(db, 'users', user.uid, 'careerInterests', interestId), {
        id: interestId,
        userId: user.uid,
        name: careerName,
        description: desc,
        emojiIcon: '✨',
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Success!", description: `${careerName} added to your dashboard.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save.", variant: "destructive" });
    }
  };

  const handleGetAiSuggestions = async () => {
    if (!interestsInput.trim()) return;
    setIsLoading(true);
    setAnalysis(null);
    
    try {
      const localResult = getHobbyPersona(interestsInput);
      if (localResult) {
        setAnalysis(localResult);
      } else {
        const interestsArray = interestsInput.split(',').map(i => i.trim()).filter(Boolean);
        const aiResult = await personalizedCareerSuggestions({ interests: interestsArray });
        
        if (aiResult.suggestions?.[0]) {
          setAnalysis({
            matchRating: 85,
            topAlignment: aiResult.suggestions[0].career,
            marketDemand: 8,
            salaryRangeKES: "75,000 - 250,000",
            description: "GenAI Analysis: This path bridges your unique interests with emerging professional opportunities.",
            alignedSubjects: aiResult.suggestions[0].subjects.split(',').map(s => s.trim()),
            alternatives: ["Specialist", "Consultant"],
            sectorId: "tech"
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSectorIcon = (sectorId: string) => {
    switch (sectorId) {
      case 'tech': return Laptop;
      case 'health': return HeartPulse;
      case 'agri': return Shovel;
      case 'law': return Gavel;
      case 'finance': return Landmark;
      case 'edu': return GraduationCap;
      case 'aviation': return Plane;
      case 'creative': return Palette;
      case 'eng': return Settings;
      case 'maritime': return Anchor;
      case 'hospitality': return Coffee;
      case 'security': return ShieldCheck;
      default: return Target;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-center gap-12 bg-primary text-white p-12 rounded-[3rem] border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Briefcase className="h-96 w-96 text-white rotate-12" />
        </div>
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Compass className="h-3 w-3" /> Navigation Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-black tracking-tighter text-white">Professional <span className="text-secondary">Ecosystems</span></h1>
          <p className="text-blue-100 text-xl leading-relaxed max-w-lg font-medium">Discover elite professional opportunities tailored for the global economy and your unique talents.</p>
        </div>
        <div className="flex-1 w-full max-w-xl relative z-10">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white/20 aspect-video relative">
            <Image 
              src={PlaceHolderImages.find(img => img.id === 'school-group')?.imageUrl || ''} 
              alt="Frere Town Excellence" 
              width={1080}
              height={720}
              priority
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Hobby Predictor Section */}
      <section className="max-w-5xl mx-auto p-10 bg-secondary/5 rounded-[3rem] border border-secondary/20 shadow-xl relative">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-secondary text-primary rounded-2xl shadow-lg">
            <Zap className="h-8 w-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black font-headline text-primary">Hobby-Career Predictor</h2>
            <p className="text-muted-foreground text-lg font-medium italic">Map your personal passions to Senior School pathways.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input 
            placeholder="e.g. Flight Simulation, Coding, Law, Music..." 
            value={interestsInput}
            onChange={(e) => setInterestsInput(e.target.value)}
            className="flex-1 bg-background h-14 text-lg rounded-2xl border-primary/20 focus:border-primary px-6 shadow-inner font-bold"
            onKeyDown={(e) => e.key === 'Enter' && handleGetAiSuggestions()}
          />
          <Button onClick={handleGetAiSuggestions} disabled={isLoading || !interestsInput.trim()} size="lg" className="h-14 px-8 rounded-2xl font-black shadow-lg gap-3">
            {isLoading ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing...</> : <><Search className="h-5 w-5" /> Predict Career</>}
          </Button>
        </div>

        {analysis && (
          <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-8 duration-700">
            <Card className="border-primary/20 bg-background shadow-2xl overflow-hidden rounded-[2.5rem]">
              <CardHeader className="bg-primary text-white pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl shadow-xl">
                    {(() => {
                      const Icon = getSectorIcon(analysis.sectorId || 'tech');
                      return <Icon className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 mb-1">Predicted Persona</p>
                    <CardTitle className="text-3xl font-headline font-black text-white">
                      {analysis.topAlignment}
                    </CardTitle>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="text-3xl font-black text-secondary">{analysis.matchRating}%</div>
                    <p className="text-[10px] font-bold uppercase text-blue-200">Match</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="p-6 bg-muted/20 border-2 border-primary/10 rounded-3xl shadow-sm space-y-4">
                      <div className="flex justify-between items-start border-b pb-4">
                        <h4 className="font-black text-xl">{analysis.topAlignment}</h4>
                        <Badge className="bg-green-600 text-white font-black">Top Match</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Demand</p>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-3 w-3 text-primary" />
                            <span className="font-black">{analysis.marketDemand}/10</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est. Salary (KES)</p>
                          <span className="text-xs font-black text-primary">{analysis.salaryRangeKES}</span>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-primary/5 italic text-sm text-muted-foreground leading-relaxed font-medium">
                        "{analysis.description}"
                      </div>
                    </div>
                    <Button className="w-full h-12 rounded-2xl font-black gap-2 shadow-lg" onClick={() => handleSaveInterest(analysis.topAlignment, analysis.description)}>
                      <Heart className="h-4 w-4 fill-current" /> Save to Interests
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] flex items-center gap-2 bg-primary/5 px-3 py-1 rounded-full w-fit">
                        <BookCheck className="h-4 w-4" /> Aligned CBE Electives
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.alignedSubjects.map((subject, i) => (
                          <Badge key={i} variant="outline" className="border-primary/20 text-primary font-black px-3 py-1 bg-white">{subject}</Badge>
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground italic px-1 font-medium">These 3 electives should be paired with the 4 Compulsory Subjects for a full 11-subject mix.</p>
                    </div>
                    <div>
                      <h4 className="font-black text-[10px] uppercase text-muted-foreground tracking-[0.2em] mb-4">🔎 Alternative Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {analysis.alternatives.map((alt, i) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-[10px] font-black bg-muted text-primary">{alt}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      {/* Sector Grid with Popups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {CAREER_FIELDS.map((field) => (
          <Card key={field.id} className="group hover:shadow-2xl transition-all duration-500 flex flex-col h-full border-none bg-card rounded-[2.5rem] overflow-hidden shadow-md">
            <div className="h-48 overflow-hidden relative">
              <CareerImage sectorId={field.id} />
              <div className="absolute top-4 right-4 bg-primary/90 text-white backdrop-blur px-3 py-1 rounded-full text-2xl shadow-xl">
                {field.icon}
              </div>
            </div>
            <CardHeader className="text-center pt-6">
              <CardTitle className="text-xl font-black">{field.name}</CardTitle>
              <CardDescription className="line-clamp-2 px-4 text-sm font-medium">{field.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 mt-auto pb-8 px-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full rounded-2xl h-12 font-black hover:bg-primary hover:text-white transition-all shadow-sm" onClick={() => setSelectedField(field)}>View Analysis</Button>
                </DialogTrigger>
                {selectedField && (
                  <DialogContent className="max-w-4xl rounded-[3rem] max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                    <DialogHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-5xl bg-primary/10 p-4 rounded-3xl">{selectedField.icon}</div>
                        <div>
                          <DialogTitle className="text-3xl font-black">{selectedField.name}</DialogTitle>
                          <DialogDescription className="text-lg font-bold text-primary/60">Official Professional Sector Profile</DialogDescription>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="space-y-8 pt-4">
                      <CareerImage sectorId={selectedField.id} />
                      
                      <div className="p-8 bg-muted/20 rounded-[2.5rem] border border-dashed border-primary/20 space-y-3">
                        <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em] flex items-center gap-2">
                          <Info className="h-4 w-4" /> Sector Insight
                        </h4>
                        <p className="text-primary/80 leading-relaxed text-lg font-black italic">
                          "{selectedField.desc}"
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                          <h4 className="text-[10px] font-black uppercase text-primary/60 mb-4 tracking-[0.2em] flex items-center gap-2">
                            <ListChecks className="h-4 w-4" /> Core Electives
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedField.subjects.split(',').map((s: string) => (
                              <Badge key={s} variant="outline" className="bg-white border-primary/20 text-primary font-black px-3 py-1">{s.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="p-6 bg-secondary/5 rounded-[2rem] border border-secondary/20">
                          <h4 className="text-[10px] font-black uppercase text-secondary mb-4 tracking-[0.2em] flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Strategic Roles
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedField.roles.map((role: string) => (
                              <div key={role} className="flex items-center gap-2 text-sm font-black bg-white px-3 py-1.5 rounded-xl border border-secondary/10 text-primary shadow-sm">
                                <ShieldCheck className="h-3 w-3 text-secondary" /> {role}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button className="w-full h-16 rounded-[2rem] text-xl font-black shadow-2xl gap-3" onClick={() => handleSaveInterest(selectedField.name, selectedField.desc)}>
                        <Heart className="h-6 w-6 fill-current" /> Add to My Interests
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
