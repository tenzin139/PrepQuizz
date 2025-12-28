'use server';

import { generatePersonalizedFeedback, type PersonalizedFeedbackInput, type PersonalizedFeedbackOutput } from '@/ai/flows/personalized-feedback-generation';
import { redirect } from 'next/navigation';
import { initializeFirebase, setDocumentNonBlocking, initiateEmailSignIn, initiateEmailSignUp } from '@/firebase';
import { doc } from 'firebase/firestore';

export async function handleLogin(formData: FormData) {
  const { auth } = initializeFirebase();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    // Handle case where email or password are not provided
    return { error: 'Email and password are required.' };
  }

  try {
    initiateEmailSignIn(auth, email, password);
  } catch (error: any) {
    return { error: error.message };
  }

  redirect('/');
}

export async function handleSignup(formData: FormData) {
  const { auth, firestore } = initializeFirebase();

  const name = formData.get('name') as string;
  const age = formData.get('age') as string;
  const state = formData.get('state') as string;
  const avatarUrl = formData.get('avatarUrl') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !age || !state || !avatarUrl || !email || !password) {
    return { error: 'Please fill out all fields.' };
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    if (user) {
      const userProfile = {
        id: user.uid,
        name,
        age: parseInt(age, 10),
        state,
        profileImageURL: avatarUrl,
      };

      const userDocRef = doc(firestore, `users/${user.uid}`);
      setDocumentNonBlocking(userDocRef, userProfile, { merge: true });
    }
  } catch (error: any) {
    return { error: error.message };
  }

  redirect('/');
}


export async function getAIFeedback(payload: { incorrectQuestions: PersonalizedFeedbackInput['incorrectQuestions'] }): Promise<{ feedback?: PersonalizedFeedbackOutput; error?: string }> {
  // In a real app, user data would come from the authenticated session
  const userData = {
    userName: 'Alex Doe',
    userAge: 23,
    userState: 'California',
  };

  const input: PersonalizedFeedbackInput = {
    ...userData,
    incorrectQuestions: payload.incorrectQuestions,
  };

  try {
    const result = await generatePersonalizedFeedback(input);
    return { feedback: result };
  } catch (error) {
    console.error('Error generating AI feedback:', error);
    return { error: 'Failed to generate feedback. Please try again later.' };
  }
}
