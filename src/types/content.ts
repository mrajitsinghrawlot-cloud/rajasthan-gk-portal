import type { BilingualText, SubjectId, PYQFrequency, ExamTarget } from './taxonomy';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface BilingualContentBlock {
  section_title: BilingualText;
  content_markdown: BilingualText;
}

export interface TimelineEvent {
  year_or_era: string;
  event: BilingualText;
  significance?: BilingualText;
}

export interface MCQOption {
  id: 'A' | 'B' | 'C' | 'D';
  text: BilingualText;
}

export interface MCQQuestion {
  id: string;
  question: BilingualText;
  options: MCQOption[];
  correct_option: 'A' | 'B' | 'C' | 'D';
  explanation: BilingualText;
  pyq_source?: string;
  difficulty: DifficultyLevel;
  tags?: string[];
}

export interface QuickFact {
  label: BilingualText;
  value: BilingualText;
  category?: string;
}

export interface SubTopicDetail {
  id: string;
  subject_id: SubjectId;
  unit_id: string;
  slug: string;
  title: BilingualText;
  short_summary: BilingualText;
  metadata: {
    pyq_frequency: PYQFrequency;
    target_exams: ExamTarget[];
    last_updated: string;
    author_verified: boolean;
  };
  quick_facts?: QuickFact[];
  notes_sections: BilingualContentBlock[];
  key_facts_rapid_revision: BilingualText[];
  timeline?: TimelineEvent[];
  exam_traps_and_tricks?: BilingualText[];
  mcqs: MCQQuestion[];
}
