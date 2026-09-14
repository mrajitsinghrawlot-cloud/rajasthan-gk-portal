import type { SubjectId } from './taxonomy';

export type SubTopicStatus = 'not_started' | 'reading' | 'quiz_passed' | 'mastered';

export interface QuizAttempt {
  timestamp: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
}

export interface SubTopicProgress {
  id: string;
  status: SubTopicStatus;
  isNotesRead: boolean;
  notesReadTimestamp?: string;
  revisionCount: number;
  lastRevisedTimestamp?: string;
  isBookmarked: boolean;
  isWeakFlagged: boolean;
  personalNotes?: string;
  bestQuizScore?: number;
  quizAttempts: QuizAttempt[];
}

export interface UnitProgressMetrics {
  unitId: string;
  totalSubtopics: number;
  completedSubtopics: number;
  masteredSubtopics: number;
  percentage: number;
}

export interface SubjectProgressMetrics {
  subjectId: SubjectId;
  totalSubtopics: number;
  completedSubtopics: number;
  masteredSubtopics: number;
  percentage: number;
  unitMetrics: Record<string, UnitProgressMetrics>;
}

export interface GlobalProgressMetrics {
  totalSubtopics: number;
  completedSubtopics: number;
  masteredSubtopics: number;
  overallPercentage: number;
  totalQuizAttempts: number;
  overallAccuracyPercentage: number;
  totalRevisionsLogged: number;
  weakTopicsCount: number;
  bookmarkedCount: number;
  subjectMetrics: Record<SubjectId, SubjectProgressMetrics>;
}

export interface UserProgressState {
  version: number;
  lastActiveDate: string;
  subtopicProgress: Record<string, SubTopicProgress>;
}
