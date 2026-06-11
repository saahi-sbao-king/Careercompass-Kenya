
"use client";

import { useUser } from '@/lib/firebase/hooks';
import { auth, storage, db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { Sparkles, Camera, Loader2, Check } from 'lucide-react';
import Image from 'next/image';

const DEFAULT_AVATARS = [
  { id: 'tech', label: 'Tech Engineer', url: 'https://picsum.photos/seed/engineer-2025/400/400' },
  { id: 'creative', label: 'Digital Creative', url: 'https://picsum.photos/seed/creative-2025/400/400' },
  { id: 'science', label: 'Bio Researcher', url: 'https://picsum.photos/seed/bio-2025/400/400' },
  { id: 'leader', label: 'Global Leader', url: 'https://picsum.photos/seed/leader-2025/400/400' },
];

export default function ProfilePage() {
  const { user, userData } = useUser();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpdatingDefault, setIsUpdatingDefault] = useState<string | null>(null);

  const handleUpdateAvatar = async (url: string, id: string | null = null) => {
    if (!user) return;
    
    if (id) setIsUpdatingDefault(id);
    
    try {
      // Update Auth Profile
      await updateProfile(user, { photoURL: url });

      // Update Firestore
      await setDoc(doc(db, 'users', user.uid), { 
        photoURL: url,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Profile updated!", description: "Your avatar has been successfully changed." });
    } catch (err: any) {
      console.error('Avatar update error:', err);
      toast({ 
        title: "Update failed", 
        description: "We couldn't update your profile picture. Please try again.",
        variant: "destructive" 
      });
    } finally {
      if (id) setIsUpdatingDefault(null);
    }
  };

  const handleGenerateAvatar = async () => {
    if (!prompt.trim() || !user) {
      toast({ title: "Please enter a prompt", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateAvatar({ prompt });
      
      if (!result.avatarDataUri) {
        throw new Error("No image data received.");
      }

      const storageRef = ref(storage, `avatars/${user.uid}/profile_${Date.now()}.png`);
      
      // Upload to Firebase Storage
      await uploadString(storageRef, result.avatarDataUri, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);

      await handleUpdateAvatar(downloadURL);
      setPrompt('');
    } catch (err: any) {
      console.error('Client avatar generation error:', err);
      toast({ 
        title: "Generation failed", 
        description: err.message || "Something went wrong while creating your avatar.",
        variant: "destructive" 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!user) return <div className="p-12 text-center">Please log in to view your profile.</div>;

  return (
    <div className="container mx-auto py-12 px-4 max-w-5xl">
      <h1 className="text-3xl font-headline font-bold mb-8">Your Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-6 md:col-span-1">
          <Card className="border-primary/10 shadow-sm overflow-hidden">
            <CardHeader className="text-center pb-8 bg-primary/5">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <Avatar className="w-full h-full border-4 border-background shadow-xl">
                  <AvatarImage src={user.photoURL || undefined} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-primary/5 text-primary">
                    {user.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full border-4 border-background shadow-lg">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <CardTitle>{userData?.assessment?.userInfo?.name || user.displayName || 'Student'}</CardTitle>
              <CardDescription className="truncate">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Role</span>
                <span className="font-semibold capitalize">{userData?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pathway</span>
                <span className="font-semibold text-primary">{userData?.assessment?.pathway || 'Not assessed'}</span>
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => auth.signOut()}>Log out</Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Select Avatars</CardTitle>
              <CardDescription>Choose from these futuristic professional personas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {DEFAULT_AVATARS.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleUpdateAvatar(avatar.url, avatar.id)}
                    disabled={!!isUpdatingDefault}
                    className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-transparent hover:border-primary transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  >
                    <Image 
                      src={avatar.url} 
                      alt={avatar.label} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      {isUpdatingDefault === avatar.id ? (
                        <Loader2 className="h-6 w-6 text-white animate-spin" />
                      ) : (
                        <Check className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1">
                      <p className="text-[10px] text-white text-center font-bold uppercase tracking-tighter">{avatar.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Avatar Generator
              </CardTitle>
              <CardDescription>Describe a unique look and our AI will paint it for you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Style Description</Label>
                <Input 
                  id="prompt" 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="e.g. A confident student with glasses, digital illustration style, blue background" 
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateAvatar()}
                />
              </div>
              <Button 
                className="w-full h-11 shadow-md" 
                onClick={handleGenerateAvatar} 
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Painting your avatar...
                  </>
                ) : "Generate & Set as Profile Picture"}
              </Button>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <strong>How it works:</strong> Our AI creates a unique image based on your text. Once generated, it will be uploaded to your profile automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

