'use server';
/**
 * @fileOverview A flow to generate creative stories based on a text prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  prompt: z.string().describe('The prompt for generating the story.')
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  story: z.string().describe('The generated story text.')
});
export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<string> {
  try {
    const result = await generateStoryFlow(input);
    return result.story;
  } catch (error) {
    console.error('generateStory server error:', error);
    throw new Error('AI was unable to generate a story. Please try a more specific prompt.');
  }
}

const generateStoryPrompt = ai.definePrompt({
  name: 'generateStoryPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `You are a professional creative writer for Kenyan students. 

Context: {{{prompt}}}

Generate a short (max 300 words), inspiring story about a student from Kenya who overcomes obstacles to succeed in a specific career path. Use optimistic, educational, and culturally relevant language.

Return the result as a JSON object with a 'story' field.`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await generateStoryPrompt(input);
    if (!output) throw new Error('AI failed to generate a story response.');
    return output;
  }
);
