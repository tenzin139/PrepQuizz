import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PastQuizzesData, LoggedInUser } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, XCircle, SkipForward } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="animate-in fade-in-50">
      <PageHeader
        title={`Welcome back, ${LoggedInUser.name}!`}
        description="Here's a summary of your recent activity. Keep up the great work!"
      />
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Previous Quizzes</h2>
          {PastQuizzesData.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {PastQuizzesData.map((quiz) => (
                <Card key={quiz.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{quiz.quizTitle}</CardTitle>
                    <CardDescription>Taken on {quiz.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-2">
                       <p className="font-bold text-4xl text-primary">{quiz.score}<span className="text-lg font-medium text-muted-foreground">/100</span></p>
                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
                         <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> {quiz.correct} Correct</span>
                         <span className="flex items-center gap-1"><XCircle className="h-4 w-4 text-red-500" /> {quiz.incorrect} Incorrect</span>
                         <span className="flex items-center gap-1"><SkipForward className="h-4 w-4 text-yellow-500" /> {quiz.skipped} Skipped</span>
                       </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Review Quiz <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <h3 className="text-lg font-medium">No quizzes taken yet.</h3>
                <p className="text-muted-foreground mb-4">Start a new quiz to see your records here.</p>
                <Button asChild>
                  <Link href="/quiz">Start a Quiz</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
