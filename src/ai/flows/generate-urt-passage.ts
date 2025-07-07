
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
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).length(4).describe('An array of 4 multiple choice options.'),
  answer: z.string().describe('The correct answer, which must be one of the provided options.'),
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
  title: z.string().describe('An appropriate title for the passage.'),
  passage: z.string().describe('The generated URT passage, formatted with HTML tags.'),
  questions: z.array(QuestionSchema).describe('The generated multiple-choice questions associated with the passage.'),
  imageUrl: z.string().describe('A URL for a relevant placeholder image.'),
  recommendedTime: z.number().describe('The recommended time in minutes to complete the test.'),
  tokenUsage: z.number().optional().describe('The number of tokens used for generation.'),
  subject: z.string().describe('The subject of the passage.'),
  chartData: z.optional(ChartDataSchema).describe('Optional structured data for rendering a chart.'),
});
export type GenerateUrtPassageOutput = z.infer<typeof GenerateUrtPassageOutputSchema>;

const selectBiologyTopicPrompt = `You are an expert in university entrance exam (URT) biology curriculum. Your role is to suggest a single, specific, and challenging topic for a biology reading comprehension passage, suitable for a rigorous exam for high-achieving high school students.

The topic must be complex enough to sustain a 450-550 word textbook-level explanation, requiring detailed scientific vocabulary and concepts. Focus on core areas of biology and ensure a diverse range of topics spanning molecular biology, cell biology, genetics, ecology, evolution, human physiology, and plant biology. Prioritize topics that allow for the exploration of processes, mechanisms, and interactions, not just static definitions.

Examples of suitable topics (to guide the model on specificity and complexity):
- "The intricate processes of cellular respiration in eukaryotes, including glycolysis, the Krebs cycle, and oxidative phosphorylation."
- "The molecular mechanisms of DNA replication and repair, detailing enzymes involved and error correction."
- "The role of gene expression and regulation in cellular differentiation and development."
- "Evolutionary adaptations of extremophiles to harsh environments (e.g., thermophiles, halophiles)."
- "The human immune system's adaptive response to viral infections, distinguishing between humoral and cell-mediated immunity."
- "Principles of Mendelian genetics and the complexities of non-Mendelian inheritance patterns (e.g., incomplete dominance, codominance, polygenic inheritance)."
- "Photosynthesis: light-dependent reactions, Calvin cycle, and adaptations in C4/CAM plants."
- "Neurotransmission: synaptic signaling, excitatory and inhibitory postsynaptic potentials, and neurotransmitter types."
- "Hormonal regulation of human physiological processes (e.g., blood glucose, stress response)."

Avoid overly broad or simplistic topics like 'Plants,' 'Animals,' or 'Cells.' Be precise and academic.

Provide only the topic title as plain text, nothing else.`;

