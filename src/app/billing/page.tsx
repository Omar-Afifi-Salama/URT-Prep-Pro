
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
            <Card className="w-full max-w-2xl">
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="font-headline text-2xl">API Usage & Billing</CardTitle>
                            <CardDescription>
                                Understanding how your API credits are used.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>
                        This application uses Google's Generative AI models (Gemini) through Genkit to power its features, such as generating passages and grading answers. When you use these features, the app makes calls to the Google AI API, which consumes your API credits.
                    </p>
                    <p>
                        Google AI offers a generous free tier that allows for a significant amount of usage at no cost. This is typically measured in requests per minute or total tokens processed. However, the exact limits can change and vary by model.
                    </p>
                    <p>
                        To get the most accurate, up-to-date information on the free tier and pricing for the models used in this app, please refer to the official Google AI pricing page.
                    </p>
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
