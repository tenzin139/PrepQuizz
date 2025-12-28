'use server';

import { generatePersonalizedFeedback, type PersonalizedFeedbackInput } from '@/ai/flows/personalized-feedback-generation';
import { redirect } from 'next/navigation';

export async function handleLogin(formData: FormData) {
  // In a real app, you would authenticate with Firebase here
  console.log('Login attempt:', Object.fromEntries(formData.entries()));
  redirect('/');
}

export async function handleSignup(formData: FormData) {
  // In a real app, you would create a user with Firebase Auth
  // and save profile data to Firestore
  console.log('Signup attempt:', Object.fromEntries(formData.entries()));
  redirect('/');
}

export async function getAIFeedback(quizResults: PersonalizedFeedbackInput['quizResults']) {
  // In a real app, user data would come from the authenticated session
  const userData = {
    userName: 'Alex Doe',
    userAge: 23,
    userState: 'California',
  };

  const input: PersonalizedFeedbackInput = {
    ...userData,
    quizResults,
  };

  try {
    const result = await generatePersonalizedFeedback(input);
    return { feedback: result.feedback };
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return { error: 'Failed to generate feedback. Please try again later.' };
  }
}
