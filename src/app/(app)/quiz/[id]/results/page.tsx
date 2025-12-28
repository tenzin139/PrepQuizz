'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QuizResults, type DetailedQuizResults } from '@/components/quiz/quiz-results';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';

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

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<DetailedQuizResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    const resultsData = sessionStorage.getItem('quizResults');
    if (resultsData) {
      try {
        const parsedData = JSON.parse(resultsData);
        setResults(parsedData);
      } catch (e) {
        console.error('Failed to parse quiz results:', e);
        setError('There was an error loading your results. The data was corrupted.');
      }
    } else {
      setError('No quiz results found. Please take a quiz to see your results.');
    }
  }, []);

  useEffect(() => {
    if (results && user && firestore) {
      const {
        quizId,
        quizTitle,
        score,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        totalQuestions,
        completionTime,
        allQuestions,
        userAnswers
      } = results;

      const quizResultData = {
        userId: user.uid,
        quizId,
        quizTitle,
        score,
        correctAnswers,
        incorrectAnswers,
        skippedAnswers: skippedQuestions,
        totalQuestions,
        completionTime,
        completionDate: serverTimestamp(),
        allQuestions, // Storing all questions for review
        userAnswers, // Storing user's answers for review
      };
      
      const resultsColRef = collection(firestore, `users/${user.uid}/quiz_results`);
      addDocumentNonBlocking(resultsColRef, quizResultData);
    }
  }, [results, user, firestore]);

  if (error) {
    return (
        <div>
            <PageHeader title="Quiz Results" description={error} />
            <Button onClick={() => router.push('/quiz')}>Take a Quiz</Button>
        </div>
    );
  }

  if (!results) {
    return (
        <div>
            <PageHeader title="Quiz Results" description="Loading your performance..." />
            <ResultsFallback />
        </div>
    )
  }

  return (
    <div>
        <PageHeader title="Quiz Results" description={`Here's how you performed in the ${results.quizTitle} quiz.`} />
        <Suspense fallback={<ResultsFallback />}>
            <QuizResults results={results} />
        </Suspense>
    </div>
  );
}
