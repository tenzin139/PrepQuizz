'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import type { Quiz, QuizQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

type QuizClientProps = {
  quiz: Quiz;
  questions: QuizQuestion[];
};

export function QuizClient({ quiz, questions }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = React.useState(quiz.duration);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          finishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const finishQuiz = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    const categoryScores: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};

    questions.forEach((q) => {
      if (!categoryTotals[q.category]) {
        categoryTotals[q.category] = 0;
        categoryScores[q.category] = 0;
      }
      categoryTotals[q.category]++;
      
      const selected = selectedAnswers[q.id];
      if (selected === q.answer) {
        correctAnswers++;
        categoryScores[q.category]++;
      } else if (selected) {
        incorrectAnswers++;
      }
    });

    const skippedQuestions = questions.length - correctAnswers - incorrectAnswers;
    const finalScore = (correctAnswers * 3) - (incorrectAnswers * 5) - (skippedQuestions * 1);
    
    const finalCategoryScores: Record<string, number> = {};
    for (const category in categoryTotals) {
        finalCategoryScores[category] = (categoryScores[category] / categoryTotals[category]) * 100;
    }

    const results = {
        score: finalScore,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions,
        totalQuestions: questions.length,
        categoryScores: JSON.stringify(finalCategoryScores),
        quizId: quiz.id
    };
    
    const params = new URLSearchParams(Object.entries(results).map(([k, v]) => [k, String(v)]));
    router.push(`/quiz/${quiz.id}/results?${params.toString()}`);
  };

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <div className="flex items-center gap-2 font-semibold text-accent">
              <Clock className="h-5 w-5" />
              <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
            </div>
          </div>
          <Progress value={progress} />
        </CardHeader>
        <CardContent>
          <div key={currentQuestion.id} className="animate-in fade-in-50">
            <p className="text-sm text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {questions.length} ({currentQuestion.category})</p>
            <h2 className="text-lg font-semibold mb-6">{currentQuestion.text}</h2>
            <RadioGroup
              onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
              value={selectedAnswers[currentQuestion.id] || ''}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Label
                    key={option}
                    className={cn(
                      "flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                      selectedAnswers[currentQuestion.id] === option && "border-primary bg-secondary"
                    )}
                  >
                    <RadioGroupItem value={option} />
                    <span>{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4"/> Previous
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}>
              Next <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          ) : (
            <Button onClick={finishQuiz} className="bg-green-600 hover:bg-green-700">Finish Quiz</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
