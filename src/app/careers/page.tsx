
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, TrendingUp, Landmark, ListChecks, Heart, DollarSign, Target, GraduationCap, Building2 } from 'lucide-react';
import { useGuestUser } from '@/lib/firebase/hooks';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { CAREER_DATABASE } from '@/lib/career-database';

export default function CareersHub() {
  const { guestId } = useGuestUser();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => 
    CAREER_DATABASE.filter(c => 
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cluster.toLowerCase().includes(searchTerm.toLowerCase())
    ), 
  [searchTerm]);

  const handleSave = async (career: any) => {
    if (!guestId) return;
    try {
      const id = career.id;
      await setDoc(doc(db, 'users', guestId, 'careerInterests', id), { 
        id, 
        guestId, 
        name: career.title, 
        description: career.description, 
        savedAt: new Date().toISOString() 
      }, { merge: true });
      toast({ title: "Saved to Dashboard", description: `${career.title} added successfully.` });
    } catch (err) { 
      toast({ title: "Error saving", variant: "destructive" }); 
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="bg-primary text-white p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Landmark size={240} />
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">Career Intelligence Hub.</h1>
          <p className="text-xl opacity-90 max-w-2xl font-medium">Explore over 100+ professional trajectories mapped to the Kenyan CBE framework.</p>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              placeholder="Search by career, cluster, or subject..." 
              className="h-16 pl-12 rounded-2xl text-foreground text-lg font-bold border-none shadow-2xl" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((c) => (
          <Card key={c.id} className="rounded-[2.5rem] overflow-hidden shadow-lg border-primary/5 hover:border-primary/20 transition-all group flex flex-col h-full">
            <CardHeader className="bg-muted/30 p-8">
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">{c.cluster}</Badge>
                <div className="flex items-center gap-1 text-xs font-black text-green-600">
                  <TrendingUp size={12} /> {c.demand}/10 Demand
                </div>
              </div>
              <CardTitle className="text-3xl font-black group-hover:text-primary transition-colors">{c.title}</CardTitle>
              <CardDescription className="line-clamp-3 text-sm font-medium mt-2 leading-relaxed">{c.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-8 flex-grow space-y-8">
              <div className="p-5 bg-primary/5 rounded-[1.5rem] border border-dashed border-primary/20 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Salary Range (KES)</p>
                  <p className="font-black text-primary text-lg">{c.salaryKES}</p>
                </div>
                <DollarSign className="text-primary opacity-20 h-8 w-8" />
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <ListChecks size={14} /> Required Electives
                </h4>
                <div className="flex flex-wrap gap-2">
                  {c.requiredSubjects.map(s => (
                    <Badge key={s} variant="outline" className="rounded-lg text-[10px] font-bold py-1 px-3 border-primary/10">{s}</Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed">
                <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] flex items-center gap-2">
                  <GraduationCap size={14} /> Training Institutions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {c.institutions.map(inst => (
                    <div key={inst} className="flex items-center gap-1.5 text-[11px] font-black text-slate-600 bg-muted px-2 py-1 rounded-md">
                      <Building2 size={10} className="text-primary" /> {inst}
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleSave(c)} 
                variant="ghost" 
                className="w-full h-14 rounded-2xl font-black gap-2 text-primary hover:bg-primary/5 mt-4"
              >
                <Heart size={18} /> Save to Dashboard
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-24 text-center space-y-6">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
             <Search size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-black">No careers found matching "{searchTerm}"</h3>
          <p className="text-muted-foreground">Try searching for a different cluster or subject.</p>
          <Button onClick={() => setSearchTerm('')} variant="outline" className="rounded-xl">Clear Search</Button>
        </div>
      )}
    </div>
  );
}
