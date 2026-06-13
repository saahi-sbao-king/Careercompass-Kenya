"use client";

import { useGuestUser, useCollection } from '@/lib/firebase/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Download, TrendingUp, Trophy, Plus, Trash2, Loader2, LogOut } from 'lucide-react';
import { useState } from 'react';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getStudyCoachAdvice } from '@/ai/flows/study-recommendations';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateCareerBlueprintPDF } from '@/lib/report-pdf-generator';
import { signOut } from "next-auth/react";

interface DashboardContentProps {
  user: any;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const { guestId, guestData } = useGuestUser();
  const { data: logs } = useCollection(guestId ? `users/${guestId}/studyLogs` : null);
  const [coachData, setCoachData] = useState<any>(null);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [newLog, setNewLog] = useState({ subject: '', duration: '', date: new Date().toISOString().split('T')[0] });

  const activeAssessment = guestData?.assessment;
  const totalMins = logs?.reduce((acc, curr) => acc + curr.duration, 0) || 0;

  const handleCoach = async () => {
    if (!activeAssessment) return toast({ title: "Assessment Required", variant: "destructive" });
    setLoadingCoach(true);
    try {
      const res = await getStudyCoachAdvice({
        careerPathway: activeAssessment.pathway,
        topIntelligences: Object.entries(activeAssessment.scores).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3).map(([k]) => k),
        interests: [],
        studyLogs: logs?.map(l => ({ subject: l.subject, duration: l.duration, date: l.date })) || []
      });
      setCoachData(res);
    } catch (e) { toast({ title: "Coach offline", variant: "destructive" }); }
    finally { setLoadingCoach(false); }
  };

  const handleAddLog = async () => {
    if (!newLog.subject || !newLog.duration || !guestId) return;
    try {
      await addDoc(collection(db, `users/${guestId}/studyLogs`), { ...newLog, duration: parseInt(newLog.duration), guestId });
      setNewLog({ subject: '', duration: '', date: new Date().toISOString().split('T')[0] });
      toast({ title: "Log recorded" });
    } catch (e) { toast({ title: "Error", variant: "destructive" }); }
  };

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-primary p-12 rounded-[3.5rem] text-primary-foreground shadow-2xl relative overflow-hidden">
        <div className="space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
            <Trophy className="h-3 w-3 text-secondary" /> Command Center
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
            Karibu, <span className="text-secondary">{user?.name?.split(' ')[0] || 'Scholar'}</span>.
          </h1>
          <p className="text-primary-foreground/80 text-xl font-medium">Public Career Intelligence Terminal</p>
        </div>
        <div className="z-10 flex flex-wrap gap-4">
          {activeAssessment && (
            <Button variant="secondary" onClick={() => generateCareerBlueprintPDF({ ...activeAssessment, studentName: activeAssessment.userInfo.name, reportDate: new Date().toLocaleDateString(), scores: activeAssessment.scores })} className="h-16 px-10 rounded-2xl font-black shadow-2xl gap-3">
              <Download className="h-6 w-6" /> Export Blueprint
            </Button>
          )}
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/" })} className="h-16 px-8 rounded-2xl font-black text-primary-foreground hover:bg-white/10 gap-2">
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mb-12 bg-muted/50 p-2 rounded-[2rem] border-2 h-20">
          <TabsTrigger value="overview" className="rounded-[1.5rem] font-black">OVERVIEW</TabsTrigger>
          <TabsTrigger value="coach" className="rounded-[1.5rem] font-black gap-2"><Brain className="h-4 w-4" /> COACH</TabsTrigger>
          <TabsTrigger value="history" className="rounded-[1.5rem] font-black">EFFORT</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-10">
          <div className="grid md:grid-cols-3 gap-10">
            <Card className="md:col-span-2 border-none shadow-2xl rounded-[3.5rem] overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-12 px-12">
                <CardTitle className="text-4xl font-black">Intelligence DNA</CardTitle>
              </CardHeader>
              <CardContent className="p-12">
                {activeAssessment ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {Object.entries(activeAssessment.scores || {})
                      .sort(([, a]: any, [, b]: any) => b - a)
                      .slice(0, 3)
                      .map(([type, score]: any) => (
                        <div key={type} className="p-12 bg-muted/20 border-2 rounded-[3rem] flex flex-col items-center">
                          <div className="text-6xl font-black text-primary mb-4">{Math.round(score)}%</div>
                          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">{type}</span>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="py-40 text-center">
                    <h3 className="text-3xl font-black mb-10">Evaluation Required.</h3>
                    <Button onClick={() => window.location.href='/assessment'} size="lg" className="rounded-2xl font-black h-16 px-16">Start Evaluation</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none bg-secondary text-secondary-foreground rounded-[3.5rem] shadow-2xl overflow-hidden p-10">
              <CardTitle className="text-2xl font-black uppercase"><TrendingUp /> Effort Meter</CardTitle>
              <div className="text-center py-10">
                <div className="text-8xl font-black leading-none mb-4">{totalMins}</div>
                <div className="text-[11px] font-black uppercase opacity-80">Minutes Recorded</div>
              </div>
              <Progress value={Math.min((totalMins / 1000) * 100, 100)} className="h-3 bg-background/20" />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coach">
          <Card className="rounded-[4rem] overflow-hidden">
            <CardHeader className="bg-secondary text-secondary-foreground p-16">
              <CardTitle className="text-5xl font-black">AI Study Coach</CardTitle>
              <Button onClick={handleCoach} disabled={loadingCoach || !activeAssessment} size="lg" className="rounded-[2.5rem] h-24 px-16 text-2xl font-black mt-8">
                {loadingCoach ? <Loader2 className="animate-spin h-10 w-10" /> : <Brain className="h-10 w-10" />}
                {coachData ? "RECALIBRATE" : "GENERATE"}
              </Button>
            </CardHeader>
            <CardContent className="p-16">
              {coachData ? (
                <div className="grid sm:grid-cols-2 gap-10">
                  {coachData.recommendations.map((r: string, i: number) => (
                    <div key={i} className="p-10 bg-muted/20 rounded-[3rem] border-2 font-bold text-xl">• {r}</div>
                  ))}
                </div>
              ) : <div className="py-24 text-center text-muted-foreground">Click generate to build your academic strategy.</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="rounded-[3.5rem] overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row items-center justify-between p-16 bg-muted/30">
              <CardTitle className="text-4xl font-black">Effort Ledger</CardTitle>
              <Dialog>
                <DialogTrigger asChild><Button size="lg" className="h-16 px-12 rounded-2xl font-black shadow-2xl"><Plus className="mr-4" /> Record Learning</Button></DialogTrigger>
                <DialogContent className="rounded-[3rem] p-12">
                  <DialogHeader><DialogTitle className="text-3xl font-black">Manual Entry</DialogTitle></DialogHeader>
                  <div className="space-y-8 pt-4">
                    <div className="space-y-2"><Label>Subject</Label><Input value={newLog.subject} onChange={e => setNewLog(p => ({ ...p, subject: e.target.value }))} className="h-16 rounded-2xl text-xl" /></div>
                    <div className="space-y-2"><Label>Duration (Mins)</Label><Input type="number" value={newLog.duration} onChange={e => setNewLog(p => ({ ...p, duration: e.target.value }))} className="h-16 rounded-2xl text-xl" /></div>
                    <Button onClick={handleAddLog} className="w-full h-20 rounded-[2rem] font-black text-2xl shadow-2xl">Commit</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted/50 border-b"><tr className="text-xs uppercase font-black text-muted-foreground"><th className="px-16 py-10">Subject</th><th className="px-16 py-10">Intensity</th><th className="px-16 py-10">Actions</th></tr></thead>
                    <tbody className="divide-y">
                      {logs?.map(log => (
                        <tr key={log.id} className="hover:bg-muted/20">
                          <td className="px-16 py-12 font-black text-3xl">{log.subject}</td>
                          <td className="px-16 py-12"><span className="bg-secondary text-white px-6 py-2.5 rounded-full font-black">{log.duration} MINS</span></td>
                          <td className="px-16 py-12 text-right"><Button variant="ghost" onClick={() => deleteDoc(doc(db, `users/${guestId}/studyLogs`, log.id))}><Trash2 className="text-muted-foreground hover:text-destructive" /></Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}