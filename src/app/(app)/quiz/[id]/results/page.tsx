import { Suspense } from 'react';
import { QuizResults } from '@/components/quiz/quiz-results';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';

type ResultsPageProps = {
    searchParams: { [key: string]: string | string[] | undefined };
};

function ResultsFallback() {
    return (
        <Card>
            <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-20 w-full" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
                <Skeleton className="h-40 w-full" />
            </CardContent>
        </Card>
    )
}

export default function ResultsPage({ searchParams }: ResultsPageProps) {
  const { 
    quizId, 
    score, 
    correctAnswers, 
    incorrectAnswers, 
    skippedQuestions, 
    totalQuestions, 
    categoryScores 
  } = searchParams;

  if (!quizId || !score || !correctAnswers || !incorrectAnswers || !skippedQuestions || !totalQuestions || !categoryScores) {
    return (
        <div>
            <PageHeader title="Quiz Results" description="There was an error loading your results." />
            <p>Please try taking the quiz again.</p>
        </div>
    );
  }

  const results = {
    quizId: String(quizId),
    score: Number(score),
    correctAnswers: Number(correctAnswers),
    incorrectAnswers: Number(incorrectAnswers),
    skippedQuestions: Number(skippedQuestions),
    totalQuestions: Number(totalQuestions),
    categoryScores: JSON.parse(String(categoryScores)),
  };

  return (
    <div>
        <PageHeader title="Quiz Results" description="Here's how you performed in the quiz." />
        <Suspense fallback={<ResultsFallback />}>
            <QuizResults results={results} />
        </Suspense>
    </div>
  );
}
