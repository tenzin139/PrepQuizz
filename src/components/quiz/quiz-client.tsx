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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type QuizClientProps = {
  quiz: Quiz;
  questions: QuizQuestion[];
};

export function QuizClient({ quiz, questions }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = React.useState(120); // 2 minutes
  const [showTimeoutAlert, setShowTimeoutAlert] = React.useState(false);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const finishQuiz = React.useCallback(() => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    const categoryScores: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    const incorrectQuestions: (QuizQuestion & { userAnswer: string })[] = [];


    questions.forEach((q) => {
        if (!categoryTotals[q.category]) {
            categoryTotals[q.category] = 0;
            categoryScores[q.category] = 0;
        }
        categoryTotals[q.category]++;

        const userAnswer = selectedAnswers[q.id.toString()];
        if (userAnswer) {
            if (userAnswer === q.answer) {
                correctAnswersCount++;
                categoryScores[q.category] = (categoryScores[q.category] || 0) + 1;
            } else {
                incorrectAnswersCount++;
                incorrectQuestions.push({ ...q, userAnswer });
            }
        }
    });

    const answeredCount = Object.keys(selectedAnswers).length;
    const skippedQuestionsCount = questions.length - answeredCount;
    const finalScore = Math.max(0, (correctAnswersCount * 3) - (incorrectAnswersCount * 1));
    
    const finalCategoryScores: Record<string, number> = {};
    for (const category in categoryTotals) {
        const questionsInCategoryAnswered = questions.filter(q => q.category === category && selectedAnswers[q.id.toString()]).length;
        if(questionsInCategoryAnswered > 0) {
              finalCategoryScores[category] = (categoryScores[q.category] / questionsInCategoryAnswered) * 100;
        } else {
            finalCategoryScores[category] = 0;
        }
    }

    const results = {
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: finalScore,
        correctAnswers: correctAnswersCount,
        incorrectAnswers: incorrectAnswersCount,
        skippedQuestions: skippedQuestionsCount,
        totalQuestions: questions.length,
        categoryScores: finalCategoryScores,
        incorrectQuestions: incorrectQuestions.map(q => ({ 
          questionText: q.text,
          userAnswer: q.userAnswer,
          correctAnswer: q.answer,
          category: q.category,
        })),
        allQuestions: questions,
        userAnswers: selectedAnswers,
    };
    
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push(`/quiz/${quiz.id}/results`);
  }, [selectedAnswers, questions, quiz.id, quiz.title, router]);


  React.useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if(timerRef.current) clearInterval(timerRef.current);
          setShowTimeoutAlert(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };
  }, []);

  const handleSelectAnswer = (questionId: number, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId.toString()]: answer }));
  };
  
  const handleNext = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrev = () => {
    setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = (Object.keys(selectedAnswers).length / questions.length) * 100;
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
          {currentQuestion && (
            <div key={currentQuestion.id} className="animate-in fade-in-50">
              <p className="text-sm text-muted-foreground mb-2">Question {currentQuestionIndex + 1} of {questions.length} ({currentQuestion.category})</p>
              <h2 className="text-lg font-semibold mb-6">{currentQuestion.text}</h2>
              <RadioGroup
                onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
                value={selectedAnswers[currentQuestion.id.toString()] || ''}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option}
                      className={cn(
                        "flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                        selectedAnswers[currentQuestion.id.toString()] === option && "border-primary bg-secondary"
                      )}
                    >
                      <RadioGroupItem value={option} />
                      <span>{option}</span>
                    </Label>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                >
                    <ArrowLeft className="mr-2 h-4 w-4"/> Previous
                </Button>
                <Button onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
             <Button onClick={finishQuiz} variant="destructive">Finish Quiz</Button>
        </CardFooter>
      </Card>
      <AlertDialog open={showTimeoutAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Time's up!</AlertDialogTitle>
            <AlertDialogDescription>
                Your time for the quiz has expired. Let's see how you did.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={finishQuiz}>View Results</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
