export interface Question {
  num: number;
  question: string;
  options: Record<string, string>;
  answer: string;
  explanation: string;
  tier: string;
}

export interface FormulaItem {
  name: string;
  latex: string;
}

export interface FormulaSection {
  module: string;
  formulas: FormulaItem[];
}

export interface StudyGuide {
  id: string;
  file: string;
  label: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  questionFile: string;
  formulaFile?: string;
  enableShuffle: boolean;
  studyGuides: StudyGuide[];
}

export interface AppConfig {
  title: string;
  subtitle: string;
  enableBackButton: boolean;
  showFormulas: boolean;
  courses: Course[];
}

export interface Answer {
  qIndex: number;
  question: Question;
  selected: string;
  correct: string;
  isCorrect: boolean;
  timeSpent: number;
}

export type QuizMode = 'all' | 'quick' | 'tier' | 'custom';

export interface QuizState {
  courseId: string;
  questions: Question[];
  currentIndex: number;
  score: number;
  answered: number;
  answers: Answer[];
  mode: QuizMode;
  moduleFilter: string | null;
}

export type Screen = 'course' | 'mode' | 'quiz' | 'summary';
