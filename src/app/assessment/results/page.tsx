"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Briefcase, 
  Brain, 
  ArrowLeft, 
  Download,
  Printer,
  Loader2,
  BarChart3,
  Lightbulb,
  Zap,
  Target,
  GraduationCap,
  History,
  Compass
} from 'lucide-react';
import { useGuestUser } from '@/lib/firebase/hooks';
import { 
  INTEL_DESCRIPTIONS,
  getLevel,
  IntelligenceType 
} from '@/lib/assessment-data';
import { cn } from '@/lib/utils';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateCareerBlueprintPDF } from '@/lib/report-pdf-generator';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const intelligenceMetadata: Record<string, { label: string; color: string; hex: string; bg: string }> = {
  "Linguistic": { label: "Linguistic", color: "bg-indigo-600", hex: "#4f46e5", bg: "bg-indigo-50" },
  "Logical-Math": { label: "Logical-Math", color: "bg-emerald-500", hex: "#10b981", bg: "bg-emerald-50" },
  "Musical": { label: "Musical", color: "bg-cyan-600", hex: "#0891b2", bg: "bg-cyan-50" },
  "Naturalistic": { label: "Naturalistic", color: "bg-lime-600", hex: "#65a30d", bg: "bg-lime-50" },
  "Visual-Spatial": { label: "Visual-Spatial", color: "bg-orange-500", hex: "#f97316", bg: "bg-orange-50" },
  "Intrapersonal": { label: "Intrapersonal", color: "bg-slate-500", hex: "#64748b", bg: "bg-slate-50" },
  "Existential": { label: "Existential", color: "bg-purple-500", hex: "#a855f7", bg: "bg-purple-50" },
  "Interpersonal": { label: "Interpersonal", color: "bg-sky-500", hex: "#0ea5e9", bg: "bg-sky-50" },
  "Bodily-Kinesthetic": { label: "Bodily-Kinesthetic", color: "bg-rose-500", hex: "#f43f5e", bg: "bg-rose-50" },
};

const careerClusters = [
  "STEM Careers", "Health Sciences", "Business and Entrepreneurship", 
  "Creative Arts and Design", "Education and Training", 
  "Agriculture and Environmental Sciences", "Information Technology",
  "Media and Communication", "Skilled Trades and Technical Careers",
  "Public Service and Leadership"
];

