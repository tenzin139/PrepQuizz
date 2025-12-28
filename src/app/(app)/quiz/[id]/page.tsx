import { QuizClient } from '@/components/quiz/quiz-client';
import { AllQuizQuestions, Quizzes } from '@/lib/mock-data';
import { notFound } from 'next/navigation';

type QuizPageProps = {
  params: {
    id: string;
  };
};

export default function QuizPage({ params }: QuizPageProps) {
  const quiz = Quizzes.find((q) => q.id === params.id);
  const questions = AllQuizQuestions[params.id];

  if (!quiz || !questions) {
    notFound();
  }

  return <QuizClient quiz={quiz} questions={questions} />;
}
