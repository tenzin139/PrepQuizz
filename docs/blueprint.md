# **App Name**: UPSC NEET Prep

## Core Features:

- User Authentication & Profile: Secure user login with Firebase Authentication. Store user details (name, age, state, profile image) in Firestore.
- Quiz Engine: Deliver quizzes with up to 500 questions pulled from Firestore. Track time, calculate scores (+3 for correct, -1 for skip, -5 for incorrect).
- Result Tracking: Persist user quiz result to Firestore, enabling record and performance review
- Personalized Feedback: Analyze user performance, generate category-specific feedback. Indicate areas where users need to improve. Use Cloud Function tool for analyzing the quiz results and securely generating the feedback.
- Leaderboard: Display a global leaderboard based on user points. Show user's state alongside their score. Scoreboard updates when quizzes are saved to the Firestore.
- Homepage: Display a user's quiz records and highlight categories needing improvement. User data stored to the Firestore.
- Account Page: Show total score and personalized feedback.

## Style Guidelines:

- Primary color: Deep blue (#2851A3), reminiscent of academic settings and symbolizing knowledge and focus.
- Background color: Light blue (#E5EAF2), offering a clean and distraction-free interface.
- Accent color: Yellow-orange (#E58E00) to highlight important elements like scores and feedback.
- Body and headline font: 'Inter', a sans-serif for a modern, clean, and highly readable interface.
- Note: currently only Google Fonts are supported.
- Use clear, professional icons that represent different quiz categories (e.g., history, science). Favor a simple line style.
- Maintain a clean, intuitive layout. Use clear section headings and ample whitespace.
- Incorporate subtle animations on the Home page (such as appearing quiz results) and for positive feedback.