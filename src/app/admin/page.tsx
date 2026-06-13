"use client";

import { useCollection } from '@/lib/firebase/hooks';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, ShieldCheck, Search, Loader2, PieChart as PieIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminDashboard() {
  const { data: users, loading: usersLoading } = useCollection('users');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => {
    if (!users || users.length === 0) return { totalUsers: 0, completedAssessments: 0, chartData: [] };
    const completed = users.filter(u => u.assessment).length;
    
    const intelligenceDistribution = users.reduce((acc: any, u) => {
      if (u.assessment?.scores) {
        Object.keys(u.assessment.scores).forEach(type => { 
          acc[type] = (acc[type] || 0) + (u.assessment.scores[type] > 60 ? 1 : 0); 
        });
      }
      return acc;
    }, {});

    const chartData = Object.entries(intelligenceDistribution).map(([name, value]) => ({ 
      name, 
      value: value as number 
    }));

    return { 
      totalUsers: users.length, 
      completedAssessments: completed, 
      chartData 
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => {
      const name = u.assessment?.userInfo?.name || u.name || u.username || u.id;
      return name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [users, searchTerm]);

  if (usersLoading) return <div className="p-24 text-center"><Loader2 className="animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-xl">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black">Strategic Console</h1>
            <p className="text-muted-foreground text-sm font-medium">Designed by Sidmadina Technologies.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-primary/5 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-primary">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card className="bg-secondary/5 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-secondary">Evaluations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{stats.completedAssessments}</div>
          </CardContent>
        </Card>
        <Card className="bg-muted/50 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black">{Math.round((stats.completedAssessments / (stats.totalUsers || 1)) * 100)}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xl mb-12 bg-muted/50 p-1.5 rounded-2xl border h-14">
          <TabsTrigger value="users" className="rounded-xl font-black gap-2"><Users className="h-4 w-4" /> User Registry</TabsTrigger>
          <TabsTrigger value="analytics" className="rounded-xl font-black gap-2"><PieIcon className="h-4 w-4" /> Intel Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-8">
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search students by name..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-12 h-14 rounded-2xl bg-muted/30 border-none font-bold"
            />
          </div>
          
          <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase font-black bg-muted/50 border-b">
                    <tr>
                      <th className="px-8 py-6">Student Profile</th>
                      <th className="px-8 py-6">Assessed Pathway</th>
                      <th className="px-8 py-6 text-right">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-8 py-6">
                          <p className="font-black text-lg">{u.assessment?.userInfo?.name || u.name || u.username || 'Anonymous Scholar'}</p>
                          <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{u.id}</p>
                        </td>
                        <td className="px-8 py-6">
                          {u.assessment ? (
                            <Badge className="bg-primary/10 text-primary border-primary/20 font-black px-3 py-1 rounded-lg">
                              {u.assessment.pathway}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground italic text-xs">Pending Analysis</span>
                          )}
                        </td>
                        <td className="px-8 py-6 text-right text-xs font-bold text-muted-foreground">
                          {u.lastActive ? new Date(u.lastActive.seconds * 1000).toLocaleDateString() : 'N/A'}
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
          <Card className="border-none shadow-2xl rounded-[3rem] p-10 bg-card">
            <CardHeader className="px-0 pt-0 pb-10">
              <CardTitle className="text-3xl font-black">Intelligence Distribution</CardTitle>
              <CardDescription className="font-medium">Number of students scoring highly (>60%) in each modality.</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px] p-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    tick={{ fontSize: 11, fontWeight: 'bold', fill: 'hsl(var(--primary))' }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary)/0.05)' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="hsl(var(--primary))" barSize={32}>
                    {stats.chartData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fillOpacity={0.8 + (index * 0.02)} />
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
