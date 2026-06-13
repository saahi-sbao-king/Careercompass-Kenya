"use client";

import { useActionState } from "react";
import { registerUser } from "@/lib/auth-actions";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Compass, ShieldCheck, UserPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerUser, null);

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Account created!", description: "Welcome to CareerCompass. Please log in." });
      router.push("/login");
    } else if (state?.error) {
      toast({ title: "Registration failed", description: state.error, variant: "destructive" });
    }
  }, [state, router]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-64px)] px-4 mx-auto py-12">
      <Card className="w-full max-w-md border-primary/10 shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="space-y-4 text-center bg-primary/5 pb-10 border-b">
          <div className="mx-auto w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl">
            <UserPlus className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black">Anza Safari Yako</CardTitle>
            <CardDescription className="font-medium">Create an account to track your professional growth.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-10 space-y-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="e.g. Sadiq Sbao" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="h-12 rounded-xl" />
            </div>
            
            <div className="space-y-3 pt-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">I am a:</Label>
              <RadioGroup defaultValue="student" name="role" className="flex gap-4">
                <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex-1 cursor-pointer font-bold">Student</Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-xl hover:bg-muted/50 transition-colors cursor-pointer flex-1">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher" className="flex-1 cursor-pointer font-bold">Teacher</Label>
                </div>
              </RadioGroup>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-black rounded-2xl shadow-xl mt-4"
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              Create Account
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-muted"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground uppercase font-bold tracking-widest">Or</span>
            <div className="flex-grow border-t border-muted"></div>
          </div>

          <Button 
            variant="outline"
            className="w-full h-14 text-md font-bold rounded-2xl gap-3 border-primary/20 hover:bg-primary/5 transition-colors" 
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
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed">
              Designed by Sidmadina Technologies. Secure data encryption standard.
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/20 py-6 border-t flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}