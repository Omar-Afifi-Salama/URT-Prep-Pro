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
  difficulty: z.string().describe('The desired difficulty of the passage and questions (e.g., "Easy", "Medium", "Hard").'),
  wordLength: z.number().describe('The approximate number of words for the passage.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateUrtPassageInput = z.infer<typeof GenerateUrtPassageInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple choice options.'),
  answer: z.string().describe('The correct answer, which must be one of the provided options.'),
});

const GenerateUrtPassageOutputSchema = z.object({
  title: z.string().describe('An appropriate title for the passage.'),
  passage: z.string().describe('The generated URT passage.'),
  questions: z.array(QuestionSchema).describe('The generated multiple-choice questions associated with the passage.'),
  imageUrl: z.string().describe('A URL for a relevant image from Unsplash.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

export async function generateUrtPassage(input: GenerateUrtPassageInput): Promise<GenerateUrtPassageOutput> {
  return generateUrtPassageFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'generateUrtPassageTextPrompt',
  input: {schema: GenerateUrtPassageInputSchema},
  output: {schema: z.object({
    title: GenerateUrtPassageOutputSchema.shape.title,
    passage: GenerateUrtPassageOutputSchema.shape.passage,
    questions: GenerateUrtPassageOutputSchema.shape.questions
  })},
  prompt: `You are an expert URT passage and question generator.

You will generate a URT passage with a title, and associated multiple-choice questions based on the provided parameters. The passage should be engaging, informative, and well-structured with multiple paragraphs. Separate each paragraph with a double newline character (\\n\\n).

If the topic is Physics or Chemistry, you MUST include relevant equations in the passage (e.g., F=ma, E=mc^2 for Physics; chemical formulas like H₂O or reaction equations for Chemistry). You must also ask at least one question that specifically requires understanding or using an equation from the passage.

Each question must have exactly 4 options, and you must specify the correct answer, which must exactly match one of the provided options.

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Approximate Word Count: {{{wordLength}}}
Number of Questions: {{{numQuestions}}}
`,
});

const generateUrtPassageFlow = ai.defineFlow(
  {
    name: 'generateUrtPassageFlow',
    inputSchema: GenerateUrtPassageInputSchema,
    outputSchema: GenerateUrtPassageOutputSchema,
  },
  async input => {
    // Step 1: Generate passage and questions
    const {output: textOutput} = await textGenerationPrompt(input);
    if (!textOutput) {
        throw new Error('Failed to generate text content.');
    }

    // Step 2: Generate a relevant image URL from Unsplash Source.
    const imageUrl = `https://source.unsplash.com/600x400/?${input.topic}`;

    return {
        ...textOutput,
        imageUrl,
    };
  }
);
