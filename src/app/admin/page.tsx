"use client";

import { useCollection, useIsAdmin, useDoc } from '@/lib/firebase/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, GraduationCap, TrendingUp, ShieldCheck, Star, Lock, Settings, CreditCard, Save, Loader2, AlertCircle, KeyRound, RefreshCw, History, ReceiptText, ArrowUpRight, UserCheck, Search, ShieldAlert } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const { isAdmin, loading: adminLoading } = useIsAdmin();
  
  const { data: users, loading: usersLoading } = useCollection(isAdmin ? 'users' : null);
  const { data: transactions } = useCollection(isAdmin ? 'transactions' : null);
  const { data: paywallFlag } = useDoc(isAdmin ? 'feature_flags/assessment_paywall' : null);
  const { data: adminConfig } = useDoc(isAdmin ? 'feature_flags/admin_config' : null);

  const [monetization, setMonetization] = useState({ isEnabled: false, priceKES: 0 });
  const [tokenConfig, setTokenConfig] = useState({ adminToken: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingToken, setIsSavingToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [grantingId, setGrantingId] = useState<string | null>(null);

  useEffect(() => {
    if (paywallFlag) {
      setMonetization({
        isEnabled: paywallFlag.isEnabled || false,
        priceKES: paywallFlag.priceKES || 0
      });
    }
  }, [paywallFlag]);

  useEffect(() => {
    if (adminConfig) {
      setTokenConfig({ adminToken: adminConfig.adminToken || 'sidmadina4lyf@2026' });
    }
  }, [adminConfig]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.assessment?.userInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const stats = useMemo(() => {
    if (!users) return { totalUsers: 0, completedAssessments: 0, pathways: {}, chartData: [] };
    
    const totalUsers = users.length;
    const completedAssessments = users.filter(u => u.assessment).length;
    const pathways = users.reduce((acc: any, u) => {
      if (u.assessment?.pathway) acc[u.assessment.pathway] = (acc[u.assessment.pathway] || 0) + 1;
      return acc;
    }, {});

    const intelligenceDistribution = users.reduce((acc: any, u) => {
      if (u.assessment?.scores) {
        Object.keys(u.assessment.scores).forEach(type => {
          acc[type] = (acc[type] || 0) + (u.assessment.scores[type] > 60 ? 1 : 0);
        });
      }
      return acc;
    }, {});

    const chartData = Object.entries(intelligenceDistribution).map(([name, value]) => ({ name, value }));

    return { totalUsers, completedAssessments, pathways, chartData };
  }, [users]);

  const totalRevenue = useMemo(() => {
    if (!transactions) return 0;
    return transactions
      .filter(tx => tx.status === 'COMPLETED')
      .reduce((acc, tx) => acc + (tx.amount || 0), 0);
  }, [transactions]);

  const handleSaveMonetization = async () => {
    if (!isAdmin) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'feature_flags', 'assessment_paywall'), {
        id: 'assessment_paywall',
        ...monetization,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Configuration Updated", description: "Monetization settings have been applied successfully." });
    } catch (err) {
      toast({ title: "Update Failed", description: "You might not have permission to change these settings.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveToken = async () => {
    if (!isAdmin) return;
    setIsSavingToken(true);
    try {
      await setDoc(doc(db, 'feature_flags', 'admin_config'), {
        id: 'admin_config',
        ...tokenConfig,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      toast({ title: "Security Token Rotated", description: "The admin entry token has been updated successfully." });
    } catch (err) {
      toast({ title: "Rotation Failed", variant: "destructive" });
    } finally {
      setIsSavingToken(false);
    }
  };

  const handleGrantAccess = async (userId: string, currentStatus: boolean) => {
    setGrantingId(userId);
    try {
      await setDoc(doc(db, 'users', userId), {
        hasPaidAssessment: !currentStatus,
        unlockedAt: !currentStatus ? new Date().toISOString() : null,
        unlockedBy: !currentStatus ? 'Admin Override' : null
      }, { merge: true });
      toast({ title: !currentStatus ? "Access Granted" : "Access Revoked" });
    } catch (err) {
      toast({ title: "Operation Failed", variant: "destructive" });
    } finally {
      setGrantingId(null);
    }
  };

  if (adminLoading) return <div className="p-12 text-center">Checking permissions...</div>;
  
  if (!isAdmin) {
    return (
      <div className="container py-24 text-center space-y-6 max-w-md mx-auto">
        <div className="bg-destructive/10 p-6 rounded-full w-fit mx-auto">
          <Lock className="h-12 w-12 text-destructive" />
        </div>
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">
          You do not have the necessary permissions to view the Admin Dashboard.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/admin/verify">
            <Button className="w-full bg-primary font-black h-12 rounded-xl">Claim Admin Access</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-12 rounded-xl">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (usersLoading) return <div className="p-12 text-center">Loading admin data...</div>;

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-headline font-bold">Admin Command Center</h1>
            <p className="text-muted-foreground text-sm font-medium">Frere Town Guidance Strategic Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-4 py-1.5 border-primary/20 text-primary font-black uppercase text-[10px] tracking-widest bg-primary/5">
            Verified Administrator
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-primary/5 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-primary/60 tracking-widest">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-secondary/60 tracking-widest">Revenue (KES)</CardTitle>
            <CreditCard className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-primary/5 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-primary/60 tracking-widest">STEM Students</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{stats.pathways['STEM'] || 0}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-black uppercase text-secondary/60 tracking-widest">Engagement</CardTitle>
            <Star className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">
              {stats.totalUsers > 0 ? Math.round((stats.completedAssessments / stats.totalUsers) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="monetization" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-3xl mb-12 bg-muted/50 p-1 rounded-2xl border">
          <TabsTrigger value="monetization" className="rounded-xl h-12 font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Strategic Regulation</TabsTrigger>
          <TabsTrigger value="users" className="rounded-xl h-12 font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">User Regulation</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-xl h-12 font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Payment Ledger</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl h-12 font-black data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Domain Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="monetization" className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-primary/10 shadow-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-primary text-white pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl"><CreditCard className="h-6 w-6" /></div>
                  <div>
                    <CardTitle className="text-xl font-black">Monetization Regulation</CardTitle>
                    <CardDescription className="text-blue-100/80">Manage fees and gateway status.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                <div className="flex items-center justify-between p-6 bg-muted/30 rounded-2xl border border-dashed border-primary/20">
                  <div className="space-y-1">
                    <Label htmlFor="paywall-toggle" className="text-base font-black">Assessment Paywall</Label>
                    <p className="text-xs text-muted-foreground font-medium">Enable automatic PesaPal gateway for students.</p>
                  </div>
                  <Switch 
                    id="paywall-toggle" 
                    checked={monetization.isEnabled} 
                    onCheckedChange={(val) => setMonetization(p => ({ ...p, isEnabled: val }))}
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="price" className="text-[10px] font-black uppercase tracking-widest text-primary/60">Assessment Price (KES)</Label>
                  <div className="flex gap-4">
                    <Input 
                      id="price"
                      type="number"
                      value={monetization.priceKES}
                      onChange={(e) => setMonetization(p => ({ ...p, priceKES: parseInt(e.target.value) || 0 }))}
                      className="h-12 text-lg font-bold rounded-xl border-primary/10 bg-background"
                    />
                    <Button onClick={handleSaveMonetization} disabled={isSaving} className="h-12 px-8 rounded-xl font-black">
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/10 shadow-xl overflow-hidden rounded-[2rem]">
              <CardHeader className="bg-secondary text-white pb-8">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl"><KeyRound className="h-6 w-6" /></div>
                  <div>
                    <CardTitle className="text-xl font-black">Security Credentials</CardTitle>
                    <CardDescription className="text-orange-100/80">Rotate the admin entry token.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="admin-token" className="text-[10px] font-black uppercase tracking-widest text-secondary/60">Active Admin Token</Label>
                  <div className="flex gap-4">
                    <Input 
                      id="admin-token"
                      value={tokenConfig.adminToken}
                      onChange={(e) => setTokenConfig(p => ({ ...p, adminToken: e.target.value }))}
                      className="h-12 text-lg font-bold rounded-xl border-secondary/10 bg-background"
                    />
                    <Button onClick={handleSaveToken} disabled={isSavingToken} variant="secondary" className="h-12 px-8 rounded-xl font-black text-white">
                      Rotate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b p-8">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <CardTitle className="text-2xl font-black flex items-center gap-3">
                    <UserCheck className="h-6 w-6 text-primary" />
                    Student Access Regulation
                  </CardTitle>
                  <CardDescription>Grant manual assessment access or review student profiles.</CardDescription>
                </div>
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or email..." 
                    className="pl-10 h-11 rounded-xl"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase tracking-widest bg-muted/50 border-b">
                    <tr>
                      <th className="px-8 py-6 font-black">Student Details</th>
                      <th className="px-8 py-6 font-black text-center">Pathway</th>
                      <th className="px-8 py-6 font-black text-center">Payment Status</th>
                      <th className="px-8 py-6 font-black text-right">Strategic Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase shadow-sm">
                              {u.email?.[0]}
                            </div>
                            <div>
                              <p className="font-black text-foreground">{u.assessment?.userInfo?.name || u.displayName || 'Unnamed Scholar'}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          {u.assessment?.pathway ? (
                            <Badge variant="outline" className="border-primary/20 text-primary font-bold bg-primary/5">{u.assessment.pathway}</Badge>
                          ) : (
                            <span className="text-[10px] text-muted-foreground italic font-medium">Pending</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-center">
                          {u.hasPaidAssessment ? (
                            <Badge className="bg-green-600 text-white font-black text-[10px] h-6 px-3">UNLOCKED</Badge>
                          ) : (
                            <Badge variant="outline" className="text-muted-foreground font-black text-[10px] h-6 px-3">LOCKED</Badge>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button 
                            variant={u.hasPaidAssessment ? "outline" : "default"}
                            size="sm"
                            className="rounded-lg font-black h-9 px-4 gap-2"
                            onClick={() => handleGrantAccess(u.id, !!u.hasPaidAssessment)}
                            disabled={grantingId === u.id}
                          >
                            {grantingId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldAlert className="h-3 w-3" />}
                            {u.hasPaidAssessment ? "Revoke Access" : "Grant Access"}
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

        <TabsContent value="transactions" className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden bg-card">
            <CardHeader className="bg-muted/30 border-b p-8">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <ReceiptText className="h-6 w-6 text-primary" />
                Strategic Payment Ledger
              </CardTitle>
              <CardDescription>Verified transaction history with official tracking codes.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase tracking-widest bg-muted/50 border-b">
                    <tr>
                      <th className="px-8 py-6 font-black">Student/Email</th>
                      <th className="px-8 py-6 font-black">Transaction Code</th>
                      <th className="px-8 py-6 font-black">Amount</th>
                      <th className="px-8 py-6 font-black">Method</th>
                      <th className="px-8 py-6 font-black">Timeline</th>
                      <th className="px-8 py-6 font-black text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {transactions?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(tx => (
                      <tr key={tx.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-black text-primary truncate max-w-[200px]">{tx.userEmail || 'Scholar'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <Badge variant="outline" className="font-mono text-[10px] font-bold border-primary/20 bg-primary/5 uppercase">
                            {tx.orderTrackingId || tx.merchantReference}
                          </Badge>
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-black">KES {tx.amount}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-xs font-bold text-muted-foreground">{tx.paymentMethod}</span>
                        </td>
                        <td className="px-8 py-6 text-xs text-muted-foreground">
                          {new Date(tx.createdAt).toLocaleString()}
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Badge className={tx.status === 'COMPLETED' ? "bg-green-600 text-white font-black h-6 px-3" : "bg-orange-500 text-white font-black h-6 px-3"}>
                            {tx.status || 'PENDING'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {(!transactions || transactions.length === 0) && (
                      <tr>
                        <td colSpan={6} className="py-24 text-center text-muted-foreground italic font-medium">No recorded transactions in the active cycle.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <Card className="border-none shadow-2xl rounded-[2rem] bg-card p-10">
            <CardHeader className="pb-8">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl font-black">Modalities Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(55, 48, 163, 0.05)' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={32}>
                    {stats.chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? 'hsl(var(--primary))' : 'hsl(var(--secondary))'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
