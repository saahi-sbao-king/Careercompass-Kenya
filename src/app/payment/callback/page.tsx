"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Loader2, XCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useUser } from '@/lib/firebase/hooks';
import { doc, setDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verify = async () => {
      const orderTrackingId = searchParams.get('OrderTrackingId');
      
      if (!orderTrackingId || !user) return;

      try {
        // Verification logic: update user and log transaction
        await setDoc(doc(db, 'users', user.uid), { 
          hasPaidAssessment: true,
          paymentStatus: 'COMPLETED',
          lastTransactionId: orderTrackingId,
          unlockedAt: new Date().toISOString()
        }, { merge: true });

        await addDoc(collection(db, 'transactions'), {
          userId: user.uid,
          userEmail: user.email,
          orderTrackingId,
          status: 'COMPLETED',
          createdAt: new Date().toISOString()
        });

        setStatus('success');
        
        // Timer for automatic redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              router.push('/assessment');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        return () => clearInterval(timer);
      } catch (err) {
        console.error("Verification error:", err);
        setStatus('error');
      }
    };

    verify();
  }, [searchParams, user, router]);

  return (
    <div className="container max-w-md mx-auto py-24 px-4">
      <Card className="border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-primary text-white p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-black">Strategic Approval</CardTitle>
          <CardDescription className="text-blue-100 font-medium">Provisioning professional access rights.</CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center space-y-8">
          {status === 'loading' && (
            <div className="space-y-6 py-8">
              <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
              <p className="text-muted-foreground font-bold italic">Verifying payment status...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-6 py-4 animate-in zoom-in-95 duration-500">
              <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Verified & Unlocked</h3>
                <p className="text-muted-foreground text-sm font-medium">Redirecting in {countdown}s...</p>
              </div>
              <Button onClick={() => router.push('/assessment')} className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl gap-3">
                Start Assessment <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          )}

          {(status === 'failed' || status === 'error') && (
            <div className="space-y-6 py-4">
              <XCircle className="h-20 w-20 text-destructive mx-auto" />
              <h3 className="text-2xl font-black">Verification Issue</h3>
              <p className="text-muted-foreground">The secure gateway encountered a connection error.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full h-14 rounded-xl">Retry Verification</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function PesaPalCallbackPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center"><Loader2 className="animate-spin mx-auto h-12 w-12 text-primary" /></div>}>
      <CallbackContent />
    </Suspense>
  );
}
