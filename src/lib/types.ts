export interface UrtPassage {
  passage: string;
  questions: string[];
}

export interface QuestionWithOptions {
  question: string;
  options: string[];
  answer: string;
}

export interface GradedResult {
  isCorrect: boolean;
  explanationEnglish: string;
  explanationArabic: string;
  userAnswer: string;
  correctAnswer: string;
  question: string;
}
