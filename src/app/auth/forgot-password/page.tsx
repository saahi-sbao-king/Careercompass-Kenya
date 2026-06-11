"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setIsSent(true);
      toast({ title: "Email sent", description: "Check your inbox for password reset instructions." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] px-4 mx-auto">
      <Card className="w-full max-w-md border-primary/10 shadow-xl">
        <CardHeader className="space-y-1">
          <Link 
            href="/auth/login" 
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="h-3 w-3" /> Back to login
          </Link>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription>
            {isSent 
              ? "We've sent a recovery link to your email address." 
              : "Enter your email address and we'll send you a link to reset your password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSent ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="m@example.com" 
                  required 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <Button className="w-full h-11 font-bold shadow-md" type="submit" disabled={isLoading}>
                {isLoading ? "Sending link..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setIsSent(false)}>
                Try another email
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            Remembered your password? <Link href="/auth/login" className="text-primary hover:underline">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
