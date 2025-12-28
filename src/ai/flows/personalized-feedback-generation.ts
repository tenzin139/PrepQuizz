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

const QuestionResultSchema = z.object({
  questionText: z.string().describe('The text of the quiz question.'),
  userAnswer: z.string().describe("The answer the user selected."),
  correctAnswer: z.string().describe('The correct answer for the question.'),
  category: z.string().describe('The category of the question.'),
});

const PersonalizedFeedbackInputSchema = z.object({
  incorrectQuestions: z.array(QuestionResultSchema).describe('An array of questions the user answered incorrectly.'),
  userName: z.string().describe('The name of the user who took the quiz.'),
  userAge: z.number().describe('The age of the user who took the quiz.'),
  userState: z.string().describe('The state of the user who took the quiz.'),
});

export type PersonalizedFeedbackInput = z.infer<typeof PersonalizedFeedbackInputSchema>;

const QuestionFeedbackSchema = z.object({
  questionText: z.string(),
  feedback: z.string().describe("A short, encouraging explanation for why the user's answer was incorrect and the correct answer is right."),
  resourceQuery: z.string().describe("A concise Google search query (3-5 words) to help the user find resources to learn more about the topic of the question."),
});

const PersonalizedFeedbackOutputSchema = z.object({
  overallFeedback: z.string().describe("A brief, overall summary of the user's performance, highlighting general areas for improvement."),
  questionFeedback: z.array(QuestionFeedbackSchema).describe('An array of detailed feedback for each incorrect question.'),
});

export type PersonalizedFeedbackOutput = z.infer<typeof PersonalizedFeedbackOutputSchema>;

export async function generatePersonalizedFeedback(input: PersonalizedFeedbackInput): Promise<PersonalizedFeedbackOutput> {
  return personalizedFeedbackFlow(input);
}

const personalizedFeedbackPrompt = ai.definePrompt({
  name: 'personalizedFeedbackPrompt',
  input: {schema: PersonalizedFeedbackInputSchema},
  output: {schema: PersonalizedFeedbackOutputSchema},
  prompt: `You are an AI-powered educational assistant that provides personalized, constructive, and encouraging feedback to students after a quiz.

  Analyze the student's performance on the questions they answered incorrectly.

  For the overall feedback, provide a brief, supportive summary (1-2 sentences) of their performance based on the categories of the incorrect questions.

  For each incorrect question, provide:
  1. A short, encouraging explanation (1-2 sentences) of why their answer was incorrect and why the correct answer is right.
  2. A concise Google search query (3-5 words) that would lead them to reliable resources to learn more about the question's topic.

  Here is the student's information:
  User Name: {{{userName}}}
  User Age: {{{userAge}}}
  User State: {{{userState}}}

  Incorrect Questions:
  {{#each incorrectQuestions}}
  - Question: "{{this.questionText}}"
    Category: {{this.category}}
    Your Answer: "{{this.userAnswer}}"
    Correct Answer: "{{this.correctAnswer}}"
  {{/each}}

  Generate the personalized feedback in the required JSON format.
  `,
  config: {
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
    // If there are no incorrect questions, return a positive message.
    if (input.incorrectQuestions.length === 0) {
      return {
        overallFeedback: `Great job, ${input.userName}! You answered all the questions correctly. Keep up the excellent work!`,
        questionFeedback: [],
      };
    }
    const {output} = await personalizedFeedbackPrompt(input);
    return output!;
  }
);
