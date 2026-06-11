"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Briefcase, TrendingUp, Landmark, ListChecks, 
  ChevronRight, Heart, DollarSign, Target
} from 'lucide-react';
import { useUser } from '@/lib/firebase/hooks';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

const CAREER_DATABASE = [
  {
    title: "Software Developer",
    salary: "80,000 - 250,000",
    demand: 10,
    subjects: ["Computer Science", "Physics", "Core/Essential Mathematics"],
    sector: "tech",
    description: "Architecting digital solutions and software systems for the global digital economy."
  },
  {
    title: "AI Engineer",
    salary: "150,000 - 450,000",
    demand: 10,
    subjects: ["Computer Science", "Core/Essential Mathematics", "Physics"],
    sector: "tech",
    description: "Developing neural networks and machine learning models for automated intelligence."
  },
  {
    title: "Commercial Pilot",
    salary: "250,000 - 850,000",
    demand: 9,
    subjects: ["Aviation", "Physics", "Geography"],
    sector: "aviation",
    description: "Operating commercial aircraft and managing global flight deck protocols."
  },
  {
    title: "Medical Doctor",
    salary: "120,000 - 350,000",
    demand: 10,
    subjects: ["Biology", "Chemistry", "Physics"],
    sector: "health",
    description: "Diagnosing and treating human illnesses within clinical and surgical environments."
  },
  {
    title: "Advocate / Lawyer",
    salary: "90,000 - 300,000",
    demand: 8,
    subjects: ["History & Citizenship", "Literature in English", "Religious Education"],
    sector: "law",
    description: "Representing clients in judicial systems and navigating legal frameworks."
  },
  {
    title: "Agribusiness Manager",
    salary: "70,000 - 200,000",
    demand: 9,
    subjects: ["Agriculture", "Biology", "Business Studies"],
    sector: "agri",
    description: "Merging modern technology with large-scale food production and supply chains."
  },
  {
    title: "Marine Engineer",
    salary: "120,000 - 400,000",
    demand: 7,
    subjects: ["Marine & Fisheries", "Physics", "Geography"],
    sector: "maritime",
    description: "Overseeing the technical operations of sea-going vessels and port infrastructure."
  }
];

export default function CareersHub() {
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCareers = useMemo(() => {
    if (!searchTerm) return CAREER_DATABASE;
    return CAREER_DATABASE.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSaveCareer = async (career: any) => {
    if (!user) {
      toast({ title: "Login Required", description: "Sign in to save this career.", variant: "destructive" });
      return;
    }
    try {
      const id = career.title.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'users', user.uid, 'careerInterests', id), {
        id,
        userId: user.uid,
        name: career.title,
        description: career.description || "Added from Career Hub",
        savedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Career Saved", description: `${career.title} added to profile.` });
    } catch (err) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="bg-primary text-white p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-6 max-w-2xl">
          <Badge className="bg-white/20 hover:bg-white/30 text-white border-none px-4 py-1">
            Professional Encyclopedia
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Career Intelligence <span className="text-secondary">Hub.</span>
          </h1>
          <p className="text-lg text-blue-100">
            Search hundreds of Kenyan career paths. Discover salary benchmarks and required CBE subjects.
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search careers, sectors, or subjects..." 
              className="h-14 pl-12 rounded-2xl bg-white text-foreground text-lg shadow-2xl"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Target className="absolute top-0 right-0 h-96 w-96 text-white/5 -mr-20 -mt-20 pointer-events-none" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCareers.map((career, i) => (
          <Card key={i} className="rounded-[2rem] overflow-hidden shadow-lg border-primary/10 flex flex-col h-full hover:shadow-xl transition-shadow">
            <CardHeader className="bg-primary/5 pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="uppercase text-[10px] font-bold tracking-widest">{career.sector}</Badge>
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs">
                  <TrendingUp className="h-3 w-3" /> Demand: {career.demand}/10
                </div>
              </div>
              <CardTitle className="text-2xl font-black">{career.title}</CardTitle>
              <CardDescription className="line-clamp-2">{career.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-grow space-y-6">
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black uppercase text-muted-foreground">Est. Salary (KES)</p>
                  <p className="font-black text-primary">{career.salary}</p>
                </div>
                <DollarSign className="h-6 w-6 text-primary/20" />
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                  <ListChecks className="h-3 w-3" /> Required CBE Subjects
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {career.subjects.map((s, idx) => (
                    <Badge key={idx} variant="outline" className="text-[10px] bg-white">{s}</Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleSaveCareer(career)} 
                variant="ghost" 
                className="w-full mt-auto rounded-xl font-bold hover:bg-primary/5 gap-2 text-primary"
              >
                <Heart className="h-4 w-4" /> Save to Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
