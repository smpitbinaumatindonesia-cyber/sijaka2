import React from 'react';
import { LucideIcon, FileQuestion, Plus, RefreshCw, DollarSign, Heart, Users, FileText } from 'lucide-react';

interface SijakaEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: LucideIcon;
  actionVariant?: 'primary' | 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
}

export const SijakaEmptyState: React.FC<SijakaEmptyStateProps> = ({
  icon: Icon = FileQuestion,
  title,
  description,
  actionText,
  onAction,
  actionIcon: ActionIcon = Plus,
  actionVariant = 'emerald',
  secondaryActionText,
  onSecondaryAction,
}) => {
  const getButtonClass = () => {
    switch (actionVariant) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/30';
      case 'amber':
        return 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30';
      case 'rose':
        return 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30';
      case 'primary':
      case 'emerald':
      default:
        return 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl bg-slate-950/60 border border-slate-800/80 my-2">
      {/* Icon with subtle halo */}
      <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3.5 shadow-inner">
        <Icon className="w-7 h-7 stroke-[1.7]" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight mb-1">
        {title}
      </h4>
      <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
        {description}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {actionText && onAction && (
          <button
            onClick={onAction}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all active:scale-[0.98] ${getButtonClass()}`}
          >
            <ActionIcon className="w-3.5 h-3.5" />
            <span>{actionText}</span>
          </button>
        )}

        {secondaryActionText && onSecondaryAction && (
          <button
            onClick={onSecondaryAction}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>{secondaryActionText}</span>
          </button>
        )}
      </div>
    </div>
  );
};
