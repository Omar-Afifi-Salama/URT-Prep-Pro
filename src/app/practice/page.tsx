
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { generateUrtPassage, type GenerateUrtPassageInput } from "@/ai/flows/generate-urt-passage.ts";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { SUBJECTS } from "@/lib/constants";
import type { Subject } from "@/lib/constants";
import type { UrtTest, GradedResult, TestHistoryItem, SubjectScore, ChartData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, FileText, Rows, Columns3, FlaskConical, Mountain, KeyRound, ArrowLeft, Highlighter, Underline, Atom, Dna } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useFont } from "@/context/font-provider";
import { cn } from "@/lib/utils";
import { TestTimer } from "@/components/test-timer";
import { useRouter } from "next/navigation";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import { useUsage } from "@/context/usage-provider";
import { biologyDemoSet1, biologyDemoSet2, geologyDemoSet1, geologyDemoSet2 } from "@/lib/demo-data";
import { Progress } from "@/components/ui/progress";

type View = "setup" | "test";
type TestView = "normal" | "compact";
const API_KEY_STORAGE_KEY = 'google-ai-api-key';
const RETAKE_STORAGE_KEY = 'urt-retake-test';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default function PracticePage() {
  // Setup State
  const [mode, setMode] = useState<"single" | "full">("single");
  const [selectedSingleSubject, setSelectedSingleSubject] = useState<Subject | null>(null);
  const [fullTestSettings, setFullTestSettings] = useState<Record<string, number>>({});
  const [difficulty, setDifficulty] = useState("Medium");
  const [wordLength, setWordLength] = useState(800);
  const [numQuestions, setNumQuestions] = useState(10);
  const [passageFormat, setPassageFormat] = useState('auto');
  
  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<UrtTest[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, Record<number, string>>>({});
  const [view, setView] = useState<View>("setup");
  const [testView, setTestView] = useState<TestView>('normal');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  const [isBackAlertOpen, setIsBackAlertOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");
  const [estimatedTime, setEstimatedTime] = useState(0);
  
  // Hooks
  const { toast } = useToast();
  const { font } = useFont();
  const { addUsage } = useUsage();
  const router = useRouter();

  useEffect(() => {
    const retakeDataString = localStorage.getItem(RETAKE_STORAGE_KEY);
    if (retakeDataString) {
      localStorage.removeItem(RETAKE_STORAGE_KEY);
      try {
        const parsedData = JSON.parse(retakeDataString);
        if (Array.isArray(parsedData)) {
            setIsLoading(true);
            setEstimatedTime(1);
            setLoadingText("Loading your retake test...");
            setTestData(null);
            setUserAnswers({});
            setElapsedTime(0);
            setActiveTab("0");

            setTimeout(() => { 
                setTestData(parsedData);
                setView("test");
                setIsLoading(false);
                toast({
                    title: "Retaking Test",
                    description: "Your previous answers have been cleared. Good luck!",
                });
            }, 100);
        }
      } catch (e) {
        console.error("Failed to parse retake data", e);
        toast({ title: "Error", description: "Could not load test for retake.", variant: "destructive" });
      }
    }
  }, [toast]);

  useEffect(() => {
    if (!isLoading || estimatedTime === 0) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = 100 / (estimatedTime * 10); // Update every 100ms
        return oldProgress + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLoading, estimatedTime]);


  const handleStartDemo = (demoSet: UrtTest[]) => {
    setIsLoading(true);
    setEstimatedTime(2); // Short time for demo loading
    setLoadingText("Loading demo...");
    setTestData(null);
    setUserAnswers({});
    setElapsedTime(0);
    setActiveTab("0");
    setTimeout(() => {
        setTestData(demoSet);
        setView("test");
        setTestView('normal');
        setIsLoading(false);
        toast({
            title: "Demo Started",
            description: "This is a pre-generated demo (Easy difficulty). No API key is required.",
        });
    }, 500);
  }
  
  const handleGenerateTest = async () => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please set your Google AI API key on the API Key page before generating a test.",
        variant: "destructive",
        action: (
          <Button variant="secondary" size="sm" onClick={() => router.push('/billing')}>
            <KeyRound className="mr-2 h-4 w-4" />
            Set Key
          </Button>
        ),
      });
      return;
    }
    
    const generationParams: Omit<GenerateUrtPassageInput, 'apiKey'>[] = [];

    if (mode === 'single') {
        if (!selectedSingleSubject) {
            toast({ title: "No Subject Selected", description: "Please choose a subject.", variant: "destructive" });
            return;
        }
        generationParams.push({
            topic: selectedSingleSubject.name,
            difficulty,
            wordLength: wordLength,
            numQuestions: numQuestions,
            passageFormat: selectedSingleSubject.isScience ? (passageFormat as 'auto' | 'reference' | 'act') : undefined,
        });
    } else { // full test mode
        Object.entries(fullTestSettings).forEach(([subjectName, count]) => {
            if (count > 0) {
              for (let i = 0; i < count; i++) {
                  const difficulties = ["Easy", "Medium", "Hard"];
                  const wordLengths = [400, 600, 800, 1000, 1200];
                  const numQuestionsOpts = [6, 10, 15];
                  const subjectInfo = SUBJECTS.find(s => s.name === subjectName);
                  generationParams.push({
                      topic: subjectName,
                      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                      wordLength: wordLengths[Math.floor(Math.random() * wordLengths.length)],
                      numQuestions: numQuestionsOpts[Math.floor(Math.random() * numQuestionsOpts.length)],
                      passageFormat: subjectInfo?.isScience ? (passageFormat as 'auto' | 'reference' | 'act') : undefined,
                  });
              }
            }
        });

        if (generationParams.length === 0) {
            toast({ title: "No Subjects Selected", description: "Please choose at least one passage for the test.", variant: "destructive" });
            return;
        }
    }

    const totalPassages = generationParams.length;
    const estimatedTimePerPassage = 30; // 30 seconds per passage
    const totalEstimatedTime = totalPassages * estimatedTimePerPassage;

    setIsLoading(true);
    setEstimatedTime(totalEstimatedTime);
    setLoadingText(`Generating ${totalPassages} passage${totalPassages > 1 ? 's' : ''}...`);
    setTestData(null);
    setUserAnswers({});
    setElapsedTime(0);
    setActiveTab("0");

    try {
        const data: UrtTest[] = [];

        for (const [index, params] of generationParams.entries()) {
            const passageData = await generateUrtPassage({ 
                ...params, 
                apiKey,
            });

            data.push(passageData);
            
            setTestData([...data]); // Update UI incrementally
            if (index < generationParams.length - 1) {
              await delay(2000); 
            }
        }
        
        setView("test");
        setTestView('normal');
        
        const totalTokens = data.reduce((sum, d) => sum + (d.tokenUsage || 0), 0);
        const totalRequests = data.length;

        if (totalRequests > 0) {
          addUsage({ requests: totalRequests, tokens: totalTokens });
        }

        if (totalTokens > 0) {
            toast({
                title: "Test Generated Successfully",
                description: `This generation used approximately ${totalTokens.toLocaleString()} tokens.`,
            });
        }
    } catch (error: any) {
        console.error("Failed to generate test:", error);
        toast({ title: "Generation Failed", description: error.message || "Could not generate the test. Check your API key and try again.", variant: "destructive" });
        setView('setup');
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAnswerChange = (passageIndex: number, questionIndex: number, value: string) => {
    setUserAnswers(prev => ({ 
        ...prev, 
        [passageIndex]: {
            ...prev[passageIndex],
            [questionIndex]: value
        }
    }));
  };

  const handleSubmitTest = async () => {
    if (!testData) return;
    setIsLoading(true);

    try {
      const allResults: GradedResult[][] = testData.map((passageData, passageIndex) =>
        passageData.questions.map((q, questionIndex) => {
          const userAnswer = userAnswers[passageIndex]?.[questionIndex] || 'No answer';
          return {
            isCorrect: userAnswer === q.answer,
            userAnswer,
            correctAnswer: q.answer,
            question: q.question,
            explanationEnglish: q.explanationEnglish,
            explanationArabic: q.explanationArabic,
            passageContext: q.passageContext,
          };
        })
      );

      const scoresBySubject: SubjectScore[] = testData.map((passage, index) => {
        const subjectResults = allResults[index];
        const correctCount = subjectResults.filter(r => r.isCorrect).length;
        const questionCount = subjectResults.length;
        return {
          subject: passage.subject,
          score: questionCount > 0 ? (correctCount / questionCount) * 100 : 0,
          correctQuestions: correctCount,
          totalQuestions: questionCount,
        };
      });

      const totalCorrect = scoresBySubject.reduce((sum, s) => sum + s.correctQuestions, 0);
      const totalQuestions = scoresBySubject.reduce((sum, s) => sum + s.totalQuestions, 0);
      const overallScore = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

      const newHistoryItem: TestHistoryItem = {
        id: 'test-' + Date.now().toString(36) + Math.random().toString(36).substring(2),
        date: new Date().toISOString(),
        subjects: testData.map(t => t.subject),
        type: mode,
        testData,
        results: allResults,
        timeTaken: elapsedTime,
        scoresBySubject,
        totalQuestions,
        correctQuestions: totalCorrect,
        overallScore,
      };

      let history: TestHistoryItem[] = [];
      try {
        const storedHistory = localStorage.getItem('testHistory');
        if (storedHistory) {
          const parsed = JSON.parse(storedHistory);
          if (Array.isArray(parsed)) {
            history = parsed;
          }
        }
      } catch (e) {
        console.error('Could not parse test history, starting fresh.', e);
        history = [];
      }
      
      history.unshift(newHistoryItem);
      localStorage.setItem('testHistory', JSON.stringify(history.slice(0, 50)));

      router.push(`/history/${newHistoryItem.id}`);

    } catch (error) {
      console.error("Failed to process test results:", error);
      toast({ title: "Submission Failed", description: "Could not process your test results. Please try again.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  };

  const handleTimeUpdate = useCallback((time: number) => {
    setElapsedTime(time);
  }, []);

  const applyMark = (styleClass: string) => {
    if (!testData) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    
    const passageContainer = document.getElementById(`passage-content-${activeTab}`);
    if (!passageContainer || !passageContainer.contains(selection.anchorNode)) {
        toast({ title: 'Invalid Selection', description: 'Please select text within the passage to apply formatting.', variant: 'destructive' });
        return;
    }

    try {
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
        span.className = styleClass;
        range.surroundContents(span);
        selection.removeAllRanges();

        // Update state
        const newHtml = passageContainer.innerHTML;
        const newTestData = testData.map((passage, index) => {
            if (index === parseInt(activeTab)) {
                return { ...passage, passage: newHtml };
            }
            return passage;
        });
        setTestData(newTestData);

    } catch (e) {
        toast({
            title: 'Formatting Error',
            description: 'Could not apply formatting. Please try selecting text contained within a single paragraph.',
            variant: 'destructive',
        });
        console.error(e);
    }
  };

  const handleHighlight = () => applyMark('bg-yellow-400/50');
  const handleUnderline = () => applyMark('underline decoration-yellow-500 decoration-2');

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
  };

  // Memoize calculation of variables for test view
  const testViewData = useMemo(() => {
    if (!testData || view !== 'test') {
      return { tabLabels: [], totalRecommendedTime: 0 };
    }
    const totalRecommendedTime = testData.reduce((sum, d) => sum + (d.recommendedTime || 0), 0);
    const subjectCounts: Record<string, number> = {};
    const tabLabels = testData.map(data => {
        const count = subjectCounts[data.subject] || 0;
        subjectCounts[data.subject] = count + 1;
        const total = testData.filter(d => d.subject === data.subject).length;
        return total > 1 ? `${data.subject} #${count + 1}` : data.subject;
    });
    return { tabLabels, totalRecommendedTime };
  }, [testData, view]);

  const totalFullTestPassages = useMemo(() => {
    return Object.values(fullTestSettings).reduce((sum, count) => sum + count, 0);
  }, [fullTestSettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="flex flex-col items-center justify-center text-center gap-4 w-full max-w-md">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-headline">{loadingText}</p>
            <div className="w-full">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">{Math.round(progress)}%</p>
            </div>
            <p className="text-muted-foreground">This may take a few moments. Please don't navigate away.</p>
          </div>
        </main>
      </div>
    );
  }

  if (view === "test" && testData) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-start justify-center p-4 md:p-8">
          <div className="w-full max-w-6xl mx-auto">
            <div className="w-full relative">
              <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsBackAlertOpen(true)}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Setup
                    </Button>
                    {testViewData.totalRecommendedTime > 0 && (
                    <div className="sticky top-20 z-10">
                        <TestTimer 
                            initialTime={testViewData.totalRecommendedTime * 60} 
                            onTimeUpdate={handleTimeUpdate}
                        />
                    </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Button variant={testView === 'normal' ? 'default' : 'outline'} size="sm" onClick={() => setTestView('normal')}>
                        <Rows className="mr-2 h-4 w-4"/>
                        Normal
                    </Button>
                    <Button variant={testView === 'compact' ? 'default' : 'outline'} size="sm" onClick={() => setTestView('compact')}>
                        <Columns3 className="mr-2 h-4 w-4"/>
                        Compact
                    </Button>
                </div>
              </div>
              <div className="w-full bg-card p-4 rounded-lg border">
                {testView === 'normal' && (
                <div className="w-full max-w-4xl mx-auto">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="mb-4">
                        {testData.map((data, index) => (
                        <TabsTrigger key={index} value={String(index)}>{testViewData.tabLabels[index]}</TabsTrigger>
                        ))}
                    </TabsList>
                    {testData.map((data, passageIndex) => (
                        <TabsContent key={passageIndex} value={String(passageIndex)}>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline text-3xl mb-2" dangerouslySetInnerHTML={{ __html: data.title }} />
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Button variant="ghost" size="sm" onClick={handleHighlight}><Highlighter className="mr-2 h-4 w-4"/>Highlight</Button>
                                        <Button variant="ghost" size="sm" onClick={handleUnderline}><Underline className="mr-2 h-4 w-4"/>Underline</Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div
                                        id={`passage-content-${passageIndex}`}
                                        key={`passage-${passageIndex}-${data.passage?.length}`}
                                        className={cn("prose max-w-none prose-p:text-justify", font)} 
                                        dangerouslySetInnerHTML={{ __html: data.passage }} 
                                    />
                                    {data.chartData && renderChart(data.chartData)}
                                </CardContent>
                            </Card>
                            <Card className="mt-6">
                                <CardHeader>
                                <CardTitle className="font-headline" dangerouslySetInnerHTML={{ __html: `Questions for "${data.title}"`}} />
                                </CardHeader>
                                <CardContent>
                                <div className="flex flex-col gap-6">
                                    {data.questions.map((q, questionIndex) => (
                                    <div key={questionIndex}>
                                        <p className="font-semibold mb-2" dangerouslySetInnerHTML={{__html: `${questionIndex + 1}. ${q.question}`}} />
                                        <RadioGroup onValueChange={(value) => handleAnswerChange(passageIndex, questionIndex, value)} value={userAnswers[passageIndex]?.[questionIndex]}>
                                            <div className="space-y-2">
                                            {q.options.map((option, optIndex) => (
                                                <div key={optIndex} className="flex items-center space-x-2">
                                                    <RadioGroupItem value={option} id={`p${passageIndex}q${questionIndex}o${optIndex}`} />
                                                    <Label htmlFor={`p${passageIndex}q${questionIndex}o${optIndex}`} className="cursor-pointer" dangerouslySetInnerHTML={{__html: option}} />
                                                </div>
                                            ))}
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    ))}
                                </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                    </Tabs>
                </div>
                )}
                {testView === 'compact' && (
                <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div className="w-full lg:sticky lg:top-20">
                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="mb-4">
                                {testData.map((data, index) => (
                                    <TabsTrigger key={index} value={String(index)}>{testViewData.tabLabels[index]}</TabsTrigger>
                                ))}
                            </TabsList>
                            {testData.map((data, index) => (
                                <TabsContent key={index} value={String(index)}>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="font-headline text-3xl mb-2" dangerouslySetInnerHTML={{ __html: data.title }} />
                                            <div className="flex items-center gap-2 pt-2 border-t">
                                                <Button variant="ghost" size="sm" onClick={handleHighlight}><Highlighter className="mr-2 h-4 w-4"/>Highlight</Button>
                                                <Button variant="ghost" size="sm" onClick={handleUnderline}><Underline className="mr-2 h-4 w-4"/>Underline</Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div
                                            id={`passage-content-${index}`}
                                            key={`passage-${index}-${data.passage?.length}`}
                                            className={cn("prose max-w-none pr-4 prose-p:text-justify", font)} 
                                            dangerouslySetInnerHTML={{ __html: data.passage }}
                                            />
                                            {data.chartData && renderChart(data.chartData)}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                            </Tabs>
                        </div>
                        
                        <div className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="font-headline">Questions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="pr-4 space-y-6">
                                        {testData[parseInt(activeTab)].questions.map((q, questionIndex) => (
                                            <div key={questionIndex}>
                                                <p className="font-semibold mb-2" dangerouslySetInnerHTML={{__html: `${questionIndex + 1}. ${q.question}`}} />
                                                <RadioGroup onValueChange={(value) => handleAnswerChange(parseInt(activeTab), questionIndex, value)} value={userAnswers[parseInt(activeTab)]?.[questionIndex]}>
                                                    <div className="space-y-2">
                                                    {q.options.map((option, optIndex) => (
                                                        <div key={optIndex} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={option} id={`p${parseInt(activeTab)}q${questionIndex}o${optIndex}`} />
                                                            <Label htmlFor={`p${parseInt(activeTab)}q${questionIndex}o${optIndex}`} className="cursor-pointer" dangerouslySetInnerHTML={{__html: option}} />
                                                        </div>
                                                    ))}
                                                    </div>
                                                </RadioGroup>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                )}
                <Button onClick={handleSubmitTest} className="w-full mt-6" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Submit All Answers
                </Button>
              </div>
            </div>
          </div>
        </main>
        <AlertDialog open={isBackAlertOpen} onOpenChange={setIsBackAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to go back?</AlertDialogTitle>
              <AlertDialogDescription>
                Your current test progress will be lost. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                setView('setup');
                setTestData(null);
                setUserAnswers({});
                setElapsedTime(0);
              }}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="container mx-auto flex justify-center">
            <div className="w-full max-w-2xl space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">Demo Area</CardTitle>
                        <CardDescription>Try the app without an API key using these pre-generated test sets.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid sm:grid-cols-2 gap-4">
                        <Button size="lg" variant="outline" onClick={() => handleStartDemo(biologyDemoSet1)}>
                            <Dna className="mr-2 h-5 w-5"/>
                            Biology Demo Set #1
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => handleStartDemo(biologyDemoSet2)}>
                            <Dna className="mr-2 h-5 w-5"/>
                            Biology Demo Set #2
                        </Button>
                         <Button size="lg" variant="outline" onClick={() => handleStartDemo(geologyDemoSet1)}>
                            <Mountain className="mr-2 h-5 w-5"/>
                            Geology Demo Set #1
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => handleStartDemo(geologyDemoSet2)}>
                            <Mountain className="mr-2 h-5 w-5"/>
                            Geology Demo Set #2
                        </Button>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader>
                    <CardTitle className="font-headline text-2xl">New AI-Generated Practice</CardTitle>
                    <CardDescription>Configure your API key on the API Key page to generate unlimited new practice sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <Tabs value={mode} onValueChange={(value) => setMode(value as "single" | "full")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="single" className="gap-2"><BookOpen className="h-4 w-4"/>Single Passage</TabsTrigger>
                        <TabsTrigger value="full" className="gap-2"><FileText className="h-4 w-4"/>Full Test</TabsTrigger>
                        </TabsList>
                        <TabsContent value="single" className="mt-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Subject</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {SUBJECTS.map((s) => (
                                            <Button key={s.name} variant={selectedSingleSubject?.name === s.name ? 'default' : 'outline'} onClick={() => setSelectedSingleSubject(s)} className="flex items-center justify-center gap-2 h-12 text-base">
                                                <s.icon className="h-5 w-5" />
                                                <span>{s.name}</span>
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {selectedSingleSubject?.isScience && (
                                    <div className="space-y-2">
                                        <Label>Passage Format</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[{id: 'auto', label: 'Auto'}, {id: 'reference', label: 'Reference'}, {id: 'act', label: 'ACT Style'}].map(format => (
                                                <Button key={format.id} variant={passageFormat === format.id ? 'default' : 'outline'} onClick={() => setPassageFormat(format.id)}>
                                                    {format.label}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Difficulty</Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Easy', 'Medium', 'Hard'].map(d => (
                                            <Button key={d} variant={difficulty === d ? 'default' : 'outline'} onClick={() => setDifficulty(d)}>
                                                {d}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Passage Length (approx. words)</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {[400, 600, 800, 1000, 1200].map(wl => (
                                            <Button key={wl} variant={wordLength === wl ? 'default' : 'outline'} onClick={() => setWordLength(wl)}>
                                                {wl}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Number of Questions</Label>
                                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                        {[5, 7, 10, 12, 15].map(nq => (
                                            <Button key={nq} variant={numQuestions === nq ? 'default' : 'outline'} onClick={() => setNumQuestions(nq)}>
                                                {nq}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="full" className="mt-6">
                        <div className="space-y-4">
                            <div>
                            <Label>Select Subjects</Label>
                            <CardDescription>Choose the number of passages for each subject. Passages will have random difficulty and length.</CardDescription>
                            </div>
                            <div className="space-y-3">
                            {SUBJECTS.map(subject => (
                                <div key={subject.name} className="flex items-center justify-between">
                                <label htmlFor={`subject-count-${subject.name}`} className="flex items-center gap-2 text-sm font-medium">
                                    <subject.icon className="h-4 w-4" />
                                    {subject.name}
                                </label>
                                <Select
                                    onValueChange={(value) => {
                                    setFullTestSettings(prev => ({ ...prev, [subject.name]: parseInt(value, 10) }));
                                    }}
                                    defaultValue="0"
                                >
                                    <SelectTrigger id={`subject-count-${subject.name}`} className="w-[120px]">
                                    <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <SelectItem key={i} value={String(i)}>{i} passage{i !== 1 ? 's' : ''}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </div>
                            ))}
                            </div>
                        </div>
                        </TabsContent>
                    </Tabs>
                    </CardContent>
                    <CardFooter>
                    <Button onClick={handleGenerateTest} disabled={isLoading || (mode === 'single' && !selectedSingleSubject) || (mode === 'full' && totalFullTestPassages === 0)} className="w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Start Practice
                    </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
      </main>
    </div>
  );
}
