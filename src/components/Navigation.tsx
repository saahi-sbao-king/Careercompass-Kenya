"use client";

import Link from 'next/link';
import { useIsAdmin } from '@/lib/firebase/hooks';
import { Button } from '@/components/ui/button';
import { Compass, Menu, X, ShieldCheck, ArrowLeft, Search, Target, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';
import { AccessibilityOptions } from '@/components/AccessibilityOptions';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useSession, signIn } from "next-auth/react";

export function Navigation() {
  const { data: session } = useSession();
  const { isAdmin } = useIsAdmin();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === '/';
  const appLogo = PlaceHolderImages.find(img => img.id === 'app-logo');

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center gap-2">
          {!isHomePage && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => router.back()}
              className="rounded-full h-9 w-9 text-primary"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Link href="/" className="flex items-center space-x-2 font-headline font-bold text-xl text-primary group">
            {appLogo ? (
              <div className="h-8 w-8 relative overflow-hidden rounded-lg">
                <Image src={appLogo.imageUrl} alt="App Logo" fill className="object-contain group-hover:scale-110 transition-transform" />
              </div>
            ) : (
              <Compass className="h-6 w-6 group-hover:rotate-45 transition-transform" />
            )}
            <span className="hidden sm:inline">CareerCompass</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <Link href="/careers" className="text-sm font-black text-primary hover:opacity-80 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-primary/5">
            <Search className="h-3.5 w-3.5" /> Careers
          </Link>
          <Link href="/exploration" className="text-sm font-black text-primary hover:opacity-80 transition-colors px-3 py-1.5 rounded-full hover:bg-primary/5">Explore</Link>
          <Link href="/subject-combination" className="text-sm font-black text-primary hover:opacity-80 transition-colors px-3 py-1.5 rounded-full hover:bg-primary/5">Subject Explorer</Link>
          <Link href="/pathways" className="text-sm font-black text-primary hover:opacity-80 transition-colors px-3 py-1.5 rounded-full hover:bg-primary/5">Pathways</Link>
          
          <div className="flex items-center space-x-4 pl-4 border-l">
            <AccessibilityOptions />
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/10">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="font-black text-primary gap-2"
                  onClick={() => signIn("google")}
                >
                  <LogIn className="h-4 w-4" /> Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="font-black gap-2 rounded-xl px-5"
                  onClick={() => signIn("google")}
                >
                  <UserPlus className="h-4 w-4" /> Sign Up
                </Button>
              </div>
            )}
            
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary font-black hover:bg-primary/5">
                  <ShieldCheck className="h-4 w-4" /> Admin
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <AccessibilityOptions />
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-primary p-2">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden border-t bg-background p-6 flex flex-col space-y-4 animate-in slide-in-from-top duration-300 shadow-2xl">
          <Link href="/careers" onClick={() => setIsMenuOpen(false)} className="font-black text-primary flex items-center gap-3 text-lg"><Search className="h-5 w-5" /> Careers Hub</Link>
          <Link href="/exploration" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg">Explore Ecosystems</Link>
          <Link href="/subject-combination" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg">Subject Explorer</Link>
          <Link href="/pathways" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg">CBE Pathways</Link>
          
          <div className="pt-4 border-t space-y-3">
            {session ? (
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg flex items-center gap-3"><Target className="h-5 w-5" /> Dashboard</Link>
            ) : (
              <>
                <button onClick={() => signIn("google")} className="w-full text-left font-black text-primary text-lg flex items-center gap-3"><LogIn className="h-5 w-5" /> Sign In</button>
                <button onClick={() => signIn("google")} className="w-full text-left font-black text-primary text-lg flex items-center gap-3"><UserPlus className="h-5 w-5" /> Sign Up</button>
              </>
            )}
            {isAdmin && (
              <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg flex items-center gap-3"><ShieldCheck className="h-5 w-5" /> Admin</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
