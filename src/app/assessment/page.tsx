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
import { useUser, useDoc } from '@/lib/firebase/hooks';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';
import { 
  ChevronLeft, ChevronRight, CheckCircle2, Loader2, UserCircle, 
  CreditCard, Lock, ArrowRight, ShieldCheck, Sparkles, Smartphone,
  X, Info, AlertCircle
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const { user, userData } = useUser();
  const { data: paywallFlag, loading: paywallLoading } = useDoc('feature_flags/assessment_paywall');

  // Quiz States
  const [step, setStep] = useState(0); 
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [userInfo, setUserInfo] = useState({ name: '', age: '', school: '', grade: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Payment UI States
  const [payStep, setPayStep] = useState<'selection' | 'details' | 'processing'>('selection');
  const [payMethod, setPayMethod] = useState<'mpesa' | 'airtel' | 'card' | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

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
  }, []);

  useEffect(() => {
    localStorage.setItem('mi-assessment-progress', JSON.stringify({
      answers,
      idx: currentQuestionIdx,
      userInfo,
      step
    }));
  }, [answers, currentQuestionIdx, userInfo, step]);

  const handlePesaPalRedirect = async () => {
    if (!user) {
      toast({ title: "Account Required", description: "Please log in to proceed.", variant: "destructive" });
      router.push('/auth/login');
      return;
    }

    setIsRedirecting(true);
    
    try {
      const merchantReference = `CCK-STORE-${Date.now()}`;
      
      // Log the redirection for admin audit
      await addDoc(collection(db, 'transactions'), {
        userId: user.uid,
        userEmail: user.email,
        merchantReference,
        amount: paywallFlag?.priceKES || 500,
        status: 'PENDING (REDIRECTED)',
        paymentMethod: payMethod?.toUpperCase() || 'UNKNOWN',
        createdAt: new Date().toISOString()
      });

      // Simple direct redirect to official Storefront
      window.location.href = 'https://store.pesapal.com/assessmentpayment';
    } catch (err) {
      toast({ title: "Connection Failed", description: "Check your internet and try again.", variant: "destructive" });
      setIsRedirecting(false);
    }
  };

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
    setIsSaving(true);
    const intelligenceScores: Record<string, number> = {};
    MI_QUESTIONS.forEach(q => {
      const score = answers[q.id] || 0;
      intelligenceScores[q.type] = (intelligenceScores[q.type] || 0) + score;
    });

    const finalScores: Record<string, number> = {};
    Object.keys(intelligenceScores).forEach(type => {
      finalScores[type] = (intelligenceScores[type] / 25) * 100;
    });

    const pathway = calculatePathway(finalScores);
    const resultData = {
      pathway,
      scores: finalScores,
      userInfo,
      completedAt: new Date().toISOString()
    };

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), { assessment: resultData }, { merge: true });
        localStorage.removeItem('mi-assessment-progress');
        router.push('/dashboard');
      } catch (err) {
        toast({ title: "Error saving results", variant: "destructive" });
        setIsSaving(false);
      }
    }
  };

  const isPaywalled = paywallFlag?.isEnabled && !userData?.hasPaidAssessment;
  const progressPercent = (currentQuestionIdx / MI_QUESTIONS.length) * 100;
  const currentQuestion = MI_QUESTIONS[currentQuestionIdx];
  const isLastQuestion = currentQuestionIdx === MI_QUESTIONS.length - 1;
  const isCurrentAnswered = !!answers[currentQuestion?.id];

  if (paywallLoading) return <div className="p-24 text-center">Verifying access...</div>;

  if (isPaywalled) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="h-3 w-3" /> Premium Evaluation
            </div>
            <h1 className="text-4xl md:text-6xl font-headline font-black leading-none tracking-tight text-primary">
              Unlock Your <span className="italic">Strategic</span> Roadmap.
            </h1>
            <h2 className="text-lg text-muted-foreground font-medium leading-relaxed">
              Gain full access to the high-fidelity Multiple Intelligence assessment and personalized CBE recommendations via our secure PesaPal Store.
            </h2>
          </div>

          <div className="flex-1 w-full max-w-[420px] bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-primary/20">
            <div className="bg-primary p-8 pb-12 text-white relative">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Secure Checkout</p>
              <h1 className="text-3xl font-bold tracking-tight">KES {paywallFlag?.priceKES || 500}.00</h1>
              <p className="text-blue-100/60 text-xs mt-1">Frere Town Guidance Service</p>
            </div>

            <div className="px-8 pb-8 -mt-6 relative z-20">
              {payStep === 'selection' && (
                <div className="space-y-3 pt-6">
                  <MethodBtn 
                    title="M-Pesa Express" 
                    sub="STK Push - Safaricom" 
                    icon={<Smartphone className="h-5 w-5" />} 
                    color="bg-emerald-50 text-emerald-600" 
                    onClick={() => { setPayMethod('mpesa'); setPayStep('details'); }} 
                  />
                  <MethodBtn 
                    title="Airtel Money" 
                    sub="Mobile Wallet" 
                    icon={<Smartphone className="h-5 w-5" />} 
                    color="bg-red-50 text-red-600" 
                    onClick={() => { setPayMethod('airtel'); setPayStep('details'); }} 
                  />
                  <MethodBtn 
                    title="Credit / Debit Card" 
                    sub="Visa, Mastercard, Amex" 
                    icon={<CreditCard className="h-5 w-5" />} 
                    color="bg-blue-50 text-blue-600" 
                    onClick={() => { setPayMethod('card'); setPayStep('details'); }} 
                  />
                </div>
              )}

              {payStep === 'details' && (
                <div className="space-y-5 pt-6">
                  <button onClick={() => setPayStep('selection')} className="text-muted-foreground flex items-center gap-2 text-xs font-bold">
                    <X className="h-4 w-4" /> Back to methods
                  </button>

                  <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100 flex items-start space-x-4">
                    <div className="bg-white p-2 rounded-xl shadow-sm"><Info size={18} className="text-blue-600" /></div>
                    <p className="text-xs text-blue-800 leading-relaxed font-medium">
                      You will be redirected to the official <b>PesaPal Store</b> to complete your transaction securely.
                    </p>
                  </div>

                  <Button 
                    onClick={handlePesaPalRedirect}
                    disabled={isRedirecting}
                    className="w-full h-16 rounded-[1.5rem] font-black text-lg gap-2"
                  >
                    {isRedirecting ? <Loader2 className="animate-spin" /> : "Confirm & Pay"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className="container max-w-xl mx-auto py-12 px-4">
        <Card className="border-primary/20 shadow-2xl bg-card overflow-hidden rounded-[2.5rem]">
          <CardHeader className="text-center bg-primary/5 pb-8 border-b">
            <UserCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle className="text-3xl font-black">Start Assessment</CardTitle>
            <p className="text-muted-foreground">Please tell us a bit about yourself.</p>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleUserInfoSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-primary/60">Full Name</Label>
                <Input required value={userInfo.name} onChange={e => setUserInfo(prev => ({ ...prev, name: e.target.value }))} placeholder="e.g. Saddiq Ali" className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase text-primary/60">Phone Number</Label>
                <Input required value={userInfo.phone} onChange={e => setUserInfo(prev => ({ ...prev, phone: e.target.value }))} placeholder="e.g. 0712345678" className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-primary/60">Age</Label>
                  <Input required type="number" placeholder="Age" value={userInfo.age} onChange={e => setUserInfo(prev => ({ ...prev, age: e.target.value }))} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase text-primary/60">Grade</Label>
                  <Input required placeholder="Grade" value={userInfo.grade} onChange={e => setUserInfo(prev => ({ ...prev, grade: e.target.value }))} className="h-12 rounded-xl" />
                </div>
              </div>
              <Button type="submit" className="w-full h-14 text-lg font-black rounded-2xl">Begin Evaluation</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 space-y-3 text-center">
        <h2 className="text-sm font-bold">Question {currentQuestionIdx + 1} of {MI_QUESTIONS.length}</h2>
        <Progress value={progressPercent} className="h-2 rounded-full" />
      </div>

      <Card className="min-h-[450px] flex flex-col justify-between border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-primary/5 border-b pb-8 px-8">
          <div className="flex items-center gap-2 mb-3">
             <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest">{currentQuestion.type}</span>
          </div>
          <CardTitle className="text-xl md:text-2xl font-black text-primary">
            {currentQuestion.text}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-10 px-8">
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
                className={`flex items-center space-x-4 p-5 border-2 rounded-2xl cursor-pointer transition-all ${answers[currentQuestion.id]?.toString() === option.value ? 'bg-primary/5 border-primary shadow-md' : 'bg-background hover:border-primary/30 border-transparent'}`}
                onClick={() => handleAnswerChange(option.value)}
              >
                <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer font-bold text-lg">{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-8 bg-muted/10">
          <Button variant="ghost" onClick={goToPrevious} disabled={currentQuestionIdx === 0} className="font-black">
            <ChevronLeft className="h-5 w-5" /> Previous
          </Button>

          {isLastQuestion ? (
            <Button onClick={calculateResults} disabled={!isCurrentAnswered || isSaving} className="px-10 h-12 rounded-xl font-black">
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Complete"}
            </Button>
          ) : (
            <Button onClick={goToNext} disabled={!isCurrentAnswered} className="px-10 h-12 rounded-xl font-black">
              Next <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

const MethodBtn = ({ title, sub, icon, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center p-5 bg-card border-2 border-border rounded-[1.5rem] hover:border-primary transition-all group"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 text-xl font-black ${color}`}>
      {icon}
    </div>
    <div className="flex-1 text-left">
      <p className="font-black text-foreground tracking-tight">{title}</p>
      <p className="text-[10px] font-bold text-muted-foreground uppercase">{sub}</p>
    </div>
    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
  </button>
);
