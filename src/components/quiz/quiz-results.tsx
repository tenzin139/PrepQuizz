'use client';

import * as React from 'react';
import { getAIFeedback } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Lightbulb, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';

type ResultsProps = {
  results: {
    quizId: string;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    totalQuestions: number;
    categoryScores: Record<string, number>;
  };
};

export function QuizResults({ results }: ResultsProps) {
  const [feedback, setFeedback] = React.useState('');
  const [loadingFeedback, setLoadingFeedback] = React.useState(true);

  React.useEffect(() => {
    async function fetchFeedback() {
      const feedbackPayload = {
        correctAnswers: results.correctAnswers,
        incorrectAnswers: results.incorrectAnswers,
        skippedQuestions: results.skippedQuestions,
        totalQuestions: results.totalQuestions,
        categoryScores: results.categoryScores,
      };
      
      const aiResponse = await getAIFeedback(feedbackPayload);
      if (aiResponse.feedback) {
        setFeedback(aiResponse.feedback);
      } else {
        setFeedback(aiResponse.error || 'Could not load feedback.');
      }
      setLoadingFeedback(false);
    }
    fetchFeedback();
  }, [results]);

  const chartData = Object.entries(results.categoryScores).map(([name, score]) => ({
    name,
    score: Math.round(score),
  }));

  const chartConfig = {
    score: {
      label: "Score",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <Card className="text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
          <CardDescription>Your final score is</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-bold text-6xl text-primary">{results.score}</p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="flex flex-col items-center justify-center p-6">
            <CheckCircle className="h-8 w-8 text-green-500 mb-2"/>
            <p className="text-2xl font-bold">{results.correctAnswers}</p>
            <p className="text-muted-foreground">Correct</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6">
            <XCircle className="h-8 w-8 text-red-500 mb-2"/>
            <p className="text-2xl font-bold">{results.incorrectAnswers}</p>
            <p className="text-muted-foreground">Incorrect</p>
        </Card>
        <Card className="flex flex-col items-center justify-center p-6">
            <SkipForward className="h-8 w-8 text-yellow-500 mb-2"/>
            <p className="text-2xl font-bold">{results.skippedQuestions}</p>
            <p className="text-muted-foreground">Skipped</p>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart className="h-6 w-6 text-accent"/>
            <CardTitle>Category Performance</CardTitle>
          </div>
          <CardDescription>Your scores across different categories.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
                <RechartsBarChart data={chartData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                    <YAxis unit="%" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-accent"/>
            <CardTitle>Personalized Feedback</CardTitle>
          </div>
          <CardDescription>AI-powered suggestions to help you improve.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFeedback ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <p className="text-foreground/90 whitespace-pre-wrap">{feedback}</p>
          )}
        </CardContent>
      </Card>
      <div className="flex gap-4">
        <Button asChild className="flex-1">
            <Link href={`/quiz/${results.quizId}`}>Try Again</Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
            <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
