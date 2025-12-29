import { QuizClient } from '@/components/quiz/quiz-client';
import { AllQuizQuestions, Quizzes } from '@/lib/mock-data';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

type QuizPageProps = {
  params: {
    id: string;
  };
  searchParams: {
    subCategory?: string;
  };
};

function QuizPageContent({ params, searchParams }: QuizPageProps) {
  const quiz = Quizzes.find((q) => q.id === params.id);
  const questions = AllQuizQuestions[params.id];
  const subCategory = searchParams.subCategory;

  if (!quiz || !questions) {
    notFound();
  }

  return <QuizClient quiz={quiz} questions={questions} subCategory={subCategory} />;
}

export default function QuizPage(props: QuizPageProps) {
  return (
    <Suspense>
      <QuizPageContent {...props} />
    </Suspense>
  )
}
