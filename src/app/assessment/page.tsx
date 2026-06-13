
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
import { useGuestUser, useDoc } from '@/lib/firebase/hooks';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';
import { initiatePayment } from '@/lib/pesapal';
import { 
  ChevronLeft, ChevronRight, Loader2, UserCircle, 
  Sparkles, CreditCard, ShieldCheck, ArrowRight
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { guestId, guestData } = useGuestUser();
  const { data: paywallFlag, loading: flagLoading } = useDoc('feature_flags/assessment_paywall');

  const [step, setStep] = useState(0); 
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', age: '', school: '', grade: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('mi-assessment-progress');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setCurrentQuestionIdx(data.idx || 0);
        setUserInfo(data.userInfo || { name: '', age: '', school: '', grade: '', phone: '' });
        setStep(data.step || 0);
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
    const isPaywalled = paywallFlag?.isEnabled === true && !guestData?.hasPaidAssessment;
    setStep(isPaywalled ? 1 : 2);
  };

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      const res = await initiatePayment({
        amount: paywallFlag?.priceKES || 500,
        email: userInfo.phone + '@guest.cck',
        phoneNumber: userInfo.phone,
        name: userInfo.name,
        description: 'Career Guidance Assessment Fee',
        callbackUrl: `${window.location.origin}/payment/callback`
      });
      if (res.success && res.redirectUrl) window.location.href = res.redirectUrl;
      else toast({ title: "Payment Error", description: res.error, variant: "destructive" });
    } catch (err) { toast({ title: "Connection Error", variant: "destructive" }); }
    finally { setIsPaying(false); }
  };

  const handleAnswerChange = (value: string) => {
    const score = parseInt(value);
    const questionId = MI_QUESTIONS[currentQuestionIdx].id;
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const calculateResults = async () => {
    if (!guestId) return;
    setIsSaving(true);
    const intelligenceScores: Record<string, number> = {};
    MI_QUESTIONS.forEach(q => {
      const score = answers[q.id] || 0;
      intelligenceScores[q.type] = (intelligenceScores[q.type] || 0) + score;
    });

    const finalScores: Record<string, number> = {};
    Object.keys(intelligenceScores).forEach(type => { finalScores[type] = (intelligenceScores[type] / 25) * 100; });

    const resultData = {
      pathway: calculatePathway(finalScores),
      scores: finalScores,
      userInfo,
      completedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', guestId), { assessment: resultData, id: guestId, username: userInfo.name }, { merge: true });
      localStorage.removeItem('mi-assessment-progress');
      toast({ title: "Complete!", description: "Synchronizing roadmap..." });
      router.push('/dashboard');
    } catch (err) { toast({ title: "Save Error", variant: "destructive" }); }
    finally { setIsSaving(false); }
  };

  if (!isHydrated || flagLoading) return <div className="p-24 text-center"><Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" /></div>;

  if (step === 0) {
    return (
      <div className="container max-w-xl mx-auto py-12 px-4">
        <Card className="border-primary/20 shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center bg-primary/5 pb-8 border-b">
            <UserCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-2xl font-black">Information Hub</CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              <div className="space-y-2"><Label>Full Name</Label><Input required value={userInfo.name} onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))} className="h-14 rounded-2xl" /></div>
              <div className="space-y-2"><Label>Phone Number</Label><Input required value={userInfo.phone} onChange={e => setUserInfo(prev => ({ ...prev, phone: e.target.value }))} className="h-14 rounded-2xl" /></div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label>Age</Label><Input required type="number" value={userInfo.age} onChange={e => setUserInfo(prev => ({ ...prev, age: e.target.value }))} className="h-14 rounded-2xl" /></div>
                <div className="space-y-2"><Label>Grade</Label><Input required value={userInfo.grade} onChange={e => setUserInfo(prev => ({ ...prev, grade: e.target.value }))} className="h-14 rounded-2xl" /></div>
              </div>
              <Button type="submit" className="w-full h-16 text-xl font-black rounded-[1.5rem]">Continue</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="container max-w-xl mx-auto py-24 px-4">
        <Card className="rounded-[3rem] overflow-hidden">
          <CardHeader className="bg-primary text-white p-12 text-center">
            <CreditCard className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-3xl font-black">Strategic Investment</CardTitle>
          </CardHeader>
          <CardContent className="p-12 text-center space-y-8">
            <div className="text-6xl font-black text-primary">KES {paywallFlag?.priceKES || 500}</div>
            <Button onClick={handlePayment} disabled={isPaying} className="w-full h-20 rounded-[2rem] text-2xl font-black gap-4">
              {isPaying ? <Loader2 className="animate-spin" /> : "Initiate Checkout"} <ArrowRight />
            </Button>
            <button onClick={() => setStep(0)} className="text-xs underline text-muted-foreground">Return to Profile</button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = MI_QUESTIONS[currentQuestionIdx];
  const progressPercent = ((currentQuestionIdx + 1) / MI_QUESTIONS.length) * 100;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Progress value={progressPercent} className="h-2 mb-10" />
      <Card className="min-h-[500px] flex flex-col justify-between rounded-[3rem] overflow-hidden">
        <CardHeader className="bg-primary text-white pb-12 px-10">
          <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">{currentQuestion.type}</span>
          <CardTitle className="text-2xl md:text-3xl font-black">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="py-12 px-10">
          <RadioGroup value={answers[currentQuestion.id]?.toString()} onValueChange={handleAnswerChange} className="grid gap-4">
            {[1, 2, 3, 4, 5].map(v => (
              <div key={v} onClick={() => handleAnswerChange(v.toString())} className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer ${answers[currentQuestion.id] === v ? 'border-primary bg-primary/5' : 'border-transparent'}`}>
                <RadioGroupItem value={v.toString()} id={`v-${v}`} />
                <Label htmlFor={`v-${v}`} className="flex-1 font-black text-lg">{["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"][v-1]}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-10">
          <Button variant="ghost" onClick={() => setCurrentQuestionIdx(i => i - 1)} disabled={currentQuestionIdx === 0}>Previous</Button>
          {currentQuestionIdx === MI_QUESTIONS.length - 1 ? (
            <Button onClick={calculateResults} disabled={!answers[currentQuestion.id] || isSaving} className="px-10 h-14 rounded-2xl font-black">
              {isSaving ? <Loader2 className="animate-spin" /> : "Complete Analysis"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestionIdx(i => i + 1)} disabled={!answers[currentQuestion.id]} className="px-10 h-14 rounded-2xl font-black">Next Step</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
