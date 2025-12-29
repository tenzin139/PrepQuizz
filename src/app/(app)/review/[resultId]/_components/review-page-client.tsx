'use client';

import { useDoc, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { QuizResults, type DetailedQuizResults } from '@/components/quiz/quiz-results';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import type { QuizResult, QuizQuestion } from '@/lib/types';
import { AllQuizQuestions } from '@/lib/mock-data';

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

function ReviewPageClient({ resultId }: { resultId: string }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const resultDocRef = useMemoFirebase(() => {
    if (!user || !resultId) return null;
    return doc(firestore, `users/${user.uid}/quiz_results`, resultId);
  }, [user, firestore, resultId]);

  const { data: result, isLoading } = useDoc<QuizResult>(resultDocRef);

  if (isLoading) {
    return <ResultsFallback />;
  }

  if (!result) {
    return <PageHeader title="Not Found" description="Could not find the requested quiz result." />;
  }
  
  const allQuestions = result.allQuestions || AllQuizQuestions[result.quizId] || [];
  
  const incorrectQuestionsList = allQuestions
    .filter(q => {
        const userAnswer = result.userAnswers?.[q.id.toString()];
        // An answer is incorrect if it was given and does not match the correct answer.
        return userAnswer !== undefined && userAnswer !== q.answer;
    })
    .map(q => ({
        questionText: q.text,
        userAnswer: result.userAnswers?.[q.id.toString()] || 'Skipped', // Default to 'Skipped' if undefined
        correctAnswer: q.answer,
        category: q.category,
    }));
  
  const categoryScores: Record<string, number> = {};
  const categoryTotals: Record<string, number> = {};
  
  allQuestions.forEach((q: QuizQuestion) => {
      // Filter by subCategory if it exists in the result
      if (result.subCategory && q.subCategory && q.subCategory !== result.subCategory) {
          return;
      }
      if (!categoryTotals[q.category]) {
          categoryTotals[q.category] = 0;
          categoryScores[q.category] = 0;
      }
      categoryTotals[q.category]++;
      if (result.userAnswers?.[q.id.toString()] === q.answer) {
          categoryScores[q.category]++;
      }
  });

  const finalCategoryScores: Record<string, number> = {};
    for (const category in categoryTotals) {
        if(categoryTotals[category] > 0) {
              const correctInCategory = categoryScores[category] || 0;
              finalCategoryScores[category] = (correctInCategory / categoryTotals[category]) * 100;
        } else {
            finalCategoryScores[category] = 0;
        }
    }


  const detailedResults: DetailedQuizResults = {
    ...result,
    skippedQuestions: result.skippedAnswers,
    totalQuestions: result.totalQuestions,
    categoryScores: finalCategoryScores,
    incorrectQuestions: incorrectQuestionsList,
    allQuestions: allQuestions.filter(q => !result.subCategory || !q.subCategory || q.subCategory === result.subCategory),
    userAnswers: result.userAnswers || {},
  };

  return (
    <QuizResults results={detailedResults} isReviewMode={true} />
  )
}

ReviewPageClient.Skeleton = ResultsFallback;

export { ReviewPageClient };
