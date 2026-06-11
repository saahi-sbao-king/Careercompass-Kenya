
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useUser, useDoc } from '@/lib/firebase/hooks';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';

export default function AdminVerificationPage() {
  const router = useRouter();
  const { user } = useUser();
  const [token, setToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Login Required", description: "You must be logged in to claim admin status.", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    try {
      // 1. Fetch the official token from Firestore
      const configRef = doc(db, 'feature_flags', 'admin_config');
      const configSnap = await getDoc(configRef);
      
      // Default token if not set in DB yet
      const officialToken = configSnap.exists() ? configSnap.data().adminToken : 'sidmadina4lyf@2026';

      if (token === officialToken) {
        // 2. Grant admin privileges
        await setDoc(doc(db, 'roles_admin', user.uid), {
          uid: user.uid,
          grantedAt: new Date().toISOString(),
          grantedBy: 'Verification Token'
        });

        // 3. Initialize config if it didn't exist (first time setup)
        if (!configSnap.exists()) {
          await setDoc(configRef, {
            id: 'admin_config',
            adminToken: 'sidmadina4lyf@2026',
            updatedAt: new Date().toISOString()
          });
        }

        toast({ title: "Verification Successful", description: "You now have administrator privileges." });
        router.push('/admin');
      } else {
        toast({ title: "Invalid Token", description: "The secret entry token provided is incorrect.", variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Verification Error", description: "Failed to communicate with the security server.", variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
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
            <CardDescription className="text-blue-100 font-medium">Verify your strategic credentials to enter the command center.</CardDescription>
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
                className="h-12 text-lg font-bold rounded-xl border-primary/10 bg-background"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isVerifying || !token}
              className="w-full h-14 rounded-xl text-lg font-black shadow-xl gap-2 transition-all hover:scale-[1.02]"
            >
              {isVerifying ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
              Verify Credentials
            </Button>

            <div className="p-4 bg-muted/50 rounded-xl flex items-start gap-3 border border-dashed">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                This area is restricted to authorized Frere Town personnel. Unauthorized attempts to gain access are logged.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
