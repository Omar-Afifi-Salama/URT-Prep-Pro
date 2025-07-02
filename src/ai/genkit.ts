
import {genkit, GenkitError} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Initialize with the Google AI plugin, but without a specific API key.
// The API key will be provided per-request in the flow logic.
// This allows the Genkit framework to be active and trace flows.
export const ai = genkit({
  plugins: [googleAI()],
  // To prevent console warnings about not being in a dev environment
  enableDevUI: false,
  // To suppress operational logs unless there's an error
  logLevel: 'warn',
});
