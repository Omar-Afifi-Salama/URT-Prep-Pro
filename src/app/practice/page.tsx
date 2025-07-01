
"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import { generateUrtPassage } from "@/ai/flows/generate-urt-passage.ts";
import { gradeAnswerAndExplain } from "@/ai/flows/grade-answer-and-explain.ts";
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
import type { UrtTest, GradedResult, TestHistoryItem, SubjectScore } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, FileDown, Trophy, BookOpen, FileText, Rows, Columns3 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useFont } from "@/context/font-provider";
import { cn } from "@/lib/utils";
import { useApiKey } from "@/context/api-key-provider";
import { TestTimer } from "@/components/test-timer";
import { useRouter } from "next/navigation";

type View = "setup" | "test" | "results";
type TestView = "compact" | "normal";

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
  const [results, setResults] = useState<GradedResult[][] | null>(null);
  const [view, setView] = useState<View>("setup");
  const [testView, setTestView] = useState<TestView>('normal');
  const [elapsedTime, setElapsedTime] = useState(0);
  
  // Hooks
  const { toast } = useToast();
  const { font } = useFont();
  const { isApiKeySet } = useApiKey();
  const router = useRouter();
  
  const printableRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = () => {
    if (printableRef.current) {
      window.print();
    }
  };

  const handleGenerateTest = async () => {
    if (!isApiKeySet) {
        toast({ title: "API Key Required", description: "Please set your Google AI API key in the user menu.", variant: "destructive" });
        return;
    }

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
    setResults(null);
    setElapsedTime(0);

    try {
        const data = await Promise.all(generationTasks);
        setTestData(data);
        setView("test");
        const totalTokens = data.reduce((sum, d) => sum + (d.tokenUsage || 0), 0);
        if (totalTokens > 0) {
            toast({
                title: "Test Generated Successfully",
                description: `This generation used approximately ${totalTokens} tokens.`,
            });
        }
    } catch (error) {
        console.error("Failed to generate test:", error);
        toast({ title: "Generation Failed", description: "Could not generate the test. Check your API key and try again.", variant: "destructive" });
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
    let gradedResults: GradedResult[][] = [];
    try {
        const gradingTasks: Promise<GradedResult[]>[] = testData.map((passageData, passageIndex) => {
            return Promise.all(passageData.questions.map(async (q, questionIndex) => {
                const userAnswer = userAnswers[passageIndex]?.[questionIndex] || "No answer";
                return gradeAnswerAndExplain({
                    passage: passageData.passage,
                    question: q.question,
                    answer: q.answer,
                    userAnswer: userAnswer,
                }).then(res => ({ ...res, userAnswer, correctAnswer: q.answer, question: q.question }))
            }));
        });
        
        gradedResults = await Promise.all(gradingTasks);
        setResults(gradedResults);
        setView("results");

    } catch (error) {
      console.error("Failed to grade test:", error);
      toast({ title: "Grading Failed", description: "Could not grade your test. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
      
      if (gradedResults.length > 0) {
        // --- Save to history ---
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
      }
    }
  };

  const lastTestHistory = useMemo(() => {
    if (view !== 'results') return null;
    const history = JSON.parse(localStorage.getItem('testHistory') || '[]') as TestHistoryItem[];
    return history[0] || null;
  }, [view]);

  const handleStartNewTest = () => {
    setView("setup");
    setTestData(null);
    setUserAnswers({});
    setResults(null);
    setSelectedSingleSubject(null);
    setFullTestSettings({});
  }

  const handleTimeUpdate = useCallback((time: number) => {
    setElapsedTime(time);
  }, []);

  const renderContent = () => {
    if (isLoading && view === 'setup') {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-headline">Generating your {mode === 'single' ? 'passage' : 'test'}...</p>
          <p className="text-muted-foreground">This may take a few moments. We're creating unique content just for you.</p>
        </div>
      );
    }

    switch (view) {
      case "setup":
        const totalFullTestPassages = Object.values(fullTestSettings).reduce((sum, count) => sum + count, 0);
        return (
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">New Practice Session</CardTitle>
              <CardDescription>Choose between a single focused passage or a full multi-subject test.</CardDescription>
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
        );
      case "test":
        if (!testData) return null;
        const totalRecommendedTime = testData.reduce((sum, d) => sum + (d.recommendedTime || 0), 0);

        const passageContent = (
             <Tabs defaultValue="0" className="w-full">
                <TabsList className="mb-4">
                    {testData.map((data, index) => (
                       <TabsTrigger key={index} value={String(index)}>{data.subject}</TabsTrigger>
                    ))}
                </TabsList>
                {testData.map((data, index) => (
                    <TabsContent key={index} value={String(index)}>
                        <Card>
                            <CardHeader><CardTitle className="font-headline text-2xl">{data.title}</CardTitle></CardHeader>
                            <CardContent>
                                <div className="mb-4 rounded-lg overflow-hidden">
                                    <Image key={data.imageUrl} src={data.imageUrl} alt="Passage illustration" width={600} height={400} className="object-cover w-full h-auto" data-ai-hint={`${data.subject.toLowerCase()} illustration`} priority={index === 0}/>
                                </div>
                                <div className={cn("prose dark:prose-invert max-w-none", font)} dangerouslySetInnerHTML={{ __html: data.passage.replace(/\n\n/g, '<br/><br/>') }} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        );

        const questionsContent = (
            <Card className={cn(testView === 'compact' && 'lg:sticky top-24')}>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline">Questions</CardTitle>
                    {totalRecommendedTime > 0 && (
                        <TestTimer 
                            initialTime={totalRecommendedTime * 60} 
                            onTimeUpdate={handleTimeUpdate}
                        />
                    )}
                </CardHeader>
                <CardContent>
                    <ScrollArea className={cn(testView === 'compact' ? "h-[60vh]" : "h-auto", "pr-4")}>
                        {testData.map((data, passageIndex) => (
                            <div key={passageIndex} className="mb-8">
                                <h3 className="font-bold text-lg mb-4 text-primary">{data.subject}</h3>
                                <div className="flex flex-col gap-6">
                                {data.questions.map((q, questionIndex) => (
                                    <div key={questionIndex}>
                                        <p className="font-semibold mb-2" dangerouslySetInnerHTML={{__html: `${questionIndex + 1}. ${q.question}`}} />
                                        <RadioGroup onValueChange={(value) => handleAnswerChange(passageIndex, questionIndex, value)}>
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
                                {passageIndex < testData.length - 1 && <Separator className="mt-8"/>}
                            </div>
                        ))}
                    </ScrollArea>
                    <Button onClick={handleSubmitTest} className="w-full mt-6" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Submit Answers
                    </Button>
                </CardContent>
            </Card>
        );

        return (
            <div className="w-full">
                 <div className="flex justify-end mb-4 gap-2">
                    <Button variant={testView === 'compact' ? 'outline' : 'default'} size="sm" onClick={() => setTestView('compact')}>
                        <Columns3 className="mr-2 h-4 w-4"/>
                        Compact
                    </Button>
                    <Button variant={testView === 'normal' ? 'default' : 'outline'} size="sm" onClick={() => setTestView('normal')}>
                        <Rows className="mr-2 h-4 w-4"/>
                        Normal
                    </Button>
                </div>
                <div className={cn('w-full items-start', testView === 'compact' ? 'grid lg:grid-cols-2 gap-8' : 'flex flex-col gap-8')}>
                    {passageContent}
                    {questionsContent}
                </div>
            </div>
        );
      case "results":
        if (!results || !testData || !lastTestHistory) return null;
        const totalCorrect = results.flat().filter(r => r.isCorrect).length;
        const totalQuestions = results.flat().length;

        return (
          <div className="w-full max-w-4xl">
              <div ref={printableRef} className="printable-area">
                <Card className="mb-6">
                  <CardHeader>
                      <CardTitle className="font-headline text-3xl text-center">Test Results</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <Trophy className="h-16 w-16 mx-auto text-primary mb-4" />
                      <p className="text-xl">You scored <span className="font-bold text-primary">{totalCorrect}</span> out of <span className="font-bold">{totalQuestions}</span></p>
                      <p className="text-5xl font-bold mt-2 text-primary">{lastTestHistory.overallScore.toFixed(1)}%</p>
                      
                      <div className="mx-auto max-w-md mt-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {lastTestHistory.scoresBySubject.map(subjectScore => (
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

                <h3 className="font-headline text-2xl mb-4">Detailed Review</h3>
                <Accordion type="single" collapsible className="w-full">
                  {results.map((subjectResults, passageIndex) => (
                      <div key={passageIndex} className="mb-4">
                          <h4 className="font-bold text-xl mb-2">{testData[passageIndex].subject}</h4>
                          {subjectResults.map((result, questionIndex) => (
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
                      </div>
                  ))}
                </Accordion>
              </div>
              <div className="flex items-center justify-center gap-4 mt-8 no-print">
                  <Button onClick={handleStartNewTest}>Start Another Test</Button>
                  <Button onClick={handlePrint} variant="outline"><FileDown className="mr-2"/>Export to PDF</Button>
                  <Button variant="secondary" onClick={() => router.push('/dashboard')}>View Dashboard</Button>
              </div>
          </div>
        )
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
