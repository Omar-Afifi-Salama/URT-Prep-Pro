"use client";

import { useState } from "react";
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
import type { UrtTest, GradedResult, TestHistoryItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useFont } from "@/context/font-provider";
import { cn } from "@/lib/utils";

export default function PracticePage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [difficulty, setDifficulty] = useState("Medium");
  const [wordLength, setWordLength] = useState("400");
  const [numQuestions, setNumQuestions] = useState("6");
  const [isLoading, setIsLoading] = useState(false);
  const [testData, setTestData] = useState<UrtTest | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<GradedResult[]>([]);
  const [view, setView] = useState<"generate" | "test" | "results">(
    "generate"
  );
  const { toast } = useToast();
  const { font } = useFont();

  const handleGenerateTest = async () => {
    if (!selectedSubject) {
      toast({
        title: "No Subject Selected",
        description: "Please choose a subject to start a test.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setTestData(null);
    setUserAnswers({});
    setResults([]);
    try {
      const data = await generateUrtPassage({
        topic: selectedSubject.name,
        difficulty,
        wordLength: parseInt(wordLength, 10),
        numQuestions: parseInt(numQuestions, 10),
      });
      setTestData(data);
      setView("test");
    } catch (error) {
      console.error("Failed to generate test:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate a new test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswerChange = (questionIndex: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmitTest = async () => {
    if (!testData) return;
    setIsLoading(true);
    try {
      const gradedResults = await Promise.all(
        testData.questions.map(async (q, index) => {
          const userAnswer = userAnswers[index] || "No answer";
          return gradeAnswerAndExplain({
            passage: testData.passage,
            question: q.question,
            answer: q.answer,
            userAnswer: userAnswer,
          }).then(res => ({ ...res, userAnswer, correctAnswer: q.answer, question: q.question }))
        })
      );
      setResults(gradedResults);
      
      const correctCount = gradedResults.filter(r => r.isCorrect).length;
      const totalCount = testData.questions.length;
      const score = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
      
      const newHistoryItem: TestHistoryItem = {
          id: new Date().toISOString() + Math.random(),
          subject: selectedSubject!.name,
          score: score,
          correctQuestions: correctCount,
          totalQuestions: totalCount,
          date: new Date().toISOString(),
      };

      const history = JSON.parse(localStorage.getItem('testHistory') || '[]') as TestHistoryItem[];
      history.unshift(newHistoryItem);
      localStorage.setItem('testHistory', JSON.stringify(history));

      setView("results");
    } catch (error) {
      console.error("Failed to grade test:", error);
      toast({
        title: "Grading Failed",
        description: "Could not grade your test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartNewTest = () => {
    setView("generate");
    setTestData(null);
    setUserAnswers({});
    setResults([]);
    setSelectedSubject(null);
  }

  const renderContent = () => {
    if (isLoading && !testData) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-headline">
            Generating your test...
          </p>
          <p className="text-muted-foreground">This may take a few moments. We're creating a unique passage and questions just for you.</p>
        </div>
      );
    }
    if (isLoading && view === 'results') {
       return (
        <div className="flex flex-col items-center justify-center text-center gap-4 p-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-headline">
            Grading your answers...
          </p>
          <p className="text-muted-foreground">This may take a few moments. Please wait.</p>
        </div>
      );
    }

    switch (view) {
      case "generate":
        return (
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">New Practice Test</CardTitle>
              <CardDescription>
                Select a subject and customize your test options below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                 <Label>Subject</Label>
                 <Select onValueChange={(value) => setSelectedSubject(SUBJECTS.find(s => s.name === value) || null)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject..." />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((subject) => (
                        <SelectItem key={subject.name} value={subject.name}>
                          <div className="flex items-center gap-2">
                            <subject.icon className="h-4 w-4" />
                            <span>{subject.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="difficulty">Difficulty</Label>
                        <Select onValueChange={setDifficulty} defaultValue={difficulty}>
                            <SelectTrigger id="difficulty">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Easy">Easy</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Hard">Hard</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="wordLength">Passage Length</Label>
                        <Select onValueChange={setWordLength} defaultValue={wordLength}>
                            <SelectTrigger id="wordLength">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="300">~300 words</SelectItem>
                                <SelectItem value="400">~400 words</SelectItem>
                                <SelectItem value="500">~500 words</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="numQuestions">Questions</Label>
                        <Select onValueChange={setNumQuestions} defaultValue={numQuestions}>
                            <SelectTrigger id="numQuestions">
                                <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="6">6 Questions</SelectItem>
                                <SelectItem value="10">10 Questions</SelectItem>
                                <SelectItem value="15">15 Questions</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
               </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerateTest} disabled={!selectedSubject || isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Start Test
                </Button>
            </CardFooter>
          </Card>
        );
      case "test":
        if (!testData) return null;
        return (
            <div className="grid lg:grid-cols-2 gap-8 w-full items-start">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{testData.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <div className="mb-4 rounded-lg overflow-hidden">
                           <Image 
                                key={testData.imageUrl}
                                src={testData.imageUrl} 
                                alt="Passage illustration"
                                width={600}
                                height={400}
                                className="object-cover w-full h-auto"
                                data-ai-hint={selectedSubject?.name.toLowerCase() + " illustration"}
                            />
                       </div>
                       <div className={cn("prose dark:prose-invert max-w-none", font)}>
                            <div dangerouslySetInnerHTML={{ __html: testData.passage.replace(/\n\n/g, '<br/><br/>') }} />
                        </div>
                    </CardContent>
                </Card>
                <Card className="lg:sticky top-24">
                    <CardHeader>
                        <CardTitle className="font-headline">Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[60vh] pr-4">
                            <div className="flex flex-col gap-6">
                            {testData.questions.map((q, index) => (
                                <div key={index}>
                                    <p className="font-semibold mb-2" dangerouslySetInnerHTML={{__html: `${index + 1}. ${q.question}`}} />
                                    <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)}>
                                        <div className="space-y-2">
                                        {q.options.map((option, optIndex) => (
                                            <div key={optIndex} className="flex items-center space-x-2">
                                                <RadioGroupItem value={option} id={`q${index}o${optIndex}`} />
                                                <Label htmlFor={`q${index}o${optIndex}`} dangerouslySetInnerHTML={{__html: option}} />
                                            </div>
                                        ))}
                                        </div>
                                    </RadioGroup>
                                </div>
                            ))}
                            </div>
                        </ScrollArea>
                        <Button onClick={handleSubmitTest} className="w-full mt-6" disabled={isLoading}>
                          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          Submit Answers
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
      case "results":
        const correctCount = results.filter(r => r.isCorrect).length;
        const totalCount = results.length;
        return (
          <div className="w-full max-w-4xl">
              <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-center">Test Results</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-xl">You scored <span className="font-bold text-primary">{correctCount}</span> out of <span className="font-bold">{totalCount}</span></p>
                    <p className="text-4xl font-bold mt-2 text-primary">
                        {totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : '0.0'}%
                    </p>
                    <Button onClick={handleStartNewTest} className="mt-6">Start Another Test</Button>
                </CardContent>
              </Card>

              <Accordion type="single" collapsible className="w-full">
                {results.map((result, index) => (
                    <Card key={index} className="mb-4">
                        <AccordionItem value={`item-${index}`} className="border-b-0">
                            <AccordionTrigger className="p-4 hover:no-underline">
                                <div className="flex items-center gap-4 w-full">
                                    {result.isCorrect ? <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" /> : <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />}
                                    <p className="text-left flex-1" dangerouslySetInnerHTML={{__html: `${index + 1}. ${result.question}`}}/>
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
                                        <p dir="rtl" className="text-right font-sans" dangerouslySetInnerHTML={{ __html: result.explanationArabic }} />
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Card>
                ))}
              </Accordion>
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
