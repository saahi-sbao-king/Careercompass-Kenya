
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Sparkles, Heart, Search, Loader2, Compass, TrendingUp, Info, ListChecks, ShieldCheck, Laptop, HeartPulse, Shovel, Briefcase, Target, Zap, BookCheck, Activity, Gavel, Landmark, Plane, Palette, Settings, Microscope, Anchor, Coffee, GraduationCap, Users } from 'lucide-react';
import { useGuestUser } from '@/lib/firebase/hooks';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { personalizedCareerSuggestions } from '@/ai/flows/personalized-career-suggestions';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { getHobbyPersona, type HobbyPersona } from '@/lib/hobby-career-data';

export default function ExplorationPage() {
  const { guestId } = useGuestUser();
  const [interestsInput, setInterestsInput] = useState('');
  const [analysis, setAnalysis] = useState<HobbyPersona | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (name: string, desc: string) => {
    if (!guestId) return;
    try {
      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await setDoc(doc(db, 'users', guestId, 'careerInterests', id), { id, guestId, name, description: desc, savedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "Saved to Dashboard" });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  const handleAnalyze = async () => {
    if (!interestsInput.trim()) return;
    setIsLoading(true);
    try {
      const local = getHobbyPersona(interestsInput);
      if (local) setAnalysis(local);
      else {
        const res = await personalizedCareerSuggestions({ interests: [interestsInput] });
        if (res.suggestions?.[0]) setAnalysis({
          matchRating: 85, topAlignment: res.suggestions[0].career, marketDemand: 8, salaryRangeKES: "75k - 250k",
          description: "AI Analysis Match", alignedSubjects: res.suggestions[0].subjects.split(','), alternatives: [], sectorId: "tech"
        });
      }
    } finally { setIsLoading(false); }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      <div className="bg-primary text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <h1 className="text-5xl font-black mb-6">Professional Ecosystems</h1>
        <p className="text-xl opacity-90 max-w-lg mb-8">Discover elite professional opportunities tailored for your unique talents.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl relative z-10">
          <Input placeholder="Enter a hobby or interest..." value={interestsInput} onChange={e => setInterestsInput(e.target.value)} className="h-14 text-lg rounded-2xl bg-white text-foreground font-bold" />
          <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="h-14 px-8 rounded-2xl font-black">
            {isLoading ? <Loader2 className="animate-spin" /> : "Predict Career"}
          </Button>
        </div>
      </div>

      {analysis && (
        <Card className="rounded-[2.5rem] overflow-hidden shadow-2xl border-primary/20">
          <CardHeader className="bg-primary text-white p-10"><CardTitle className="text-4xl font-black">{analysis.topAlignment}</CardTitle></CardHeader>
          <CardContent className="p-10">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="p-8 bg-muted/20 border-2 rounded-3xl font-medium italic text-lg leading-relaxed">"{analysis.description}"</div>
                <Button onClick={() => handleSave(analysis.topAlignment, analysis.description)} className="w-full h-16 rounded-2xl font-black text-xl shadow-xl">Add to My Dashboard</Button>
              </div>
              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-muted-foreground">Aligned CBE Electives</h4>
                <div className="flex flex-wrap gap-2">{analysis.alignedSubjects.map(s => <Badge key={s} className="px-4 py-2 rounded-xl bg-primary/5 text-primary border-primary/20 font-bold">{s}</Badge>)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
