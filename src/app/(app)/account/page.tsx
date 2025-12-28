import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { LoggedInUser, PastQuizzesData } from '@/lib/mock-data';
import { Medal, BookOpen, Lightbulb } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function AccountPage() {
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
                <AvatarImage src={LoggedInUser.profilePicture} alt={LoggedInUser.name} />
                <AvatarFallback className="text-3xl">{LoggedInUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{LoggedInUser.name}</CardTitle>
                <CardDescription>{LoggedInUser.age} years old, from {LoggedInUser.state}</CardDescription>
              </div>
            </CardHeader>
          </Card>
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
                <span className="font-bold text-lg text-primary">{LoggedInUser.totalScore.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-accent"/>
                    <span>Quizzes Taken</span>
                </div>
                <span className="font-bold text-lg text-primary">{PastQuizzesData.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-accent"/>
                    <CardTitle>Areas to Improve</CardTitle>
                </div>
              <CardDescription>Based on your recent performance, here are some suggestions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {PastQuizzesData.map((quiz, index) => (
                    <div key={quiz.id}>
                        <div className="p-4 bg-secondary/50 rounded-lg">
                            <h4 className="font-semibold text-primary">{quiz.quizTitle}</h4>
                            <p className="text-sm text-foreground/80 mt-1">{quiz.feedback}</p>
                        </div>
                        {index < PastQuizzesData.length - 1 && <Separator className="my-4" />}
                    </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
