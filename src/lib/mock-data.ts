import type { ImagePlaceholder } from './placeholder-images';
import { getPlaceholderImage, getAvatarPlaceholders } from './placeholder-images';
import type { Quiz, QuizQuestion, PastQuiz, LeaderboardEntry } from './types';

export const LoggedInUser = {
  name: 'Alex Doe',
  age: 23,
  state: 'California',
  totalScore: 1250,
  profilePicture: getPlaceholderImage('avatar-1')?.imageUrl || '',
};

export const ProfileAvatars = getAvatarPlaceholders();

export const QuizCategories = [
  { id: 'history', name: 'History', icon: 'History' },
  { id: 'science', name: 'Science', icon: 'FlaskConical' },
  { id: 'polity', name: 'Polity', icon: 'Scale' },
  { id: 'geography', name: 'Geography', icon: 'Globe' },
];

export const Quizzes: Quiz[] = [
  {
    id: 'upsc-gs-1',
    title: 'UPSC General Studies Mix',
    description: 'A mixed quiz covering all topics from UPSC General Studies.',
    category: 'Mixed',
    questionsCount: 10,
    duration: 120, // in seconds
    image: getPlaceholderImage('quiz-upsc')?.imageUrl || '',
    imageHint: 'library study',
  },
  {
    id: 'neet-bio-1',
    title: 'NEET Biology Practice',
    description: 'Test your knowledge in key areas of Biology for NEET.',
    category: 'Science',
    questionsCount: 10,
    duration: 120,
    image: getPlaceholderImage('quiz-neet')?.imageUrl || '',
    imageHint: 'DNA biology',
  }
];

