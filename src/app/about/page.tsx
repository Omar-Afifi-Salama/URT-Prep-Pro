import { AppHeader } from '@/components/app-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="container mx-auto flex justify-center">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl">About URT Prep Pro</CardTitle>
              <CardDescription>Your AI-powered partner for university entrance test preparation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base">
              <p>
                URT Prep Pro is a cutting-edge study tool designed to help students excel in their University Readiness Tests (URT). We leverage the power of Google's Gemini generative AI models through Genkit to provide a limitless supply of high-quality, realistic practice passages and questions across a variety of subjects.
              </p>
              
              <div className="space-y-4">
                <h3 className="font-headline text-xl font-semibold">Key Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Dynamic Passage Generation:</strong> Get unique, exam-level passages on demand. Our AI is trained to mimic the style, tone, and complexity of actual URT materials, including formatted equations and data tables.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Customizable Practice:</strong> Choose between a quick "Single Passage" practice or a comprehensive "Full Test" mode where you can mix and match subjects and the number of passages.
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Instant AI-Powered Grading:</strong> Submit your answers and receive immediate feedback. Our AI grades your responses and provides detailed explanations in both English and Arabic to help you understand the reasoning behind the correct answer.
                    </span>
                  </li>
                   <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span>
                      <strong className="font-semibold">Performance Tracking:</strong> All your test results are automatically saved to your Dashboard, allowing you to monitor your progress, identify your strengths and weaknesses, and focus your study efforts.
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-headline text-xl font-semibold">Our Technology</h3>
                <p className="mt-2">
                  This application is built with a modern, production-ready tech stack including Next.js, React, Tailwind CSS, and ShadCN UI components. All AI functionality is powered by Google's Genkit framework.
                </p>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
