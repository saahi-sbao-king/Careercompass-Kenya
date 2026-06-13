"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass, ShieldCheck, LogIn, Loader2, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast({ title: "Login failed", description: "Invalid email or password.", variant: "destructive" });
      } else {
        toast({ title: "Welcome back!", description: "Success. Accessing your roadmap." });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] px-4 mx-auto py-12">
      <Card className="w-full max-w-md border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-4 text-center bg-primary/5 pb-10 border-b">
          <div className="mx-auto w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl">
            <Compass className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black">Karibu Tena</CardTitle>
            <CardDescription className="font-medium">Sign in to access your professional roadmap.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-10 space-y-6">
          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary hover:underline font-medium">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl"
                placeholder="admin123"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-black rounded-2xl shadow-xl mt-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin mr-2" /> : <LogIn className="h-5 w-5 mr-2" />}
              Login
            </Button>
          </form>

          <div className="p-4 bg-muted/50 rounded-2xl border border-dashed flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-black uppercase text-primary tracking-widest">Demo Account Access</p>
              <p className="text-[10px] text-muted-foreground font-medium">Use <b>admin@example.com</b> / <b>admin123</b> to evaluate the platform instantly.</p>
            </div>
          </div>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-bold tracking-widest">Or</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <Button 
            className="w-full h-14 text-md font-bold rounded-2xl gap-3 shadow-md bg-white text-foreground border border-muted-foreground/20 hover:bg-muted/50 transition-colors" 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
            Continue with Google
          </Button>

          <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl border border-dashed">
            <ShieldCheck className="h-5 w-5 text-primary opacity-50" />
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed text-center">
              Secured by Sidmadina Technologies. Your professional data is private.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 py-6 border-t flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
