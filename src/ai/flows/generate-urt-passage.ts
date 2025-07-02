
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
  randomSeed: z.number().optional().describe('A random number to ensure prompt uniqueness.'),
});
export type GenerateUrtPassageInput = z.infer<typeof GenerateUrtPassageInputSchema>;

const QuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple choice options.'),
  answer: z.string().describe('The correct answer, which must be one of the provided options.'),
  explanationEnglish: z.string().describe('A detailed explanation in English of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
  explanationArabic: z.string().describe('A detailed explanation in Arabic of why the correct answer is correct. Use HTML tags for formatting if necessary (e.g., <sub>, <sup>).'),
});

const ChartDataSchema = z.object({
    type: z.string().describe("The type of chart to render. Must be 'bar'."),
    data: z.array(z.record(z.any())).describe('An array of data objects for the chart.'),
    xAxisKey: z.string().describe('The key in the data objects to use for the X-axis.'),
    yAxisKey: z.string().describe('The key in the data objects to use for the Y-axis.'),
    yAxisLabel: z.string().describe('A short label for the Y-axis (e.g., "Temperature (°C)").'),
});

const GenerateUrtPassageOutputSchema = z.object({
  title: z.string().describe('An appropriate title for the passage.'),
  passage: z.string().describe('The generated URT passage.'),
  questions: z.array(QuestionSchema).describe('The generated multiple-choice questions associated with the passage.'),
  imageUrl: z.string().describe('A URL for a relevant placeholder image.'),
  recommendedTime: z.number().describe('The recommended time in minutes to complete the test.'),
  tokenUsage: z.number().optional().describe('The number of tokens used for generation.'),
  subject: z.string().describe('The subject of the passage.'),
  chartData: z.optional(ChartDataSchema).describe('Optional structured data for rendering a chart.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

export async function generateUrtPassage(input: GenerateUrtPassageInput): Promise<GenerateUrtPassageOutput> {
  return generateUrtPassageFlow(input);
}

// AI-specific output schema where chartData.data is a string
const ActStyleAiOutputSchema = GenerateUrtPassageOutputSchema
  .omit({ imageUrl: true, tokenUsage: true, subject: true, chartData: true })
  .extend({
      chartData: z.optional(ChartDataSchema.omit({ data: true }).extend({
          data: z.string().describe('A JSON string representing an array of data objects for the chart. This MUST be a valid, minified JSON array string.'),
      })),
  });

const standardTextGenerationPrompt = ai.definePrompt({
  name: 'standardUrtPassageTextPrompt',
  input: {schema: GenerateUrtPassageInputSchema},
  // Omit chartData entirely for this prompt to avoid schema validation issues
  output: {schema: GenerateUrtPassageOutputSchema.omit({ imageUrl: true, tokenUsage: true, subject: true, chartData: true })},
  prompt: `You are a master curriculum designer and subject matter expert for a highly competitive university entrance exam. Your task is to create passages that are designed to challenge top-tier students. The tone must be formal, academic, objective, and information-dense, similar to a university-level textbook or scientific journal. Avoid any conversational language or simplification. All facts, data, and theories must be presented with utmost precision and complexity appropriate for the difficulty level.

You will generate a URT passage with a title, and associated multiple-choice questions based on the provided parameters. The passage should be engaging, informative, and well-structured to the standards of a university entrance exam. For "Hard" difficulty, the passage should involve multiple complex, interrelated concepts, require a high level of critical reading, and use advanced, domain-specific vocabulary.

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

QUESTION AND EXPLANATION FORMATTING:
- Each question must have exactly 4 options.
- The correct answer must exactly match one of the provided options.
- For EACH question, you MUST provide a detailed explanation in both English and Arabic. The explanation should clarify why the correct answer is correct and why the other options are incorrect. Store these in the 'explanationEnglish' and 'explanationArabic' fields respectively. This is a mandatory part of the output for every question.
- Any equations or formulas in the questions, options, or explanations MUST use the specified HTML formatting.

TIMER:
- Calculate a recommended time limit in minutes for this test. Use this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number. For a 600-word passage with 10 questions, this should be around 10 minutes.
- Include this in the 'recommendedTime' field.

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Approximate Word Count: {{{wordLength}}}
Number of Questions: {{{numQuestions}}}
Uniqueness Seed: {{{randomSeed}}} (A random number to ensure the generated content is unique. Do not mention this in your output.)

IMPORTANT: You must format your response as a single, valid JSON object that adheres to the requested output schema. Do not include any text or markdown formatting before or after the JSON object.
`,
});

const actStyleSciencePrompt = ai.definePrompt({
  name: 'actStyleSciencePassagePrompt',
  input: {schema: GenerateUrtPassageInputSchema},
  output: {schema: ActStyleAiOutputSchema},
  prompt: `You are an expert curriculum designer specializing in creating ACT Science test passages. Your task is to generate a passage in one of two formats: "Research Summaries" (describing 2-3 complex experiments) or "Conflicting Viewpoints" (presenting nuanced hypotheses from Scientist 1 and Scientist 2). The tone should be objective, dense, and data-focused. The passage must be information-rich and at least 600 words long to provide sufficient depth.

The passage MUST include data presented in a detailed HTML table (e.g., <table>, <thead>, <tbody>, <tr>, <th>, <td>). The table should contain multiple variables and trials. You must refer to the table in the text (e.g., "as shown in Table 1").

Crucially, you MUST also provide a structured JSON object in the 'chartData' field that represents a subset of the table's data, suitable for rendering a simple bar chart. The data should be complex enough to support multiple questions.
- 'type' must be 'bar'.
- 'data' must be a JSON-formatted string representing the array of objects from the table. For example: '[{"trial":1,"resultA":15,"resultB":18},{"trial":2,"resultA":25,"resultB":29}]'.
- 'xAxisKey' must be the name of the property to use for the X-axis (e.g., 'substance' or 'trialNumber').
- 'yAxisKey' must be the name of the property for the Y-axis (must be a numerical value).
- 'yAxisLabel' must be a short string describing the Y-axis unit (e.g., 'pH Level' or 'Temperature (°C)').

EQUATION FORMATTING:
- When formatting equations or chemical formulas, you MUST use HTML tags like <sub> for subscripts (e.g., H<sub>2</sub>O) and <sup> for superscripts (e.g., E=mc<sup>2</sup>). This applies to the passage, the questions, and the multiple-choice options.

QUESTION AND EXPLANATION FORMATTING:
- Generate questions that require deep interpretation of the text, tables, and the relationship between hypotheses and data. Avoid simple fact recall. Questions should test analytical skills like interpolation, extrapolation, and synthesis of information from different parts of the passage.
- Each question must have exactly 4 options.
- The correct answer must exactly match one of the provided options.
- For EACH question, you MUST provide a detailed explanation in both English and Arabic. The explanation should clarify why the correct answer is correct and why the other options are incorrect, referencing the passage, tables, or charts as needed. Store these in the 'explanationEnglish' and 'explanationArabic' fields respectively. This is a mandatory part of the output for every question.

TIMER:
- Calculate a recommended time limit in minutes for this test. Use this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number. For a 600-word passage with 10 questions, this should be around 10 minutes.
- Include this in the 'recommendedTime' field.

Topic: {{{topic}}}
Difficulty: {{{difficulty}}}
Approximate Word Count: {{{wordLength}}}
Number of Questions: {{{numQuestions}}}
Uniqueness Seed: {{{randomSeed}}} (A random number to ensure the generated content is unique. Do not mention this in your output.)

IMPORTANT: You must format your response as a single, valid JSON object that adheres to the requested output schema. Do not include any text or markdown formatting before or after the JSON object.
`,
});

const generateUrtPassageFlow = ai.defineFlow(
  {
    name: 'generateUrtPassageFlow',
    inputSchema: GenerateUrtPassageInputSchema,
    outputSchema: GenerateUrtPassageOutputSchema,
  },
  async (input): Promise<GenerateUrtPassageOutput> => {
    try {
      const scienceSubjects = ["Physics", "Chemistry", "Biology", "Geology"];
      const isScience = scienceSubjects.includes(input.topic);
      const shouldUseActStyle = isScience && Math.random() < 0.3;

      const finalInput = { ...input, randomSeed: Math.random() };

      let textOutput: any;
      let usage;

      if (shouldUseActStyle) {
        const {output: aiOutput, usage: actUsage} = await actStyleSciencePrompt(finalInput, { model: 'googleai/gemini-1.5-flash-latest' });
        textOutput = aiOutput;
        usage = actUsage;
        
        if (textOutput && textOutput.chartData && typeof textOutput.chartData.data === 'string') {
          try {
            const parsedData = JSON.parse(textOutput.chartData.data);
            // Mutate the object to match the final schema the app expects
            textOutput.chartData.data = parsedData;
          } catch (e) {
            console.error("Failed to parse chartData JSON from AI", e);
            textOutput.chartData = undefined; // Drop chartData if parsing fails
          }
        }

      } else {
        ({output: textOutput, usage} = await standardTextGenerationPrompt(finalInput, { model: 'googleai/gemini-1.5-flash-latest' }));
      }

      if (!textOutput) {
          throw new Error('Failed to generate text content.');
      }
      
      const imageUrl = `https://placehold.co/600x400.png`;

      return {
          ...textOutput,
          imageUrl,
          tokenUsage: usage?.totalTokens,
          subject: input.topic,
      };
    } catch (e: any) {
        if (e.message && e.message.includes('429')) {
            throw new Error('You have exceeded the daily request limit for the Google AI free tier. Please enable billing on your Google Cloud project or try again tomorrow.');
        }
        // Re-throw other errors
        throw e;
    }
  }
);
