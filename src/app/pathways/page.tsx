"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Trophy, Microscope, Briefcase, GraduationCap, Star, Info, ListChecks, CheckCircle2, Brain, ShieldCheck, Shield } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PathwaysPage() {
  const juniorCore = ["English Language", "Kiswahili / KSL", "Core/Essential Mathematics", "Integrated Science", "Social Studies", "Pre-Technical Education", "Business Studies", "Agriculture", "Religious Education", "Health Education", "Life Skills", "Sports & PE"];
  const juniorOptional = ["Visual Arts", "Performing Arts", "Home Science", "Computer Science", "Foreign Languages", "Indigenous Languages"];
  
  const seniorCore = ["English Language", "Kiswahili or Kenyan Sign Language", "Core/Essential Mathematics", "Community Service Learning (CSL)"];

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl space-y-20">
      {/* Dynamic Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
          <BookOpen className="h-4 w-4" /> KICD CBE Framework
        </div>
        <h1 className="text-5xl md:text-7xl font-headline font-black text-primary tracking-tighter">Official Pathways</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-medium">
          Comprehensive guide to specialized learning areas from Junior Secondary foundational blocks to Senior Secondary professional tracks.
        </p>
      </div>

      {/* 1. Junior Secondary Section */}
      <section className="space-y-10">
        <div className="flex items-center gap-4 border-l-8 border-primary pl-6">
          <div className="p-3 bg-primary text-primary-foreground rounded-2xl shadow-xl"><GraduationCap className="h-8 w-8" /></div>
          <div>
            <h2 className="text-3xl font-black">1. Junior Secondary School</h2>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Grades 7–9: The Broad Base</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-4xl">Learners engage in a wide variety of subjects to discover their natural Multiple Intelligence strengths before specializing in Grade 10.</p>
        
        <div className="grid md:grid-cols-2 gap-10">
          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-card overflow-hidden group hover:shadow-primary/10 transition-shadow">
            <CardHeader className="bg-primary/5 py-8 px-8 border-b">
              <CardTitle className="text-xl font-black flex items-center gap-3">
                <Brain className="h-6 w-6 text-primary" /> 12 Compulsory Areas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {juniorCore.map(s => (
                  <div key={s} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-primary/40 group-hover:text-primary transition-all" /> {s}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white dark:bg-card overflow-hidden group hover:shadow-secondary/10 transition-shadow">
            <CardHeader className="bg-secondary/10 py-8 px-8 border-b">
              <CardTitle className="text-xl font-black flex items-center gap-3 text-primary">
                <Star className="h-6 w-6 text-secondary fill-secondary" /> Optional Areas (Choose 1-2)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {juniorOptional.map(s => (
                  <div key={s} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-secondary transition-colors">
                    <div className="h-2 w-2 rounded-full bg-secondary group-hover:scale-125 transition-all" /> {s}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. Senior Secondary School Section */}
      <section className="space-y-16">
        <div className="flex items-center gap-4 border-l-8 border-secondary pl-6">
          <div className="p-3 bg-secondary text-secondary-foreground rounded-2xl shadow-xl"><Shield className="h-8 w-8" /></div>
          <div>
            <h2 className="text-3xl font-black">2. Senior Secondary School</h2>
            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Grades 10–12: Professional Tracks</p>
          </div>
        </div>

        <div className="bg-primary p-12 rounded-[3rem] text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><ListChecks className="h-64 w-64 text-white" /></div>
          <div className="z-10 relative space-y-8">
            <h3 className="text-2xl font-black flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-secondary" /> The 11-Subject Formula
            </h3>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Part A: Compulsory (4)</p>
                <div className="flex flex-col gap-2">
                  {seniorCore.map(s => (
                    <Badge key={s} variant="secondary" className="px-4 py-2 text-xs bg-white/10 border-white/20 text-white font-bold w-fit">{s}</Badge>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">Part B: Electives (7)</p>
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-sm font-medium leading-relaxed">
                    Choose 7 electives matching your MI Profile. <span className="text-secondary font-black">Critical Rule:</span> Exactly <span className="font-black text-lg underline decoration-secondary">3 electives</span> must come from your specialized track for cluster analysis and university program alignment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pathways Grid */}
        <div className="grid lg:grid-cols-3 gap-10">
          {/* STEM */}
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden flex flex-col bg-white dark:bg-card group hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="bg-blue-900 text-white p-10">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Microscope className="h-8 w-8 text-blue-300" /> STEM
              </CardTitle>
              <CardDescription className="text-blue-100 font-bold uppercase text-[10px] tracking-widest mt-2">Science, Tech, Eng & Math</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8 flex-grow">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-blue-900/40 dark:text-blue-300/40 tracking-[0.2em]">Core Specializations</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-blue-900 dark:text-blue-400" /> Pure Sciences (Bio, Chem, Phys)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-blue-900 dark:text-blue-400" /> Applied (Agri, Comp Science)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-blue-900 dark:text-blue-400" /> Technical (Aviation, Engineering)</li>
                </ul>
              </div>
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-100 dark:border-blue-800 shadow-inner">
                <p className="text-xs font-bold text-blue-900 dark:text-blue-200 leading-relaxed">Ideal for: Engineers, Doctors, Data Scientists, and Research Scientists.</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Sciences */}
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden flex flex-col bg-white dark:bg-card group hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="bg-sky-600 text-white p-10">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-sky-200" /> Social Sciences
              </CardTitle>
              <CardDescription className="text-sky-100 font-bold uppercase text-[10px] tracking-widest mt-2">Humanities, Lang & Business</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8 flex-grow">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-sky-600/40 dark:text-sky-200/40 tracking-[0.2em]">Core Specializations</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400" /> Humanities (History, Geog, RE)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400" /> Languages (Fasihi, Sign Lang)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-sky-600 dark:text-sky-400" /> Business Studies & Economics</li>
                </ul>
              </div>
              <div className="p-6 bg-sky-50 dark:bg-sky-900/20 rounded-2xl border-2 border-sky-100 dark:border-sky-800 shadow-inner">
                <p className="text-xs font-bold text-sky-900 dark:text-sky-200 leading-relaxed">Ideal for: Lawyers, Diplomats, Accountants, and Policy Makers.</p>
              </div>
            </CardContent>
          </Card>

          {/* Arts & Sports */}
          <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden flex flex-col bg-white dark:bg-card group hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="bg-amber-600 text-white p-10">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-200" /> Arts & Sports
              </CardTitle>
              <CardDescription className="text-amber-100 font-bold uppercase text-[10px] tracking-widest mt-2">Performance & Physiology</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-8 flex-grow">
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase text-amber-600/40 dark:text-amber-200/40 tracking-[0.2em]">Core Specializations</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Performing Arts (Music, Theatre)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Visual Arts (Fine Arts, Design)</li>
                  <li className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Sports Science & Physiology</li>
                </ul>
              </div>
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border-2 border-amber-100 dark:border-amber-800 shadow-inner">
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 leading-relaxed">Ideal for: Athletes, Creative Directors, Musicians, and Sports Analysts.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Summary Table */}
      <section className="space-y-10">
        <h3 className="text-3xl font-black text-center">Curriculum Strategic Table</h3>
        <div className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white dark:bg-card">
          <Table>
            <TableHeader className="bg-primary/5">
              <TableRow>
                <TableHead className="w-[250px] font-black text-primary py-6 px-8 text-sm uppercase tracking-widest">Education Level</TableHead>
                <TableHead className="font-black text-primary py-6 px-8 text-sm uppercase tracking-widest">Structural Requirement</TableHead>
                <TableHead className="font-black text-primary py-6 px-8 text-sm uppercase tracking-widest">Strategic Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-black text-lg py-8 px-8">Junior Secondary (7–9)</TableCell>
                <TableCell className="font-bold py-8 px-8">12 Compulsory + 1-2 Optional</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300 font-medium py-8 px-8">Discovery phase for identifying Multiple Intelligence signatures.</TableCell>
              </TableRow>
              <TableRow className="hover:bg-primary/5 transition-colors">
                <TableCell className="font-black text-lg py-8 px-8">Senior Secondary (10–12)</TableCell>
                <TableCell className="font-bold py-8 px-8">11 Subjects (4 Compulsory + 7 Electives)</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-300 font-medium py-8 px-8">Specialization phase. Exactly 3 electives must align with the chosen track.</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Final CTA */}
      <div className="p-20 bg-primary rounded-[4rem] text-center space-y-10 relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <GraduationCap className="h-[600px] w-[600px] -bottom-20 -left-20 absolute" />
        </div>
        <div className="relative z-10 space-y-6">
          <h3 className="text-4xl md:text-6xl font-black text-white">Unlock Your Blueprint.</h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto font-medium">
            Use the Hobby-Career Analyst to see which professional domains match your preferred 3-elective mix today.
          </p>
        </div>
        <Link href="/subject-combination" className="relative z-10 inline-block group">
          <Button size="lg" className="px-16 h-20 text-2xl font-black rounded-2xl shadow-2xl bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:scale-105 transition-all">
            Analyze My Mix Now
          </Button>
        </Link>
      </div>
    </div>
  );
}