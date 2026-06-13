
"use client";

import { useCollection, useDoc } from '@/lib/firebase/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, TrendingUp, ShieldCheck, Star, CreditCard, Loader2, KeyRound, ReceiptText, UserCheck, Search, ShieldAlert } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const { data: users, loading: usersLoading } = useCollection('users');
  const { data: transactions } = useCollection('transactions');
  const { data: paywallFlag } = useDoc('feature_flags/assessment_paywall');
  const { data: adminConfig } = useDoc('feature_flags/admin_config');

  const [monetization, setMonetization] = useState({ isEnabled: false, priceKES: 0 });
  const [tokenConfig, setTokenConfig] = useState({ adminToken: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [grantingId, setGrantingId] = useState<string | null>(null);

  useEffect(() => {
    if (paywallFlag) setMonetization({ isEnabled: paywallFlag.isEnabled || false, priceKES: paywallFlag.priceKES || 0 });
  }, [paywallFlag]);

  useEffect(() => {
    if (adminConfig) setTokenConfig({ adminToken: adminConfig.adminToken || 'sidmadina4lyf' });
  }, [adminConfig]);

  const stats = useMemo(() => {
    if (!users) return { totalUsers: 0, completedAssessments: 0, pathways: {}, chartData: [] };
    const completed = users.filter(u => u.assessment).length;
    const intelligenceDistribution = users.reduce((acc: any, u) => {
      if (u.assessment?.scores) {
        Object.keys(u.assessment.scores).forEach(type => { acc[type] = (acc[type] || 0) + (u.assessment.scores[type] > 60 ? 1 : 0); });
      }
      return acc;
    }, {});
    return { 
      totalUsers: users.length, 
      completedAssessments: completed, 
      chartData: Object.entries(intelligenceDistribution).map(([name, value]) => ({ name, value })) 
    };
  }, [users]);

  const handleSaveMonetization = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'feature_flags', 'assessment_paywall'), { id: 'assessment_paywall', ...monetization, updatedAt: new Date().toISOString() }, { merge: true });
      toast({ title: "Configuration Updated" });
    } catch (err) { toast({ title: "Update Failed", variant: "destructive" }); }
    finally { setIsSaving(false); }
  };

  const handleGrantAccess = async (userId: string, currentStatus: boolean) => {
    setGrantingId(userId);
    try {
      await setDoc(doc(db, 'users', userId), { hasPaidAssessment: !currentStatus, unlockedAt: !currentStatus ? new Date().toISOString() : null }, { merge: true });
      toast({ title: !currentStatus ? "Access Granted" : "Access Revoked" });
    } catch (err) { toast({ title: "Operation Failed", variant: "destructive" }); }
    finally { setGrantingId(null); }
  };

  if (usersLoading) return <div className="p-24 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary text-white rounded-2xl"><ShieldCheck className="h-8 w-8" /></div>
        <h1 className="text-3xl font-black">Public Command Center</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-none"><CardHeader><CardTitle className="text-xs font-black uppercase">Students</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">{stats.totalUsers}</div></CardContent></Card>
        <Card className="bg-secondary/5 border-none"><CardHeader><CardTitle className="text-xs font-black uppercase">Engagement</CardTitle></CardHeader><CardContent><div className="text-3xl font-black">{Math.round((stats.completedAssessments / (stats.totalUsers || 1)) * 100)}%</div></CardContent></Card>
      </div>

      <Tabs defaultValue="monetization" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-3xl mb-12 bg-muted/50 p-1 rounded-2xl">
          <TabsTrigger value="monetization" className="rounded-xl font-black">Monetization</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl font-black">Users</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl font-black">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="monetization" className="space-y-8">
          <Card className="rounded-[2rem] overflow-hidden border-primary/10">
            <CardHeader className="bg-primary text-white">
              <CardTitle className="font-black">Paywall Settings</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl">
                <Label className="font-black">Assessment Paywall</Label>
                <Switch checked={monetization.isEnabled} onCheckedChange={(val) => setMonetization(p => ({ ...p, isEnabled: val }))} />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase">Price (KES)</Label>
                <div className="flex gap-4">
                  <Input type="number" value={monetization.priceKES} onChange={(e) => setMonetization(p => ({ ...p, priceKES: parseInt(e.target.value) || 0 }))} className="h-12 text-lg font-bold" />
                  <Button onClick={handleSaveMonetization} disabled={isSaving} className="h-12 px-8 font-black">{isSaving ? <Loader2 className="animate-spin" /> : "Save"}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-8">
          <Card className="rounded-[2rem] overflow-hidden border-none shadow-2xl">
            <CardHeader className="bg-muted/30 border-b p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3"><UserCheck /> Management</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase font-black bg-muted/50 border-b"><tr><th className="px-8 py-6">Guest ID / Name</th><th className="px-8 py-6 text-center">Status</th><th className="px-8 py-6 text-right">Actions</th></tr></thead>
                  <tbody className="divide-y">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30">
                        <td className="px-8 py-6">
                          <p className="font-black">{u.assessment?.userInfo?.name || u.id}</p>
                          <p className="text-xs text-muted-foreground">{u.id}</p>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <Badge className={u.hasPaidAssessment ? "bg-green-600" : "bg-muted text-muted-foreground"}>{u.hasPaidAssessment ? "UNLOCKED" : "LOCKED"}</Badge>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button size="sm" onClick={() => handleGrantAccess(u.id, !!u.hasPaidAssessment)} disabled={grantingId === u.id} className="font-black rounded-lg">
                            {grantingId === u.id ? <Loader2 className="animate-spin" /> : u.hasPaidAssessment ? "Revoke" : "Grant Access"}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2rem] p-10">
            <CardHeader><CardTitle className="text-2xl font-black">Intelligence Modalities</CardTitle></CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="hsl(var(--primary))" barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
