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
import { TestHistoryItem } from '@/lib/types';
import { Loader2, Trophy, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedHistory = localStorage.getItem('testHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          // Filter out any potentially corrupted items
          const validHistory = parsedHistory.filter(item => item && item.id && item.subjects);
          setHistory(validHistory);
        }
      } catch (error) {
        console.error("Failed to parse test history:", error);
        localStorage.removeItem('testHistory');
        setHistory([]);
      }
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
        <div className="container mx-auto">
          <h1 className="text-3xl font-headline font-bold mb-6">Test History</h1>
          <Card>
            <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>Review your past performance and track your progress.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Test Type</TableHead>
                            <TableHead>Subjects</TableHead>
                            <TableHead className="text-right">Overall Score</TableHead>
                            <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {history.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Badge variant={item.type === 'full' ? 'default' : 'secondary'}>
                                        {item.type === 'full' ? 'Full Test' : 'Single Passage'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">{Array.isArray(item.subjects) ? item.subjects.join(', ') : 'N/A'}</TableCell>
                                <TableCell className="text-right font-semibold text-primary">
                                  {typeof item.overallScore === 'number' ? `${item.overallScore.toFixed(1)}%` : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.date && new Date(item.date).toString() !== 'Invalid Date'
                                        ? format(new Date(item.date), 'PPp')
                                        : 'Invalid Date'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
           <div className="flex justify-center mt-8">
                <Button onClick={() => router.push('/practice')}>
                    Start a New Test <ArrowRight className="ml-2" />
                </Button>
           </div>
        </div>
      </main>
    </div>
  );
}
