'use client';

import * as React from 'react';
import { getAIFeedback } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart, Lightbulb, CheckCircle, XCircle, SkipForward, ExternalLink, HelpCircle, Star, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, BarChart as RechartsBarChart } from 'recharts';
import type { PersonalizedFeedbackOutput, PersonalizedFeedbackInput } from '@/ai/flows/personalized-feedback-generation';
import type { QuizQuestion, UserProfile } from '@/lib/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';


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
  const firestore = useFirestore();

  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  React.useEffect(() => {
    async function fetchFeedback() {
      if (!userProfile) return;

      if (results.incorrectQuestions.length === 0) {
        setAiFeedback({
            overallFeedback: "Amazing work! You got a perfect score. Keep up the fantastic effort!",
            questionFeedback: []
        });
        setLoadingFeedback(false);
        return;
      }
      
      const feedbackPayload: PersonalizedFeedbackInput = {
        userName: userProfile.name,
        userAge: userProfile.age,
        userState: userProfile.state,
        incorrectQuestions: results.incorrectQuestions,
      };
      
      try {
        const aiResponse = await getAIFeedback(feedbackPayload);
        if (aiResponse.feedback) {
          setAiFeedback(aiResponse.feedback);
        } else {
            setErrorFeedback(aiResponse.error || 'The AI response was empty.');
        }
      } catch (e: any) {
        console.error("AI Feedback error:", e);
        setErrorFeedback('Could not load AI-powered feedback at this time.');
      } finally {
        setLoadingFeedback(false);
      }
    }
    if (userProfile) {
        fetchFeedback();
    }
  }, [results.incorrectQuestions, userProfile]);

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
    const feedbackForQuestion = aiFeedback?.questionFeedback.find(f => f.questionText === q.text);
    
    return {
      ...q,
      userAnswer,
      isCorrect,
      isIncorrect,
      feedback: feedbackForQuestion?.feedback,
      resourceQuery: feedbackForQuestion?.resourceQuery
    };
  });


  return (
    <div className="space-y-6 animate-in fade-in-50">
      {!isReviewMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            <CardDescription>Here's a summary of your performance.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="font-bold text-6xl text-primary">{results.score}</p>
            </div>
            <div className="flex gap-6">
              <div className="flex flex-col items-center gap-1">
                <CheckCircle className="h-7 w-7 text-green-500" />
                <p className="text-xl font-bold">{results.correctAnswers}</p>
                <p className="text-xs text-muted-foreground">Correct</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <XCircle className="h-7 w-7 text-red-500" />
                <p className="text-xl font-bold">{results.incorrectAnswers}</p>
                <p className="text-xs text-muted-foreground">Incorrect</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <SkipForward className="h-7 w-7 text-yellow-500" />
                <p className="text-xl font-bold">{results.skippedQuestions}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
         <Card>
            <CardHeader>
              <CardTitle>Scoring Rules</CardTitle>
              <CardDescription>How your score was calculated.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                        <p className="font-medium">Correct Answer</p>
                        <p className="text-muted-foreground text-sm">+5 points</p>
                    </div>
               </div>
                <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-500" />
                    <div>
                        <p className="font-medium">Incorrect Answer</p>
                        <p className="text-muted-foreground text-sm">-2 points</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <SkipForward className="h-6 w-6 text-yellow-500" />
                    <div>
                        <p className="font-medium">Skipped Question</p>
                        <p className="text-muted-foreground text-sm">-1 point</p>
                    </div>
                </div>
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
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
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
                      <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} fontSize={12} />
                      <YAxis unit="%" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                  </RechartsBarChart>
              </ChartContainer>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
              <CardTitle>Full Quiz Review</CardTitle>
              <CardDescription>A question-by-question breakdown.</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    {allQuestionDetails.map((item, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger>
                                <div className="flex items-center gap-3 text-left">
                                    {item.isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 shrink-0" /> : item.isIncorrect ? <XCircle className="h-5 w-5 text-red-500 shrink-0" /> : <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0" />}
                                    <span className="flex-1 text-sm font-medium">{item.text}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold mb-1 text-muted-foreground">YOUR ANSWER</p>
                                        <p className={cn("text-sm p-2 rounded-md border", 
                                          item.isCorrect && "bg-green-500/10 border-green-500/20",
                                          item.isIncorrect && "bg-red-500/10 border-red-500/20",
                                          !item.userAnswer && "bg-secondary"
                                        )}>
                                          {item.userAnswer || 'Not Answered'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold mb-1 text-muted-foreground">CORRECT ANSWER</p>
                                        <p className="text-sm p-2 rounded-md bg-green-500/10 border border-green-500/20">{item.answer}</p>
                                    </div>
                                </div>
                                {item.isIncorrect && (
                                  <div>
                                      <p className="text-xs font-semibold mb-1 text-muted-foreground">AI EXPLANATION</p>
                                      {loadingFeedback ? (
                                           <Skeleton className="h-4 w-full mt-2" />
                                      ) : item.feedback ? (
                                        <>
                                           <p className="text-sm text-foreground/80">{item.feedback}</p>
                                           {item.resourceQuery && (
                                              <Button variant="outline" size="sm" asChild className="mt-2">
                                                  <a href={`https://www.google.com/search?q=${encodeURIComponent(item.resourceQuery)}`} target="_blank" rel="noopener noreferrer">
                                                      Learn more <ExternalLink className="ml-2 h-4 w-4" />
                                                  </a>
                                              </Button>
                                          )}
                                        </>
                                      ) : (
                                        <p className="text-sm text-muted-foreground italic">No explanation available.</p>
                                      )}
                                  </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 pt-4">
        {!isReviewMode && (
          <Button asChild className="flex-1">
              <Link href={`/quiz/${results.quizId}`}>Try Again</Link>
          </Button>
        )}
        <Button asChild variant="outline" className="flex-1">
            <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
}