export const AllQuizQuestions: Record<string, QuizQuestion[]> = {
  'upsc-gs-1': [
    { id: 1, category: 'History', question: 'The Battle of Plassey was fought in?', text: 'The Battle of Plassey was fought in?', options: ['1757', '1782', '1748', '1764'], answer: '1757' },
    { id: 2, category: 'Polity', question: 'The Constitution of India was adopted by the Constituent Assembly on?', text: 'The Constitution of India was adopted by the Constituent Assembly on?', options: ['26 January 1950', '26 November 1949', '15 August 1947', '9 December 1946'], answer: '26 November 1949' },
    { id: 3, category: 'Geography', question: 'Which is the longest river in India?', text: 'Which is the longest river in India?', options: ['Ganga', 'Yamuna', 'Godavari', 'Brahmaputra'], answer: 'Ganga' },
    { id: 4, category: 'History', question: 'Who was the first Governor-General of India?', text: 'Who was the first Governor-General of India?', options: ['Lord William Bentinck', 'Lord Canning', 'Lord Mountbatten', 'C. Rajagopalachari'], answer: 'Lord William Bentinck' },
    { id: 5, category: 'Polity', question: 'What is the minimum age for becoming a member of the Lok Sabha?', text: 'What is the minimum age for becoming a member of the Lok Sabha?', options: ['21 years', '25 years', '30 years', '35 years'], answer: '25 years' },
    { id: 6, category: 'Geography', question: 'The "Sundarbans" delta is formed by which rivers?', text: 'The "Sundarbans" delta is formed by which rivers?', options: ['Ganga and Brahmaputra', 'Indus and Jhelum', 'Mahanadi and Godavari', 'Krishna and Kaveri'], answer: 'Ganga and Brahmaputra' },
    { id: 7, category: 'History', question: 'The Dandi March, also known as the Salt March, was initiated by Mahatma Gandhi in which year?', text: 'The Dandi March, also known as the Salt March, was initiated by Mahatma Gandhi in which year?', options: ['1928', '1930', '1932', '1942'], answer: '1930' },
    { id: 8, category: 'Polity', question: 'Which article of the Indian Constitution deals with the Right to Equality?', text: 'Which article of the Indian Constitution deals with the Right to Equality?', options: ['Article 14', 'Article 19', 'Article 21', 'Article 32'], answer: 'Article 14' },
    { id: 9, category: 'Geography', question: 'What is the capital of Mizoram?', text: 'What is the capital of Mizoram?', options: ['Imphal', 'Agartala', 'Aizawl', 'Kohima'], answer: 'Aizawl' },
    { id: 10, category: 'History', question: 'The ancient city of "Pataliputra" is currently known as?', text: 'The ancient city of "Pataliputra" is currently known as?', options: ['Varanasi', 'Allahabad', 'Patna', 'Lucknow'], answer: 'Patna' }
  ],
  'neet-bio-1': [
    { id: 1, category: 'Biology', question: 'Which of the following is known as the "powerhouse" of the cell?', text: 'Which of the following is known as the "powerhouse" of the cell?', options: ['Nucleus', 'Mitochondrion', 'Ribosome', 'Endoplasmic Reticulum'], answer: 'Mitochondrion' },
    { id: 2, category: 'Biology', question: 'The process of photosynthesis occurs in?', text: 'The process of photosynthesis occurs in?', options: ['Mitochondria', 'Chloroplasts', 'Ribosomes', 'Nucleus'], answer: 'Chloroplasts' },
    { id: 3, category: 'Biology', question: 'Which blood group is called the "universal donor"?', text: 'Which blood group is called the "universal donor"?', options: ['A', 'B', 'AB', 'O'], answer: 'O' },
    { id: 4, category: 'Biology', question: 'What is the largest organ in the human body?', text: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Heart', 'Skin'], answer: 'Skin' },
    { id: 5, category: 'Biology', question: 'Deficiency of Vitamin D causes which disease?', text: 'Deficiency of Vitamin D causes which disease?', options: ['Scurvy', 'Rickets', 'Beriberi', 'Night blindness'], answer: 'Rickets' },
    { id: 6, category: 'Biology', question: 'Which gas is most essential for respiration?', text: 'Which gas is most essential for respiration?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Hydrogen'], answer: 'Oxygen' },
    { id: 7, category: 'Biology', question: 'The study of insects is known as?', text: 'The study of insects is known as?', options: ['Ornithology', 'Entomology', 'Botany', 'Zoology'], answer: 'Entomology' },
    { id: 8, category: 'Biology', question: 'What is the main function of red blood cells (RBCs)?', text: 'What is the main function of red blood cells (RBCs)?', options: ['Fight infection', 'Transport oxygen', 'Help in blood clotting', 'Produce antibodies'], answer: 'Transport oxygen' },
    { id: 9, category: 'Biology', question: 'Which part of the brain is responsible for balance and coordination?', text: 'Which part of the brain is responsible for balance and coordination?', options: ['Cerebrum', 'Cerebellum', 'Medulla Oblongata', 'Thalamus'], answer: 'Cerebellum' },
    { id: 10, category: 'Biology', question: 'DNA is a polymer of?', text: 'DNA is a polymer of?', options: ['Amino acids', 'Nucleotides', 'Fatty acids', 'Monosaccharides'], answer: 'Nucleotides' }
  ],
};

export const PastQuizzesData: PastQuiz[] = [
  {
    id: 'pq1',
    quizTitle: 'UPSC General Studies Mix',
    date: '2024-05-10',
    score: 80,
    correct: 8,
    incorrect: 2,
    skipped: 0,
    total: 10,
    feedback: 'Good attempt! You have a strong grasp on Polity. Focus more on modern History dates.'
  },
  {
    id: 'pq2',
    quizTitle: 'NEET Biology Practice',
    date: '2024-05-12',
    score: 65,
    correct: 7,
    incorrect: 2,
    skipped: 1,
    total: 10,
    feedback: 'Solid performance in Biology. Review the chapter on genetics to improve your score.'
  }
];

export const LeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Ravi Kumar', state: 'Uttar Pradesh', score: 2500 },
  { rank: 2, name: 'Priya Sharma', state: 'Maharashtra', score: 2450 },
  { rank: 3, name: 'Suresh Singh', state: 'Bihar', score: 2300 },
  { rank: 4, name: 'Anjali Desai', state: 'Gujarat', score: 2280 },
  { rank: 5, name: 'Alex Doe', state: 'California', score: 1250 },
  { rank: 6, name: 'Ben Carter', state: 'Texas', score: 1100 },
  { rank: 7, name: 'Sita Patil', state: 'Karnataka', score: 1050 },
  { rank: 8, name: 'Vikram Reddy', state: 'Andhra Pradesh', score: 980 },
];
