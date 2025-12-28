'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { QuizResult } from '@/lib/types';
import { format } from 'date-fns';

function PastQuizzes() {
  const { user } = useUser();
  const firestore = useFirestore();

  const quizResultsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(
      collection(firestore, `users/${user.uid}/quiz_results`),
      orderBy('completionDate', 'desc'),
      limit(10)
    );
  }, [user, firestore]);

  const { data: pastQuizzes, isLoading } = useCollection<QuizResult>(quizResultsQuery);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse mt-1"></div>
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-muted rounded w-1/3 animate-pulse"></div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Review Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!pastQuizzes || pastQuizzes.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <h3 className="text-lg font-medium">No quizzes taken yet.</h3>
          <p className="text-muted-foreground mb-4">Start a new quiz to see your records here.</p>
          <Button asChild>
            <Link href="/quiz">Start a Quiz</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {pastQuizzes.map((quiz) => (
        <Card key={quiz.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{quiz.quizTitle}</CardTitle>
            <CardDescription>
              Taken on {quiz.completionDate ? format(new Date(quiz.completionDate.seconds * 1000), 'PPP') : 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <p className="font-bold text-4xl text-primary">{quiz.score}<span className="text-lg font-medium text-muted-foreground">/100</span></p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> {quiz.correctAnswers} Correct</span>
                <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-500" /> {quiz.incorrectAnswers} Incorrect</span>
                <span className="flex items-center gap-1"><SkipForward className="h-4 w-4 text-yellow-500" /> {quiz.skippedAnswers} Skipped</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full" disabled={!quiz.id}>
              <Link href={`/review/${quiz.id}`}>
                Review Quiz <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}


export default function HomePage() {
  const { user } = useUser();

  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={user ? `Welcome back, ${user.displayName || 'Student'}!` : 'Welcome!'}
        description="Here's a summary of your recent activity. Keep up the great work!"
      />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Previous Quizzes</h2>
          <PastQuizzes />
        </div>
      </div>
    </div>
  );
}
