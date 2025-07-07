
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
  explanationEnglish: z.string().describe('A detailed explanation in English of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
  explanationArabic: z.string().describe('A detailed explanation in Arabic of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
  passageContext: z.string().describe('The exact, verbatim quote from the passage that directly supports the correct answer. This should be a short snippet. Use HTML tags for formatting if they were present in the original passage.')
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

const standardTextPromptTemplate = `You are a curriculum designer and expert in {{topic}} for a competitive university entrance exam. Your task is to generate a high-quality practice test based on the provided parameters.

**Instructions:**
1.  **Generate a Passage:** Create a novel, information-dense passage of approximately {{wordLength}} words on a specific sub-topic within '{{topic}}'. The passage must be formal, academic, and objective.
    -   The passage text MUST be formatted with HTML <p> tags, and each paragraph must be numbered (e.g., "<p>1. ...</p>").
2.  **Generate Questions:** Create exactly {{numQuestions}} multiple-choice questions based *ONLY* on the information in the passage.
    -   At least half the questions should require inference or application, not just simple recall of facts.
    -   Incorrect options (distractors) must be plausible and designed to target common misunderstandings.
3.  **Provide Explanations:** For EACH question, you are required to provide:
    -   \\\`explanationEnglish\\\`: A detailed explanation in English of why the correct answer is correct.
    -   \\\`explanationArabic\\\`: A detailed explanation in Arabic of why the correct answer is correct.
    -   \\\`passageContext\\\`: The exact, verbatim quote from the passage that directly supports the answer.
    -   These fields CANNOT be empty.
4.  **Calculate Time:** Recommend a completion time in minutes using this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number.

**Output Format:**
Your entire response MUST be a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object. The structure must conform to the following schema, and all fields are mandatory unless marked as optional.

{
  "title": "A suitable, non-empty title for the passage.",
  "passage": "The generated HTML passage content.",
  "questions": [
    {
      "question": "The question text.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text, which must exactly match one of the options.",
      "explanationEnglish": "The mandatory English explanation.",
      "explanationArabic": "The mandatory Arabic explanation.",
      "passageContext": "The mandatory supporting quote from the passage."
    }
  ],
  "recommendedTime": 10,
  "subject": "{{topic}}"
}
{{topicHistoryInstruction}}
`;

const actStyleSciencePromptTemplate = `You are an expert curriculum designer specializing in creating challenging ACT Science test passages.

**Instructions:**
1.  **Generate a Passage:** Create a passage of approximately {{wordLength}} words on a specific sub-topic within '{{topic}}'. The passage MUST include data presented in a detailed HTML table.
2.  **Generate Questions:** Create exactly {{numQuestions}} multiple-choice questions that require deep interpretation of the text and tables.
3.  **Provide Explanations:** For EACH question, you MUST provide:
    -   \\\`explanationEnglish\\\`: A detailed English explanation for the correct answer.
    -   \\\`explanationArabic\\\`: A detailed Arabic explanation for the correct answer.
    -   \\\`passageContext\\\`: The verbatim quote or data from the passage that supports the answer.
    -   These fields CANNOT be empty.
4.  **Structure Chart Data:** Provide a JSON object in the 'chartData' field that represents the data from the HTML table, suitable for rendering a bar chart.
5.  **Calculate Time:** Recommend a completion time in minutes using the formula: (Word Count / 130) + (Number of Questions * 0.75), rounded to the nearest whole number.

**Output Format:**
Your response MUST be a single, valid JSON object. Do not include any text or markdown before or after the JSON. The structure must be:
{
  "title": "A suitable title for the passage.",
  "passage": "The generated HTML passage content including the table.",
  "chartData": { "type": "bar", "data": [...], "xAxisKey": "...", "yAxisKeys": ["..."], "yAxisLabel": "..." },
  "questions": [
    {
      "question": "The question text.",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "The correct option text.",
      "explanationEnglish": "The mandatory English explanation.",
      "explanationArabic": "The mandatory Arabic explanation.",
      "passageContext": "The supporting quote/data from the passage."
    }
  ],
  "recommendedTime": 12,
  "subject": "{{topic}}"
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
          topicHistoryInstruction = `To ensure variety, you MUST NOT generate a passage on a topic that is the same as or semantically very similar to any of the following recently used topics: ${finalInput.topicHistory.join('; ')}.`;
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

    
