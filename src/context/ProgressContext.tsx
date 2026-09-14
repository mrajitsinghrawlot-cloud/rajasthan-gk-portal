import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SubTopicProgress,
  SubTopicStatus,
  UserProgressState,
  GlobalProgressMetrics,
  SubjectProgressMetrics,
  UnitProgressMetrics,
  QuizAttempt,
} from '../types/progress';
import type { MasterTaxonomy, SubjectId } from '../types/taxonomy';
import taxonomyDataRaw from '../data/taxonomy.json';

const taxonomyData = taxonomyDataRaw as unknown as MasterTaxonomy;

const STORAGE_KEY = 'rj_study_user_progress_v1';

interface ProgressContextType {
  progressState: UserProgressState;
  globalMetrics: GlobalProgressMetrics;
  getSubtopicProgress: (subtopicId: string) => SubTopicProgress;
  getUnitMetrics: (unitId: string) => UnitProgressMetrics;
  getSubjectMetrics: (subjectId: SubjectId) => SubjectProgressMetrics;
  toggleNotesRead: (subtopicId: string) => void;
  logRevision: (subtopicId: string) => void;
  toggleBookmark: (subtopicId: string) => void;
  toggleWeakFlag: (subtopicId: string) => void;
  saveQuizResult: (subtopicId: string, score: number, total: number, timeSpent: number) => void;
  exportProgressData: () => string;
  importProgressData: (jsonData: string) => boolean;
  resetAllProgress: () => void;
}

