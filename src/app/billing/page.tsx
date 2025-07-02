
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard, ExternalLink, FileTerminal } from 'lucide-react';
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
                            <FileTerminal className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">API Key Configuration</CardTitle>
                            <CardDescription>
                                This app uses a local `.env` file to manage your API key.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Why use a `.env` file?</h3>
                        <p className="text-muted-foreground">
                            This application uses Google's powerful Gemini AI models. To use the AI features, you must provide your own API key. Storing the key in a `.env` file is a standard and secure practice for web development. It keeps your key separate from the main codebase and ensures it's loaded securely on the server.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Google provides a generous free tier that is sufficient for most users' study needs.
                        </p>
                    </div>

                     <div>
                        <h3 className="font-semibold text-lg mb-2">How to Configure Your API Key</h3>
                        <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                            <li>
                                Go to the <Link href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary underline">Google AI Studio</Link>. You may need to sign in with your Google account.
                            </li>
                            <li>
                                Click the <span className="font-semibold text-foreground">"Create API key"</span> button. You may be prompted to create a new Google Cloud project if you don't have one already.
                            </li>
                             <li>
                                A new key will be generated for you. Copy this key.
                            </li>
                            <li>
                                In this project's file explorer, open the file named <span className="font-semibold font-mono text-foreground">.env</span>.
                            </li>
                             <li>
                                Paste your key into the file after the equals sign, like this: <br />
                                <code className="block bg-muted p-2 rounded-md mt-1 text-foreground font-mono">GOOGLE_AI_API_KEY=YourApiKeyHere</code>
                            </li>
                            <li>
                                Restart the application for the change to take effect. The app will now use your key for all AI-powered features.
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
