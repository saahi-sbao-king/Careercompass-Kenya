"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MI_QUESTIONS, calculatePathway } from '@/lib/assessment-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useUser } from '@/lib/firebase/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, ChevronRight, Loader2, UserCircle, 
  Sparkles
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { user } = useUser();

  // Quiz States
  const [step, setStep] = useState(0); 
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', age: '', school: '', grade: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle Hydration and LocalStorage Load
  useEffect(() => {
    const saved = localStorage.getItem('mi-assessment-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentQuestionIdx(data.idx || 0);
        setUserInfo(data.userInfo || { name: '', age: '', school: '', grade: '', phone: '' });
        setStep(data.step || 0);
      } catch (e) {
        console.error("Failed to parse saved progress", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save Progress
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('mi-assessment-progress', JSON.stringify({
        answers,
        idx: currentQuestionIdx,
        userInfo,
        step
      }));
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

  const goToNext = () => {
    if (currentQuestionIdx < MI_QUESTIONS.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(prev => prev - 1);
    }
  };

  const calculateResults = async () => {
    if (!user) {
      toast({ title: "Account Required", description: "Please sign in to save your results.", variant: "destructive" });
      router.push('/auth/login');
      return;
    }

    setIsSaving(true);
    const intelligenceScores: Record<string, number> = {};
    MI_QUESTIONS.forEach(q => {
      const score = answers[q.id] || 0;
      intelligenceScores[q.type] = (intelligenceScores[q.type] || 0) + score;
    });

    const finalScores: Record<string, number> = {};
    Object.keys(intelligenceScores).forEach(type => {
      // Each type has 5 questions, max score 25. Scale to 100.
      finalScores[type] = (intelligenceScores[type] / 25) * 100;
    });

    const pathway = calculatePathway(finalScores);
    const resultData = {
      pathway,
      scores: finalScores,
      userInfo,
      completedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', user.uid), { 
        assessment: resultData,
        hasPaidAssessment: true // Free for all now
      }, { merge: true });
      
      localStorage.removeItem('mi-assessment-progress');
      toast({ title: "Assessment Complete!", description: "Your results have been synchronized." });
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      toast({ title: "Error saving results", description: "Failed to connect to the strategic server.", variant: "destructive" });
      setIsSaving(false);
    }
  };

  if (!isHydrated) {
    return <div className="p-24 text-center"><Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" /></div>;
  }

  // Step 0: User Info
  if (step === 0) {
    return (
      <div className="container max-w-xl mx-auto py-12 px-4">
        <div className="mb-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="h-3 w-3" /> Talent Discovery
          </div>
          <h1 className="text-4xl font-headline font-black text-primary">Strategic Profile</h1>
          <p className="text-muted-foreground font-medium">Define your academic identity to begin the evaluation.</p>
        </div>

        <Card className="border-primary/20 shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center bg-primary/5 pb-8 border-b">
            <UserCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-black">Information Hub</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Full Name</Label>
                <Input required value={userInfo.name} onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Saddiq Ali" className="h-14 rounded-2xl bg-muted/30 border-none px-6 text-lg font-bold" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Phone Number</Label>
                <Input required value={userInfo.phone} onChange={e => setUserInfo(prev => ({ ...prev, phone: e.target.value }))} placeholder="e.g. 0712345678" className="h-14 rounded-2xl bg-muted/30 border-none px-6 text-lg font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Age</Label>
                  <Input required type="number" placeholder="Age" value={userInfo.age} onChange={e => setUserInfo(prev => ({ ...prev, age: e.target.value }))} className="h-14 rounded-2xl bg-muted/30 border-none px-6 text-lg font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/60 tracking-widest ml-1">Grade</Label>
                  <Input required placeholder="Grade" value={userInfo.grade} onChange={e => setUserInfo(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl bg-muted/30 border-none px-6 text-lg font-bold" />
                </div>
              </div>
              <Button type="submit" className="w-full h-16 text-xl font-black rounded-[1.5rem] shadow-xl mt-4">Begin Evaluation</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = MI_QUESTIONS[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / MI_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIdx === MI_QUESTIONS.length - 1;
  const isCurrentAnswered = !!answers[currentQuestion?.id];

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-10 space-y-4 text-center">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Intelligence Sequence</h2>
          <span className="text-[10px] font-black text-muted-foreground uppercase">{currentQuestionIdx + 1} / {MI_QUESTIONS.length}</span>
        </div>
        <Progress value={progressPercent} className="h-2 rounded-full bg-primary/10" />
      </div>

      <Card className="min-h-[500px] flex flex-col justify-between border-primary/10 shadow-2xl rounded-[3rem] overflow-hidden bg-card">
        <CardHeader className="bg-primary text-white pb-12 px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Sparkles className="h-40 w-40 text-white" />
          </div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
             <span className="px-3 py-1 bg-white/20 backdrop-blur-xl border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{currentQuestion.type}</span>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-headline font-black leading-tight relative z-10">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="py-12 px-10">
          <RadioGroup 
            value={answers[currentQuestion.id]?.toString()} 
            onValueChange={handleAnswerChange} 
            className="grid gap-4"
          >
            {[
              { label: "Strongly Disagree", value: "1" },
              { label: "Disagree", value: "2" },
              { label: "Neutral", value: "3" },
              { label: "Agree", value: "4" },
              { label: "Strongly Agree", value: "5" }
            ].map(option => (
              <div 
                key={option.value} 
                className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${answers[currentQuestion.id]?.toString() === option.value ? 'bg-primary/5 border-primary shadow-lg scale-[1.02]' : 'bg-background hover:border-primary/20 border-transparent shadow-sm'}`}
                onClick={() => handleAnswerChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer font-black text-lg tracking-tight">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>

        <CardFooter className="flex justify-between border-t p-10 bg-muted/5">
          <Button variant="ghost" onClick={goToPrevious} disabled={currentQuestionIdx === 0} className="font-black h-12 px-6 rounded-xl hover:bg-primary/5">
            <ChevronLeft className="h-5 w-5 mr-1" /> Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={calculateResults} disabled={!isCurrentAnswered || isSaving} className="px-10 h-14 rounded-2xl font-black text-lg shadow-2xl">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete Analysis"}
            </Button>
          ) : (
            <Button onClick={goToNext} disabled={!isCurrentAnswered} className="px-10 h-14 rounded-2xl font-black text-lg shadow-2xl">
              Next Step <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
