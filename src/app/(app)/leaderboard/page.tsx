'use client';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import type { LeaderboardEntry as LeaderboardEntryType } from '@/lib/types';

export default function LeaderboardPage() {
  const firestore = useFirestore();

  const leaderboardQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'leaderboard_entries'), orderBy('score', 'desc'), limit(20));
  }, [firestore]);

  const { data: leaderboardData, isLoading } = useCollection<LeaderboardEntryType>(leaderboardQuery);

  return (
    <div>
      <PageHeader
        title="Leaderboard"
        description="See how you rank against other students."
      />
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-12 ml-auto" /></TableCell>
                </TableRow>
              ))}
              {leaderboardData?.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-5">
                      {index < 3 ? (
                        <Trophy className={cn(
                          "h-5 w-5",
                          index === 0 && "text-yellow-400",
                          index === 1 && "text-gray-400",
                          index === 2 && "text-amber-600"
                        )} />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImageURL} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell className="text-right font-semibold text-primary">{user.score.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           {!isLoading && (!leaderboardData || leaderboardData.length === 0) && (
            <div className="text-center p-8 text-muted-foreground">
                No one is on the leaderboard yet. Be the first!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
