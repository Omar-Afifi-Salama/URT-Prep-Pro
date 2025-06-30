// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A URT passage and question generator AI agent.
 *
 * - generateUrtPassage - A function that handles the URT passage generation process.
 * - GenerateUrtPassageInput - The input type for the generateUrtPassage function.
 * - GenerateUrtPassageOutput - The return type for the generateUrtPassage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUrtPassageInputSchema = z.object({
  topic: z.string().describe('The topic to generate the URT passage and questions about (English, Physics, Chemistry, Biology, Geology).'),
});
export type GenerateUrtPassageInput = z.infer<typeof GenerateUrtPassageInputSchema>;

const GenerateUrtPassageOutputSchema = z.object({
  passage: z.string().describe('The generated URT passage.'),
  questions: z.array(z.string()).describe('The generated multiple-choice questions associated with the passage.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

export async function generateUrtPassage(input: GenerateUrtPassageInput): Promise<GenerateUrtPassageOutput> {
  return generateUrtPassageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUrtPassagePrompt',
  input: {schema: GenerateUrtPassageInputSchema},
  output: {schema: GenerateUrtPassageOutputSchema},
  prompt: `You are an expert URT passage and question generator.

You will generate a URT passage and associated multiple-choice questions on the given topic.

Topic: {{{topic}}}

Passage:
{{passage}}

Questions:
{{#each questions}}- {{{this}}}\n{{/each}}`,
});

const generateUrtPassageFlow = ai.defineFlow(
  {
    name: 'generateUrtPassageFlow',
    inputSchema: GenerateUrtPassageInputSchema,
    outputSchema: GenerateUrtPassageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
