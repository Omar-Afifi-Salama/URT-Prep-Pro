
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

const standardTextPromptTemplate = `You are an expert curriculum designer for a competitive university entrance exam, tasked with creating a high-quality practice test on the topic of {{topic}}.

Your entire response MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON.

The JSON object must have the following structure and content:
{
  "title": "string", // REQUIRED: An appropriate, non-empty, academic title for the passage.
  "passage": "string", // REQUIRED: A novel, information-dense passage of approximately {{wordLength}} words. The passage must be formal, objective, and formatted with HTML <p> tags for each paragraph (e.g., "<p>1. ...</p>"). The quality should be similar to a university textbook, using illustrative language and concrete examples to explain mechanisms and processes.
  "questions": [ // REQUIRED: An array of exactly {{numQuestions}} multiple-choice questions.
    {
      "question": "string", // REQUIRED: The question text.
      "options": ["string", "string", "string", "string"], // REQUIRED: An array of exactly 4 options.
      "answer": "string", // REQUIRED: The correct answer, which must exactly match one of the options.
      "explanationEnglish": "string", // REQUIRED: A detailed English explanation of why the correct answer is correct.
      "explanationArabic": "string", // REQUIRED: A detailed Arabic explanation of why the correct answer is correct.
      "passageContext": "string" // REQUIRED: The exact, verbatim quote from the passage that supports the answer.
    }
  ],
  "recommendedTime": "number", // REQUIRED: The recommended completion time in minutes. Calculate this using the formula: (Passage Word Count / 130) + (Number of Questions * 0.75), then round to the nearest whole number.
  "subject": "{{topic}}" // REQUIRED: Must be exactly the topic provided: "{{topic}}".
}

**Critical Rules for Questions:**
- All questions must be based *only* on the information provided in the passage.
- At least half the questions must test inference or application, not just recall.
- Incorrect options (distractors) must be plausible and target common misunderstandings.
{{topicHistoryInstruction}}
`;

const actStyleSciencePromptTemplate = `You are an expert curriculum designer creating a challenging ACT Science test passage on {{topic}}.

Your entire response MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON.

The JSON object must have the following structure and content:
{
  "title": "string", // REQUIRED: A suitable, non-empty title for the passage.
  "passage": "string", // REQUIRED: A passage of approximately {{wordLength}} words. The passage MUST include data presented in a detailed HTML table.
  "chartData": { // REQUIRED for this format.
    "type": "bar", // Must be 'bar'.
    "data": [], // An array of data objects for the chart.
    "xAxisKey": "string", // The key in the data objects for the X-axis.
    "yAxisKeys": [], // The keys in the data objects for the Y-axis.
    "yAxisLabel": "string" // A short label for the Y-axis.
  },
  "questions": [ // REQUIRED: An array of exactly {{numQuestions}} multiple-choice questions.
    {
      "question": "string", // REQUIRED: The question text. Must require interpretation of text and tables.
      "options": ["string", "string", "string", "string"], // REQUIRED: An array of exactly 4 options.
      "answer": "string", // REQUIRED: The correct answer text.
      "explanationEnglish": "string", // REQUIRED: A detailed English explanation for the correct answer.
      "explanationArabic": "string", // REQUIRED: A detailed Arabic explanation for the correct answer.
      "passageContext": "string" // REQUIRED: The verbatim quote or data from the passage that supports the answer.
    }
  ],
  "recommendedTime": "number", // REQUIRED: Recommended time in minutes. Calculate using (Word Count / 130) + (Num Questions * 0.75), rounded.
  "subject": "{{topic}}" // REQUIRED: Must be exactly "{{topic}}".
}
{{topicHistoryInstruction}}
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
          const validHistory = finalInput.topicHistory.filter(t => typeof t === 'string' && t.trim() !== '');
          if (validHistory.length > 0) {
            topicHistoryInstruction = `To ensure variety, you MUST NOT generate a passage on a topic that is the same as or semantically very similar to any of the following recently used topics: ${validHistory.join('; ')}.`;
          }
      }

      prompt = promptTemplate
          .replace(/\{\{topicHistoryInstruction\}\}/g, topicHistoryInstruction)
          .replace(/\{\{topic\}\}/g, finalInput.topic)
          .replace(/\{\{difficulty\}\}/g, finalInput.difficulty)
          .replace(/\{\{wordLength\}\}/g, String(finalInput.wordLength))
          .replace(/\{\{numQuestions\}\}/g, String(finalInput.numQuestions))
          .replace(/\{\{randomSeed\}\}/g, String(finalInput.randomSeed));
      
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
      
      let responseText = response.text();
      
      // Clean the response to remove markdown wrappers if they exist
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        responseText = jsonMatch[1];
      }

      let aiOutput;
      try {
        aiOutput = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response from AI:", jsonError);
        console.error("Raw AI response:", responseText);
        throw new Error("The AI model returned an invalid format. The raw response has been logged to the console. Please try again.");
      }
      
      // Comprehensive data normalization to handle cases where the AI returns an object instead of a string.
      if (aiOutput) {
        // Normalize top-level string fields
        if (aiOutput.title && typeof aiOutput.title === 'object') {
          aiOutput.title = String(aiOutput.title.text || JSON.stringify(aiOutput.title));
        }
        if (aiOutput.passage && typeof aiOutput.passage === 'object') {
          aiOutput.passage = String(aiOutput.passage.text || JSON.stringify(aiOutput.passage));
        }
        
        // Normalize fields within the questions array
        if (Array.isArray(aiOutput.questions)) {
          aiOutput.questions.forEach((q: any) => {
            if (q.question && typeof q.question === 'object') {
              q.question = String(q.question.text || JSON.stringify(q.question));
            }
            if (q.answer && typeof q.answer === 'object') {
              q.answer = String(q.answer.text || JSON.stringify(q.answer));
            }
            if (q.explanationEnglish && typeof q.explanationEnglish === 'object') {
              q.explanationEnglish = String(q.explanationEnglish.text || JSON.stringify(q.explanationEnglish));
            }
            if (q.explanationArabic && typeof q.explanationArabic === 'object') {
              q.explanationArabic = String(q.explanationArabic.text || JSON.stringify(q.explanationArabic));
            }
            if (q.passageContext && typeof q.passageContext === 'object') {
              q.passageContext = String(q.passageContext.text || JSON.stringify(q.passageContext));
            }
            // Normalize the options array
            if (Array.isArray(q.options)) {
              q.options = q.options.map((opt: any) => {
                if (opt && typeof opt === 'object') {
                  return String(opt.text || JSON.stringify(opt));
                }
                return String(opt); // Ensure it's a string
              });
            }
          });
        }
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
