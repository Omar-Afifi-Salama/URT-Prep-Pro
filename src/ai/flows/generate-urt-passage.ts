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

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple choice options.'),
  answer: z.string().describe('The correct answer, which must be one of the provided options.'),
});

const GenerateUrtPassageOutputSchema = z.object({
  passage: z.string().describe('The generated URT passage of at least 300 words.'),
  questions: z.array(QuestionSchema).describe('The generated multiple-choice questions associated with the passage.'),
  imageUrl: z.string().describe('A data URI of a relevant image or graph for the passage.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

export async function generateUrtPassage(input: GenerateUrtPassageInput): Promise<GenerateUrtPassageOutput> {
  return generateUrtPassageFlow(input);
}

const textGenerationPrompt = ai.definePrompt({
  name: 'generateUrtPassageTextPrompt',
  input: {schema: GenerateUrtPassageInputSchema},
  output: {schema: z.object({
    passage: GenerateUrtPassageOutputSchema.shape.passage,
    questions: GenerateUrtPassageOutputSchema.shape.questions
  })},
  prompt: `You are an expert URT passage and question generator.

You will generate a URT passage of at least 300 words and associated multiple-choice questions on the given topic. The passage should be engaging and informative.

The number of questions depends on the topic:
- If the topic is "English", generate 10 questions.
- If the topic is "Physics", "Chemistry", "Biology", or "Geology", generate 6 questions.

Each question must have exactly 4 options, and you must specify the correct answer, which must exactly match one of the provided options.

Topic: {{{topic}}}
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

    // Step 2: Generate an image based on the passage
    const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: `Generate a visually appealing and relevant image or graph for the following educational passage about ${input.topic}. The image should be helpful for understanding the text, like a diagram, chart, or illustration. Passage: ${textOutput.passage.substring(0, 800)}`,
        config: {
            responseModalities: ['TEXT', 'IMAGE'],
        },
    });

    const imageUrl = media?.url || 'https://placehold.co/600x400.png';

    return {
        ...textOutput,
        imageUrl,
    };
  }
);
