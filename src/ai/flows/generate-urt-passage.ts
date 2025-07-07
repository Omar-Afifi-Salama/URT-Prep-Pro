
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

const GenerateUrtPassageInputSchema = z.object({
  topic: z.string().describe('The topic to generate the URT passage and questions about (English, Physics, Chemistry, Biology, Geology).'),
  difficulty: z.string().describe('The desired difficulty of the passage and questions (e.g., "Easy", "Medium", "Hard").'),
  wordLength: z.number().describe('The approximate number of words for the passage.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  apiKey: z.string().describe('The user-provided Google AI API key.'),
  randomSeed: z.number().optional().describe('A random number to ensure prompt uniqueness.'),
  passageFormat: z.enum(['auto', 'reference', 'act']).optional().describe('The desired passage format for science topics.'),
  topicHistory: z.array(z.string()).optional().describe('A list of recently generated topics to avoid repetition.'),
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
  chartData: z.optional(ChartDataSchema).describe('Optional structured data for rendering a chart.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

const standardTextPromptTemplate = `You are a master curriculum designer and subject matter expert for a highly competitive university entrance exam, similar to the SAT or URT. Your task is to create passages that are designed to challenge top-tier students. The tone must be formal, academic, objective, and information-dense, similar to a university-level textbook or a scientific journal. Avoid any conversational language or simplification.

You MUST generate a novel passage. Do not repeat topics or questions from previous requests. To ensure the output is completely unique and does not repeat previous content, use this random number as a creative seed: {{randomSeed}}. {{topicHistoryInstruction}} You must choose a specific, narrow sub-topic within the broader topic of '{{topic}}'.

**PASSAGE REQUIREMENTS:**
1.  **Title:** Generate a suitable, non-empty title for the passage.
2.  **Length:** The passage MUST be approximately {{wordLength}} words.
3.  **Depth & Quality:** The passage must explain *how* processes work, not just *what* they are. Use illustrative language and concrete examples to clarify complex mechanisms and achieve a textbook-like quality.
4.  **Formatting:**
    - All paragraphs must be wrapped in <p> tags.
    - Number each paragraph, starting with 1. (e.g., "<p>1. The first paragraph text...</p>")
    - When appropriate for the topic (e.g., Physics, Chemistry), include relevant equations or data in a well-structured HTML table. Use <sub> and <sup> tags for formulas.

**QUESTION REQUIREMENTS:**
1.  **Count:** Generate EXACTLY {{numQuestions}} multiple-choice questions.
2.  **Quality & Validity:** All questions, options, and answers MUST be derived *directly* from the provided passage. Do not introduce external information. At least half the questions should require complex reasoning (Inference, Application, etc.), not just simple recall.
3.  **Sophisticated Distractors:** Incorrect options (distractors) MUST be plausible. They should target common misconceptions or be statements that are true but not supported by the passage, requiring careful reading to eliminate.

**EXPLANATION REQUIREMENTS (MANDATORY):**
For EACH of the {{numQuestions}} questions, you MUST provide the following. These fields CANNOT be empty.
1.  **English Explanation:** A thorough explanation detailing only why the correct answer is right by citing the passage.
2.  **Arabic Explanation:** A thorough explanation in Arabic doing the same.
3.  **Passage Context:** The exact, verbatim quote from the passage that directly supports the correct answer. This should be a short snippet.

**TIMER:**
- Calculate a recommended time limit in minutes using this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number.

Topic: {{topic}}
Difficulty: {{difficulty}}

**OUTPUT FORMAT:**
IMPORTANT: You must format your response as a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.
`;

const actStyleSciencePromptTemplate = `You are an expert curriculum designer specializing in creating challenging ACT Science test passages. Your task is to generate a passage in one of two formats: "Research Summaries" or "Conflicting Viewpoints". The tone should be objective, dense, and data-focused.

You MUST generate a novel passage. Do not repeat topics or questions from previous requests. To ensure the output is completely unique and does not repeat previous content, use this random number as a creative seed: {{randomSeed}}. {{topicHistoryInstruction}} You must choose a specific, narrow sub-topic within the broader topic provided.

YOUR TASK - FOLLOW THESE RULES EXACTLY:
1.  Generate a passage with a suitable, non-empty title. The passage MUST be approximately {{wordLength}} words and MUST include data presented in a detailed HTML table.
2.  Generate EXACTLY {{numQuestions}} multiple-choice questions that require deep interpretation of the text and tables. Avoid simple fact recall. Distractors must be plausible.
3.  Provide a structured JSON object in the 'chartData' field that represents the data from the table, suitable for rendering a bar chart.
4.  For EACH question, you MUST generate the following. These fields CANNOT be empty:
    a.  An English explanation detailing only why the correct answer is right by citing the passage/table.
    b.  An Arabic explanation doing the same.
    c.  In the 'passageContext' field, the exact, verbatim quote from the passage or table that supports the correct answer.

FORMATTING:
- Use standard HTML tags for tables and text formatting (<sub>, <sup>).

TIMER:
- Calculate a recommended time limit in minutes using this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number.

Topic: {{topic}}
Difficulty: {{difficulty}}

IMPORTANT: You must format your response as a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
          shouldUseActStyle = Math.random() < 0.25;
        }
      }
      
      let prompt;
      let promptTemplate;

      if (shouldUseActStyle) {
          promptTemplate = actStyleSciencePromptTemplate;
      } else {
          promptTemplate = standardTextPromptTemplate;
      }
      
      const finalInput = { ...validatedInput, randomSeed: Math.random() };
      
      let topicHistoryInstruction = "";
      if (finalInput.topicHistory && finalInput.topicHistory.length > 0) {
          topicHistoryInstruction = `To ensure variety, you MUST NOT generate a passage on a topic that is the same as or semantically very similar to any of the following recently used topics: ${finalInput.topicHistory.join('; ')}.`;
      }

      prompt = promptTemplate
          .replace('{{topicHistoryInstruction}}', topicHistoryInstruction)
          .replace('{{topic}}', finalInput.topic)
          .replace('{{difficulty}}', finalInput.difficulty)
          .replace(new RegExp('{{wordLength}}', 'g'), String(finalInput.wordLength))
          .replace(new RegExp('{{numQuestions}}', 'g'), String(finalInput.numQuestions))
          .replace('{{randomSeed}}', String(finalInput.randomSeed));
      
      const modelConfig = {
          model: "gemini-1.5-flash-latest",
          generationConfig: {
              responseMimeType: "application/json",
          },
      };
      
      const model = genAI.getGenerativeModel({
          ...modelConfig,
          safetySettings: [
              { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
              { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          ]
      });
      
      const generationResult = await model.generateContent(prompt);
      const response = generationResult.response;

      if (!response || !response.candidates || response.candidates.length === 0 || !response.text()) {
        console.error("AI Generation Error: No response, candidates, or text returned.", response?.promptFeedback);
        const blockReason = response?.promptFeedback?.blockReason;
        if (blockReason) {
            throw new Error(`Generation blocked by safety settings: ${blockReason}. Please adjust the prompt or topic.`);
        }
        throw new Error('The AI model returned an empty or incomplete response. Please try again.');
      }
      
      const responseText = response.text();
      let aiOutput;
      try {
        aiOutput = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response from AI:", jsonError);
        console.error("Raw AI response:", responseText);
        throw new Error("The AI model returned an invalid format. The raw response has been logged to the console. Please try again.");
      }
      
      // Data normalization before validation. This prevents crashes if the AI returns an object instead of a string for certain fields.
      if (aiOutput && Array.isArray(aiOutput.questions)) {
          aiOutput.questions.forEach((q: any) => {
              if (q.explanationEnglish && typeof q.explanationEnglish === 'object') {
                  q.explanationEnglish = String(q.explanationEnglish.text || JSON.stringify(q.explanationEnglish));
              }
              if (q.explanationArabic && typeof q.explanationArabic === 'object') {
                  q.explanationArabic = String(q.explanationArabic.text || JSON.stringify(q.explanationArabic));
              }
              if (q.passageContext && typeof q.passageContext === 'object') {
                  q.passageContext = String(q.passageContext.text || JSON.stringify(q.passageContext));
              }
          });
      }

      const usage = await model.countTokens(prompt);
      
      if (aiOutput && aiOutput.chartData && typeof aiOutput.chartData.data === 'string') {
        try {
          const parsedData = JSON.parse(aiOutput.chartData.data);
          aiOutput.chartData.data = parsedData;
        } catch (e) {
          console.error("Failed to parse chartData JSON from AI", e);
          aiOutput.chartData = undefined;
        }
      }

      if (!aiOutput) {
          throw new Error('Failed to generate text content.');
      }
      
      const imageUrl = `https://placehold.co/600x400.png`;

      const finalOutput = {
          ...aiOutput,
          imageUrl,
          tokenUsage: usage?.totalTokens,
          subject: validatedInput.topic, // Always return the original subject for categorization
      };
      
      // Final validation to ensure the entire object matches the expected schema before returning
      return GenerateUrtPassageOutputSchema.parse(finalOutput);

    } catch (e: any) {
        if (e instanceof z.ZodError) {
            console.error("Zod validation failed:", e.errors);
            throw new Error(`AI response failed validation. One or more required fields were missing or empty. Details: ${e.errors.map(err => err.message).join(', ')}`);
        }
        if (e.message && (e.message.includes('API key not valid') || e.message.includes('400'))) {
            throw new Error('Your API Key is not valid. Please check it on the API Key page and try again.');
        }
        if (e.message && e.message.includes('429')) {
            throw new Error('API rate limit exceeded (requests per minute). Please wait a moment before generating more passages.');
        }
        if (e.message && e.message.includes('resource has been exhausted')) {
            throw new Error('You have likely exceeded the daily quota for the Google AI free tier. Please check your account status or try again tomorrow.');
        }
        // Re-throw specific errors from the try block
        if (e.message.startsWith('Generation blocked') || e.message.startsWith('The AI model')) {
            throw e;
        }
        console.error("Error in generateUrtPassage:", e);
        throw new Error('An unexpected error occurred while generating the passage.');
    }
}
