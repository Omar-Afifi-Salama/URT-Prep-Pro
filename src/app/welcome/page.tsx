import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, FlaskConical, Gauge, KeyRound, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto max-w-4xl space-y-8">

          <div className="text-center">
            <Rocket className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold font-headline">Welcome to URT Prep Pro</h1>
            <p className="text-lg md:text-xl text-muted-foreground mt-2">
              Your AI-powered partner for university entrance test success.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">A Smarter Way to Prepare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base text-muted-foreground">
                URT Prep Pro uses Google's powerful Gemini AI to generate an endless supply of realistic, high-quality practice passages and questions. Stop reusing old practice tests and start preparing with unique content tailored to the subjects and formats you need to master.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Dynamic Content Generation:</strong> Get unique, exam-level passages and questions on demand across multiple subjects.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Realistic Formats:</strong> Practice with standard passages or challenging ACT-style science passages with data tables and charts.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Instant Grading & Feedback:</strong> Get immediate results with detailed, AI-generated explanations in both English and Arabic.
                    </span>
                  </li>
                   <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Performance Dashboard:</strong> Automatically save all test results to track your scores, monitor progress, and identify areas for improvement.
                    </span>
                  </li>
                </ul>
            </div>
             <Card className="bg-secondary/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3"><KeyRound className="h-6 w-6 text-primary"/> Quick Start Guide</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-4">
                        <li>
                            <strong className="font-semibold">Get your API Key:</strong> Navigate to the <Link href="/billing" className="text-primary underline">Billing page</Link> and follow the instructions to get and save your free Google AI API key.
                        </li>
                        <li>
                            <strong className="font-semibold">Start Practicing:</strong> Go to the <Link href="/practice" className="text-primary underline">Practice page</Link>, choose your subjects and settings, and generate a new test.
                        </li>
                        <li>
                            <strong className="font-semibold">Review & Improve:</strong> After each test, you'll be taken to a detailed review. Check your <Link href="/dashboard" className="text-primary underline">Dashboard</Link> to see your progress over time.
                        </li>
                    </ol>
                </CardContent>
             </Card>
          </div>

          <div className="text-center pt-4">
            <Button asChild size="lg">
                <Link href="/practice">
                    Start Practicing Now
                    <Rocket className="ml-2 h-5 w-5" />
                </Link>
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}
