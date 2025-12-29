'use client';

import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, SkipForward, Coins } from 'lucide-react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc, runTransaction, Timestamp } from 'firebase/firestore';
import type { QuizResult, UserProfile } from '@/lib/types';
import { format, isToday } from 'date-fns';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { getPlaceholderImage } from '@/lib/placeholder-images';

function HomeHero() {
  const { user } = useUser();
  const heroImage = getPlaceholderImage('home-hero-real');

  return (
     <Card className="flex flex-col md:flex-row items-center overflow-hidden border-2 border-primary/20 shadow-lg">
        <div className="md:w-3/5 p-8 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-3 font-heading text-primary">
                Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}!
            </h1>
            <p className="text-muted-foreground mb-6 text-lg">
                Ready to level up your knowledge? Let's get started!
            </p>
            <Button asChild size="lg" className='rounded-full text-base font-bold shadow-lg transition-transform hover:scale-105'>
                <Link href="/quiz">Start New Quiz <ArrowRight className="ml-2 h-5 w-5"/></Link>
            </Button>
        </div>
        <div className="md:w-2/5 flex items-center justify-center p-4 h-full">
            {heroImage && (
                <div className="relative w-full h-48 md:h-full rounded-lg overflow-hidden">
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={heroImage.imageHint}
                    />
                </div>
            )}
        </div>
    </Card>
  )
}

function ScoringRules() {
    const rules = [
        {
            icon: CheckCircle,
            title: "Correct Answer",
            points: "+5",
            color: "text-green-500",
        },
        {
            icon: XCircle,
            title: "Incorrect Answer",
            points: "-2",
            color: "text-red-500",
        },
        {
            icon: SkipForward,
            title: "Skipped Question",
            points: "-1",
            color: "text-yellow-500",
        }
    ];

    return (
        <div>
            <h2 className="text-2xl font-semibold tracking-tight mb-4 font-heading">Scoring Rules</h2>
            <div className="grid gap-4 md:grid-cols-3">
                {rules.map((rule, index) => (
                     <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card/80 backdrop-blur-sm">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <rule.icon className={cn("h-10 w-10 mb-3", rule.color)} />
                            <p className="font-semibold text-lg">{rule.title}</p>
                            <p className="text-3xl font-bold text-primary">{rule.points}</p>
                            <p className="text-xs text-muted-foreground">points</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
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
      limit(5)
    );
  }, [user, firestore]);

  const { data: pastQuizzes, isLoading } = useCollection<QuizResult>(quizResultsQuery);

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp.seconds * 1000), 'PPP p');
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
      <Card className="text-center py-12 bg-card/80 backdrop-blur-sm">
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
        <Card key={quiz.id} className="flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
          <CardHeader>
            <CardTitle className="font-heading">{quiz.quizTitle}</CardTitle>
            <CardDescription>
              {quiz.subCategory ? `${quiz.subCategory} - ` : ''}
              Taken on {formatDate(quiz.completionDate)}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <p className="font-bold text-5xl text-primary">{quiz.score}<span className="text-lg font-medium text-muted-foreground">pts</span></p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> {quiz.correctAnswers} Correct</span>
                <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-500" /> {quiz.incorrectAnswers} Incorrect</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full rounded-full font-semibold" disabled={!quiz.id}>
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
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const userProfileRef = useMemoFirebase(() => {
        if (!user) return null;
        return doc(firestore, 'users', user.uid);
    }, [user, firestore]);
    const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userProfileRef);

    useEffect(() => {
        if (!isUserLoading && !user) {
        redirect('/login');
        }
    }, [user, isUserLoading]);
    
    useEffect(() => {
        if (userProfile && firestore) {
            const lastQuizDate = userProfile.lastQuizDate?.toDate();
            if (lastQuizDate && !isToday(lastQuizDate)) {
                const userDocRef = doc(firestore, 'users', userProfile.id);
                runTransaction(firestore, async (transaction) => {
                    transaction.update(userDocRef, { quizzesTakenToday: 0 });
                }).catch(e => console.error("Failed to reset daily quizzes", e));
            }
        }
    }, [userProfile, firestore]);

    if (isUserLoading || isProfileLoading) {
        return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
        );
    }
    
    const freeAttemptsRemaining = Math.max(0, 5 - (userProfile?.quizzesTakenToday || 0));
  
  return (
    <div className="animate-in fade-in-50 space-y-8">
      <HomeHero />
       <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <Card>
                <CardHeader className='pb-2'>
                    <CardDescription>Daily Free Attempts</CardDescription>
                    <CardTitle className='text-4xl'>{freeAttemptsRemaining} / 5</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className='text-xs text-muted-foreground'>Your free attempts reset daily.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className='pb-2'>
                    <CardDescription>Your Credits</CardDescription>
                    <CardTitle className='text-4xl flex items-center gap-2'>
                        <Coins className='w-8 h-8 text-accent'/>
                        {userProfile?.quizCredits || 0}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className='text-xs text-muted-foreground'>Use 10 credits for an extra quiz.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className='pb-2'>
                    <CardDescription>Need more credits?</CardDescription>
                    <CardTitle className='text-4xl'>Top Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <Button disabled>Buy Credits (Coming Soon)</Button>
                </CardContent>
            </Card>
       </div>
      <ScoringRules />
      <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4 font-heading">Previous Quizzes</h2>
          <PastQuizzes />
      </div>
    </div>
  );
}
