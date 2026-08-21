import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  DollarSign, 
  UserCheck, 
  Heart, 
  Clock,
  ChevronRight
} from 'lucide-react';
import { ActivityItem } from '../services/dashboardService';

interface RecentActivitiesPanelProps {
  activities: ActivityItem[];
}

export const RecentActivitiesPanel: React.FC<RecentActivitiesPanelProps> = ({ activities }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'claim':
        return <AlertTriangle className="w-4 h-4 text-rose-400 stroke-[2]" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-400 stroke-[2]" />;
      case 'member_update':
        return <UserCheck className="w-4 h-4 text-blue-400 stroke-[2]" />;
      case 'service':
        return <Heart className="w-4 h-4 text-purple-400 stroke-[2]" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400 stroke-[2]" />;
    }
  };

  const getBadgeStyle = (color: string) => {
    switch (color) {
      case 'rose':
        return 'bg-rose-500/10 border-rose-500/20 text-rose-300';
      case 'emerald':
        return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300';
      case 'blue':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
      case 'purple':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-300';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 shrink-0">
            <Activity className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Aktivitas Terbaru
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
              Log aktivitas mutasi, santunan, dan administrasi sistem
            </p>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
          Realtime
        </span>
      </div>

      {/* List on mobile (max 3 items) vs Full list on desktop (sm:) */}
      {activities.length === 0 ? (
        <div className="py-8 text-center text-xs sm:text-sm text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60 mt-3">
          Belum ada catatan aktivitas terbaru saat ini.
        </div>
      ) : (
        <div className="mt-3.5 space-y-2 sm:space-y-2.5">
          {activities.map((act, index) => (
            <div
              key={act.id}
              className={`items-start gap-3 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all group ${
                index >= 3 ? 'hidden sm:flex' : 'flex'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${getBadgeStyle(act.badgeColor)}`}>
                {getIcon(act.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                    {act.title}
                  </h4>
                  <span className="text-xs text-slate-400 shrink-0 font-normal flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{act.timeAgo}</span>
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-1">
                  {act.description}
                </p>
                <div className="text-xs text-slate-500 mt-1 font-mono">
                  Oleh: {act.actor}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mobile Footer Link: Lihat Semua → */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex sm:hidden items-center justify-between">
        <span className="text-xs text-slate-500">Menampilkan 3 aktivitas terbaru</span>
        <button 
          onClick={() => {
            const btn = document.getElementById('tab-buku-kas-trigger');
            if (btn) btn.click();
          }}
          className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
