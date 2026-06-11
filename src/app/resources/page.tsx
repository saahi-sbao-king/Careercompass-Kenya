"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Globe, Video, ExternalLink, ArrowRight } from 'lucide-react';

const resources = [
  {
    title: 'Kenya Universities and Colleges Central Placement Service (KUCCPS)',
    description: 'The official portal for university and college placements in Kenya. Explore courses and institutions.',
    link: 'https://kuccps.net/',
    icon: Globe,
    type: 'Official Portal'
  },
  {
    title: 'Career Options Kenya',
    description: 'A comprehensive guide to various careers available in the Kenyan market, including job descriptions and required skills.',
    link: 'https://www.careeroptionsafrica.com/',
    icon: BookOpen,
    type: 'Career Guide'
  },
  {
    title: 'Guide to the Competency-Based Curriculum (CBC)',
    description: 'An overview of the CBC system by the Kenya Institute of Curriculum Development (KICD).',
    link: 'https://kicd.ac.ke/cbc-materials/curriculum-designs/',
    icon: Globe,
    type: 'Official Guide'
  },
  {
    title: 'Top Careers in Kenya for the Next Decade',
    description: 'A video exploring future-proof careers in Kenya, focusing on technology, healthcare, and emerging industries.',
    link: 'https://www.youtube.com/watch?v=GOqARrckaR8&t=3s&pp=ygUlYmVzdCBiZXN0IGNhcmVlcnMgaW4gdGhlIG5leHQgZGVjYWRlIA%3D%3D',
    icon: Video,
    type: 'Video'
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Resources</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore these useful links and guides to help you navigate your career and education journey in Kenya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {resources.map((resource, index) => (
          <Card key={index} className="hover:shadow-lg transition-all group border-primary/10 h-full flex flex-col hover:border-primary/30">
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                <resource.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase text-primary/60 tracking-wider">
                  {resource.type}
                </div>
                <CardTitle className="text-xl leading-tight">{resource.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground leading-relaxed">
                {resource.description}
              </p>
              <Button asChild variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-white transition-colors mt-auto">
                <a href={resource.link} target="_blank" rel="noopener noreferrer">
                  Visit Resource <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20 p-8 bg-accent/5 rounded-3xl border border-accent/10 text-center">
        <h2 className="text-2xl font-bold mb-4">Still need guidance?</h2>
        <p className="text-muted-foreground mb-6">Take our AI-powered assessment to get personalized recommendations based on your strengths.</p>
        <Button size="lg" asChild>
          <a href="/assessment" className="gap-2">
            Start Assessment <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
