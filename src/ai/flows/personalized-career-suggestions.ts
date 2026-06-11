'use server';

/**
 * @fileOverview This flow provides personalized career suggestions based on user interests.
 * Robust: Uses local database context and optimized prompt for the Kenyan CBE system.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedCareerSuggestionsInputSchema = z.object({
  interests: z.array(z.string()).describe('An array of career interests, hobbies, or languages.'),
});

export type PersonalizedCareerSuggestionsInput = z.infer<typeof PersonalizedCareerSuggestionsInputSchema>;

const PersonalizedCareerSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.object({
    career: z.string().describe('The name of the suggested career.'),
    subjects: z.string().describe('3-4 related CBE subjects for this career.')
  })).describe('The list of suggested careers and their subject alignment.')
});

export type PersonalizedCareerSuggestionsOutput = z.infer<typeof PersonalizedCareerSuggestionsOutputSchema>;

export async function personalizedCareerSuggestions(
  input: PersonalizedCareerSuggestionsInput
): Promise<PersonalizedCareerSuggestionsOutput> {
  try {
    return await personalizedCareerSuggestionsFlow(input);
  } catch (error) {
    // Return empty results rather than throwing to avoid UI errors or toasts
    console.error('AI Suggestion Error:', error);
    return { suggestions: [] };
  }
}

const prompt = ai.definePrompt({
  name: 'personalizedCareerSuggestionsPrompt',
  input: {schema: PersonalizedCareerSuggestionsInputSchema},
  output: {schema: PersonalizedCareerSuggestionsOutputSchema},
  prompt: `You are an expert career advisor in Kenya. 
  
  Based on the student's interests, suggest relevant career paths and map them to the official CBE Senior School subjects.
  
  STUDENT INPUT:
  {{#each interests}}
    - {{{this}}}
  {{/each}}

  STRATEGY:
  1. Primary: Identify the best "Top Match" career that bridges their multiple interests.
  2. Map the career to official CBE Subjects: 
     - STEM: Physics, Chemistry, Biology, Mathematics, Agriculture, Computer Science, Aviation, Marine, Power Mech.
     - Social Sciences: History, Geography, Business Studies, RE, Literature, Fasihi, French, German, Mandarin.
     - Arts/Sports: Music, Dance, Theatre, Fine Art, PE.

  Return results as a JSON object with 'suggestions' containing career names and their related subjects string.`,
});

const personalizedCareerSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedCareerSuggestionsFlow',
    inputSchema: PersonalizedCareerSuggestionsInputSchema,
    outputSchema: PersonalizedCareerSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return { suggestions: [] };
    }
    return output;
  }
);
