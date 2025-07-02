
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useReactToPrint } from 'react-to-print';
import { AppHeader } from '@/components/app-header';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, Printer, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { TestHistoryItem, ChartData } from '@/lib/types';
import { useFont } from '@/context/font-provider';
import { cn } from '@/lib/utils';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import { flushSync } from 'react-dom';

export default function HistoryDetailPage() {
  const [test, setTest] = useState<TestHistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
  const params = useParams();
  const router = useRouter();
  const { font } = useFont();
  const printRef = useRef<HTMLDivElement>(null);

  const allItemValues = useMemo(() => {
    if (!test) return [];
    return test.testData.flatMap((passageData, passageIndex) =>
      passageData.questions.map((q, questionIndex) => `p${passageIndex}-q${questionIndex}`)
    );
  }, [test]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: async () => {
      await new Promise<void>((resolve) => {
        flushSync(() => {
          setOpenAccordionItems(allItemValues);
        });
        resolve();
      });
    },
    onAfterPrint: () => {
      setOpenAccordionItems([]);
    },
  });
  
  useEffect(() => {
    setIsLoading(true);
    const { id } = params;
    if (typeof id === 'string') {
        const storedHistory = localStorage.getItem('testHistory');
        if (storedHistory) {
            try {
                const rawHistory = JSON.parse(storedHistory);
                let parsedHistory: TestHistoryItem[] = [];
                
                if (Array.isArray(rawHistory)) {
                    parsedHistory = rawHistory.filter((item): item is TestHistoryItem => 
                      item && 
                      typeof item.id === 'string' &&
                      typeof item.date === 'string' &&
                      Array.isArray(item.subjects) &&
                      typeof item.overallScore === 'number' &&
                      typeof item.totalQuestions === 'number' &&
                      typeof item.correctQuestions === 'number' &&
                      Array.isArray(item.scoresBySubject) &&
                      (item.type === 'single' || item.type === 'full') &&
                      Array.isArray(item.testData) &&
                      Array.isArray(item.results) &&
                      typeof item.timeTaken === 'number'
                    );
                }

                const foundTest = parsedHistory.find(item => item && item.id === id);
                if (foundTest) {
                    setTest(foundTest);
                } else {
                    console.error("Test with ID not found in parsed history, redirecting.", id);
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error("Failed to parse history, redirecting to dashboard", error);
                router.push('/dashboard');
            }
        } else {
            router.push('/dashboard');
        }
    }
    setIsLoading(false);
  }, [params, router]);

  const renderChart = (chartData: ChartData) => {
    const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
    
    const chartConfig = chartData.yAxisKeys.reduce((acc: ChartConfig, key, index) => {
      acc[key] = {
        label: key,
        color: chartColors[index % chartColors.length],
      };
      return acc;
    }, {});

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>A graphical representation of the data from the passage.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsBarChart accessibilityLayer data={chartData.data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={chartData.xAxisKey} tickLine={false} tickMargin={10} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft' }}
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {chartData.yAxisKeys.map((key) => (
                  <Bar
                      key={key}
                      dataKey={key}
                      fill={chartConfig[key]?.color}
                      radius={4}
                  />
              ))}
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center text-center p-4">
          <div>
            <h2 className="text-2xl font-bold">Test Not Found</h2>
            <p className="text-muted-foreground">The test you are looking for does not exist or has been removed.</p>
            <Button className="mt-4" onClick={() => router.push('/dashboard')}>
                Back to Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  const { testData, results, overallScore, scoresBySubject, totalQuestions } = test;
  const totalCorrect = results.flat().filter(r => r.isCorrect).length;

  return (
    <div className="min-h-screen w-full flex flex-col bg-background">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto max-w-4xl">
            <div className="no-print mb-4 flex justify-between items-center">
              <Button variant="ghost" onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
              </Button>
               <button onClick={handlePrint} className={cn(buttonVariants({ variant: "outline" }))}>
                  <Printer className="mr-2 h-4 w-4"/>Export to PDF
               </button>
            </div>
            <div ref={printRef} className="w-full printable-area">
              <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-center">Test Review</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <Trophy className="h-16 w-16 mx-auto text-primary mb-4" />
                    <p className="text-xl">You scored <span className="font-bold text-primary">{totalCorrect}</span> out of <span className="font-bold">{totalQuestions}</span></p>
                    <p className="text-5xl font-bold mt-2 text-primary">{overallScore.toFixed(1)}%</p>
                    
                    <div className="mx-auto max-w-md mt-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {scoresBySubject.map(subjectScore => (
                                <Card key={subjectScore.subject} className="text-left">
                                    <CardHeader className="p-4">
                                        <CardTitle className="text-lg">{subjectScore.subject}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0">
                                        <p className="text-2xl font-bold">{subjectScore.score.toFixed(1)}%</p>
                                        <p className="text-xs text-muted-foreground">{subjectScore.correctQuestions}/{subjectScore.totalQuestions} correct</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </CardContent>
              </Card>

              <h3 className="font-headline text-2xl mb-4 mt-8">Detailed Review</h3>
              
              {testData.map((passageData, passageIndex) => (
                <div key={passageIndex} className="mb-8">
                    <Card className="mb-4">
                        <CardHeader><CardTitle className="font-headline text-2xl">{passageData.title}</CardTitle></CardHeader>
                        <CardContent>
                            <div className={cn("prose dark:prose-invert max-w-none prose-p:text-justify", font)} dangerouslySetInnerHTML={{ __html: passageData.passage }} />
                             {passageData.chartData && renderChart(passageData.chartData)}
                        </CardContent>
                    </Card>

                    <Accordion type="multiple" className="w-full" value={openAccordionItems} onValueChange={setOpenAccordionItems}>
                        {results[passageIndex] && results[passageIndex].map((result, questionIndex) => (
                            <Card key={questionIndex} className="mb-2">
                                <AccordionItem value={`p${passageIndex}-q${questionIndex}`} className="border-b-0">
                                    <AccordionTrigger className="p-4 hover:no-underline">
                                        <div className="flex items-center gap-4 w-full">
                                            {result.isCorrect ? <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" /> : <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />}
                                            <p className="text-left flex-1" dangerouslySetInnerHTML={{__html: `${questionIndex + 1}. ${result.question}`}}/>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <div className="space-y-4">
                                            <p><strong>Your Answer:</strong> <span className={result.isCorrect ? 'text-green-600' : 'text-red-600'} dangerouslySetInnerHTML={{__html: result.userAnswer}}/> </p>
                                            <p><strong>Correct Answer:</strong> <span dangerouslySetInnerHTML={{__html: result.correctAnswer}} /></p>
                                            <Separator />
                                            <div className={cn("prose prose-sm dark:prose-invert max-w-none prose-p:text-foreground prose-h4:text-foreground prose-strong:text-foreground", font)}>
                                                <h4 className="font-bold">Explanation (English)</h4>
                                                <p dangerouslySetInnerHTML={{ __html: result.explanationEnglish }} />
                                                <h4 className="font-bold">Explanation (Arabic)</h4>
                                                <p dir="rtl" className="text-right font-arabic text-lg" dangerouslySetInnerHTML={{ __html: result.explanationArabic }} />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Card>
                        ))}
                    </Accordion>
                </div>
              ))}
            </div>
        </div>
      </main>
    </div>
  );
}
