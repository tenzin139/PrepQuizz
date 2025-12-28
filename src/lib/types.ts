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

export type PastQuiz = {
  id: string;
  quizTitle: string;
  date: string;
  score: number;
  correct: number;
  incorrect: number;
  skipped: number;
  total: number;
  feedback: string;
};

export type LeaderboardEntry = {
  rank: number;
  name: string;
  state: string;
  score: number;
};
