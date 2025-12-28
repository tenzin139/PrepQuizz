'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, SkipForward } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import type { QuizResult } from '@/lib/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import { getPlaceholderImage } from '@/lib/placeholder-images';

function HomeHero() {
  const heroImage = getPlaceholderImage('home-hero');

  return (
    <Card className="flex flex-col md:flex-row items-center overflow-hidden">
        <div className="md:w-1/2 p-8 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">
                Prepare With Us in a fun way
            </h1>
            <p className="text-muted-foreground mb-6">
                Ready to ace your next exam? Start a new quiz or review your past performance.
            </p>
            <Button asChild size="lg">
                <Link href="/quiz">Start New Quiz</Link>
            </Button>
        </div>
        {heroImage && (
            <div className="md:w-1/2 h-64 md:h-full w-full relative">
                <Image 
                    src={heroImage.imageUrl} 
                    alt={heroImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={heroImage.imageHint}
                />
            </div>
        )}
    </Card>
  )
}


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

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp.seconds * 1000), 'PPP');
  }

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
          <p className="text-muted-foreground">Start a new quiz to see your records here.</p>
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
              Taken on {formatDate(quiz.completionDate)}
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
  return (
    <div className="animate-in fade-in-50 space-y-8">
      <HomeHero />
      <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Previous Quizzes</h2>
          <PastQuizzes />
      </div>
    </div>
  );
}
