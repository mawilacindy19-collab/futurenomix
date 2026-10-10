import React from 'react';

interface ProgressBarProps {
  percentage: number;
}

export function ProfileCompletionBar({ percentage }: ProgressBarProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Profile Completeness</h3>
        <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
        {percentage < 100 
          ? "Complete your profile to increase your match score and attract more opportunities." 
          : "Your profile is fully complete!"}
      </p>
    </div>
  );
}
