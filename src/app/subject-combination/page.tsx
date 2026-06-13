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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { 
  Target, Calculator, BookOpen, Sparkles, Loader2, ListChecks, 
  Landmark, Microscope, Languages, Trophy, ShieldCheck, Zap,
  Cpu, Rocket, FlaskConical, Plane, Briefcase, Gavel, Globe, Activity
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
  const [catalogueView, setCatalogueView] = useState<'stem' | 'social'>('stem');

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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-4">
          <ShieldCheck className="h-4 w-4" /> KICD CBE Specialized Tool
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tight text-primary">Subject Navigator</h1>
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

            <TabsContent value="catalogue" className="space-y-12">
              <div className="flex justify-center mb-8">
                <div className="bg-muted p-1 rounded-xl flex gap-1">
                  <Button 
                    variant={catalogueView === 'stem' ? 'default' : 'ghost'} 
                    onClick={() => setCatalogueView('stem')}
                    className="rounded-lg font-black"
                  >
                    STEM Framework
                  </Button>
                  <Button 
                    variant={catalogueView === 'social' ? 'default' : 'ghost'} 
                    onClick={() => setCatalogueView('social')}
                    className="rounded-lg font-black"
                  >
                    Social Sciences
                  </Button>
                </div>
              </div>

              {catalogueView === 'stem' ? (
                <div className="space-y-12">
                  <div className="p-10 bg-blue-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><FlaskConical className="h-64 w-64" /></div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Microscope className="h-8 w-8 text-blue-300" /></div>
                        <h2 className="text-4xl font-black">STEM Framework</h2>
                      </div>
                      <p className="text-lg opacity-80 max-w-3xl leading-relaxed">
                        The Science, Technology, Engineering and Mathematics (STEM) Framework is a premier senior school pathway in Kenya's CBE system, designed for scientific innovation and technical leadership.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-10">
                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden flex flex-col group">
                      <div className="h-2 w-full bg-blue-500" />
                      <CardHeader className="bg-muted/30 p-10">
                        <CardTitle className="text-2xl font-black flex items-center gap-3"><FlaskConical className="text-blue-500" /> Pure Sciences Track</CardTitle>
                        <CardDescription className="font-bold">Focus: Scientific theory, medicine, and research.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8 flex-grow">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Subjects Offered</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Advanced Mathematics", "Biology", "Chemistry", "Physics"].map(s => <Badge key={s} variant="outline" className="rounded-lg">{s}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Core Careers</h4>
                          <ul className="grid grid-cols-2 gap-2 text-sm font-bold text-slate-700">
                            <li>• Medicine & Surgery</li>
                            <li>• Pharmacy</li>
                            <li>• Biomedical Science</li>
                            <li>• Biotechnology</li>
                            <li>• Genetics</li>
                            <li>• Environmental Science</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden flex flex-col group">
                      <div className="h-2 w-full bg-emerald-500" />
                      <CardHeader className="bg-muted/30 p-10">
                        <CardTitle className="text-2xl font-black flex items-center gap-3"><Cpu className="text-emerald-500" /> Applied Sciences Track</CardTitle>
                        <CardDescription className="font-bold">Focus: Practical application, engineering, and tech.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 space-y-8 flex-grow">
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Subjects Offered</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Advanced Mathematics", "Physics", "Chemistry", "Computer Science", "Engineering Studies", "Aviation Studies"].map(s => <Badge key={s} variant="outline" className="rounded-lg">{s}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Core Careers</h4>
                          <ul className="grid grid-cols-2 gap-2 text-sm font-bold text-slate-700">
                            <li>• Software Engineering</li>
                            <li>• Artificial Intelligence</li>
                            <li>• Civil Engineering</li>
                            <li>• Robotics</li>
                            <li>• Architecture</li>
                            <li>• Renewable Energy</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-10 bg-indigo-950 text-white rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5"><Gavel className="h-64 w-64" /></div>
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xl"><Briefcase className="h-8 w-8 text-indigo-300" /></div>
                        <h2 className="text-4xl font-black">Social Sciences Framework</h2>
                      </div>
                      <p className="text-lg opacity-80 max-w-3xl leading-relaxed">
                        Designed for learners interested in humanities, law, governance, business, and communication. This pathway develops critical leaders for society and the economy.
                      </p>
                    </div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Track 1: Humanities */}
                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden flex flex-col group">
                      <div className="h-2 w-full bg-indigo-500" />
                      <CardHeader className="bg-muted/30 p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3"><Landmark className="text-indigo-500" /> Humanities & Biz</CardTitle>
                        <CardDescription className="text-xs font-bold">Society, Governance & Economics.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6 flex-grow">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Key Subjects</h4>
                          <div className="flex flex-wrap gap-1">
                            {["History", "Geography", "Business", "Economics", "CRE/IRE"].map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Careers</h4>
                          <ul className="text-xs font-bold text-slate-700 space-y-1">
                            <li>• Law & Advocacy</li>
                            <li>• Public Administration</li>
                            <li>• Banking & Accounting</li>
                            <li>• Political Science</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Track 2: Languages */}
                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden flex flex-col group">
                      <div className="h-2 w-full bg-amber-500" />
                      <CardHeader className="bg-muted/30 p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3"><Languages className="text-amber-500" /> Lang & Literature</CardTitle>
                        <CardDescription className="text-xs font-bold">Communication & Cultural Depth.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6 flex-grow">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Key Subjects</h4>
                          <div className="flex flex-wrap gap-1">
                            {["English Lit", "Fasihi", "French", "German", "Arabic"].map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Careers</h4>
                          <ul className="text-xs font-bold text-slate-700 space-y-1">
                            <li>• Diplomacy & UN</li>
                            <li>• Journalism & Media</li>
                            <li>• Translation</li>
                            <li>• Publishing</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Track 3: Sports Science */}
                    <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden flex flex-col group">
                      <div className="h-2 w-full bg-rose-500" />
                      <CardHeader className="bg-muted/30 p-8">
                        <CardTitle className="text-xl font-black flex items-center gap-3"><Activity className="text-rose-500" /> Sports Science</CardTitle>
                        <CardDescription className="text-xs font-bold">Performance & Management.</CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 space-y-6 flex-grow">
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Key Subjects</h4>
                          <div className="flex flex-wrap gap-1">
                            {["Sports & Rec", "Exercise Phys", "Sports Psych", "Mgmt"].map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Careers</h4>
                          <ul className="text-xs font-bold text-slate-700 space-y-1">
                            <li>• Professional Athlete</li>
                            <li>• Coaching & Fitness</li>
                            <li>• Sports Management</li>
                            <li>• Sports Medicine</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-[3rem] border-none shadow-2xl p-10 bg-indigo-900 text-white">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <h3 className="text-3xl font-black flex items-center gap-3"><Zap className="text-amber-400" /> Social Competencies</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            "Ethical Decision-Making", "Cultural Awareness", "Public Speaking",
                            "Strategic Leadership", "Research & Analysis", "Social Policy Design"
                          ].map(c => (
                            <div key={c} className="flex items-center gap-3 text-sm font-bold">
                              <div className="h-1.5 w-1.5 rounded-full bg-amber-400" /> {c}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/20 text-center">
                          <Globe className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                          <p className="text-[10px] font-black uppercase">Emerging Field</p>
                          <p className="font-bold text-xs mt-1">Policy Analyst</p>
                        </div>
                        <div className="p-6 bg-white/10 rounded-2xl border border-white/20 text-center">
                          <Target className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                          <p className="text-[10px] font-black uppercase">Emerging Field</p>
                          <p className="font-bold text-xs mt-1">Digital Strategist</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
