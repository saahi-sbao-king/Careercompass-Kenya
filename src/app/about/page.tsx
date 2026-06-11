
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AboutPage() {
  const schoolGroup = PlaceHolderImages.find(img => img.id === 'school-group') || PlaceHolderImages[1];

  return (
    <main className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="border-primary/20 bg-card">
        <CardHeader>
          <CardTitle className="text-center text-4xl font-bold text-primary">About The Career Guidance System</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 text-lg">
          <div className="rounded-2xl overflow-hidden shadow-xl mb-8 border-4 border-primary/10 aspect-video relative">
            <Image 
              src={schoolGroup.imageUrl} 
              alt="Frere Town Students" 
              width={1080}
              height={720}
              className="object-cover w-full h-full"
            />
          </div>

          <p className="text-muted-foreground leading-relaxed">
            This system is designed to help students in Kenya's Competency-Based Education (CBE) system navigate their career choices. By assessing multiple intelligences, we recommend suitable career pathways that align with each student's unique interests, abilities, and passions.
          </p>

          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-primary">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <CheckCircle2 className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <strong className="font-semibold block text-foreground">Intelligence Assessment</strong>
                  <span className="text-muted-foreground text-sm">We use a questionnaire based on Howard Gardner's Multiple Intelligence Theory to assess 8 different types of intelligences.</span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <CheckCircle2 className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <strong className="font-semibold block text-foreground">Pathway Classification</strong>
                  <span className="text-muted-foreground text-sm">A machine learning model classifies your intelligence profile into one of the three senior school pathways in Kenya (Arts & Sports Science, Social Sciences, or STEM).</span>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 rounded-xl bg-primary/5 border border-primary/10">
                <CheckCircle2 className="text-primary mt-1 h-6 w-6 flex-shrink-0" />
                <div>
                  <strong className="font-semibold block text-foreground">Personalized Recommendations</strong>
                  <span className="text-muted-foreground text-sm">Based on your results, our AI generates personalized career recommendations, including specific careers, and a 6-month skill development plan.</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-primary/10 space-y-4">
            <h3 className="text-2xl font-semibold text-primary text-center">Our Mission</h3>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Our mission is to empower students to make informed and fulfilling career decisions that leverage their natural talents and contribute to Kenya's growing economy. We believe every student has a unique potential, and our goal is to help them discover it.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
