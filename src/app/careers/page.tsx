
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Landmark, ListChecks, Heart, DollarSign, Target } from 'lucide-react';
import { useGuestUser } from '@/lib/firebase/hooks';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';

const CAREER_DATABASE = [
  { title: "Software Developer", salary: "80,000 - 250,000", demand: 10, subjects: ["Computer Science", "Physics", "Core Math"], sector: "tech", description: "Architecting digital solutions." },
  { title: "AI Engineer", salary: "150,000 - 450,000", demand: 10, subjects: ["Computer Science", "Core Math", "Physics"], sector: "tech", description: "Developing neural networks." },
  { title: "Commercial Pilot", salary: "250,000 - 850,000", demand: 9, subjects: ["Aviation", "Physics", "Geography"], sector: "aviation", description: "Operating commercial aircraft." },
  { title: "Medical Doctor", salary: "120,000 - 350,000", demand: 10, subjects: ["Biology", "Chemistry", "Physics"], sector: "health", description: "Diagnosing human illnesses." },
  { title: "Advocate", salary: "90,000 - 300,000", demand: 8, subjects: ["History", "Literature", "RE"], sector: "law", description: "Representing clients in judicial systems." }
];

export default function CareersHub() {
  const { guestId } = useGuestUser();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => CAREER_DATABASE.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

  const handleSave = async (career: any) => {
    if (!guestId) return;
    try {
      const id = career.title.toLowerCase().replace(/\s+/g, '-');
      await setDoc(doc(db, 'users', guestId, 'careerInterests', id), { id, guestId, name: career.title, description: career.description, savedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "Saved to Dashboard" });
    } catch (err) { toast({ title: "Error saving", variant: "destructive" }); }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="bg-primary text-white p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <h1 className="text-5xl font-black mb-6">Career Intelligence Hub.</h1>
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search careers..." className="h-14 pl-12 rounded-2xl text-foreground text-lg" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {filtered.map((c, i) => (
          <Card key={i} className="rounded-[2rem] overflow-hidden shadow-lg border-primary/10 flex flex-col h-full">
            <CardHeader className="bg-primary/5">
              <Badge variant="secondary" className="w-fit mb-2 uppercase">{c.sector}</Badge>
              <CardTitle className="text-2xl font-black">{c.title}</CardTitle>
              <CardDescription className="line-clamp-2">{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 flex-grow space-y-6">
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed flex justify-between items-center">
                <div><p className="text-[10px] font-black uppercase text-muted-foreground">Salary (KES)</p><p className="font-black text-primary">{c.salary}</p></div>
                <DollarSign className="opacity-20" />
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Subjects</p>
                <div className="flex flex-wrap gap-1.5">{c.subjects.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}</div>
              </div>
              <Button onClick={() => handleSave(c)} variant="ghost" className="w-full rounded-xl font-bold gap-2 text-primary"><Heart size={16} /> Save to Dashboard</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
