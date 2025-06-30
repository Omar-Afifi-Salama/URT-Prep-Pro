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
  imageUrl: z.string().describe('A URL for a relevant placeholder image.'),
  recommendedTime: z.number().describe('The recommended time in minutes to complete the test.'),
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
    questions: GenerateUrtPassageOutputSchema.shape.questions,
    recommendedTime: GenerateUrtPassageOutputSchema.shape.recommendedTime,
  })},
  prompt: `You are a senior curriculum designer for a national testing board. Your task is to write passages for the URT science exam. The tone must be formal, objective, and information-dense, completely avoiding conversational language. All facts must be presented with precision.

You will generate a URT passage with a title, and associated multiple-choice questions based on the provided parameters. The passage should be engaging, informative, and well-structured to the standards of a university entrance exam.

The passage itself should not contain the title, as it is handled by a separate 'title' field in the output.

PASSAGE FORMATTING:
- Number each paragraph, starting with 1. (e.g., "1. First paragraph text...")
- When appropriate, include data in an HTML table (e.g., <table>, <thead>, <tbody>, <tr>, <th>, <td>).
- When a table is included, refer to it in the text (e.g., "as shown in Table 1").
- Separate each paragraph with a double newline character (\\n\\n).

EQUATION FORMATTING:
- When formatting equations or chemical formulas, you MUST use HTML tags like <sub> for subscripts (e.g., H<sub>2</sub>O) and <sup> for superscripts (e.g., E=mc<sup>2</sup>). This applies to the passage, the questions, and the multiple-choice options.

SUBJECT-SPECIFIC INSTRUCTIONS:
- For science topics (Physics, Chemistry, Biology, Geology), adopt an academic and authoritative tone, similar to a reference textbook, while ensuring the content remains engaging and accessible.
- If the topic is Physics or Chemistry, you MUST include relevant equations in the passage. You must also ask at least one question that specifically requires understanding or using an equation from the passage. These equations must use the specified HTML formatting.

QUESTION FORMATTING:
- Each question must have exactly 4 options.
- The correct answer must exactly match one of the provided options.
- Any equations or formulas in the questions or options MUST use the specified HTML formatting.

TIMER:
- Calculate a recommended time limit in minutes for this test. A good rule of thumb is 1.5 minutes per question, plus 3-5 minutes for reading the passage, depending on its length and complexity. Include this in the 'recommendedTime' field.

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
    const {output: textOutput} = await textGenerationPrompt(input, { model: 'googleai/gemini-1.5-flash' });
    if (!textOutput) {
        throw new Error('Failed to generate text content.');
    }

    // Step 2: Generate a relevant image URL from Unsplash.
    const imageUrl = `https://source.unsplash.com/600x400/?${input.topic}`;

    return {
        ...textOutput,
        imageUrl,
    };
  }
);
