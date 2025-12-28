'use server';

/**
 * @fileOverview Generates personalized feedback for students after a quiz, highlighting weak areas and suggesting topics for improvement.
 *
 * - generatePersonalizedFeedback - A function that generates personalized feedback for a student's quiz performance.
 * - PersonalizedFeedbackInput - The input type for the generatePersonalizedFeedback function.
 * - PersonalizedFeedbackOutput - The return type for the generatePersonalizedFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedFeedbackInputSchema = z.object({
  quizResults: z.object({
    correctAnswers: z.number().describe('The number of correct answers.'),
    incorrectAnswers: z.number().describe('The number of incorrect answers.'),
    skippedQuestions: z.number().describe('The number of skipped questions.'),
    totalQuestions: z.number().describe('The total number of questions in the quiz.'),
    categoryScores: z.record(z.number()).describe('A record of scores for each quiz category.'),
  }).describe('The results of the quiz.'),
  userName: z.string().describe('The name of the user who took the quiz.'),
  userAge: z.number().describe('The age of the user who took the quiz.'),
  userState: z.string().describe('The state of the user who took the quiz.'),
});

export type PersonalizedFeedbackInput = z.infer<typeof PersonalizedFeedbackInputSchema>;

const PersonalizedFeedbackOutputSchema = z.object({
  feedback: z.string().describe('Personalized feedback for the user, highlighting weak areas and suggesting topics for improvement.'),
});

export type PersonalizedFeedbackOutput = z.infer<typeof PersonalizedFeedbackOutputSchema>;

export async function generatePersonalizedFeedback(input: PersonalizedFeedbackInput): Promise<PersonalizedFeedbackOutput> {
  return personalizedFeedbackFlow(input);
}

const personalizedFeedbackPrompt = ai.definePrompt({
  name: 'personalizedFeedbackPrompt',
  input: {schema: PersonalizedFeedbackInputSchema},
  output: {schema: PersonalizedFeedbackOutputSchema},
  prompt: `You are an AI-powered educational assistant that provides personalized feedback to students after they complete a quiz.

  Analyze the student's quiz performance and provide feedback that highlights their weak areas and suggests topics for improvement.
  Be encouraging and supportive, and tailor the feedback to the student's age and state.

  Here is the student's quiz information:
  User Name: {{{userName}}}
  User Age: {{{userAge}}}
  User State: {{{userState}}}
  Quiz Results:
    Correct Answers: {{{quizResults.correctAnswers}}}
    Incorrect Answers: {{{quizResults.incorrectAnswers}}}
    Skipped Questions: {{{quizResults.skippedQuestions}}}
    Total Questions: {{{quizResults.totalQuestions}}}
    Category Scores: {{#each quizResults.categoryScores}}{{{@key}}}: {{{this}}} {{/each}}

  Generate personalized feedback for the student:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const personalizedFeedbackFlow = ai.defineFlow(
  {
    name: 'personalizedFeedbackFlow',
    inputSchema: PersonalizedFeedbackInputSchema,
    outputSchema: PersonalizedFeedbackOutputSchema,
  },
  async input => {
    const {output} = await personalizedFeedbackPrompt(input);
    return output!;
  }
);
