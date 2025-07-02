
'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { KeyRound, ExternalLink, Save } from 'lucide-react';
import Link from 'next/link';

const API_KEY_STORAGE_KEY = 'google-ai-api-key';

export default function BillingPage() {
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey.trim());
      toast({
        title: 'API Key Saved',
        description: 'Your API key has been saved in your browser\'s local storage.',
      });
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
      toast({
        title: 'API Key Cleared',
        description: 'Your API key has been removed from local storage.',
      });
    }
  };

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
                            This application uses Google's powerful Gemini AI models. To generate new, unique practice tests, you must provide your own API key. Your key is stored securely in your browser's local storage and is never shared with anyone.
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
                                Click the <span className="font-semibold text-foreground">"Create API key"</span> button.
                            </li>
                             <li>
                                A new key will be generated. Copy this key to your clipboard.
                            </li>
                            <li>
                                Paste your key into the input field below and click "Save Key".
                            </li>
                        </ol>

                        <div className="space-y-2 pt-4">
                            <Label htmlFor="api-key-input" className="font-semibold text-base">Your Google AI API Key</Label>
                            <div className="flex gap-2">
                                <Input 
                                    id="api-key-input"
                                    type="password" 
                                    placeholder="Paste your API key here"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="flex-1"
                                />
                                <Button onClick={handleSaveKey}><Save className="mr-2 h-4 w-4" /> Save Key</Button>
                            </div>
                        </div>
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
