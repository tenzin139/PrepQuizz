import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LeaderboardData } from '@/lib/mock-data';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function LeaderboardPage() {
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
              {LeaderboardData.map((user) => (
                <TableRow key={user.rank} className={cn(user.name === 'Alex Doe' && 'bg-secondary')}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                    {user.rank <= 3 ? (
                        <Trophy className={cn(
                            "h-5 w-5",
                            user.rank === 1 && "text-yellow-400",
                            user.rank === 2 && "text-gray-400",
                            user.rank === 3 && "text-amber-600"
                        )} />
                    ) : (
                        <span className="w-5 text-center">{user.rank}</span>
                    )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
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
        </CardContent>
      </Card>
    </div>
  );
}
