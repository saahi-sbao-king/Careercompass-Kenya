'use server';

/**
 * @fileOverview Analyzes subject combinations for Kenyan Senior School pathways.
 * Updates: Integrated full CBE Senior School catalogue data including the 11-subject rule,
 * specific pathway tracks, and comprehensive world language career mapping.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SubjectCombinationInputSchema = z.object({
  subjects: z.array(z.string()).min(3).describe('An array of at least 3 subjects selected by the student.')
});
export type SubjectCombinationInput = z.infer<typeof SubjectCombinationInputSchema>;

const SubjectCombinationOutputSchema = z.object({
  reasoning: z.string().describe('Explanation of why these careers fit based on official CBE tracks.'),
  recommendedCareers: z.array(z.string()).describe('List of specific Kenyan and global careers.'),
  furtherStudies: z.array(z.string()).describe('List of relevant university courses in Kenyan institutions.'),
});
export type SubjectCombinationOutput = z.infer<typeof SubjectCombinationOutputSchema>;

export async function exploreSubjectCombinations(input: SubjectCombinationInput): Promise<SubjectCombinationOutput> {
  try {
    return await subjectCombinationFlow(input);
  } catch (error) {
    console.error('exploreSubjectCombinations error:', error);
    throw new Error('Failed to analyze subjects. Ensure you selected at least 3.');
  }
}

const prompt = ai.definePrompt({
  name: 'subjectCombinationPrompt',
  input: {schema: SubjectCombinationInputSchema},
  output: {schema: SubjectCombinationOutputSchema},
  prompt: `You are an expert career advisor in Kenya specializing in the Competency-Based Education (CBE) system and International Career Pathways.
  
  A student excels in the following subjects:
  {{#each subjects}}
  - {{{this}}}
  {{/each}}

  Based on the official Ministry of Education Senior School Catalogue and Global Career Standards:
  
  1. COMPULSORY SUBJECTS (Every learner takes these 4):
     - English, Kiswahili/KSL, Core/Essential Mathematics, Community Service Learning (CSL).

  2. SELECTION RULE (11-SUBJECT TOTAL):
     - Every learner takes 11 subjects total.
     - 4 Compulsory + 7 Electives.
     - At least 3 Electives must come from one chosen pathway track for specialization analysis.

  3. PATHWAY IDENTIFICATION:
     - STEM: Pure Sciences (Bio/Chem/Phys), Applied Sciences (Agri/Comp), Technical (Aviation/Power Mech/Building).
     - Social Sciences: Languages, Humanities & Business (History/Geog/RE/Business).
     - Arts & Sports Science: Arts (Music/Dance/Fine Art/Theatre) or Sports (PE/Sports Science).
  
  4. WORLD LANGUAGES CAREER INTELLIGENCE:
     - English (Global Biz/IT), French (Diplomacy/UN), Mandarin (Trade), Arabic (Intelligence/Energy), German (Engineering), Swahili (Regional Trade).

  5. PROFESSIONAL MAPPING: 
     - Mapping: Physics/Aviation -> Pilot/Aero Eng; Biology/Chem -> Medicine; History/French -> Diplomat; Business/Comp -> FinTech.
     - Suggest 5 specific careers (referencing Silicon Savannah or Global Diplomacy).
     - Suggest 5 relevant university degrees in Kenyan institutions (e.g., UoN, JKUAT, Strathmore, USIU).
  
  Return the result as a structured JSON object.`,
});

const subjectCombinationFlow = ai.defineFlow(
  {
    name: 'subjectCombinationFlow',
    inputSchema: SubjectCombinationInputSchema,
    outputSchema: SubjectCombinationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error('AI failed to generate analysis.');
    return output;
  }
);