const biologyContentGenerationPromptTemplate = `You are a senior editor for a university-level biology textbook (e.g., *Campbell Biology*). Your task is to create a rigorous reading comprehension passage and a set of multiple-choice questions on the following specific academic topic: "{{topic}}". Maintain a formal, objective, and analytical tone. Avoid colloquialisms and generic filler phrases.

**PASSAGE REQUIREMENTS:**
*   **Content Depth & Mechanism Focus:** The passage must delve into the topic with significant detail, prioritizing the explanation of *how* processes work, not just *what* they are. Explain complex molecular mechanisms and signaling pathways thoroughly.
*   **Specificity and Elucidation:** To add depth, you must name specific key proteins, enzymes, or molecules where appropriate (e.g., mentioning "CaMKII" when discussing LTP-related kinases). If you introduce a related high-level concept (like "epigenetic modifications"), you must briefly explain its specific, direct role in the context of the main topic.
*   **Illustrative Quality:** To achieve a textbook-like quality, go beyond simply listing facts. Use clear, illustrative language and concrete examples to build deep understanding.
*   **Inferential Potential:** The passage must contain information that allows a student to make logical inferences. The relationships between concepts should be multi-layered.
*   **Technical Details:** The passage must be **450-550 words** long, structured into **4-6 distinct, numbered paragraphs** wrapped in \`<p>\` tags. Use HTML tags like \`<sub>\` and \`<sup>\` for all formulas.

**QUESTION REQUIREMENTS (CRITICAL):**
Your questions must be sophisticated and test true comprehension, not simple recall. **All questions, options, and answers MUST be derived *directly* from the provided passage.** Do not introduce external information.
*   **Question Mix:** At least half of the questions should require complex reasoning (Inference, Application to a new scenario, or analyzing the Purpose of a detail).
*   **Sophisticated Distractors:** Incorrect options (distractors) MUST be plausible. They should target common misconceptions or be statements that are true but not supported by the passage, requiring careful reading to eliminate.
*   **No Hallucinations:** Do not create questions based on concepts or analogies not explicitly present in the text you've written.

**EXPLANATION REQUIREMENTS (MANDATORY CHECKLIST):**
For EACH of the {{numQuestions}} questions, you MUST provide the following:
*   A thorough explanation in both English and Arabic. The explanation MUST be complete and not contain placeholder text.
*   The explanation MUST focus only on why the correct answer is right, quoting or referencing the passage. **DO NOT** explain why the other options are wrong.
*   In the 'passageContext' field, provide the **exact, verbatim quote** from the passage that directly supports the correct answer. This should be a short snippet.

**ADDITIONAL TASKS:**
1.  **Title:** Create a suitable title for the passage.
2.  **Timer:** Calculate a recommended time in minutes. Use this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number.

**OUTPUT FORMAT:**
IMPORTANT: You must format your response as a single, valid JSON object. Do not include any text or markdown formatting (like \`\`\`json) before or after the JSON object. Your entire response should be only the JSON.`;

const standardTextPromptTemplate = `You are a master curriculum designer and subject matter expert for a highly competitive university entrance exam, similar to the SAT or URT. Your task is to create passages that are designed to challenge top-tier students. The tone must be formal, academic, objective, and information-dense, similar to a university-level textbook or a scientific journal. Avoid any conversational language or simplification.

You MUST generate a novel passage. Do not repeat topics or questions from previous requests. To ensure the output is completely unique and does not repeat previous content, use this random number as a creative seed: {{randomSeed}}. {{topicHistoryInstruction}} You must choose a specific, narrow sub-topic within the broader topic provided.

YOUR TASK - FOLLOW THESE RULES EXACTLY:
1.  Generate a passage with a title. The passage MUST be approximately {{wordLength}} words.
2.  Generate EXACTLY {{numQuestions}} multiple-choice questions based on the passage.
3.  The multiple-choice questions should test deep comprehension, not just surface-level recall. At least half the questions should require inference or application. The incorrect options (distractors) must be plausible and based on information within the text.
4.  For EACH question, you MUST generate the following:
    a.  An English explanation detailing only why the correct answer is right by citing the passage.
    b.  An Arabic explanation doing the same.
    c.  In the 'passageContext' field, the exact, verbatim quote from the passage that supports the correct answer.

PASSAGE FORMATTING:
- All paragraphs must be wrapped in <p> tags.
- Number each paragraph, starting with 1. (e.g., "<p>1. The first paragraph text...</p>")
- When appropriate, include data in a well-structured HTML table.

EQUATION FORMATTING:
- When formatting equations or chemical formulas, you MUST use HTML tags like <sub> and <sup>.
- If the topic is Physics or Chemistry, you MUST include relevant equations in the passage.

TIMER:
- Calculate a recommended time limit in minutes using this formula: (Passage Word Count / 130) + (Number of Questions * 0.75). Round to the nearest whole number.

Topic: {{topic}}
Difficulty: {{difficulty}}

IMPORTANT: You must format your response as a single, valid JSON object. Do not include any text or markdown formatting before or after the JSON object.
`;

