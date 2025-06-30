'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/app-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { TestHistoryItem } from '@/lib/types';
import { SUBJECTS } from '@/lib/constants';
import { Loader2, TrendingDown, TrendingUp, Trophy } from 'lucide-react';


const chartConfig = {
  score: {
    label: 'Score',
  },
  english: {
    label: 'English',
    color: 'hsl(var(--chart-1))',
  },
  physics: {
    label: 'Physics',
    color: 'hsl(var(--chart-2))',
  },
  chemistry: {
    label: 'Chemistry',
    color: 'hsl(var(--chart-3))',
  },
  biology: {
    label: 'Biology',
    color: 'hsl(var(--chart-4))',
  },
  geology: {
    label: 'Geology',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedHistory = localStorage.getItem('testHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
    setIsLoading(false);
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        bestSubject: { name: 'N/A', score: 0 },
        worstSubject: { name: 'N/A', score: 0 },
        recentHistory: [],
      };
    }

    const totalTests = history.length;
    const averageScore = history.reduce((acc, item) => acc + item.score, 0) / totalTests;

    const subjectStats: Record<string, { scores: number[], count: number }> = {};
    for (const item of history) {
        if (!subjectStats[item.subject]) {
            subjectStats[item.subject] = { scores: [], count: 0 };
        }
        subjectStats[item.subject].scores.push(item.score);
        subjectStats[item.subject].count++;
    }

    const subjectAverages = Object.entries(subjectStats).map(([name, data]) => ({
      name,
      score: data.scores.reduce((a, b) => a + b, 0) / data.count,
    }));
    
    const bestSubject = subjectAverages.reduce((max, s) => s.score > max.score ? s : max, { name: 'N/A', score: -1 });
    const worstSubject = subjectAverages.reduce((min, s) => s.score < min.score ? s : min, { name: 'N/A', score: 101 });

    return {
      totalTests,
      averageScore,
      bestSubject,
      worstSubject,
      recentHistory: history.slice(0, 5)
    };
  }, [history]);

  const chartData = useMemo(() => {
    return SUBJECTS.map(subjectInfo => {
      const subjectHistory = history.filter(h => h.subject === subjectInfo.name);
      if (subjectHistory.length === 0) {
        return { subject: subjectInfo.name, score: 0, fill: `var(--color-${subjectInfo.name.toLowerCase()})` };
      }
      const avgScore = subjectHistory.reduce((acc, item) => acc + item.score, 0) / subjectHistory.length;
      return {
        subject: subjectInfo.name,
        score: Math.round(avgScore),
        fill: `var(--color-${subjectInfo.name.toLowerCase()})`,
      };
    });
  }, [history]);


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
                <Button asChild className="mt-6">
                    <Link href="/practice">Start a New Test</Link>
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
        <div className="container mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6">Dashboard</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tests Taken</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTests}</div>
                <p className="text-xs text-muted-foreground">Keep up the great work!</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">Across all subjects</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bestSubject.name}</div>
                <p className="text-xs text-muted-foreground">{stats.bestSubject.score.toFixed(1)}% average score</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
                 <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.worstSubject.name}</div>
                <p className="text-xs text-muted-foreground">{stats.worstSubject.score.toFixed(1)}% average score</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Performance by Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="subject"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar dataKey="score" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
