
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { KeyRound, ExternalLink, FileTerminal } from 'lucide-react';
import Link from 'next/link';

export default function BillingPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto flex justify-center">
            <Card className="w-full max-w-3xl">
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">Set Your Google AI API Key</CardTitle>
                            <CardDescription>
                                Use a free personal API key to power the AI features.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">How It Works</h3>
                        <p className="text-muted-foreground">
                            This application uses Google's powerful Gemini AI models. To generate new, unique practice tests, you must provide your own API key. The app reads this key from a special configuration file in your project called <code className="font-mono bg-muted px-1.5 py-1 rounded">.env</code>. This is a standard and secure practice that keeps your key safe.
                        </p>
                        <p className="text-muted-foreground mt-2">
                           Google provides a generous free tier that is sufficient for most users' study needs.
                        </p>
                    </div>

                     <div className="p-4 border rounded-lg space-y-4">
                        <h3 className="font-semibold text-lg">Configuration Steps</h3>
                        <ol className="list-decimal list-inside space-y-4 text-muted-foreground">
                            <li>
                                Go to the <Link href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">Google AI Studio</Link> to get your key. You may need to sign in.
                            </li>
                            <li>
                                Click the <span className="font-semibold text-foreground">"Create API key"</span> button. You might be prompted to create a new Google Cloud project.
                            </li>
                             <li>
                                A new key will be generated. Copy this key to your clipboard.
                            </li>
                            <li>
                                In the file list on the **left side of the editor**, find and open the file named <code className="font-semibold font-mono text-foreground bg-muted px-1.5 py-1 rounded-md">.env</code>.
                            </li>
                             <li>
                                Paste your key into the file. It must be in this exact format:
                                <div className="bg-muted p-3 rounded-md mt-2">
                                  <code className="text-foreground font-mono">GOOGLE_AI_API_KEY=YourApiKeyHere</code>
                                </div>
                            </li>
                            <li>
                                The application will automatically restart and begin using your key. If it doesn't, you may need to manually stop and start the app.
                            </li>
                        </ol>
                    </div>
                    
                    <Button asChild>
                        <Link href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer">
                            View Google AI Pricing <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
