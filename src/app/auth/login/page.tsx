"use client";

import { useState } from 'react';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { verifyRecaptcha } from '../actions';
import { Separator } from '@/components/ui/separator';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      toast({ title: "Google login failed", description: err.message, variant: "destructive" });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // 1. Execute reCAPTCHA Enterprise
      const siteKey = "6LcITm0sAAAAAHyJBIAJtqp4L6ixag3XrkaRMO_O";
      
      if (typeof window !== 'undefined' && window.grecaptcha && window.grecaptcha.enterprise) {
        const token = await new Promise<string>((resolve, reject) => {
          window.grecaptcha.enterprise.ready(async () => {
            try {
              const t = await window.grecaptcha.enterprise.execute(siteKey, {action: 'LOGIN'});
              resolve(t);
            } catch (err) {
              console.error('reCAPTCHA execution error:', err);
              reject(new Error('Security check failed to initialize.'));
            }
          });
        });

        // 2. Verify token on server
        const verification = await verifyRecaptcha(token, 'LOGIN');
        if (!verification.success || (verification.score < 0.3)) {
          throw new Error('Bot detection triggered. If you are human, please try again.');
        }
      }

      // 3. Proceed with Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err: any) {
      toast({ title: "Login failed", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] px-4 mx-auto">
      <Card className="w-full max-w-md border-primary/10 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full h-11 font-bold gap-3 border-border hover:bg-muted/50" 
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </Button>

          <div className="relative flex items-center py-2">
            <Separator className="flex-grow" />
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-bold tracking-widest">Or</span>
            <Separator className="flex-grow" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/auth/forgot-password" size="sm" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <Button className="w-full h-11 font-bold shadow-md" type="submit" disabled={isLoading || isGoogleLoading}>
              {isLoading ? "Verifying..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center w-full text-muted-foreground">
            Don't have an account? <Link href="/auth/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