export default function ResultsPage() {
  const router = useRouter();
  const { guestData } = useGuestUser();
  const [results, setResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const schoolLogo = PlaceHolderImages.find(img => img.id === 'school-logo')?.imageUrl || '';

  useEffect(() => {
    setIsMounted(true);
    if (guestData?.assessment) {
      setResults(guestData.assessment);
    } else {
      const temp = localStorage.getItem('temp-assessment-results');
      if (temp) {
        try {
          setResults(JSON.parse(temp));
        } catch (e) {
          console.error("Failed to parse results");
        }
      }
    }
  }, [guestData]);

  const handleDownload = async () => {
    if (!results) return;
    setIsGenerating(true);
    try {
      await generateCareerBlueprintPDF({
        studentName: results.userInfo?.name || 'Scholar',
        age: results.userInfo?.age || 'N/A',
        grade: results.userInfo?.grade || 'N/A',
        school: results.userInfo?.school || 'Frere Town Secondary School',
        pathway: results.pathway,
        reportDate: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }),
        scores: results.scores,
        schoolLogoUrl: schoolLogo
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!results) {
    return (
      <div className="container py-24 text-center space-y-4">
        <Loader2 className="animate-spin mx-auto h-12 w-12 text-primary" />
        <h2 className="text-2xl font-black text-primary">Strategic Analysis in Progress</h2>
        <p className="text-muted-foreground">Retrieving your professional roadmap...</p>
        <Button onClick={() => router.push('/assessment')} className="rounded-xl h-14 px-10 font-black">Restart Assessment</Button>
      </div>
    );
  }

  const sortedIntelligences = Object.entries(results.scores || {}).sort(([, a]: any, [, b]: any) => b - a);
  const topThree = sortedIntelligences.slice(0, 3);
  const chartData = Object.entries(results.scores).map(([name, value]) => ({
    name,
    value: Math.round(value as number),
    fill: intelligenceMetadata[name]?.hex || '#4338ca'
  }));

  const devAreas = sortedIntelligences.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 flex flex-col items-center">
      {/* Action Bar */}
      <div className="w-full max-w-5xl mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="gap-2 text-slate-500 font-bold hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Command Center
        </Button>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDownload} disabled={isGenerating} className="h-12 px-6 rounded-xl font-black border-primary/20 bg-white gap-2">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Export PDF Blueprint
          </Button>
          <Button onClick={() => window.print()} className="h-12 px-6 rounded-xl font-black shadow-xl gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* Main Report Document */}
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-[3rem] overflow-hidden border border-primary/5 flex flex-col">
        
        {/* Header */}
        <header className="bg-primary text-white p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Brain className="h-48 w-48" /></div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Official Intelligence Assessment</p>
                <h1 className="text-3xl md:text-6xl font-black tracking-tighter">Career Intelligence Blueprint</h1>
                <p className="text-lg md:text-xl font-medium opacity-90 mt-2">Designed by Sidmadina Technologies.</p>
              </div>
              <div className="hidden sm:block p-2 bg-white rounded-2xl shadow-2xl">
                <img src={schoolLogo} alt="School Logo" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-8 border-t border-white/10">
              <div><p className="text-[10px] font-black uppercase text-blue-200">Scholar</p><p className="font-bold text-sm md:text-lg">{results.userInfo?.name || 'Scholar'}</p></div>
              <div><p className="text-[10px] font-black uppercase text-blue-200">Academic Level</p><p className="font-bold text-sm md:text-lg">{results.userInfo?.grade || 'Grade 10'}</p></div>
              <div><p className="text-[10px] font-black uppercase text-blue-200">Institution</p><p className="font-bold text-sm md:text-lg">{results.userInfo?.school || 'Frere Town Secondary'}</p></div>
              <div><p className="text-[10px] font-black uppercase text-blue-200">Report Date</p><p className="font-bold text-sm md:text-lg">{new Date().toLocaleDateString()}</p></div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-12 space-y-20">
          
          {/* Section 1: Profile Summary */}
          <section className="space-y-10">
            <div className="flex items-center gap-4 border-l-8 border-primary pl-6">
              <div className="p-3 bg-primary text-white rounded-2xl shadow-xl"><BarChart3 className="h-8 w-8" /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black">Intelligence Profile Summary</h2>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Performance Visual Analytics</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-10">
              <div className="md:col-span-2 h-[400px] bg-muted/20 rounded-[2.5rem] p-6 md:p-10 border-2 border-dashed">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <XAxis type="number" hide domain={[0, 25]} />
                      <YAxis dataKey="name" type="category" hide />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'black' }}
                      />
                      <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="space-y-4">
                 <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Recommended Pathway</p>
                    <p className="text-3xl md:text-4xl font-black mt-2">{results.pathway}</p>
                 </div>
                 <div className="p-6 bg-white border-2 rounded-[2rem] space-y-4">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Score Distribution</p>
                    <div className="space-y-2">
                       {sortedIntelligences.map(([name, score]: any) => (
                         <div key={name} className="flex justify-between items-center text-xs font-black">
                            <span className="text-muted-foreground">{name}</span>
                            <span className={cn("px-2 py-0.5 rounded-md", intelligenceMetadata[name]?.bg, intelligenceMetadata[name]?.color.replace('bg-', 'text-'))}>
                               {Math.round(score)}/25
                            </span>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 2: Top Dominant Intelligences */}
          <section className="space-y-12">
            <div className="flex items-center gap-4 border-l-8 border-secondary pl-6">
              <div className="p-3 bg-secondary text-white rounded-2xl shadow-xl"><Award className="h-8 w-8" /></div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black">Top Dominant Intelligences</h2>
                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Core Professional Pillars</p>
              </div>
            </div>

            <div className="grid gap-8">
              {topThree.map(([name, score]: any, i) => {
                const meta = INTEL_DESCRIPTIONS[name as IntelligenceType];
                const styles = intelligenceMetadata[name];
                return (
                  <Card key={name} className="border-none shadow-xl rounded-[2.5rem] overflow-hidden group hover:-translate-y-1 transition-all">
                    <div className={cn("h-3 w-full", styles.color)} />
                    <CardHeader className="p-8 md:p-10 flex flex-col md:flex-row justify-between items-start gap-6 bg-muted/30">
                      <div className="space-y-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Dominance Ranking: #{i+1}</span>
                        <CardTitle className="text-3xl md:text-4xl font-black">{name}</CardTitle>
                        <Badge className={cn("font-black", styles.bg, styles.color.replace('bg-', 'text-'))}>
                          {getLevel(score)} ({score}/25)
                        </Badge>
                      </div>
                      <div className="p-4 bg-white rounded-2xl shadow-sm italic text-muted-foreground font-medium max-w-sm">
                        "{meta.desc}"
                      </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10 grid md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary"><Zap size={14} /> Key Strengths</h4>
                          <div className="flex flex-wrap gap-2">{meta.strengths.map(s => <Badge key={s} variant="secondary" className="rounded-lg">{s}</Badge>)}</div>
                        </div>
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-primary"><Briefcase size={14} /> Career Trajectories</h4>
                          <div className="flex flex-wrap gap-2">{meta.careers.map(c => <Badge key={c} variant="outline" className="rounded-lg border-primary/20">{c}</Badge>)}</div>
                        </div>
                      </div>
                      <div className="p-8 bg-muted/20 rounded-[2rem] border-2 border-dashed space-y-4">
                        <h4 className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-muted-foreground"><Lightbulb size={14} /> Recommended Strategies</h4>
                        <ul className="space-y-2">
                          {meta.strategies.map(s => <li key={s} className="text-sm font-bold text-slate-700 flex items-start gap-2"><div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" /> {s}</li>)}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Section 3: Clusters & Learning Style */}
          <div className="grid md:grid-cols-2 gap-10">
            <Card className="rounded-[3rem] border-none shadow-2xl bg-primary text-white p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Target size={120} /></div>
              <h3 className="text-3xl font-black mb-8">Career Clusters</h3>
              <div className="grid gap-3">
                {careerClusters.map(c => (
                  <div key={c} className="p-4 bg-white/10 rounded-2xl border border-white/10 font-bold flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 rounded-full bg-secondary shadow-2xl" /> {c}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[3rem] border-none shadow-2xl bg-white p-12 overflow-hidden border">
               <h3 className="text-3xl font-black mb-8 text-primary">Learning DNA</h3>
               <div className="space-y-6">
                  {topThree.map(([name]: any) => (
                    <div key={name} className="p-6 bg-muted/30 rounded-2xl space-y-2">
                       <h4 className="text-[10px] font-black uppercase text-primary tracking-widest">{name} Learning Style</h4>
                       <p className="text-sm font-bold text-slate-700">{INTEL_DESCRIPTIONS[name as IntelligenceType].styles[0]}</p>
                    </div>
                  ))}
                  <div className="pt-6 border-t">
                    <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Development Areas</h4>
                    <div className="space-y-3">
                       {devAreas.map(([name, score]: any) => (
                         <div key={name} className="flex justify-between items-center text-sm font-bold">
                            <span className="text-slate-600">{name}</span>
                            <Badge variant="outline" className="text-[10px] opacity-70">Focus Required</Badge>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </Card>
          </div>

          {/* Section 4: Guidance Summary */}
          <section className="bg-secondary text-white p-10 md:p-16 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <Compass className="h-[600px] w-[600px] -bottom-40 -left-40 absolute" />
             </div>
             <h3 className="text-3xl md:text-4xl font-black">Strategic Guidance Summary</h3>
             <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-90">
               Your intelligence profile indicates strong potential in <span className="font-black underline">{topThree[0][0]}</span> and <span className="font-black underline">{topThree[1][0]}</span>. 
               We recommend focusing on the <span className="bg-white/20 px-2 rounded">{results.pathway}</span> pathway for Senior School specialization.
             </p>
             <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button onClick={() => router.push('/subject-combination')} variant="secondary" className="rounded-2xl h-16 px-10 text-lg font-black bg-white text-secondary hover:bg-white/90">Analyze Subject Mix</Button>
                <Button onClick={() => router.push('/exploration')} variant="ghost" className="rounded-2xl h-16 px-10 text-lg font-black text-white hover:bg-white/10">Explore Careers</Button>
             </div>
          </section>

          {/* Next Steps */}
          <section className="p-12 bg-slate-900 text-white rounded-[3rem] space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3"><History className="text-secondary" /> Strategic Next Steps</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                "Complete the Passion, Interest and Abilities Assessment on the Exploration page.",
                "Explore recommended career pathways aligned with your pathway.",
                "Research relevant university, college and TVET programmes in Kenya.",
                "Consult a teacher, parent or career counselor for further guidance."
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center font-black flex-shrink-0">{i+1}</div>
                  <p className="text-sm md:text-base font-medium opacity-80">{step}</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <footer className="bg-primary text-white p-12 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-lg font-black tracking-tighter">CAREERCOMPASS KENYA</p>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-1">Discover. Learn. Succeed.</p>
            </div>
            <div className="text-center md:text-right">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Designed by Sidmadina Technologies.</p>
               <p className="text-xs font-medium opacity-60 mt-1">© {new Date().getFullYear()} Official Career Blueprint System.</p>
            </div>
          </div>
        </footer>

      </div>
      
      <p className="mt-8 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-50">
        Discover. Learn. Succeed.
      </p>
    </div>
  );
}
