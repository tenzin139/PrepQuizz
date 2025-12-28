'use client';

import * as React from 'react';
import { getAIFeedback } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Lightbulb, CheckCircle, XCircle, SkipForward, ExternalLink, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import type { PersonalizedFeedbackOutput } from '@/ai/flows/personalized-feedback-generation';
import type { QuizQuestion } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';

export type DetailedQuizResults = {
    quizId: string;
    quizTitle: string;
    score: number;
    correctAnswers: number;
    incorrectAnswers: number;
    skippedQuestions: number;
    totalQuestions: number;
    categoryScores: Record<string, number>;
    incorrectQuestions: {
        questionText: string;
        userAnswer: string;
        correctAnswer: string;
        category: string;
    }[];
    allQuestions: QuizQuestion[];
    userAnswers: Record<string, string>;
};

type ResultsProps = {
  results: DetailedQuizResults;
  isReviewMode?: boolean;
};

export function QuizResults({ results, isReviewMode = false }: ResultsProps) {
  const [aiFeedback, setAiFeedback] = React.useState<PersonalizedFeedbackOutput | null>(null);
  const [loadingFeedback, setLoadingFeedback] = React.useState(true);
  const [errorFeedback, setErrorFeedback] = React.useState<string | null>(null);
  const { user } = useUser();

  React.useEffect(() => {
    async function fetchFeedback() {
      if (results.incorrectQuestions.length === 0) {
        setAiFeedback({
            overallFeedback: "Amazing work! You got a perfect score. Keep up the fantastic effort!",
            questionFeedback: []
        });
        setLoadingFeedback(false);
        return;
      }
      
      const feedbackPayload = {
        userName: user?.displayName || 'Student',
        userAge: 25, // This should be fetched from user profile
        userState: 'CA', // This should be fetched from user profile
        incorrectQuestions: results.incorrectQuestions,
      };
      
      try {
        const aiResponse = await getAIFeedback(feedbackPayload);
        if (aiResponse.feedback) {
          setAiFeedback(aiResponse.feedback);
        } else {
          throw new Error(aiResponse.error || 'The AI response was empty.');
        }
      } catch (e: any) {
        console.error("AI Feedback error:", e);
        setErrorFeedback('Could not load AI-powered feedback at this time.');
      } finally {
        setLoadingFeedback(false);
      }
    }
    fetchFeedback();
  }, [results.incorrectQuestions, user]);

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
  
  const allQuestionDetails = results.allQuestions.map(q => {
    const userAnswer = results.userAnswers[q.id.toString()];
    const isCorrect = userAnswer === q.answer;
    const isIncorrect = userAnswer && !isCorrect;
    const feedback = isIncorrect ? aiFeedback?.questionFeedback.find(f => f.questionText === q.text) : undefined;
    
    return {
      ...q,
      userAnswer,
      isCorrect,
      isIncorrect,
      feedback: feedback?.feedback,
      resourceQuery: feedback?.resourceQuery
    };
  });


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
                    <Bar dataKey="score" fill="var(--color-score)" radius={8} />
                </RechartsBarChart>
            </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-accent"/>
            <CardTitle>AI-Powered Analysis</CardTitle>
          </div>
          <CardDescription>Personalized feedback to help you improve.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingFeedback ? (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
          ) : errorFeedback ? (
             <p className="text-destructive">{errorFeedback}</p>
          ) : (
             <p className="text-foreground/90">{aiFeedback?.overallFeedback}</p>
          )}
        </CardContent>
      </Card>

      {isReviewMode && (
         <Card>
            <CardHeader>
              <CardTitle>Full Quiz Review</CardTitle>
              <CardDescription>A question-by-question breakdown of your answers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {allQuestionDetails.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 text-left">
                                    {item.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> : item.isIncorrect ? <XCircle className="h-5 w-5 text-red-500 shrink-0" /> : <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />}
                                    <span className="flex-1">{item.questionText}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Your Answer</p>
                                        <p className={cn("text-sm p-2 rounded-md border", 
                                          item.isCorrect && "bg-green-500/10 text-green-700 border-green-500/20",
                                          item.isIncorrect && "bg-red-500/10 text-red-700 border-red-500/20",
                                          !item.userAnswer && "bg-secondary"
                                        )}>
                                          {item.userAnswer || 'Not Answered'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Correct Answer</p>
                                        <p className="text-sm p-2 rounded-md bg-green-500/10 text-green-700 border border-green-500/20">{item.correctAnswer}</p>
                                    </div>
                                </div>
                                {item.isIncorrect && (
                                  <>
                                    <div>
                                        <p className="text-sm font-semibold mb-1">Explanation</p>
                                        {item.feedback ? (
                                             <p className="text-sm text-foreground/80">{item.feedback}</p>
                                        ) : (
                                            <Skeleton className="h-4 w-full" />
                                        )}
                                    </div>
                                    {item.resourceQuery && (
                                        <Button variant="outline" size="sm" asChild>
                                            <a href={`https://www.google.com/search?q=${encodeURIComponent(item.resourceQuery)}`} target="_blank" rel="noopener noreferrer">
                                                Learn more <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    )}
                                  </>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
         </Card>
      )}

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
