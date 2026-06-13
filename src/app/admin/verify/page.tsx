"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function AdminVerificationPage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    // Official Strategic Token Gate
    if (token === 'sidmadina4lyf') {
      localStorage.setItem('cck_admin_verified', 'true');
      toast({ title: "Access Granted", description: "Welcome to the Strategic Command Center." });
      router.push('/admin');
    } else {
      toast({ title: "Access Denied", description: "Invalid strategic token.", variant: "destructive" });
    }
    setIsVerifying(false);
  };

  return (
    <div className="container max-w-md mx-auto py-24 px-4">
      <Card className="border-primary/20 shadow-2xl rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-primary text-white p-8 text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black">Admin Access Gateway</CardTitle>
            <CardDescription className="text-blue-100 font-medium">Verify your strategic credentials.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-8 pt-10">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-[10px] font-black uppercase tracking-widest text-primary/60">Secret Entry Token</Label>
              <Input 
                id="token"
                type="password"
                value={token}
                onChange={e => setToken(e.target.value)}
                placeholder="Enter token..."
                className="h-12 text-lg font-bold rounded-xl"
                required
              />
            </div>
            
            <Button type="submit" disabled={isVerifying} className="w-full h-14 rounded-xl text-lg font-black shadow-xl gap-2">
              {isVerifying ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
              Verify Credentials
            </Button>

            <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 border border-dashed">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                Designed by Sidmadina Technologies. This area is restricted to authorized personnel.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}