
"use client";

import { useState, useMemo, useCallback } from "react";
import { generateUrtPassage } from "@/ai/flows/generate-urt-passage.ts";
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
import { SUBJECTS } from "@/lib/constants";
import type { Subject } from "@/lib/constants";
import type { UrtTest, GradedResult, TestHistoryItem, SubjectScore, ChartData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, FileText, Rows, Columns3, FlaskConical, Mountain } from "lucide-react";
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
import { biologyDemoSet, geologyDemoSet } from "@/lib/demo-data";

type View = "setup" | "test";
type TestView = "normal" | "compact";

export default function PracticePage() {
  // Setup State
  const [mode, setMode] = useState<"single" | "full">("single");
  const [selectedSingleSubject, setSelectedSingleSubject] = useState<Subject | null>(null);
  const [fullTestSettings, setFullTestSettings] = useState<Record<string, number>>({});
  const [difficulty, setDifficulty] = useState("Medium");
  const [wordLength, setWordLength] = useState("600");
  const [numQuestions, setNumQuestions] = useState("6");
  
  // App State
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<UrtTest[] | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, Record<number, string>>>({});
  const [view, setView] = useState<View>("setup");
  const [testView, setTestView] = useState<TestView>('normal');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [activeTab, setActiveTab] = useState("0");
  
  // Hooks
  const { toast } = useToast();
  const { font } = useFont();
  const { addUsage } = useUsage();
  const router = useRouter();

  const handleStartDemo = (demoSet: UrtTest[]) => {
    setIsLoading(true);
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
            description: "This is a pre-generated demo. No API key is required.",
        });
    }, 500);
  }
  
  const handleGenerateTest = async () => {
    const generationTasks: Promise<UrtTest>[] = [];
    if (mode === 'single') {
        if (!selectedSingleSubject) {
            toast({ title: "No Subject Selected", description: "Please choose a subject.", variant: "destructive" });
            return;
        }
        generationTasks.push(generateUrtPassage({
            topic: selectedSingleSubject.name,
            difficulty,
            wordLength: parseInt(wordLength, 10),
            numQuestions: parseInt(numQuestions, 10),
        }));
    } else { // full test mode
        Object.entries(fullTestSettings).forEach(([subjectName, count]) => {
            if (count > 0) {
              for (let i = 0; i < count; i++) {
                  const difficulties = ["Easy", "Medium", "Hard"];
                  const wordLengths = [400, 600, 800, 1000, 1200];
                  const numQuestionsOpts = [6, 10, 15];
                  generationTasks.push(generateUrtPassage({
                      topic: subjectName,
                      difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
                      wordLength: wordLengths[Math.floor(Math.random() * wordLengths.length)],
                      numQuestions: numQuestionsOpts[Math.floor(Math.random() * numQuestionsOpts.length)],
                  }));
              }
            }
        });

        if (generationTasks.length === 0) {
            toast({ title: "No Subjects Selected", description: "Please choose at least one passage for the test.", variant: "destructive" });
            return;
        }
    }

    setIsLoading(true);
    setTestData(null);
    setUserAnswers({});
    setElapsedTime(0);
    setActiveTab("0");

    try {
        const data = await Promise.all(generationTasks);
        setTestData(data);
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
        const gradedResults: GradedResult[][] = testData.map((passageData, passageIndex) => {
            return passageData.questions.map((q, questionIndex) => {
                const userAnswer = userAnswers[passageIndex]?.[questionIndex] || "No answer";
                const isCorrect = userAnswer === q.answer;
                return {
                    isCorrect,
                    userAnswer,
                    correctAnswer: q.answer,
                    question: q.question,
                    explanationEnglish: q.explanationEnglish,
                    explanationArabic: q.explanationArabic,
                };
            });
        });

        let totalCorrect = 0;
        let totalQuestions = 0;
        const scoresBySubject: SubjectScore[] = gradedResults.map((subjectResults, index) => {
            const correctCount = subjectResults.filter(r => r.isCorrect).length;
            const questionCount = subjectResults.length;
            totalCorrect += correctCount;
            totalQuestions += questionCount;
            return {
                subject: testData[index].subject,
                score: questionCount > 0 ? (correctCount / questionCount) * 100 : 0,
                correctQuestions: correctCount,
                totalQuestions: questionCount,
            };
        });

        const newHistoryItem: TestHistoryItem = {
            id: new Date().toISOString() + Math.random(),
            subjects: testData.map(t => t.subject),
            overallScore: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
            correctQuestions: totalCorrect,
            totalQuestions,
            date: new Date().toISOString(),
            scoresBySubject,
            type: mode,
            testData: testData,
            results: gradedResults,
            timeTaken: elapsedTime,
        };

        const history = JSON.parse(localStorage.getItem('testHistory') || '[]') as TestHistoryItem[];
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

  const renderChart = (chartData: ChartData) => {
    const chartConfig: ChartConfig = {
      [chartData.yAxisKey]: {
        label: chartData.yAxisLabel,
        color: "hsl(var(--primary))",
      },
    };

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>A graphical representation of the data from the passage.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
              <Bar dataKey={chartData.yAxisKey} fill="var(--color-primary)" radius={4} />
            </RechartsBarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-headline">Loading your test...</p>
          <p className="text-muted-foreground">This may take a few moments.</p>
        </div>
      );
    }

    switch (view) {
      case "setup":
        const totalFullTestPassages = Object.values(fullTestSettings).reduce((sum, count) => sum + count, 0);
        return (
          <div className="w-full max-w-2xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Demo Area</CardTitle>
                    <CardDescription>Try the app without an API key using these pre-generated test sets.</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                    <Button size="lg" variant="outline" onClick={() => handleStartDemo(biologyDemoSet)}>
                        <FlaskConical className="mr-2 h-5 w-5"/>
                        Biology Demo Set
                    </Button>
                     <Button size="lg" variant="outline" onClick={() => handleStartDemo(geologyDemoSet)}>
                        <Mountain className="mr-2 h-5 w-5"/>
                        Geology Demo Set
                    </Button>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                <CardTitle className="font-headline text-2xl">New AI-Generated Practice</CardTitle>
                <CardDescription>Configure your API key in the project's `.env` file to generate unlimited new practice sessions.</CardDescription>
                </CardHeader>
                <CardContent>
                <Tabs value={mode} onValueChange={(value) => setMode(value as "single" | "full")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="single" className="gap-2"><BookOpen className="h-4 w-4"/>Single Passage</TabsTrigger>
                    <TabsTrigger value="full" className="gap-2"><FileText className="h-4 w-4"/>Full Test</TabsTrigger>
                    </TabsList>
                    <TabsContent value="single" className="mt-6">
                    <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Subject</Label>
                                <Select onValueChange={(value) => setSelectedSingleSubject(SUBJECTS.find(s => s.name === value) || null)}>
                                    <SelectTrigger><SelectValue placeholder="Select a subject..." /></SelectTrigger>
                                    <SelectContent>{SUBJECTS.map((s) => (<SelectItem key={s.name} value={s.name}><div className="flex items-center gap-2"><s.icon className="h-4 w-4" /><span>{s.name}</span></div></SelectItem>))}</SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2"><Label htmlFor="difficulty">Difficulty</Label><Select onValueChange={setDifficulty} defaultValue={difficulty}><SelectTrigger id="difficulty"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Easy">Easy</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="Hard">Hard</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="wordLength">Passage Length</Label><Select onValueChange={setWordLength} defaultValue={wordLength}><SelectTrigger id="wordLength"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="400">~400 words</SelectItem><SelectItem value="600">~600 words</SelectItem><SelectItem value="800">~800 words</SelectItem><SelectItem value="1000">~1000 words</SelectItem><SelectItem value="1200">~1200 words</SelectItem></SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="numQuestions">Questions</Label><Select onValueChange={setNumQuestions} defaultValue={numQuestions}><SelectTrigger id="numQuestions"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="6">6 Questions</SelectItem><SelectItem value="10">10 Questions</SelectItem><SelectItem value="15">15 Questions</SelectItem></SelectContent></Select></div>
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
        );
      case "test":
        if (!testData) return null;
        const totalRecommendedTime = testData.reduce((sum, d) => sum + (d.recommendedTime || 0), 0);

        return (
            <div className="w-full relative">
                 <div className="flex justify-between items-start mb-4 gap-2">
                    {totalRecommendedTime > 0 && (
                       <div className="sticky top-20 z-10">
                         <TestTimer 
                            initialTime={totalRecommendedTime * 60} 
                            onTimeUpdate={handleTimeUpdate}
                          />
                       </div>
                    )}
                    <div className="flex gap-2 ml-auto">
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
                {testView === 'normal' && (
                  <div className="w-full">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="mb-4">
                        {testData.map((data, index) => (
                           <TabsTrigger key={index} value={String(index)}>{data.subject}</TabsTrigger>
                        ))}
                      </TabsList>
                      {testData.map((data, passageIndex) => (
                          <TabsContent key={passageIndex} value={String(passageIndex)}>
                              <Card>
                                  <CardHeader><CardTitle className="font-headline text-2xl">{data.title}</CardTitle></CardHeader>
                                  <CardContent>
                                      <div className={cn("prose dark:prose-invert max-w-none", font)} dangerouslySetInnerHTML={{ __html: data.passage.replace(/\n\n/g, '<br/><br/>') }} />
                                      {data.chartData && renderChart(data.chartData)}
                                  </CardContent>
                              </Card>
                              <Card className="mt-6">
                                <CardHeader>
                                  <CardTitle className="font-headline">Questions for "{data.title}"</CardTitle>
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
                    <Button onClick={handleSubmitTest} className="w-full mt-6" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Submit All Answers
                    </Button>
                  </div>
                )}
                {testView === 'compact' && (
                  <div>
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="mb-4">
                              {testData.map((data, index) => (
                                <TabsTrigger key={index} value={String(index)}>{data.subject}</TabsTrigger>
                              ))}
                          </TabsList>
                          {testData.map((data, index) => (
                              <TabsContent key={index} value={String(index)}>
                                  <Card className="lg:sticky top-40">
                                      <CardHeader><CardTitle className="font-headline text-2xl">{data.title}</CardTitle></CardHeader>
                                      <CardContent>
                                        <ScrollArea className="h-[calc(100vh-20rem)]">
                                          <div className={cn("prose dark:prose-invert max-w-none pr-4", font)} dangerouslySetInnerHTML={{ __html: data.passage.replace(/\n\n/g, '<br/><br/>') }} />
                                          {data.chartData && renderChart(data.chartData)}
                                        </ScrollArea>
                                      </CardContent>
                                  </Card>
                              </TabsContent>
                          ))}
                        </Tabs>

                        <Card className="lg:sticky top-40">
                          <CardHeader>
                            <CardTitle className="font-headline">Questions</CardTitle>
                            <CardDescription>
                              Showing questions for: <span className="font-semibold text-primary">{testData[parseInt(activeTab)].title}</span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                              <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
                                  {testData[parseInt(activeTab)].questions.map((q, questionIndex) => (
                                      <div key={questionIndex} className="mb-6">
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
                              </ScrollArea>
                          </CardContent>
                        </Card>
                    </div>
                     <Button onClick={handleSubmitTest} className="w-full mt-6" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Submit All Answers
                    </Button>
                  </div>
                )}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 flex items-start justify-center p-4 md:p-8">
        <div className="container mx-auto flex justify-center">
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