const actStyleSciencePromptTemplate = `You are an expert curriculum designer specializing in creating challenging ACT Science test passages. Your task is to generate a passage in one of two formats: "Research Summaries" or "Conflicting Viewpoints". The tone should be objective, dense, and data-focused.

You MUST generate a novel passage. Do not repeat topics or questions from previous requests. To ensure the output is completely unique and does not repeat previous content, use this random number as a creative seed: {{randomSeed}}. {{topicHistoryInstruction}} You must choose a specific, narrow sub-topic within the broader topic provided.

YOUR TASK - FOLLOW THESE RULES EXACTLY:
1.  Generate a passage with a title. The passage MUST be approximately {{wordLength}} words and MUST include data presented in a detailed HTML table.
2.  Generate EXACTLY {{numQuestions}} multiple-choice questions that require deep interpretation of the text and tables. Avoid simple fact recall. Distractors must be plausible.
3.  Provide a structured JSON object in the 'chartData' field that represents the data from the table, suitable for rendering a bar chart.
4.  For EACH question, you MUST generate the following:
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
      let modelConfig;
      let finalTopic = validatedInput.topic;

      // New 2-step logic for high-quality Biology passages
      if (validatedInput.topic === 'Biology' && !shouldUseActStyle) {
          let dynamicSelectPrompt = selectBiologyTopicPrompt;
          if (validatedInput.topicHistory && validatedInput.topicHistory.length > 0) {
              const historyString = validatedInput.topicHistory.join(', ');
              dynamicSelectPrompt += `\n\nCRITICAL: You MUST NOT select a topic that is the same as or semantically very similar to any of the following recently used topics: ${historyString}. Strive for novelty.`;
          }

          const topicModel = genAI.getGenerativeModel({
              model: "gemini-1.5-flash-latest",
              generationConfig: { temperature: 0.7, maxOutputTokens: 50 }
          });
          const topicResult = await topicModel.generateContent(dynamicSelectPrompt);
          const specificTopic = topicResult.response.text().trim();
          
          if (!specificTopic) {
              console.error("Failed to generate a specific biology topic, falling back to general 'Biology'.");
              finalTopic = "Biology"; // Fallback to a general topic
          } else {
              finalTopic = specificTopic;
          }
          await delay(1500); // Wait 1.5s to avoid hitting per-minute rate limits

          prompt = biologyContentGenerationPromptTemplate
              .replace('{{topic}}', finalTopic)
              .replace('{{numQuestions}}', String(validatedInput.numQuestions));
          
          modelConfig = {
              model: "gemini-1.5-flash-latest",
              generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.5,
              },
          };

      } else {
          // Existing logic for other subjects and ACT-style passages
          const finalInput = { ...validatedInput, randomSeed: Math.random() };
          let promptTemplate;
          if (shouldUseActStyle) {
              promptTemplate = actStyleSciencePromptTemplate;
          } else {
              promptTemplate = standardTextPromptTemplate;
          }

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
          
          modelConfig = {
              model: "gemini-1.5-flash-latest",
              generationConfig: {
                  responseMimeType: "application/json",
              },
          };
      }

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
      let textOutput;
      try {
        textOutput = JSON.parse(responseText);
      } catch (jsonError: any) {
        console.error("Failed to parse JSON response from AI:", jsonError);
        console.error("Raw AI response:", responseText);
        throw new Error("The AI model returned an invalid format. The raw response has been logged to the console. Please try again.");
      }
      
      const usage = await model.countTokens(prompt);
      
      if (textOutput && textOutput.chartData && typeof textOutput.chartData.data === 'string') {
        try {
          const parsedData = JSON.parse(textOutput.chartData.data);
          textOutput.chartData.data = parsedData;
        } catch (e) {
          console.error("Failed to parse chartData JSON from AI", e);
          textOutput.chartData = undefined;
        }
      }

      if (!textOutput) {
          throw new Error('Failed to generate text content.');
      }
      
      const imageUrl = `https://placehold.co/600x400.png`;

      return {
          ...textOutput,
          imageUrl,
          tokenUsage: usage?.totalTokens,
          subject: validatedInput.topic, // Always return the original subject for categorization
      };
    } catch (e: any) {
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
