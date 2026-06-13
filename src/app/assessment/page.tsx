"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MI_QUESTIONS, calculatePathway } from '@/lib/assessment-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useGuestUser } from '@/lib/firebase/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { toast } from '@/hooks/use-toast';
import { 
  UserCircle, 
  Loader2,
  Brain,
  ChevronRight,
  ChevronLeft,
  Target,
  Sparkles
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { guestId } = useGuestUser();

  const [step, setStep] = useState(0); 
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', age: '', school: '', grade: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mi-assessment-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentQuestionIdx(data.idx || 0);
        const info = data.userInfo || { name: '', age: '', school: '', grade: '', phone: '' };
        setUserInfo(info);
        if (info.name && info.name.length > 2) {
          setStep(data.step || 1);
        }
      } catch (e) { console.error(e); }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('mi-assessment-progress', JSON.stringify({ answers, idx: currentQuestionIdx, userInfo, step }));
    }
  }, [answers, currentQuestionIdx, userInfo, step, isHydrated]);

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleAnswerChange = (value: string) => {
    const score = parseInt(value);
    const questionId = MI_QUESTIONS[currentQuestionIdx].id;
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateResults = async () => {
    if (!guestId || !db) return;
    setIsSaving(true);
    
    try {
      const intelligenceScores: Record<string, number> = {};
      MI_QUESTIONS.forEach(q => {
        const score = answers[q.id] || 0;
        intelligenceScores[q.type] = (intelligenceScores[q.type] || 0) + score;
      });

      const resultData = {
        pathway: calculatePathway(intelligenceScores),
        scores: intelligenceScores,
        userInfo,
        completedAt: new Date().toISOString()
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('temp-assessment-results', JSON.stringify(resultData));
      }

      await setDoc(doc(db, 'users', guestId), { 
        assessment: resultData, 
        id: guestId, 
        username: userInfo.name,
        lastActive: new Date().toISOString()
      }, { merge: true });
      
      localStorage.removeItem('mi-assessment-progress');
      toast({ title: "Blueprint Finalized", description: "Your professional roadmap is ready." });
      router.push('/assessment/results');
    } catch (err) { 
      console.error("Save Error:", err);
      router.push('/assessment/results');
    } finally { 
      setIsSaving(false); 
    }
  };

  if (!isHydrated) return (
    <div className="p-24 text-center">
      <Loader2 className="animate-spin mx-auto text-primary" />
      <p className="mt-4 text-muted-foreground">Initializing questionnaire...</p>
    </div>
  );

  if (step === 0) {
    return (
      <div className="container max-w-2xl mx-auto py-12 px-4">
        <Card className="border-primary/20 shadow-2xl bg-card overflow-hidden rounded-[3rem]">
          <CardHeader className="text-center bg-primary text-white p-12">
            <div className="mx-auto w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 shadow-2xl backdrop-blur-xl">
              <UserCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-4xl font-black tracking-tighter">Information Hub</CardTitle>
            <CardDescription className="text-blue-100 font-medium">Verify your strategic details to begin the assessment.</CardDescription>
          </CardHeader>
          <CardContent className="p-12 space-y-8">
            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Full Name</Label>
                <Input required value={userInfo.name} onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))} className="h-14 rounded-2xl text-lg font-bold" placeholder="e.g. Sadiq Sbao" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Age</Label>
                  <Input required type="number" value={userInfo.age} onChange={e => setUserInfo(prev => ({ ...prev, age: e.target.value }))} className="h-14 rounded-2xl text-lg font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Grade / Level</Label>
                  <Input required value={userInfo.grade} onChange={e => setUserInfo(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl text-lg font-bold" placeholder="Grade 10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60">Institution</Label>
                <Input required value={userInfo.school} onChange={e => setUserInfo(prev => ({ ...prev, school: e.target.value }))} className="h-14 rounded-2xl text-lg font-bold" placeholder="Frere Town Secondary" />
              </div>
              <Button type="submit" className="w-full h-20 text-2xl font-black rounded-[2rem] shadow-2xl mt-4">
                Launch Assessment <ChevronRight className="ml-2" />
              </Button>
              <div className="p-4 bg-muted/30 rounded-2xl border border-dashed text-center">
                 <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">Strategic Partner: Sidmadina Technologies</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = MI_QUESTIONS[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / MI_QUESTIONS.length) * 100;

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary text-white rounded-lg shadow-lg"><Brain size={18} /></div>
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Modality Analysis</span>
            <p className="text-[10px] text-muted-foreground font-bold">{currentQuestion.type} Intelligence</p>
          </div>
        </div>
        <div className="text-right">
           <span className="text-xs font-black text-primary">{Math.round(progressPercent)}%</span>
           <p className="text-[10px] font-bold text-muted-foreground">{currentQuestionIdx + 1} of 45</p>
        </div>
      </div>
      <Progress value={progressPercent} className="h-2 rounded-full bg-primary/10" />
      
      <Card className="min-h-[600px] flex flex-col justify-between rounded-[4rem] overflow-hidden shadow-2xl border-primary/5">
        <CardHeader className="bg-primary text-white p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10"><Target size={160} /></div>
          <span className="px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mb-6 block backdrop-blur-xl">
             Focus Area: {currentQuestion.type}
          </span>
          <CardTitle className="text-2xl md:text-4xl font-black leading-tight tracking-tighter">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-8 md:p-16">
          <RadioGroup value={answers[currentQuestion.id]?.toString()} onValueChange={handleAnswerChange} className="grid gap-4">
            {[5, 4, 3, 2, 1].map(v => (
              <div 
                key={v} 
                onClick={() => handleAnswerChange(v.toString())} 
                className={`flex items-center space-x-4 p-4 md:p-6 border-2 rounded-3xl cursor-pointer transition-all ${
                  answers[currentQuestion.id] === v 
                    ? 'border-primary bg-primary/5 shadow-xl scale-[1.03]' 
                    : 'border-transparent bg-muted/30 hover:bg-muted/50'
                }`}
              >
                <RadioGroupItem value={v.toString()} id={`v-${v}`} />
                <Label htmlFor={`v-${v}`} className="flex-1 font-black text-lg md:text-xl cursor-pointer">
                  {v === 5 && "Strongly Agree"}
                  {v === 4 && "Agree"}
                  {v === 3 && "Neutral"}
                  {v === 2 && "Disagree"}
                  {v === 1 && "Strongly Disagree"}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        
        <CardFooter className="flex justify-between p-8 md:p-16 pt-0">
          <Button 
            variant="ghost" 
            onClick={() => setCurrentQuestionIdx(i => i - 1)} 
            disabled={currentQuestionIdx === 0}
            className="h-14 px-4 md:px-8 rounded-xl font-black gap-2"
          >
            <ChevronLeft /> Previous
          </Button>
          
          {currentQuestionIdx === MI_QUESTIONS.length - 1 ? (
            <Button 
              onClick={calculateResults} 
              disabled={!answers[currentQuestion.id] || isSaving} 
              className="h-16 px-8 md:px-12 rounded-2xl font-black shadow-2xl text-lg md:text-xl gap-2"
            >
              {isSaving ? <Loader2 className="animate-spin" /> : <Sparkles className="h-5 w-5" />}
              Finalize Roadmap
            </Button>
          ) : (
            <Button 
              onClick={() => setCurrentQuestionIdx(i => i + 1)} 
              disabled={!answers[currentQuestion.id]} 
              className="h-16 px-8 md:px-12 rounded-2xl font-black shadow-2xl text-lg md:text-xl"
            >
              Next Question <ChevronRight />
            </Button>
          )}
        </CardFooter>
      </Card>
      
      <p className="text-[10px] text-center text-muted-foreground font-black uppercase tracking-[0.3em]">
         Strategic Career Intelligence Terminal v4.0.0
      </p>
    </div>
  );
}
