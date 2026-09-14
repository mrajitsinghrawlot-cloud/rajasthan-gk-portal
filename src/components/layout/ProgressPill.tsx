import React from 'react';

interface ProgressPillProps {
  completed: number;
  total: number;
  percentage: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const ProgressPill: React.FC<ProgressPillProps> = ({
  completed,
  total,
  percentage,
  size = 'md',
  showLabel = true,
}) => {
  const isMastered = percentage >= 80;
  const isStarted = percentage > 0;

  const barColor = isMastered
    ? 'bg-emerald-500'
    : isStarted
    ? 'bg-rajasthan-saffron'
    : 'bg-stone-300 dark:bg-stone-700';

  const textColor = isMastered
    ? 'text-emerald-700 dark:text-emerald-400'
    : isStarted
    ? 'text-rajasthan-saffron dark:text-orange-400'
    : 'text-stone-400 dark:text-stone-500';

  return (
    <div className="flex items-center gap-2">
      {/* Progress track */}
      <div className={`flex-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden ${size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'}`}>
        <div
          className={`h-full transition-all duration-500 rounded-full ${barColor}`}
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      {/* Percentage label */}
      {showLabel && (
        <span className={`font-mono text-xs font-semibold tabular-nums shrink-0 ${textColor}`}>
          {completed}/{total} ({percentage}%)
        </span>
      )}
    </div>
  );
};
