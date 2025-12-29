'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { QuizResults, type DetailedQuizResults } from '@/components/quiz/quiz-results';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { useFirestore, useUser, addDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc, getDoc, runTransaction } from 'firebase/firestore';
import type { QuizResult } from '@/lib/types';
import type { UserProfile } from '@/lib/types';


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

function ResultsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<DetailedQuizResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  
  const userProfileRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);

  const { data: userProfile } = useDoc<UserProfile>(userProfileRef);

  useEffect(() => {
    const resultsData = sessionStorage.getItem('quizResults');
    if (resultsData) {
      try {
        const parsedData = JSON.parse(resultsData);
        // Get subCategory from URL search params as a fallback
        const subCategory = searchParams.get('subCategory');
        if (subCategory && !parsedData.subCategory) {
            parsedData.subCategory = subCategory;
        }
        setResults(parsedData);
      } catch (e) {
        console.error('Failed to parse quiz results:', e);
        setError('There was an error loading your results. The data was corrupted.');
      }
    } else {
      setError('No quiz results found. Please take a quiz to see your results.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (results && user && firestore && userProfile) {
      const saveResults = async () => {
        const {
          quizId,
          quizTitle,
          subCategory,
          score,
          correctAnswers,
          incorrectAnswers,
          skippedQuestions,
          totalQuestions,
          completionTime,
          allQuestions,
          userAnswers
        } = results;

        const quizResultData: Omit<QuizResult, 'id'> = {
          userId: user.uid,
          quizId,
          quizTitle,
          subCategory,
          score,
          correctAnswers,
          incorrectAnswers,
          skippedAnswers: skippedQuestions,
          totalQuestions,
          completionTime,
          completionDate: serverTimestamp(),
          allQuestions,
          userAnswers,
        };
        
        const resultsColRef = collection(firestore, `users/${user.uid}/quiz_results`);
        const newResultRef = await addDocumentNonBlocking(resultsColRef, quizResultData);

        if (newResultRef) {
          // Use a quiz-specific leaderboard path
          const leaderboardRef = doc(firestore, `leaderboards/${quizId}/entries`, user.uid);
          
          runTransaction(firestore, async (transaction) => {
            const leaderboardDoc = await transaction.get(leaderboardRef);
            const currentTotalScore = leaderboardDoc.exists() ? leaderboardDoc.data().score : 0;
            const newTotalScore = currentTotalScore + score;
            
            const leaderboardEntry = {
                userId: user.uid,
                score: newTotalScore,
                name: userProfile.name,
                state: userProfile.state,
                profileImageURL: userProfile.profileImageURL, // Use current profile URL
                submissionDate: serverTimestamp(),
            }
            transaction.set(leaderboardRef, leaderboardEntry, { merge: true });
          }).catch(e => console.error("Leaderboard transaction failed: ", e));
        }
      };

      saveResults();
    }
  }, [results, user, firestore, userProfile]);

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
            <QuizResults results={results} isReviewMode={false} />
        </Suspense>
    </div>
  );
}


export default function ResultsPage() {
    return (
        <Suspense fallback={<ResultsFallback />}>
            <ResultsPageContent />
        </Suspense>
    )
}