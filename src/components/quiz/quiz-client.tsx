'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, ArrowRight, SkipForward, Star, Info, CheckCircle, XCircle } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type QuizClientProps = {
  quiz: Quiz;
  questions: QuizQuestion[];
};

export function QuizClient({ quiz, questions }: QuizClientProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
  const [currentQuestion, setCurrentQuestion] = React.useState<QuizQuestion>(questions[0]);
  const [answeredQuestions, setAnsweredQuestions] = React.useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, string>>({});
  const [isAnswered, setIsAnswered] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(120); // 2 minutes
  const [startTime] = React.useState(Date.now());
  const [showTimeoutAlert, setShowTimeoutAlert] = React.useState(false);
  const [currentScore, setCurrentScore] = React.useState(0);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const calculateScore = React.useCallback((answers: Record<string, string>) => {
    let score = 0;
    Object.keys(answers).forEach((questionId) => {
        const question = answeredQuestions.find(q => q.id.toString() === questionId) || questions.find(q => q.id.toString() === questionId);
        if (question) {
            const userAnswer = answers[questionId];
            if (userAnswer === question.answer) {
                score += 3;
            } else {
                score -= 1;
            }
        }
    });
    return Math.max(0, score);
  }, [answeredQuestions, questions]);
  

  const finishQuiz = React.useCallback(() => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
    }
    
    let correctAnswersCount = 0;
    let incorrectAnswersCount = 0;
    const categoryScores: Record<string, number> = {};
    const categoryTotals: Record<string, number> = {};
    const incorrectQuestionsList: { questionText: string; userAnswer: string; correctAnswer: string; category: string; }[] = [];


    answeredQuestions.forEach((q) => {
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
                incorrectQuestionsList.push({ 
                    questionText: q.text,
                    userAnswer: userAnswer,
                    correctAnswer: q.answer,
                    category: q.category,
                });
            }
        }
    });

    // Handle skipped questions
    const answeredIds = new Set(answeredQuestions.map(q => q.id.toString()));
    const allAttemptedIds = new Set(Object.keys(selectedAnswers));
    const skippedQuestionsCount = allAttemptedIds.size - answeredIds.size;

    const finalScore = calculateScore(selectedAnswers);
    const completionTime = (Date.now() - startTime) / 1000;
    
    const finalCategoryScores: Record<string, number> = {};
    for (const category in categoryTotals) {
        const questionsInCategoryAnswered = answeredQuestions.filter(q => q.category === category && selectedAnswers[q.id.toString()]).length;
        if(questionsInCategoryAnswered > 0) {
              const correctInCategory = categoryScores[category] || 0;
              finalCategoryScores[category] = (correctInCategory / questionsInCategoryAnswered) * 100;
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
        totalQuestions: answeredQuestions.length,
        categoryScores: finalCategoryScores,
        incorrectQuestions: incorrectQuestionsList,
        allQuestions: answeredQuestions, // Only store answered questions
        userAnswers: selectedAnswers,
        completionTime,
    };
    
    sessionStorage.setItem('quizResults', JSON.stringify(results));
    router.push(`/quiz/${quiz.id}/results`);
  }, [selectedAnswers, answeredQuestions, quiz.id, quiz.title, router, calculateScore, startTime, questions]);


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
    if (isAnswered) return;
    const newAnswers = { ...selectedAnswers, [questionId.toString()]: answer };
    setSelectedAnswers(newAnswers);
    if (!answeredQuestions.find(q => q.id === questionId)) {
        setAnsweredQuestions(prev => [...prev, currentQuestion]);
    }
    setCurrentScore(calculateScore(newAnswers));
    setIsAnswered(true);
  };
  
  const getNextQuestion = () => {
      // Simple random selection for unlimited feel
      const nextIndex = Math.floor(Math.random() * questions.length);
      setCurrentQuestion(questions[nextIndex]);
      setIsAnswered(false);
  }

  const handleNext = () => {
    getNextQuestion();
  };

  const handleSkip = () => {
    if (isAnswered) return;
    // Don't add to answered questions if skipped
    getNextQuestion();
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const selectedOption = selectedAnswers[currentQuestion.id.toString()];
  
  return (
    <div className="w-full max-w-3xl mx-auto">
       <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-2xl">{quiz.title}</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <Star className="h-5 w-5 text-primary" />
                <span>{currentScore}</span>
                 <Tooltip>
                    <TooltipTrigger asChild>
                        <button><Info className="h-4 w-4 text-muted-foreground" /></button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p className="text-sm">
                            Correct: +3 points<br/>
                            Incorrect: -1 point
                        </p>
                    </TooltipContent>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2 font-semibold text-accent text-lg">
                <Clock className="h-6 w-6" />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentQuestion && (
            <div key={currentQuestion.id} className="animate-in fade-in-50">
              <p className="text-sm text-muted-foreground mb-2">({currentQuestion.category})</p>
              <h2 className="text-lg font-semibold mb-6">{currentQuestion.text}</h2>
              <RadioGroup
                onValueChange={(value) => handleSelectAnswer(currentQuestion.id, value)}
                value={selectedOption}
                disabled={isAnswered}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected = selectedOption === option;
                    const isCorrect = currentQuestion.answer === option;

                    return (
                        <Label
                        key={option}
                        className={cn(
                            "flex items-center gap-4 border rounded-lg p-4 cursor-pointer hover:bg-secondary/50 transition-colors",
                             isAnswered && isCorrect && "border-green-500 bg-green-500/10 text-green-700",
                             isAnswered && isSelected && !isCorrect && "border-red-500 bg-red-500/10 text-red-700",
                             isAnswered && !isSelected && "opacity-60"
                        )}
                        >
                        <RadioGroupItem value={option} />
                        <span>{option}</span>
                         {isAnswered && isCorrect && <CheckCircle className="ml-auto h-5 w-5 text-green-500" />}
                         {isAnswered && isSelected && !isCorrect && <XCircle className="ml-auto h-5 w-5 text-red-500" />}
                        </Label>
                    )
                  })}
                </div>
              </RadioGroup>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
            <div className="flex gap-2">
                <Button onClick={handleNext}>
                    Next <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
                <Button variant="outline" onClick={handleSkip} disabled={isAnswered}>
                    Skip <SkipForward className="ml-2 h-4 w-4"/>
                </Button>
            </div>
             <Button onClick={finishQuiz} variant="destructive">Finish Quiz</Button>
        </CardFooter>
      </Card>
      </TooltipProvider>
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
