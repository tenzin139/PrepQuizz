import { Timestamp } from 'firebase/firestore';

export type QuizQuestion = {
  id: number;
  category: string;
  question: string; // Legacy, prefer `text`
  text: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategories?: string[];
  questionsCount: number;
  duration: number; // in seconds
  image: string;
  imageHint: string;
};

export type QuizResult = {
  id: string; // Document ID
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
  id: string; // Document ID, which is the user's UID
  userId: string;
  score: number;
  name: string;
  state: string;
  profileImageURL: string;
  submissionDate: Timestamp;
};

export type UserProfile = {
  id: string;
  name: string;
  age: number;
  state: string;
  profileImageURL: string;
};
