"use client";

import Link from 'next/link';
import { useAuth, useIsAdmin } from '@/lib/firebase/hooks';
import { auth } from '@/lib/firebase/config';
import { Button } from '@/components/ui/button';
import { Compass, User, LogOut, Menu, X, ShieldCheck, ArrowLeft, Briefcase, Target, BookOpen, Search } from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AccessibilityOptions } from '@/components/AccessibilityOptions';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navigation() {
  const { user } = useAuth();
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
          
          <div className="flex items-center space-x-4">
            <AccessibilityOptions />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-black text-primary hover:bg-primary/10">Dashboard</Button>
                </Link>
                {isAdmin && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2 border-primary/20 text-primary font-black hover:bg-primary/5">
                      <ShieldCheck className="h-4 w-4" /> Admin
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full border-2 border-primary/10 p-0 overflow-hidden">
                      <Avatar className="h-full w-full">
                        <AvatarImage src={user.photoURL || undefined} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-xs">{user.email?.[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-background border-border rounded-2xl shadow-xl">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center cursor-pointer font-bold p-3 rounded-xl"><User className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => auth.signOut()} className="text-destructive cursor-pointer font-bold p-3 rounded-xl">
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="font-black text-primary">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="font-black bg-secondary text-white hover:bg-secondary/90 shadow-lg rounded-xl">Sign up</Button>
                </Link>
              </div>
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
          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="font-black text-primary text-lg flex items-center gap-3"><Target className="h-5 w-5" /> Dashboard</Link>
          {!user && (
            <div className="flex flex-col gap-3 pt-4 border-t">
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}><Button variant="outline" className="w-full font-black h-12 rounded-xl border-primary text-primary">Log in</Button></Link>
              <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}><Button className="w-full font-black h-12 rounded-xl bg-secondary text-white shadow-lg">Sign up</Button></Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}