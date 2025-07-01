
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { TestHistoryItem, SubjectScore } from '@/lib/types';
import { Loader2, Trophy, ArrowRight, BarChart, Clock, Percent } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';

type SubjectStats = {
  subject: string;
  averageScore: number;
  testsTaken: number;
};

const chartConfig = {
  averageScore: {
    label: "Average Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export default function DashboardPage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [globalStats, setGlobalStats] = useState({
      totalTests: 0,
      averageScore: 0,
      totalTime: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedHistory = localStorage.getItem('testHistory');
    let parsedHistory: TestHistoryItem[] = [];
    if (storedHistory) {
      try {
        const rawHistory = JSON.parse(storedHistory);
        if (Array.isArray(rawHistory)) {
          parsedHistory = rawHistory.filter(item => item && item.id && item.subjects && Array.isArray(item.subjects));
        }
      } catch (error) {
        console.error("Failed to parse test history:", error);
        localStorage.removeItem('testHistory');
      }
    }

    setHistory(parsedHistory);

    if (parsedHistory.length > 0) {
        // Calculate Subject Stats
        const statsMap = new Map<string, { totalScore: number, count: number }>();
        parsedHistory.forEach(item => {
            item.scoresBySubject.forEach(subjectScore => {
                const stat = statsMap.get(subjectScore.subject) || { totalScore: 0, count: 0 };
                stat.totalScore += subjectScore.score;
                stat.count += 1;
                statsMap.set(subjectScore.subject, stat);
            });
        });

        const calculatedSubjectStats = Array.from(statsMap.entries()).map(([subject, data]) => ({
            subject,
            averageScore: data.totalScore / data.count,
            testsTaken: data.count,
        }));
        setSubjectStats(calculatedSubjectStats);

        // Calculate Global Stats
        const totalTests = parsedHistory.length;
        const averageScore = parsedHistory.reduce((sum, item) => sum + item.overallScore, 0) / totalTests;
        const totalTime = parsedHistory.reduce((sum, item) => sum + (item.timeTaken || 0), 0);
        setGlobalStats({ totalTests, averageScore, totalTime });
    }

    setIsLoading(false);
  }, []);

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

  if (history.length === 0) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <AppHeader />
        <main className="flex-1 flex items-center justify-center text-center p-4">
            <div>
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold font-headline">Your Dashboard is Empty</h2>
                <p className="text-muted-foreground mt-2 max-w-sm">Complete a practice test to see your performance analysis and track your progress over time.</p>
                <Button className="mt-6" onClick={() => router.push('/practice')}>
                    Start a New Test
                </Button>
            </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col">
      <AppHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="container mx-auto space-y-8">
          <h1 className="text-3xl font-headline font-bold">Dashboard</h1>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Average Score</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{globalStats.averageScore.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">Across {globalStats.totalTests} tests taken</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Tests Completed</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{globalStats.totalTests}</div>
                    <p className="text-xs text-muted-foreground">Keep up the great work!</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatTime(globalStats.totalTime)}</div>
                    <p className="text-xs text-muted-foreground">Total time spent in tests</p>
                </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>Subject Performance</CardTitle>
                    <CardDescription>Average score by subject.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                   <ChartContainer config={chartConfig} className="h-[250px] w-full">
                       <RechartsBarChart accessibilityLayer data={subjectStats}>
                           <CartesianGrid vertical={false} />
                           <XAxis dataKey="subject" tickLine={false} tickMargin={10} axisLine={false} />
                           <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`}/>
                           <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                           <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
                       </RechartsBarChart>
                   </ChartContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Tests</CardTitle>
                    <CardDescription>Review your past performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {history.slice(0, 5).map(item => (
                            <div key={item.id} className="flex items-center">
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {item.subjects.join(', ')}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNowStrict(new Date(item.date))} ago
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => router.push(`/history/${item.id}`)}>
                                    Review
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
          </div>
          
           <Card>
                <CardHeader>
                    <CardTitle>Full Test History</CardTitle>
                    <CardDescription>Click on any test to review it in detail.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Subjects</TableHead>
                                <TableHead>Test Type</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Time Taken</TableHead>
                                <TableHead className="text-right">Score</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map(item => (
                                <TableRow key={item.id} className="cursor-pointer" onClick={() => router.push(`/history/${item.id}`)}>
                                    <TableCell className="font-medium">{item.subjects.join(', ')}</TableCell>
                                    <TableCell>
                                        <Badge variant={item.type === 'full' ? 'default' : 'secondary'}>
                                            {item.type === 'full' ? 'Full Test' : 'Single Passage'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {item.date && new Date(item.date).toString() !== 'Invalid Date'
                                            ? format(new Date(item.date), 'PP')
                                            : 'Invalid Date'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {typeof item.timeTaken === 'number' ? formatTime(item.timeTaken) : 'N/A'}
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-primary">
                                      {typeof item.overallScore === 'number' ? `${item.overallScore.toFixed(1)}%` : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
