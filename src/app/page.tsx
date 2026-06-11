"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Briefcase, ChartColumn, GraduationCap, ArrowRight, ShieldCheck, Compass, Shield, Target, BookOpen, UserCheck, FileText, Sparkles, Brain } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'frere-town-main') || PlaceHolderImages[0];
  const schoolGroup = PlaceHolderImages.find(img => img.id === 'school-group') || PlaceHolderImages[1];
  
  return (
    <div className="flex flex-col w-full">
      {/* Dynamic Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-background">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none hidden lg:block">
          <GraduationCap className="h-[500px] w-[500px] text-primary" />
        </div>
        <div className="container px-4 mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
              <Compass className="h-4 w-4" /> Official Guidance Portal
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-headline font-bold text-primary tracking-tight">Your Future, Calculated.</h2>
              <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter text-foreground leading-[1.1]">
                Discover Your <span className="text-primary italic">Perfect</span> Career Path at Frere Town
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              Personalized guidance for Kenyan CBE students. Use AI to unlock your potential. Our system analyzes your Multiple Intelligences, passion, interests, and abilities to map out a clear, data-driven path to your future career.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <Link href="/assessment">
                <Button size="lg" className="px-10 h-14 text-lg font-bold shadow-2xl rounded-2xl bg-secondary hover:bg-secondary/90 text-white">Start Your Assessment</Button>
              </Link>
              <Link href="#how-it-works">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="px-10 h-14 text-lg font-bold rounded-2xl bg-white border-primary/20 hover:bg-primary/5 text-primary transition-all"
                >
                  Learn How it Works
                </Button>
              </Link>
            </div>
            <p className="text-sm font-bold text-primary/60 uppercase tracking-widest pt-4">
              Empowering students at Frere Town Secondary School
            </p>
          </div>
          <div className="flex-1 relative w-full lg:w-auto">
            <Link href="/assessment" className="block group">
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(55,48,163,0.2)] border-8 border-white aspect-video lg:aspect-square cursor-pointer">
                <Image 
                  src={heroImage.imageUrl} 
                  alt={heroImage.description} 
                  width={1080}
                  height={1080}
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 w-full h-full"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CBE Ready Banner */}
      <section className="bg-primary py-6">
        <div className="container px-4 mx-auto flex items-center justify-center gap-4 text-primary-foreground">
          <div className="p-2 bg-white/20 rounded-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="font-black text-xl">CBE Ready.</span>
            <span className="ml-2 font-medium opacity-90">Tailored for the new Senior School competency standards.</span>
          </div>
        </div>
      </section>

      {/* Why Subject Selection Matters */}
      <section className="py-24 bg-muted border-y border-border">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="p-3 bg-primary/10 rounded-2xl w-fit">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black font-headline leading-tight">Why Subject Selection Matters</h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                Many learners choose subjects based on guesswork or peer influence, leading to a mismatch between their potential and their future careers.
              </p>
            </div>
            <div className="space-y-8">
              <div className="p-8 rounded-[2.5rem] bg-white dark:bg-background border-l-8 border-primary shadow-sm">
                <h4 className="font-black text-xl mb-2 text-primary">The Challenge</h4>
                <p className="text-muted-foreground font-medium">10th Grade is a critical junction for STEM and Social Science pathways. One wrong choice can limit your university eligibility.</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-secondary text-secondary-foreground shadow-xl">
                <h4 className="font-black text-xl mb-2">The Solution</h4>
                <p className="opacity-90 font-medium">An objective, data-driven navigator that integrates CBC rules with your unique Multiple Intelligence (MI) profile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-headline">How It Works.</h2>
            <p className="text-xl text-muted-foreground font-medium">A simplified 3-step process to secure your professional roadmap.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-6 text-center group">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <UserCheck className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Step 1: Profile Strengths</h3>
                <p className="text-muted-foreground font-medium">Enter your passions, interests, and results from your Multiple Intelligence (MI) assessment.</p>
              </div>
            </div>
            <div className="space-y-6 text-center group">
              <div className="w-20 h-20 bg-secondary text-secondary-foreground rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <BookOpen className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Step 2: Choose Electives</h3>
                <p className="text-muted-foreground font-medium">Select your preferred subjects from Groups 5, 6, and 7. Our system ensures your combination aligns with CBC framework rules.</p>
              </div>
            </div>
            <div className="space-y-6 text-center group">
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform">
                <FileText className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black">Step 3: Get Your Roadmap</h3>
                <p className="text-muted-foreground font-medium">Receive an AI-generated career report in PDF format, mapping your choices to real-world academic and professional opportunities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Excellence Section */}
      <section className="py-32 bg-background relative overflow-hidden">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 w-full relative">
              <Link href="/about" className="block group">
                <div className="relative rounded-[4rem] overflow-hidden shadow-2xl aspect-[4/3] border-[12px] border-white dark:border-muted cursor-pointer">
                  <Image 
                    src={schoolGroup.imageUrl} 
                    alt={schoolGroup.description} 
                    width={1080}
                    height={810}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000"
                  />
                </div>
              </Link>
              <div className="absolute -top-6 -right-6 bg-primary text-primary-foreground px-6 py-3 rounded-full font-black shadow-xl border-4 border-white rotate-6 pointer-events-none">
                Academic Excellence
              </div>
            </div>
            <div className="flex-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-black font-headline leading-tight">Architects of Intellectual Brilliance.</h2>
                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  Empowering the Next Generation of Kenyan Leaders. At Frere Town Secondary, we bridge the gap between academic theory and professional practice. Our platform identifies your natural talents and aligns them with realistic career tracks.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-6 rounded-[2rem] bg-muted border border-border">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-1">Standardized Logic</h4>
                  <p className="text-xs text-muted-foreground">Tailored for the highest global competency standards.</p>
                </div>
                <div className="p-6 rounded-[2rem] bg-muted border border-border">
                  <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-bold mb-1">Official Tracks</h4>
                  <p className="text-xs text-muted-foreground">Strict alignment with national KICD Senior School pathways.</p>
                </div>
              </div>
              <Link href="/about" className="inline-block group">
                <Button variant="link" className="p-0 text-primary font-black text-xl h-auto group-hover:no-underline">
                  Our Mission <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Command Grid */}
      <section className="py-32 bg-muted relative">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black font-headline">Why Use the Navigator?</h2>
            <p className="text-xl text-muted-foreground font-medium">Everything you need to navigate your specialized professional journey.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white dark:bg-background border-none shadow-xl rounded-[2.5rem] p-4 group hover:-translate-y-2 transition-all duration-500">
              <CardHeader className="flex flex-col items-center text-center space-y-6 pt-10 pb-8">
                <div className="p-5 bg-primary text-primary-foreground rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform">
                  <Bot className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-black">AI-Powered Logic</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-10">
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">Get objective recommendations based on your unique Multiple Intelligence (MI) data.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-background border-none shadow-xl rounded-[2.5rem] p-4 group hover:-translate-y-2 transition-all duration-500">
              <CardHeader className="flex flex-col items-center text-center space-y-6 pt-10 pb-8">
                <div className="p-5 bg-secondary text-secondary-foreground rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform">
                  <BookOpen className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-black">CBC Aligned</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-10">
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">Built specifically for the Kenyan Grade 10 elective structure and KICD requirements.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-background border-none shadow-xl rounded-[2.5rem] p-4 group hover:-translate-y-2 transition-all duration-500">
              <CardHeader className="flex flex-col items-center text-center space-y-6 pt-10 pb-8">
                <div className="p-5 bg-primary text-primary-foreground rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform">
                  <ChartColumn className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-black">Visual Analytics</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-10">
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">View your intelligence profile via interactive visualizations powered by Recharts.</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-background border-none shadow-xl rounded-[2.5rem] p-4 group hover:-translate-y-2 transition-all duration-500">
              <CardHeader className="flex flex-col items-center text-center space-y-6 pt-10 pb-8">
                <div className="p-5 bg-secondary text-secondary-foreground rounded-[2rem] shadow-xl group-hover:scale-110 transition-transform">
                  <FileText className="h-10 w-10" />
                </div>
                <CardTitle className="text-2xl font-black">Instant Reports</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-6 pb-10">
                <p className="text-muted-foreground font-medium text-sm leading-relaxed">Download a professional career guide to share with parents or teachers instantly.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Compass className="h-[800px] w-[800px] -top-40 -right-40 absolute" />
        </div>
        <div className="container px-4 mx-auto text-center relative z-10 space-y-10">
          <h2 className="text-4xl md:text-6xl font-black font-headline">Ready to Chart Your Path?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto font-medium">Join the students of Frere Town Secondary in securing their professional futures today.</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-secondary hover:bg-white/90 px-12 h-16 text-xl font-black rounded-2xl shadow-2xl transition-transform hover:scale-105">Create Free Account</Button>
            </Link>
            <Link href="/pathways">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-12 h-16 text-xl font-black rounded-2xl shadow-2xl transition-transform hover:scale-105"
              >
                Browse Pathways
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}