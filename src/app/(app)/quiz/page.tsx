'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Quizzes } from '@/lib/mock-data';
import type { Quiz } from '@/lib/types';
import { Clock } from 'lucide-react';
import { QuizSelectionDialog } from '@/components/quiz/quiz-selection-dialog';

export default function QuizSelectionPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const handleStartQuiz = (quiz: Quiz) => {
    if (quiz.subCategories && quiz.subCategories.length > 0) {
      setSelectedQuiz(quiz);
    } else {
      // For quizzes without sub-categories, we would navigate directly
      // This requires the parent component to handle the navigation logic.
      // For now, we will just log it, but a router.push would go here.
      console.log(`Navigating to /quiz/${quiz.id}`);
    }
  };

  const handleCloseDialog = () => {
    setSelectedQuiz(null);
  };

  return (
    <div>
      <PageHeader
        title="Start a New Quiz"
        description="Choose a quiz from the categories below to test your knowledge."
      />
      <div className="grid gap-6 md:grid-cols-2">
        {Quizzes.map((quiz) => (
          <Card key={quiz.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={quiz.image}
                alt={quiz.title}
                fill
                className="object-cover"
                data-ai-hint={quiz.imageHint}
              />
            </div>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.duration / 60} minutes</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {quiz.subCategories ? (
                 <Button className="w-full" onClick={() => handleStartQuiz(quiz)}>Start Quiz</Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/quiz/${quiz.id}`}>Start Quiz</Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      {selectedQuiz && (
        <QuizSelectionDialog
          quiz={selectedQuiz}
          open={!!selectedQuiz}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
}
