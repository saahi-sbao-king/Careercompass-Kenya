"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  Target, Calculator, BookOpen, Sparkles, Loader2, ListChecks, 
  Landmark, Microscope, Languages, Trophy
} from 'lucide-react';
import { exploreSubjectCombinations } from '@/ai/flows/subject-combination-flow';

const SUBJECT_DOMAINS = {
  "STEM Domain": ["Biology", "Chemistry", "Physics", "Computer Science", "Agriculture", "Geography", "Aviation", "Marine & Fisheries"],
  "Social & Humanities": ["History", "Literature in English", "Fasihi ya Kiswahili", "CRE/IRE", "Business Studies", "French", "German"],
  "Arts and Sports": ["Sports and Recreation", "Music and Dance", "Theatre and Film", "Fine Arts"]
};

export default function SubjectExplorerFinal() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [cluster, setCluster] = useState({ math: '', s1: '', s2: '', s3: '' });
  const [weight, setWeight] = useState<number | null>(null);

  const toggle = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 3 ? [...prev, s] : prev);
  };

  const handleAnalyze = async () => {
    if (selected.length !== 3) {
      toast({ title: "Selection Required", description: "Select exactly 3 electives.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await exploreSubjectCombinations({ subjects: selected });
      setAnalysis(res);
    } catch (e) {
      toast({ title: "Analysis Failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const calculateCluster = () => {
    const m = parseInt(cluster.math) || 0;
    const s1 = parseInt(cluster.s1) || 0;
    const s2 = parseInt(cluster.s2) || 0;
    const s3 = parseInt(cluster.s3) || 0;
    setWeight(Number(((m * 4 + s1 * 3 + s2 * 2 + s3 * 1) / 10).toFixed(2)));
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-headline font-black tracking-tight text-primary">Subject Combination Navigator</h1>
        <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">Pathfinder AI v3.0: Formal KICD CBE subject mapping and cluster analysis.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1 h-fit border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden bg-card">
          <CardHeader className="bg-primary/5 py-8 border-b">
            <CardTitle className="text-lg font-black flex items-center gap-2"><ListChecks className="h-5 w-5 text-primary" /> Specialized Mix</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-wider">Choose 3 Electives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-8 pb-10">
            <ScrollArea className="h-[450px] pr-4">
              {Object.entries(SUBJECT_DOMAINS).map(([domain, subjects]) => (
                <div key={domain} className="space-y-3 mb-8">
                  <h4 className="text-[10px] font-black uppercase text-primary tracking-[0.2em] bg-primary/5 px-2 py-1 rounded w-fit">{domain}</h4>
                  {subjects.map(s => (
                    <div key={s} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${selected.includes(s) ? 'bg-primary/5 border-primary shadow-sm' : 'border-transparent hover:bg-muted/50'}`} onClick={() => toggle(s)}>
                      <Checkbox checked={selected.includes(s)} />
                      <Label className="font-bold text-sm cursor-pointer">{s}</Label>
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
            <div className="pt-6 border-t space-y-4">
              <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                <span>Mix Progress</span>
                <span className={selected.length === 3 ? "text-green-600" : ""}>{selected.length} / 3</span>
              </div>
              <Progress value={(selected.length / 3) * 100} className="h-2" />
              <Button className="w-full h-14 rounded-2xl font-black text-lg shadow-xl" onClick={handleAnalyze} disabled={loading || selected.length !== 3}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Run AI Prediction"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-10">
          <Tabs defaultValue="analyzer" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-16 bg-muted/50 p-1.5 rounded-2xl border">
              <TabsTrigger value="analyzer" className="gap-2 font-black rounded-xl"><Target className="h-4 w-4" /> Prediction</TabsTrigger>
              <TabsTrigger value="calculator" className="gap-2 font-black rounded-xl"><Calculator className="h-4 w-4" /> Cluster Tool</TabsTrigger>
              <TabsTrigger value="catalogue" className="gap-2 font-black rounded-xl"><BookOpen className="h-4 w-4" /> KICD Catalogue</TabsTrigger>
            </TabsList>

            <TabsContent value="analyzer" className="space-y-8">
              {analysis ? (
                <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-card">
                  <CardHeader className="bg-primary text-white p-10">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-xl shadow-2xl"><Sparkles className="h-8 w-8" /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-2">Professional Alignment</p>
                        <CardTitle className="text-4xl font-headline font-black">Strategic Career Prediction</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="p-8 bg-muted/20 border-2 border-primary/10 rounded-[2.5rem] shadow-sm">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Core Reasoning</h4>
                          <p className="text-lg leading-relaxed font-medium italic">"{analysis.reasoning}"</p>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Recommended Careers</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysis.recommendedCareers.map((c: string, i: number) => <Badge key={i} className="px-4 py-2 rounded-xl font-bold bg-primary text-white">{c}</Badge>)}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div className="p-8 bg-secondary/5 border-2 border-secondary/10 rounded-[2.5rem]">
                          <h4 className="text-[10px] font-black uppercase text-secondary tracking-widest mb-4">University Pathways</h4>
                          <div className="grid gap-3">
                            {analysis.furtherStudies.map((u: string, i: number) => (
                              <div key={i} className="flex items-center gap-3 text-sm font-black p-3 bg-white rounded-xl shadow-sm border border-secondary/5">
                                <Landmark className="h-4 w-4 text-secondary" /> {u}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="py-40 text-center border-4 border-dashed rounded-[4rem] bg-muted/20 space-y-6">
                  <Target className="h-20 w-20 text-primary/20 mx-auto" />
                  <h3 className="text-3xl font-black">Initialize Analysis Engine</h3>
                  <p className="text-muted-foreground max-sm mx-auto font-medium">Select your 3-elective mix to see official career trajectories and university courses.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calculator">
              <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-card">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
                  {['math', 's1', 's2', 's3'].map(k => (
                    <div key={k} className="space-y-3">
                      <Label className="font-black text-[10px] uppercase tracking-widest">{k === 'math' ? 'Core Math' : `Subject ${k.slice(1)}`}</Label>
                      <Input type="number" placeholder="12" className="h-16 text-2xl font-black rounded-2xl bg-muted/30 border-none" value={cluster[k as keyof typeof cluster]} onChange={e => setCluster(p => ({...p, [k]: e.target.value}))} />
                    </div>
                  ))}
                </div>
                <Button className="w-full h-20 rounded-[2rem] text-xl font-black shadow-2xl" onClick={calculateCluster}>Calculate Weight</Button>
                {weight !== null && (
                  <div className="mt-12 p-16 bg-primary text-white rounded-[4rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10"><Trophy className="h-40 w-40" /></div>
                    <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Projected Cluster Weight</p>
                    <div className="text-8xl font-black drop-shadow-2xl">{weight}</div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="catalogue">
              <div className="grid md:grid-cols-2 gap-10">
                <Card className="rounded-[3rem] shadow-2xl bg-blue-950 text-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-white/10"><CardTitle className="text-xl font-black flex items-center gap-3"><Microscope className="h-6 w-6 text-blue-400" /> STEM Framework</CardTitle></CardHeader>
                  <CardContent className="p-8"><p className="text-sm font-medium leading-relaxed opacity-80">Official pure and applied science tracks for Grade 10 specialization.</p></CardContent>
                </Card>
                <Card className="rounded-[3rem] shadow-2xl bg-slate-900 text-white overflow-hidden">
                  <CardHeader className="p-8 border-b border-white/10"><CardTitle className="text-xl font-black flex items-center gap-3"><Languages className="h-6 w-6 text-sky-400" /> Social Sciences</CardTitle></CardHeader>
                  <CardContent className="p-8"><p className="text-sm font-medium leading-relaxed opacity-80">Official humanities, languages, and business specialization tracks.</p></CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
