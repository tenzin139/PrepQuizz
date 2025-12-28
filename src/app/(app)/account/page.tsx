'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Medal, BookOpen, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, getDocs, aggregate, sum, count as firestoreCount } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import type { QuizResult } from '@/lib/types';


function AccountStatistics() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [stats, setStats] = useState({ totalScore: 0, quizzesTaken: 0 });
    const [loading, setLoading] = useState(true);

    const quizResultsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, `users/${user.uid}/quiz_results`);
    }, [user, firestore]);
    
    const { data: quizzes, isLoading: quizzesLoading } = useCollection<QuizResult>(quizResultsQuery);


    useEffect(() => {
        async function fetchStats() {
            if (!user || !firestore) return;
            setLoading(true);
            const resultsRef = collection(firestore, `users/${user.uid}/quiz_results`);

            const totalScoreQuery = query(resultsRef);
            const scoreSnapshot = await getDocs(totalScoreQuery);
            const totalScore = scoreSnapshot.docs.reduce((acc, doc) => acc + (doc.data().score || 0), 0);

            const quizzesTakenSnapshot = await getDocs(query(resultsRef));
            const quizzesTaken = quizzesTakenSnapshot.size;

            setStats({ totalScore, quizzesTaken });
            setLoading(false);
        }

        fetchStats();
    }, [user, firestore, quizzes]);


    if (loading || quizzesLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-6 w-12" />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-6 w-8" />
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    return (
         <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Medal className="h-5 w-5 text-accent"/>
                  <span>Total Score</span>
                </div>
                <span className="font-bold text-lg text-primary">{stats.totalScore.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-accent"/>
                    <span>Quizzes Taken</span>
                </div>
                <span className="font-bold text-lg text-primary">{stats.quizzesTaken}</span>
              </div>
            </CardContent>
          </Card>
    )
}

export default function AccountPage() {
    const { user } = useUser();
    const [userProfile, setUserProfile] = useState<{name:string, age: number, state: string, profileImageURL: string} | null>(null);

    // This is not ideal, but we need to fetch the user profile data from firestore
    // We should probably have a useUserProfile hook
    const firestore = useFirestore();
    useEffect(() => {
        async function fetchUser() {
            if(user && firestore) {
                const userDoc = await getDocs(query(collection(firestore, 'users'), where('id', '==', user.uid)));
                if(!userDoc.empty) {
                    const profile = userDoc.docs[0].data()
                    setUserProfile({
                        name: profile.name,
                        age: profile.age,
                        state: profile.state,
                        profileImageURL: profile.profileImageURL,
                    });
                }
            }
        }
        fetchUser();
    }, [user, firestore])


  return (
    <div>
      <PageHeader
        title="My Account"
        description="View your profile, progress, and personalized feedback."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile?.profileImageURL} alt={userProfile?.name || ''} />
                <AvatarFallback className="text-3xl">{userProfile?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{userProfile?.name || <Skeleton className="h-8 w-32" />}</CardTitle>
                <CardDescription>
                    {userProfile ? `${userProfile.age} years old, from ${userProfile.state}` : <Skeleton className="h-4 w-24 mt-1" />}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
          <AccountStatistics />
        </div>
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                    <CardDescription>Personalized feedback and areas to improve will be shown here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-48 bg-secondary/50 rounded-lg">
                        <p className="text-muted-foreground">Check back later for AI-powered insights!</p>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
