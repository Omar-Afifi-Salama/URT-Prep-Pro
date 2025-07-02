
export interface UrtQuestion {
  question: string;
  options: string[];
  answer: string;
  explanationEnglish: string;
  explanationArabic: string;
}

export interface ChartData {
  type: 'bar';
  data: any[];
  xAxisKey: string;
  yAxisKeys: string[];
  yAxisLabel: string;
}

export interface UrtTest {
  title: string;
  passage: string;
  questions: UrtQuestion[];
  imageUrl?: string;
  recommendedTime?: number;
  tokenUsage?: number;
  subject: string;
  chartData?: ChartData;
}

export interface GradedResult {
  isCorrect: boolean;
  explanationEnglish: string;
  explanationArabic: string;
  userAnswer: string;
  correctAnswer: string;
  question: string;
}

export interface SubjectScore {
  subject: string;
  score: number;
  correctQuestions: number;
  totalQuestions: number;
}

export interface TestHistoryItem {
  id: string;
  subjects: string[];
  overallScore: number;
  totalQuestions: number;
  correctQuestions: number;
  date: string;
  scoresBySubject: SubjectScore[];
  type: 'single' | 'full';
  testData: UrtTest[];
  results: GradedResult[][];
  timeTaken: number;
}
