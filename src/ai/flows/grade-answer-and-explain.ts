'use server';
/**
 * @fileOverview An AI agent for grading user answers and providing explanations in English and Arabic.
 *
 * - gradeAnswerAndExplain - A function that handles the grading and explanation process.
 * - GradeAnswerAndExplainInput - The input type for the gradeAnswerAndExplain function.
 * - GradeAnswerAndExplainOutput - The return type for the gradeAnswerAndExplain function.
 */

import {ai, getGoogleAI} from '@/ai/genkit';
import {z} from 'genkit';

const GradeAnswerAndExplainInputSchema = z.object({
  passage: z.string().describe('The passage the question is based on.'),
  question: z.string().describe('The question to be answered.'),
  answer: z.string().describe('The correct answer to the question.'),
  userAnswer: z.string().describe('The user provided answer.'),
  apiKey: z.string().optional().describe('The user provided API key for Google AI.'),
});
export type GradeAnswerAndExplainInput = z.infer<typeof GradeAnswerAndExplainInputSchema>;

const GradeAnswerAndExplainOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the user answer is correct or not.'),
  explanationEnglish: z.string().describe('The explanation of the answer in English.'),
  explanationArabic: z.string().describe('The explanation of the answer in Arabic.'),
});
export type GradeAnswerAndExplainOutput = z.infer<typeof GradeAnswerAndExplainOutputSchema>;

export async function gradeAnswerAndExplain(input: GradeAnswerAndExplainInput): Promise<GradeAnswerAndExplainOutput> {
  return gradeAnswerAndExplainFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeAnswerAndExplainPrompt',
  input: {schema: GradeAnswerAndExplainInputSchema},
  output: {schema: GradeAnswerAndExplainOutputSchema},
  prompt: `You are an expert tutor, skilled in explaining concepts clearly and concisely.

You will be given a passage, a question, the correct answer, and the user's answer.

Your task is to determine if the user's answer is correct. Then, provide explanations in both English and Arabic.

When writing explanations, if you need to include equations or chemical formulas, use HTML tags for formatting, such as <sub> for subscripts and <sup> for superscripts.

Explain why the correct answer is correct, and if the user's answer is incorrect, explain where they went wrong and what they should learn.

Passage: {{{passage}}}
Question: {{{question}}}
Correct Answer: {{{answer}}}
User Answer: {{{userAnswer}}}

Here's how you should format the response:
{
  "isCorrect": true or false,
  "explanationEnglish": "Explanation in English",
  "explanationArabic": "Explanation in Arabic"
}
`,
});

const gradeAnswerAndExplainFlow = ai.defineFlow(
  {
    name: 'gradeAnswerAndExplainFlow',
    inputSchema: GradeAnswerAndExplainInputSchema,
    outputSchema: GradeAnswerAndExplainOutputSchema,
  },
  async input => {
    const gemini = getGoogleAI(input.apiKey).model('gemini-1.5-flash');
    const {output} = await prompt(input, { model: gemini });
    return output!;
  }
);
