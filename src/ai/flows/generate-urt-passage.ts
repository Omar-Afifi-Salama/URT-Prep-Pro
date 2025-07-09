
'use server';
/**
 * @fileOverview A URT passage and question generator AI agent.
 *
 * - generateUrtPassage - A function that handles the URT passage generation process.
 * - GenerateUrtPassageInput - The input type for the generateUrtPassage function.
 * - GenerateUrtPassageOutput - The return type for the generateUrtPassage function.
 */

import { z } from 'zod';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { zodToJsonSchema } from 'zod-to-json-schema';

const GenerateUrtPassageInputSchema = z.object({
  topic: z.string().describe('The topic to generate the URT passage and questions about (English, Physics, Chemistry, Biology, Geology).'),
  difficulty: z.string().describe('The desired difficulty of the passage and questions (e.g., "Easy", "Medium", "Hard").'),
  wordLength: z.number().describe('The approximate number of words for the passage.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  apiKey: z.string().describe('The user-provided Google AI API key.'),
  passageFormat: z.enum(['auto', 'reference', 'act']).optional().describe('The desired passage format for science topics.'),
});
export type GenerateUrtPassageInput = z.infer<typeof GenerateUrtPassageInputSchema>;

const QuestionSchema = z.object({
  question: z.string().min(1, "Question text cannot be empty.").describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple choice options.'),
  answer: z.string().min(1, "Answer cannot be empty.").describe('The correct answer, which must be one of the provided options.'),
  explanationEnglish: z.string().min(1, "English explanation cannot be empty.").describe('A detailed explanation in English of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
  explanationArabic: z.string().min(1, "Arabic explanation cannot be empty.").describe('A detailed explanation in Arabic of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
  passageContext: z.string().min(1, "Passage context cannot be empty.").describe('The exact, verbatim quote from the passage that directly supports the correct answer. This should be a short snippet. Use HTML tags for formatting if they were present in the original passage.')
});

const ChartDataSchema = z.object({
    type: z.string().describe("The type of chart to render. Must be 'bar'."),
    data: z.array(z.record(z.any())).describe('An array of data objects for the chart.'),
    xAxisKey: z.string().describe('The key in the data objects to use for the X-axis.'),
    yAxisKeys: z.array(z.string()).describe('The keys in the data objects to use for the Y-axis. Can contain multiple keys for grouped bar charts.'),
    yAxisLabel: z.string().describe('A short label for the Y-axis (e.g., "Temperature (°C)").'),
});

const GenerateUrtPassageOutputSchema = z.object({
  title: z.string().min(1, "Title cannot be empty.").describe('An appropriate title for the passage.'),
  passage: z.string().min(1, "Passage cannot be empty.").describe('The generated URT passage, formatted with HTML tags.'),
  questions: z.array(QuestionSchema).describe('The generated multiple-choice questions associated with the passage.'),
  imageUrl: z.string().optional(),
  recommendedTime: z.number().describe('The recommended time in minutes to complete the test.'),
  tokenUsage: z.number().optional().describe('The number of tokens used for generation.'),
  subject: z.string().describe('The subject of the passage.'),
  chartData: z.optional(ChartDataSchema).nullable().describe('Optional structured data for rendering a chart.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

export async function generateUrtPassage(input: GenerateUrtPassageInput): Promise<GenerateUrtPassageOutput> {
    const validatedInput = GenerateUrtPassageInputSchema.parse(input);

    if (!validatedInput.apiKey) {
      throw new Error('API Key is required for AI generation.');
    }

    try {
      const genAI = new GoogleGenerativeAI(validatedInput.apiKey);
      const scienceSubjects = ["Physics", "Chemistry", "Biology", "Geology"];
      const isScience = scienceSubjects.includes(validatedInput.topic);
      
      let shouldUseActStyle = false;
      if (isScience) {
        if (validatedInput.passageFormat === 'act') {
          shouldUseActStyle = true;
        } else if (validatedInput.passageFormat === 'reference') {
          shouldUseActStyle = false;
        } else { // 'auto' or undefined
          shouldUseActStyle = Math.random() < 0.5;
        }
      }
      
      const reference_style_prompt = `You are an expert curriculum designer specializing in creating publication-quality educational content, similar to a university textbook. Your task is to generate a URT practice set on the topic of "${validatedInput.topic}".

Your response MUST adhere to the following strict quality standards:

1.  **Title:** The title must be specific, descriptive, and engaging (e.g., "The Role of Mitochondria in Cellular Energy Production," not "Biology Passage").
2.  **Passage Content & Quality:**
    *   The passage should be approximately ${validatedInput.wordLength} words.
    *   It must be information-dense, formal, and written at a university-level.
    *   **Crucially, the passage must be formatted into multiple paragraphs using HTML <p> tags for structure and readability.** A single block of text is unacceptable.
    *   For science topics, it is REQUIRED to include illustrative data, such as a summary table in an HTML '<table>', a chemical equation using '<sub>' and '<sup>' tags, or a detailed description of a scientific figure.
3.  **Question Quality:**
    *   Generate ${validatedInput.numQuestions} questions.
    *   The questions MUST test comprehension, analysis, and data interpretation, not just simple recall. They should require critical thinking.
    *   All questions must be answerable SOLELY from the text and data provided.
4.  **Explanations & Context:**
    *   Provide detailed \`explanationEnglish\` and \`explanationArabic\` for why the correct answer is correct.
    *   Provide a \`passageContext\` quote that directly supports the answer.
5.  **Calculated Time:** The \`recommendedTime\` must be calculated as (Word Count / 130) + (Questions * 0.75), rounded to the nearest integer.

Your output MUST be a single, valid JSON object that strictly adheres to the schema. Do not include any markdown formatting like \`\`\`json.`;
      
      const act_style_prompt = `You are an expert curriculum designer specializing in creating ACT Science-style practice tests. Your task is to generate a URT practice set on the topic of "${validatedInput.topic}".

Your response MUST adhere to the following strict quality standards:

1.  **Title:** The title must be specific and descriptive, reflecting the scientific study presented (e.g., "An Experiment on Enzyme Inhibition," not "Science Test").
2.  **Passage Content & Quality:**
    *   The passage should be approximately ${validatedInput.wordLength} words.
    *   It MUST be an ACT Science style passage, presenting one or more studies with an introduction and experimental results.
    *   **The passage MUST include a detailed data table using a proper HTML \`<table>\` tag.**
    *   The passage MUST be formatted into multiple paragraphs using HTML \`<p>\` tags.
3.  **Chart Data:** You MUST provide structured data for a bar chart in the \`chartData\` field that visualizes the data from the passage's table.
4.  **Question Quality:**
    *   Generate ${validatedInput.numQuestions} questions.
    *   The questions MUST test data interpretation, analysis of experimental design, and the ability to draw conclusions from the provided text and data. Avoid simple recall questions.
    *   All questions must be answerable SOLELY from the passage, table, and chart data.
5.  **Explanations & Context:**
    *   Provide detailed \`explanationEnglish\` and \`explanationArabic\` for why the correct answer is correct.
    *   Provide a \`passageContext\` quote that directly supports the answer.
6.  **Calculated Time:** The \`recommendedTime\` must be calculated as (Word Count / 130) + (Questions * 0.75), rounded to the nearest integer.

Your output MUST be a single, valid JSON object that strictly adheres to the schema. Do not include any markdown formatting like \`\`\`json.`;

      const promptToUse = shouldUseActStyle ? act_style_prompt : reference_style_prompt;
      
      const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash-latest",
          safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ],
          systemInstruction: promptToUse,
          generationConfig: {
            responseMimeType: "application/json",
          }
      });
      
      const generationResult = await model.generateContent("Generate the URT practice set now.");
      
      const response = generationResult.response;

      if (response?.promptFeedback?.blockReason) {
        throw new Error(`Generation blocked by safety settings: ${response.promptFeedback.blockReason}. Please adjust the prompt or topic.`);
      }

      const responseText = response.text();
      let aiOutput;
      
      try {
          aiOutput = JSON.parse(responseText);
      } catch (e) {
          console.error("AI Generation Error: Failed to parse JSON response.", responseText);
          throw new Error('The AI model returned an invalid JSON format. The raw response has been logged to the console. Please try again.');
      }

      if (!aiOutput) {
          throw new Error('The AI model returned an empty response.');
      }
      
      const usage = await model.countTokens(promptToUse);
      
      const imageUrl = `https://placehold.co/600x400.png`;

      const finalOutput = {
          ...aiOutput,
          imageUrl,
          tokenUsage: usage?.totalTokens,
      };
      
      return GenerateUrtPassageOutputSchema.parse(finalOutput);

    } catch (e: any) {
        console.error("Error in generateUrtPassage:", e);

        if (e instanceof z.ZodError) {
            console.error("Zod validation failed:", e.errors);
            throw new Error(`AI response failed validation. Details: ${e.errors.map(err => `'${err.path.join('.')}' ${err.message}`).join(', ')}`);
        }
        
        const errorMessage = e.message || 'An unknown error occurred.';

        if (errorMessage.includes('API key not valid') || errorMessage.includes('400')) {
            throw new Error('Your API Key is not valid. Please check it on the API Key page and try again.');
        }
        if (errorMessage.includes('429')) {
            throw new Error('API rate limit exceeded. Please wait a moment before generating more passages.');
        }
        if (errorMessage.includes('resource has been exhausted')) {
            throw new Error('You have likely exceeded the daily quota for the Google AI free tier.');
        }
        if (errorMessage.includes('503') || errorMessage.toLowerCase().includes('overloaded')) {
            throw new Error('The AI model is currently experiencing high demand and is temporarily unavailable. Please try again in a few moments.');
        }

        throw new Error(errorMessage);
    }
}
