"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Award, 
  Briefcase, 
  ListChecks, 
  Brain, 
  ArrowLeft, 
  Download,
  Printer,
  Loader2,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useGuestUser } from '@/lib/firebase/hooks';
import { 
  getRecommendedPassions, 
  getRecommendedAbilities, 
  getRecommendedInterests,
  getRecommendedCareers,
  getRecommendedSubjects 
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
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const intelligenceMetadata: Record<string, { label: string; color: string; hex: string; bg: string }> = {
  "Linguistic": { label: "Linguistic", color: "bg-indigo-600", hex: "#4f46e5", bg: "bg-indigo-50" },
  "Logical-Math": { label: "Logical-Math", color: "bg-emerald-500", hex: "#10b981", bg: "bg-emerald-50" },
  "Musical": { label: "Musical", color: "bg-cyan-600", hex: "#0891b2", bg: "bg-cyan-50" },
  "Naturalist": { label: "Naturalist", color: "bg-lime-600", hex: "#65a30d", bg: "bg-lime-50" },
  "Spatial": { label: "Spatial", color: "bg-orange-500", hex: "#f97316", bg: "bg-orange-50" },
  "Intrapersonal": { label: "Intrapersonal", color: "bg-slate-500", hex: "#64748b", bg: "bg-slate-50" },
  "Existential": { label: "Existential", color: "bg-purple-500", hex: "#a855f7", bg: "bg-purple-50" },
  "Interpersonal": { label: "Interpersonal", color: "bg-sky-500", hex: "#0ea5e9", bg: "bg-sky-50" },
  "Bodily-Kinesthetic": { label: "Bodily-Kinesthetic", color: "bg-rose-500", hex: "#f43f5e", bg: "bg-rose-50" },
};

export default function ResultsPage() {
  const router = useRouter();
  const { guestData } = useGuestUser();
  const [results, setResults] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const schoolLogo = PlaceHolderImages.find(img => img.id === 'school-logo')?.imageUrl || '';

  useEffect(() => {
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
        reportDate: results.completedAt ? new Date(results.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '10 March 2026',
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
        <h2 className="text-2xl font-bold text-primary">No results found</h2>
        <Button onClick={() => router.push('/assessment')} className="bg-primary text-primary-foreground">Start Quiz</Button>
      </div>
    );
  }

  const sortedIntelligences = Object.entries(results.scores || {}).sort(([, a]: any, [, b]: any) => b - a);
  const topThree = sortedIntelligences.slice(0, 3);
  const formatScore = (score: number) => Math.round(score / 4);

  const careers = getRecommendedCareers(results.scores);
  const subjects = getRecommendedSubjects(results.scores, results.pathway);

  // Chart Data
  const chartData = Object.entries(results.scores).map(([name, value]) => ({
    name,
    value: Math.round(value as number),
    fill: intelligenceMetadata[name]?.hex || '#4338ca'
  }));

  const pieData = topThree.map(([name, value]) => ({
    name,
    value: value as number,
    fill: intelligenceMetadata[name]?.hex || '#4338ca'
  }));

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center font-sans text-slate-900">
      {/* Action Bar */}
      <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.push('/dashboard')} className="gap-2 text-slate-500 font-bold hover:text-[#4338ca]">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload} disabled={isGenerating} className="gap-2 border-slate-200 font-bold text-[#4338ca] bg-white">
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Download PDF Report
          </Button>
          <Button onClick={() => window.print()} className="gap-2 bg-[#4338ca] hover:bg-[#3730a3] font-bold text-white shadow-lg">
            <Printer className="h-4 w-4" /> Print
          </Button>
        </div>
      </div>

      {/* Report Container */}
      <div className="w-full max-w-[210mm] bg-white shadow-2xl overflow-hidden min-h-[297mm] flex flex-col relative print:shadow-none print:m-0">
        
        {/* --- ZONE 1: EXECUTIVE HEADER --- */}
        <header className="bg-[#4338ca] text-white p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-10 rounded-full" />
          
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <p className="text-[9px] font-bold tracking-widest uppercase opacity-90">
                CAREERCOMPASS KENYA
              </p>
              <h1 className="text-2xl font-bold tracking-tight leading-none mb-1">Career Assessment Report</h1>
              <p className="text-xs opacity-80 mb-3">
                {results.userInfo?.school || 'Frere Town Secondary'} • {results.completedAt ? new Date(results.completedAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : '10 March 2026'}
              </p>
            </div>

            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-white/30 p-1 overflow-hidden shadow-inner">
              <img 
                src={schoolLogo} 
                alt="Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </header>

        {/* --- ZONE 2: IDENTIFICATION & PATHWAY --- */}
        <section className="px-8 py-4 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{results.userInfo?.name || 'Scholar'}</h2>
              <p className="text-[10px] text-slate-500 uppercase font-medium">
                {results.userInfo?.age || 'N/A'} Yrs • {results.userInfo?.grade || 'Grade 10'}
              </p>
            </div>
          </div>
          
          <div className="w-full md:w-64 bg-emerald-500 text-white rounded-lg p-3 text-center flex flex-col justify-center shadow-md">
            <span className="text-[9px] font-bold tracking-widest uppercase opacity-90">
              RECOMMENDED PATHWAY
            </span>
            <p className="text-md font-bold">{results.pathway}</p>
          </div>
        </section>

        {/* --- ZONE 3: TOP INTELLIGENCES --- */}
        <section className="px-8 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-slate-700" size={18} />
            <h3 className="text-md font-bold text-slate-800 border-b-2 border-slate-800 pb-0.5">
              Top Intelligences
            </h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {topThree.map(([key, score]: any, i) => {
              const meta = intelligenceMetadata[key];
              const labels = ["PRIMARY", "SECONDARY", "TERTIARY"];
              return (
                <div key={key} className="bg-white border border-slate-100 rounded-lg shadow-sm flex flex-col items-center py-3 relative overflow-hidden group hover:border-indigo-200 transition-colors">
                  <div className={cn("absolute top-0 left-0 right-0 h-1", meta.color)} />
                  <span className="text-[8px] font-bold text-indigo-600 mb-1 tracking-tighter">{labels[i]}</span>
                  <span className="text-[11px] font-bold text-slate-700 mb-2 text-center px-1 leading-tight">{meta.label}</span>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-black text-slate-800">{formatScore(score)}</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-0.5">/25</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- VISUAL ANALYTICS --- */}
        <section className="px-8 mb-6 grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
          <Card className="border-slate-100 shadow-sm">
            <div className="p-4 flex items-center gap-2 border-b">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Score Distribution</h4>
            </div>
            <CardContent className="h-[200px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" hide />
                  <YAxis domain={[0, 100]} hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm">
            <div className="p-4 flex items-center gap-2 border-b">
              <PieChartIcon className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Strength Composition</h4>
            </div>
            <CardContent className="h-[200px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* --- ZONE: CAREERS & RECOMMENDED ELECTIVES --- */}
        <section className="px-8 mb-6 grid grid-cols-2 gap-4">
          {/* Careers */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-indigo-700">
              <Briefcase size={16} />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Recommended Careers</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {careers.map(career => (
                <span key={career} className="bg-white border border-indigo-200 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                  {career}
                </span>
              ))}
            </div>
          </div>

          {/* Recommended Elective Subjects */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-amber-700">
              <ListChecks size={16} />
              <h4 className="text-[11px] font-bold uppercase tracking-wider">Recommended 3 Electives</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {subjects.map(elective => (
                <span key={elective} className="bg-white border border-amber-200 text-amber-700 text-[10px] px-2 py-0.5 rounded-full font-medium shadow-sm">
                  {elective}
                </span>
              ))}
            </div>
            <p className="text-[9px] text-amber-600/70 mt-3 italic leading-tight">
              Selection based on talent alignment & pathway suitability.
            </p>
          </div>
        </section>

        {/* --- ZONE 4: QUALITATIVE INSIGHTS --- */}
        <section className="px-8 mb-6">
          <div className="grid grid-cols-3 gap-4 bg-slate-50 rounded-lg p-4 border border-slate-100 shadow-sm">
            <div>
              <h4 className="text-[9px] font-bold text-indigo-700 uppercase tracking-widest border-b border-indigo-200 mb-2">Interests</h4>
              <ul className="space-y-1">
                {getRecommendedInterests(results.scores).slice(0, 3).map(item => (
                  <li key={item} className="text-[10px] text-slate-600 flex items-start gap-1"><span className="text-indigo-400">•</span> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest border-b border-emerald-200 mb-2">Passions</h4>
              <ul className="space-y-1">
                {getRecommendedPassions(results.scores).slice(0, 3).map(item => (
                  <li key={item} className="text-[10px] text-slate-600 flex items-start gap-1"><span className="text-emerald-400">•</span> {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-bold text-cyan-700 uppercase tracking-widest border-b border-cyan-200 mb-2">Abilities</h4>
              <ul className="space-y-1">
                {getRecommendedAbilities(results.scores).slice(0, 3).map(item => (
                  <li key={item} className="text-[10px] text-slate-600 flex items-start gap-1"><span className="text-cyan-400">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* --- ZONE 5: FULL PROFILE --- */}
        <section className="px-8 mb-6 flex-grow">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="text-slate-700" size={18} />
            <h3 className="text-md font-bold text-slate-800 border-b-2 border-slate-800 pb-0.5">
              Full Intelligence Profile
            </h3>
          </div>
          
          <div className="space-y-2">
            {sortedIntelligences.map(([key, score]: any) => {
              const meta = intelligenceMetadata[key];
              return (
                <div key={key} className="flex items-center gap-3 group">
                  <div className="w-24 text-right shrink-0">
                    <span className="text-[9px] font-bold text-slate-600 uppercase leading-none group-hover:text-indigo-600 transition-colors">{meta.label}</span>
                  </div>
                  <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={cn("h-full opacity-80 group-hover:opacity-100 transition-opacity", meta.color)} style={{ width: `${score}%` }} />
                  </div>
                  <div className="w-10 text-left shrink-0">
                    <span className="text-[9px] font-black text-slate-400">{formatScore(score)}/25</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* --- ZONE 6: FOOTER --- */}
        <footer className="bg-[#4338ca] text-white p-4 mt-auto">
          <div className="text-center">
            <p className="text-[9px] font-bold opacity-90 mb-0.5">
              CareerCompass Kenya | Designed by Sidmadina Technologies
            </p>
            <p className="text-[8px] opacity-60 uppercase tracking-tighter">
              Kenya's Competency-Based Education (CBE) System Alignment
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
