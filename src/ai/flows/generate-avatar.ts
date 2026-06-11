'use server';
/**
 * @fileOverview A flow that generates an AI avatar from a text prompt.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAvatarInputSchema = z.object({
  prompt: z.string().describe('A text prompt to generate the avatar.'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  avatarDataUri: z
    .string()
    .describe(
      'The generated avatar as a data URI.' 
    ),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  try {
    return await generateAvatarFlow(input);
  } catch (error: any) {
    console.error('generateAvatar server error:', error);
    throw new Error('Image generation is currently unavailable. Please try again later.');
  }
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async input => {
    try {
      const {media} = await ai.generate({
        model: 'googleai/imagen-3.0-generate-001',
        prompt: `A professional student portrait, friendly and ambitious, profile picture style. Character details: ${input.prompt}`,
      });

      if (!media || !media.url) {
        throw new Error('No image was returned by the AI model.');
      }

      return {avatarDataUri: media.url};
    } catch (err: any) {
      console.error('generateAvatarFlow internal error:', err);
      throw err;
    }
  }
);
