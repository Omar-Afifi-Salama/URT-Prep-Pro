
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard, ExternalLink } from 'lucide-react';
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
                            <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">API Usage & Billing</CardTitle>
                            <CardDescription>
                                To keep URT Prep Pro free, you must provide your own API key.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Why do I need my own key?</h3>
                        <p className="text-muted-foreground">
                            This application uses Google's powerful Gemini AI models to generate passages and grade answers. Each time you use these features, it makes an API call that has a small cost. By using your own API key, you are responsible for these costs, which allows us to offer this tool to everyone for free.
                        </p>
                        <p className="text-muted-foreground mt-2">
                            Google provides a generous free tier that is sufficient for most users' study needs.
                        </p>
                    </div>

                     <div>
                        <h3 className="font-semibold text-lg mb-2">How to Get Your Google AI API Key</h3>
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
                                Back in URT Prep Pro, click on your user avatar in the top-right corner, select <span className="font-semibold text-foreground">"Set API Key,"</span> and paste your key into the dialog.
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