const defaultSubtopicProgress = (id: string): SubTopicProgress => ({
  id,
  status: 'not_started',
  isNotesRead: false,
  revisionCount: 0,
  isBookmarked: false,
  isWeakFlagged: false,
  quizAttempts: [],
});

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressState, setProgressState] = useState<UserProgressState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading progress from storage', e);
    }
    return {
      version: 1,
      lastActiveDate: new Date().toISOString(),
      subtopicProgress: {},
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressState));
    } catch (e) {
      console.error('Error saving progress to storage', e);
    }
  }, [progressState]);

  const getSubtopicProgress = (subtopicId: string): SubTopicProgress => {
    return progressState.subtopicProgress[subtopicId] || defaultSubtopicProgress(subtopicId);
  };

  const updateSubtopic = (
    subtopicId: string,
    updater: (prev: SubTopicProgress) => SubTopicProgress
  ) => {
    setProgressState(prev => {
      const current = prev.subtopicProgress[subtopicId] || defaultSubtopicProgress(subtopicId);
      const updated = updater(current);
      return {
        ...prev,
        lastActiveDate: new Date().toISOString(),
        subtopicProgress: {
          ...prev.subtopicProgress,
          [subtopicId]: updated,
        },
      };
    });
  };

  const toggleNotesRead = (subtopicId: string) => {
    updateSubtopic(subtopicId, current => {
      const isNotesRead = !current.isNotesRead;
      let status: SubTopicStatus = current.status;
      if (isNotesRead && status === 'not_started') {
        status = 'reading';
      } else if (!isNotesRead && current.quizAttempts.length === 0) {
        status = 'not_started';
      }
      return {
        ...current,
        isNotesRead,
        notesReadTimestamp: isNotesRead ? new Date().toISOString() : undefined,
        status,
      };
    });
  };

  const logRevision = (subtopicId: string) => {
    updateSubtopic(subtopicId, current => {
      const revisionCount = current.revisionCount + 1;
      const isMastered = revisionCount >= 2 || (current.bestQuizScore !== undefined && current.bestQuizScore >= 80);
      return {
        ...current,
        revisionCount,
        lastRevisedTimestamp: new Date().toISOString(),
        status: isMastered ? 'mastered' : current.status === 'not_started' ? 'reading' : current.status,
      };
    });
  };

  const toggleBookmark = (subtopicId: string) => {
    updateSubtopic(subtopicId, current => ({
      ...current,
      isBookmarked: !current.isBookmarked,
    }));
  };

  const toggleWeakFlag = (subtopicId: string) => {
    updateSubtopic(subtopicId, current => ({
      ...current,
      isWeakFlagged: !current.isWeakFlagged,
    }));
  };

  const saveQuizResult = (
    subtopicId: string,
    score: number,
    total: number,
    timeSpent: number
  ) => {
    const percentage = Math.round((score / total) * 100);
    const newAttempt: QuizAttempt = {
      timestamp: new Date().toISOString(),
      score,
      total,
      percentage,
      timeSpentSeconds: timeSpent,
    };

    updateSubtopic(subtopicId, current => {
      const attempts = [newAttempt, ...(current.quizAttempts || [])];
      const bestScore = Math.max(current.bestQuizScore || 0, percentage);
      const isPassed = percentage >= 60;
      const isMastered = percentage >= 80 || current.revisionCount >= 2;

      let status: SubTopicStatus = current.status;
      if (isMastered) status = 'mastered';
      else if (isPassed) status = 'quiz_passed';
      else if (status === 'not_started') status = 'reading';

      return {
        ...current,
        bestQuizScore: bestScore,
        quizAttempts: attempts,
        status,
        isWeakFlagged: percentage < 60 ? true : current.isWeakFlagged,
      };
    });
  };

  // Roll-up Calculations
  const calculateMetrics = (): GlobalProgressMetrics => {
    let globalTotal = 0;
    let globalCompleted = 0;
    let globalMastered = 0;
    let totalAttempts = 0;
    let totalScoreSum = 0;
    let totalRevisions = 0;
    let weakCount = 0;
    let bookmarkCount = 0;

    const subjectMetricsRecord = {} as Record<SubjectId, SubjectProgressMetrics>;

    taxonomyData.subjects.forEach(subject => {
      let subjTotal = 0;
      let subjCompleted = 0;
      let subjMastered = 0;
      const unitMetricsRecord: Record<string, UnitProgressMetrics> = {};

      subject.units.forEach(unit => {
        const unitTotal = unit.subtopics.length;
        let unitCompleted = 0;
        let unitMastered = 0;

        unit.subtopics.forEach(sub => {
          const prog = progressState.subtopicProgress[sub.id] || defaultSubtopicProgress(sub.id);
          if (prog.status === 'mastered') {
            unitMastered++;
            unitCompleted++;
          } else if (prog.status === 'quiz_passed' || prog.isNotesRead) {
            unitCompleted++;
          }

          if (prog.isWeakFlagged) weakCount++;
          if (prog.isBookmarked) bookmarkCount++;
          totalRevisions += prog.revisionCount;

          if (prog.quizAttempts && prog.quizAttempts.length > 0) {
            totalAttempts += prog.quizAttempts.length;
            prog.quizAttempts.forEach(att => (totalScoreSum += att.percentage));
          }
        });

        subjTotal += unitTotal;
        subjCompleted += unitCompleted;
        subjMastered += unitMastered;

        unitMetricsRecord[unit.id] = {
          unitId: unit.id,
          totalSubtopics: unitTotal,
          completedSubtopics: unitCompleted,
          masteredSubtopics: unitMastered,
          percentage: unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0,
        };
      });

      globalTotal += subjTotal;
      globalCompleted += subjCompleted;
      globalMastered += subjMastered;

      subjectMetricsRecord[subject.id] = {
        subjectId: subject.id,
        totalSubtopics: subjTotal,
        completedSubtopics: subjCompleted,
        masteredSubtopics: subjMastered,
        percentage: subjTotal > 0 ? Math.round((subjCompleted / subjTotal) * 100) : 0,
        unitMetrics: unitMetricsRecord,
      };
    });

    return {
      totalSubtopics: globalTotal,
      completedSubtopics: globalCompleted,
      masteredSubtopics: globalMastered,
      overallPercentage: globalTotal > 0 ? Math.round((globalCompleted / globalTotal) * 100) : 0,
      totalQuizAttempts: totalAttempts,
      overallAccuracyPercentage: totalAttempts > 0 ? Math.round(totalScoreSum / totalAttempts) : 0,
      totalRevisionsLogged: totalRevisions,
      weakTopicsCount: weakCount,
      bookmarkedCount: bookmarkCount,
      subjectMetrics: subjectMetricsRecord,
    };
  };

  const globalMetrics = calculateMetrics();

  const getUnitMetrics = (unitId: string): UnitProgressMetrics => {
    for (const subj of Object.values(globalMetrics.subjectMetrics)) {
      if (subj.unitMetrics[unitId]) {
        return subj.unitMetrics[unitId];
      }
    }
    return {
      unitId,
      totalSubtopics: 0,
      completedSubtopics: 0,
      masteredSubtopics: 0,
      percentage: 0,
    };
  };

  const getSubjectMetrics = (subjectId: SubjectId): SubjectProgressMetrics => {
    return (
      globalMetrics.subjectMetrics[subjectId] || {
        subjectId,
        totalSubtopics: 0,
        completedSubtopics: 0,
        masteredSubtopics: 0,
        percentage: 0,
        unitMetrics: {},
      }
    );
  };

  const exportProgressData = () => {
    return JSON.stringify(progressState, null, 2);
  };

  const importProgressData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed && typeof parsed.subtopicProgress === 'object') {
        setProgressState(parsed);
        return true;
      }
    } catch (e) {
      console.error('Failed to import progress data', e);
    }
    return false;
  };

  const resetAllProgress = () => {
    setProgressState({
      version: 1,
      lastActiveDate: new Date().toISOString(),
      subtopicProgress: {},
    });
  };

  return (
    <ProgressContext.Provider
      value={{
        progressState,
        globalMetrics,
        getSubtopicProgress,
        getUnitMetrics,
        getSubjectMetrics,
        toggleNotesRead,
        logRevision,
        toggleBookmark,
        toggleWeakFlag,
        saveQuizResult,
        exportProgressData,
        importProgressData,
        resetAllProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
