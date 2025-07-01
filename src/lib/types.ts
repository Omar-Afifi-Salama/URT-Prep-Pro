export interface UrtQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface UrtTest {
  title: string;
  passage: string;
  questions: UrtQuestion[];
  imageUrl: string;
  recommendedTime?: number;
  tokenUsage?: number;
}

export interface GradedResult {
  isCorrect: boolean;
  explanationEnglish: string;
  explanationArabic: string;
  userAnswer: string;
  correctAnswer: string;
  question: string;
}

export interface TestHistoryItem {
  id: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctQuestions: number;
  date: string;
}
