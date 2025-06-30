'use client';
import { AppHeader } from '@/components/app-header';
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

const chartData = [
  { subject: 'English', score: 82, fill: 'var(--color-english)' },
  { subject: 'Physics', score: 75, fill: 'var(--color-physics)' },
  { subject: 'Chemistry', score: 91, fill: 'var(--color-chemistry)' },
  { subject: 'Biology', score: 68, fill: 'var(--color-biology)' },
  { subject: 'Geology', score: 85, fill: 'var(--color-geology)' },
];

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
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">80.2%</div>
                <p className="text-xs text-muted-foreground">+5.1% from last month</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Chemistry</div>
                <p className="text-xs text-muted-foreground">91% average score</p>
              </CardContent>
            </Card>
             <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Biology</div>
                <p className="text-xs text-muted-foreground">68% average score</p>
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
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <YAxis />
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
