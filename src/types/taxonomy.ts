export type SubjectId =
  | 'history'
  | 'art-culture'
  | 'geography'
  | 'polity-admin'
  | 'economy'
  | 'sports-awards'
  | 'govt-schemes';

export type PYQFrequency = 'ultra-high' | 'high' | 'medium' | 'low';
export type ExamTarget = 'RAS' | 'CET' | 'Patwari' | 'Police' | 'REET' | '1st-Grade' | 'All';

export interface BilingualText {
  en: string;
  hi: string;
}

export interface SubTopicSummary {
  id: string; // e.g. "A.01.01"
  unit_id: string; // e.g. "A.01"
  subject_id: SubjectId;
  slug: string;
  title: BilingualText;
  pyq_frequency: PYQFrequency;
  target_exams: ExamTarget[];
  key_highlights?: BilingualText;
  has_full_content?: boolean;
}

export interface UnitSummary {
  id: string; // e.g. "A.01"
  subject_id: SubjectId;
  title: BilingualText;
  description?: BilingualText;
  subtopics: SubTopicSummary[];
}

export interface SubjectSummary {
  id: SubjectId;
  code: string; // e.g. "A", "B", "C"
  title: BilingualText;
  tagline: BilingualText;
  color: string;
  icon: string;
  units: UnitSummary[];
}

export interface MasterTaxonomy {
  version: string;
  last_updated: string;
  subjects: SubjectSummary[];
}
