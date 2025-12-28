import { Timestamp } from 'firebase/firestore';

export type QuizQuestion = {
  id: number;
  category: string;
  question: string;
  text: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  questionsCount: number;
  duration: number; // in seconds
  image: string;
  imageHint: string;
};

export type QuizResult = {
  id?: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  totalQuestions: number;
  completionTime: number;
  completionDate?: Timestamp;
  // Detailed fields for review
  allQuestions?: QuizQuestion[];
  userAnswers?: Record<string, string>;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  state: string;
  score: number;
};
