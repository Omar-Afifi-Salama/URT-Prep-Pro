import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
});

export function getGoogleAI(apiKey?: string) {
    return googleAI({ apiKey });
}
