
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Music, Map, User, Users, Leaf, Calculator, Type, HelpCircle } from 'lucide-react';

const INTELLIGENCES = [
  {
    type: 'Linguistic',
    icon: Type,
    description: 'Sensitivity to spoken and written language, the ability to learn languages, and the capacity to use language to accomplish certain goals.',
    careers: ['Writer', 'Lawyer', 'Journalist', 'Teacher', 'Public Speaker']
  },
  {
    type: 'Logical-Mathematical',
    icon: Calculator,
    description: 'Capacity to analyze problems logically, carry out mathematical operations, and investigate issues scientifically.',
    careers: ['Scientist', 'Engineer', 'Computer Programmer', 'Accountant', 'Researcher']
  },
  {
    type: 'Spatial',
    icon: Map,
    description: 'The potential to recognize and use the patterns of wide space and more confined areas.',
    careers: ['Architect', 'Artist', 'Pilot', 'Surgeon', 'Graphic Designer']
  },
  {
    type: 'Bodily-Kinesthetic',
    icon: User,
    description: 'The potential of using one\'s whole body or parts of the body to solve problems or to fashion products.',
    careers: ['Athlete', 'Dancer', 'Surgeon', 'Craftsperson', 'Mechanic']
  },
  {
    type: 'Musical',
    icon: Music,
    description: 'Skill in the performance, composition, and appreciation of musical patterns.',
    careers: ['Composer', 'Singer', 'Music Producer', 'DJ', 'Sound Engineer']
  },
  {
    type: 'Interpersonal',
    icon: Users,
    description: 'The capacity to understand the intentions, motivations, and desires of other people.',
    careers: ['Counselor', 'Salesperson', 'Manager', 'Politician', 'Teacher']
  },
  {
    type: 'Intrapersonal',
    icon: Brain,
    description: 'The capacity to understand oneself, to appreciate one\'s feelings, fears and motivations.',
    careers: ['Psychologist', 'Theologian', 'Entrepreneur', 'Consultant', 'Writer']
  },
  {
    type: 'Naturalist',
    icon: Leaf,
    description: 'Sensitivity to patterns in nature, including the ability to identify and classify species.',
    careers: ['Farmer', 'Botanist', 'Environmentalist', 'Vet', 'Chef']
  },
  {
    type: 'Existential',
    icon: HelpCircle,
    description: 'The ability to be sensitive to, or have the capacity for, conceptualizing or tackling deeper questions about human existence.',
    careers: ['Philosopher', 'Theologian', 'Cosmologist', 'Deep Thinker', 'Life Coach']
  }
];

export default function IntelligenceAnalystPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-headline font-bold">Multiple Intelligences Theory</h1>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          Developed by Howard Gardner, this theory suggests that human intelligence is not a single entity but a collection of distinct "modalities."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {INTELLIGENCES.map((item) => (
          <Card key={item.type} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-xl">{item.type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
              <div>
                <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Ideal Careers</h4>
                <div className="flex flex-wrap gap-2">
                  {item.careers.map((career) => (
                    <span key={career} className="px-2 py-1 bg-muted rounded-md text-xs font-medium">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-20 p-8 bg-primary/5 rounded-3xl border border-primary/10 text-center">
        <h2 className="text-2xl font-bold mb-4">How it applies to Kenyan Students</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          In the Competency-Based Education (CBE) system, recognizing these intelligences early helps students choose the right pathway (STEM, Arts, or Social Sciences) for Senior School, ensuring they pursue a career that aligns with their natural talents.
        </p>
      </div>
    </div>
  );
}
