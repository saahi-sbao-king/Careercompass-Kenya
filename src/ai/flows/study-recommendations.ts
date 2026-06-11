'use server';

/**
 * @fileOverview AI-powered study coach providing personalized recommendations and structured timetables.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyCoachInputSchema = z.object({
  careerPathway: z.string().describe('The student\'s recommended pathway (STEM, Arts, etc.)'),
  topIntelligences: z.array(z.string()).describe('The student\'s top 3 multiple intelligence types'),
  interests: z.array(z.string()).describe('List of student career interests or hobbies'),
  studyLogs: z.array(
    z.object({
      subject: z.string(),
      duration: z.number(),
      date: z.string(),
    })
  ).describe('Recent study history'),
});
export type StudyCoachInput = z.infer<typeof StudyCoachInputSchema>;

const StudyCoachOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('Actionable study advice'),
  weeklySchedule: z.array(
    z.object({
      day: z.string(),
      tasks: z.array(
        z.object({
          time: z.string(),
          activity: z.string(),
          reason: z.string().describe('Why this activity was chosen based on their interests/intelligence'),
        })
      ),
    })
  ).describe('A structured 7-day study timetable'),
});
export type StudyCoachOutput = z.infer<typeof StudyCoachOutputSchema>;

export async function getStudyCoachAdvice(input: StudyCoachInput): Promise<StudyCoachOutput> {
  try {
    return await studyCoachFlow(input);
  } catch (error) {
    console.error('getStudyCoachAdvice error:', error);
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'studyCoachPrompt',
  input: {schema: StudyCoachInputSchema},
  output: {schema: StudyCoachOutputSchema},
  prompt: `You are a high-level AI Study Coach at Frere Town Secondary School, specializing in the Kenyan CBE system.
  
  Your goal is to create a holistic weekly study schedule and provide advice for a student with the following profile:
  - Pathway: {{{careerPathway}}}
  - Strengths (Multiple Intelligences): {{#each topIntelligences}}{{{this}}}, {{/each}}
  - Passions/Interests: {{#each interests}}{{{this}}}, {{/each}}
  - Recent Effort: {{#each studyLogs}}{{{subject}}} ({{{duration}}} mins), {{/each}}

  Guidelines for the Schedule:
  1. Balance academic subjects with the student's hobbies and passions.
  2. Use their Multiple Intelligence strengths.
  3. Include 2-3 sessions per day (Morning, Afternoon, Evening).
  4. Ensure sessions for their career interests are explicitly scheduled.
  5. Provide a 7-day schedule (Monday to Sunday).

  Return a JSON object matching the required schema.`,
});

const studyCoachFlow = ai.defineFlow(
  {
    name: 'studyCoachFlow',
    inputSchema: StudyCoachInputSchema,
    outputSchema: StudyCoachOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Coach failed to generate a plan.');
    return output;
  }
);
