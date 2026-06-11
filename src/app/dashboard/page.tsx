"use client";

import { useUser, useCollection } from '@/lib/firebase/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Download, Clock, TrendingUp, Trophy, Calendar, Plus, Trash2, Loader2, ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { useState, useMemo } from 'react';
import { doc, addDoc, collection, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getStudyCoachAdvice } from '@/ai/flows/study-recommendations';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateCareerBlueprintPDF } from '@/lib/report-pdf-generator';

export default function StudentDashboardFinal() {
  const { user, userData } = useUser();
  const { data: logs } = useCollection(user ? `users/${user.uid}/studyLogs` : null);
  const [coachData, setCoachData] = useState<any>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [newLog, setNewLog] = useState({ subject: '', duration: '', date: new Date().toISOString().split('T')[0] });

  const activeAssessment = userData?.assessment;
  const totalMins = logs?.reduce((acc, curr) => acc + curr.duration, 0) || 0;

  const handleCoach = async () => {
    if (!activeAssessment) {
      toast({ title: "Assessment Required", variant: "destructive" });
      return;
    }
    setLoadingCoach(true);
    try {
      const res = await getStudyCoachAdvice({
        careerPathway: activeAssessment.pathway,
        topIntelligences: Object.entries(activeAssessment.scores).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3).map(([k]) => k),
        interests: [],
        studyLogs: logs?.map(l => ({ subject: l.subject, duration: l.duration, date: l.date })) || []
      });
      setCoachData(res);
    } catch (e) {
      toast({ title: "Coach offline", variant: "destructive" });
    } finally {
      setLoadingCoach(false);
    }
  };

  const handleAddLog = async () => {
    if (!newLog.subject || !newLog.duration) return;
    try {
      await addDoc(collection(db, `users/${user?.uid}/studyLogs`), {
        ...newLog,
        duration: parseInt(newLog.duration),
        userId: user?.uid
      });
      setNewLog({ subject: '', duration: '', date: new Date().toISOString().split('T')[0] });
      toast({ title: "Log recorded" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-primary p-12 rounded-[3.5rem] text-primary-foreground shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none"><Brain className="h-80 w-80 text-white rotate-12" /></div>
        <div className="space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/20 text-foreground rounded-full text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-xl border border-white/10">
            <Trophy className="h-3 w-3 text-secondary fill-secondary" /> Command Center
          </div>
          <h1 className="text-5xl md:text-7xl font-headline font-black tracking-tighter leading-none">
            Karibu, <span className="text-secondary">{activeAssessment?.userInfo?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Scholar'}</span>.
          </h1>
          <p className="text-primary-foreground/80 text-xl font-medium max-w-xl">Synchronizing professional evolution and CBE trajectory.</p>
        </div>
        <div className="z-10 flex flex-wrap gap-4">
          {activeAssessment && (
            <Button variant="secondary" onClick={() => generateCareerBlueprintPDF({ ...activeAssessment, studentName: user?.displayName || 'Scholar', reportDate: new Date().toLocaleDateString(), scores: activeAssessment.scores })} className="h-16 px-10 rounded-2xl font-black shadow-2xl gap-3 text-lg">
              <Download className="h-6 w-6" /> Export Blueprint
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-12 bg-muted/50 p-2 rounded-[2rem] border-2 h-20 shadow-inner">
          <TabsTrigger value="overview" className="rounded-[1.5rem] h-full text-sm font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">STRATEGIC OVERVIEW</TabsTrigger>
          <TabsTrigger value="coach" className="rounded-[1.5rem] h-full text-sm font-black gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Brain className="h-4 w-4" /> AI COACH</TabsTrigger>
          <TabsTrigger value="history" className="rounded-[1.5rem] h-full text-sm font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">EFFORT LEDGER</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10">
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="md:col-span-2 border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-card">
              <CardHeader className="bg-muted/30 border-b py-12 px-12">
                <div className="flex items-center gap-6">
                  <div className="p-5 bg-primary text-primary-foreground rounded-[2rem] shadow-2xl"><Brain className="h-10 w-10" /></div>
                  <div>
                    <CardTitle className="text-4xl font-black tracking-tight leading-none mb-2">Intelligence DNA</CardTitle>
                    <CardDescription className="text-xl font-medium">Top identified cognitive modalities.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-12">
                {activeAssessment ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {Object.entries(activeAssessment.scores || {})
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .slice(0, 3)
                      .map(([type, score]: any) => (
                        <div key={type} className="p-12 bg-muted/20 border-2 border-border/50 rounded-[3rem] flex flex-col items-center text-center group hover:bg-primary hover:text-primary-foreground transition-all duration-700">
                          <div className="text-6xl font-black text-primary group-hover:text-secondary mb-4 leading-none">{Math.round(score)}%</div>
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-primary-foreground/90">{type}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-40 text-center space-y-10">
                    <h3 className="text-3xl font-black">Profile Encrypted.</h3>
                    <p className="text-muted-foreground max-sm mx-auto text-lg">Complete your assessment to unlock professional data.</p>
                    <Button onClick={() => window.location.href='/assessment'} size="lg" className="rounded-2xl font-black px-16 shadow-2xl h-16 text-xl transition-transform hover:scale-105">Start Evaluation</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-10">
              <Card className="border-none bg-secondary text-secondary-foreground rounded-[3.5rem] shadow-2xl overflow-hidden relative group">
                <div className="absolute -bottom-8 -right-8 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Clock className="h-40 w-40" /></div>
                <CardHeader className="pb-6 p-10"><CardTitle className="text-2xl font-black flex items-center gap-4 uppercase tracking-tighter"><TrendingUp className="h-6 w-6" /> Effort Meter</CardTitle></CardHeader>
                <CardContent className="pb-12 px-10">
                  <div className="text-center py-10">
                    <div className="text-8xl font-black tracking-tighter leading-none mb-4">{totalMins}</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">Minutes Recorded</div>
                  </div>
                  <Progress value={Math.min((totalMins / 1000) * 100, 100)} className="h-3 bg-background/20 rounded-full" />
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-muted/30 rounded-[3.5rem] shadow-sm p-3">
                <CardHeader className="pb-6 pt-10 px-10"><CardTitle className="text-2xl font-black tracking-tighter uppercase">Quick Access</CardTitle></CardHeader>
                <CardContent className="space-y-3 px-6 pb-8">
                  <Button variant="ghost" className="w-full h-16 justify-between gap-6 hover:bg-background rounded-[2rem] px-8 transition-all group" onClick={() => window.location.href='/careers'}><div className="flex items-center gap-5"><div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground"><Briefcase className="h-6 w-6" /></div><span className="font-black text-lg">Careers Hub</span></div><ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" /></Button>
                  <Button variant="ghost" className="w-full h-16 justify-between gap-6 hover:bg-background rounded-[2rem] px-8 transition-all group" onClick={() => window.location.href='/subject-combination'}><div className="flex items-center gap-5"><div className="p-3 bg-primary/10 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground"><GraduationCap className="h-6 w-6" /></div><span className="font-black text-lg">Pathfinder AI</span></div><ArrowRight className="h-5 w-5 opacity-30 group-hover:opacity-100 group-hover:translate-x-2 transition-all" /></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coach">
          <Card className="border-none shadow-2xl overflow-hidden rounded-[4rem] bg-card">
            <CardHeader className="bg-secondary text-secondary-foreground flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-16 opacity-10 pointer-events-none"><Sparkles className="h-[500px] w-[500px] text-white" /></div>
              <div className="space-y-6 z-10">
                <div className="flex items-center gap-5"><div className="p-4 bg-background/10 rounded-[2rem] backdrop-blur-2xl border border-white/20 shadow-2xl"><Sparkles className="h-10 w-10 fill-current" /></div><CardTitle className="text-5xl font-black tracking-tighter">AI Study Coach</CardTitle></div>
                <CardDescription className="text-secondary-foreground/90 text-2xl font-medium max-w-2xl leading-relaxed">A high-fidelity academic blueprint synchronizing DNA with CBE.</CardDescription>
              </div>
              <Button onClick={handleCoach} disabled={loadingCoach || !activeAssessment} size="lg" variant="outline" className="rounded-[2.5rem] shadow-2xl gap-5 h-24 px-16 bg-background/10 border-white/30 text-secondary-foreground font-black hover:bg-background/20 z-10 text-2xl">
                {loadingCoach ? <Loader2 className="h-10 w-10 animate-spin" /> : <Brain className="h-10 w-10" />}
                {coachData ? "RECALIBRATE" : "GENERATE"}
              </Button>
            </CardHeader>
            <CardContent className="p-16">
              {!coachData && !loadingCoach ? (
                <div className="py-24 text-center border-4 border-dashed rounded-[3rem] space-y-4">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground/30" />
                  <h3 className="text-3xl font-black">Plan Your Success.</h3>
                  <p className="text-muted-foreground font-medium">Click the button above to build your 7-day academic strategy.</p>
                </div>
              ) : coachData && (
                <div className="space-y-12">
                   <div className="grid sm:grid-cols-2 gap-10">
                      {coachData.recommendations.map((r: string, i: number) => (
                        <div key={i} className="p-10 bg-muted/20 rounded-[3rem] border-2 border-border/50 font-bold text-xl leading-relaxed">
                          <p>• {r}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border-none shadow-2xl rounded-[3.5rem] overflow-hidden bg-card">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between bg-muted/30 p-16 border-b gap-10">
              <div className="space-y-2">
                <CardTitle className="text-4xl font-black tracking-tighter">Verified Effort Ledger</CardTitle>
                <CardDescription className="text-xl font-medium">Historical audit of academic activities and learning milestones.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild><Button size="lg" className="h-16 px-12 rounded-2xl font-black shadow-2xl gap-4 text-xl"><Plus className="h-7 w-7" /> Record Learning</Button></DialogTrigger>
                <DialogContent className="rounded-[3rem] p-12 bg-card">
                  <DialogHeader><DialogTitle className="text-3xl font-black mb-4">Manual Entry</DialogTitle></DialogHeader>
                  <div className="space-y-8 pt-4">
                    <div className="space-y-3">
                      <Label className="font-black text-[10px] uppercase tracking-widest ml-2">Learning Area / Subject</Label>
                      <Input value={newLog.subject} onChange={e => setNewLog(p => ({ ...p, subject: e.target.value }))} placeholder="e.g. Physics Core" className="rounded-2xl h-16 text-xl font-bold bg-muted/30 px-6" />
                    </div>
                    <div className="space-y-3">
                      <Label className="font-black text-[10px] uppercase tracking-widest ml-2">Duration (Mins)</Label>
                      <Input type="number" value={newLog.duration} onChange={e => setNewLog(p => ({ ...p, duration: e.target.value }))} placeholder="60" className="rounded-2xl h-16 text-xl font-bold bg-muted/30 px-6" />
                    </div>
                    <Button onClick={handleAddLog} className="w-full h-20 rounded-[2rem] font-black text-2xl shadow-2xl mt-4">Commit to Ledger</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
               {logs && logs.length > 0 ? (
                 <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] text-muted-foreground uppercase tracking-[0.4em] bg-muted/50 border-b">
                        <tr><th className="px-16 py-10 font-black">Strategic Subject</th><th className="px-16 py-10 font-black text-center">Intensity</th><th className="px-16 py-10 font-black">Timeline</th><th className="px-16 py-10 font-black text-right">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y">
                        {logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(log => (
                          <tr key={log.id} className="hover:bg-muted/20 transition-all duration-500 group">
                            <td className="px-16 py-12"><span className="font-black text-3xl group-hover:text-primary transition-colors tracking-tight">{log.subject}</span></td>
                            <td className="px-16 py-12 text-center"><span className="text-sm font-black bg-secondary text-white px-6 py-2.5 rounded-full shadow-lg">{log.duration} MINS</span></td>
                            <td className="px-16 py-12 font-bold text-muted-foreground text-lg italic">{new Date(log.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</td>
                            <td className="px-16 py-12 text-right"><Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl hover:bg-destructive/10" onClick={() => deleteDoc(doc(db, `users/${user?.uid}/studyLogs`, log.id))}><Trash2 className="h-7 w-7 text-muted-foreground hover:text-destructive" /></Button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               ) : (
                 <div className="py-64 text-center text-muted-foreground bg-muted/10 rounded-[4rem] border-8 border-dashed m-12">
                    <Calendar className="h-24 w-24 mx-auto mb-10 opacity-10" />
                    <p className="font-black text-4xl opacity-20 tracking-tighter">Ledger Currently Empty.</p>
                 </div>
               )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}