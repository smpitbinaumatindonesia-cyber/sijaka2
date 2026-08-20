import React from 'react';

export const KpiSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  const items = Array.from({ length: count }, (_, i) => i + 1);
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-pulse">
      {items.map((i) => (
        <div key={i} className="bg-[#0B1428] border border-slate-800 rounded-2xl p-4 h-[125px] flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="w-16 h-2.5 bg-slate-800 rounded"></div>
              <div className="w-24 h-6 bg-slate-700 rounded"></div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-800"></div>
          </div>
          <div className="w-28 h-2 bg-slate-800/80 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-[#0B1428] border border-slate-800 rounded-3xl p-6 h-[360px] animate-pulse flex flex-col justify-between">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <div className="space-y-1.5">
          <div className="w-32 h-4 bg-slate-700 rounded"></div>
          <div className="w-48 h-2.5 bg-slate-800 rounded"></div>
        </div>
        <div className="w-20 h-7 bg-slate-800 rounded-xl"></div>
      </div>
      <div className="flex-1 flex items-end gap-3 py-6 px-2">
        {[40, 65, 30, 85, 55, 90, 45, 70, 95, 60, 75, 80].map((h, idx) => (
          <div key={idx} className="flex-1 bg-slate-800/60 rounded-t-md" style={{ height: `${h}%` }}></div>
        ))}
      </div>
      <div className="flex justify-between pt-2 border-t border-slate-800">
        <div className="w-24 h-3 bg-slate-800 rounded"></div>
        <div className="w-24 h-3 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

export const ActivitySkeleton: React.FC = () => {
  return (
    <div className="bg-[#0B1428] border border-slate-800 rounded-3xl p-6 animate-pulse space-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="w-36 h-4 bg-slate-700 rounded"></div>
        <div className="w-16 h-3 bg-slate-800 rounded"></div>
      </div>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
          <div className="w-8 h-8 rounded-xl bg-slate-800 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between">
              <div className="w-28 h-3 bg-slate-700 rounded"></div>
              <div className="w-12 h-2 bg-slate-800 rounded"></div>
            </div>
            <div className="w-44 h-2 bg-slate-800 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const MemberListSkeleton: React.FC = () => {
  return (
    <div className="bg-[#0B1428] border border-slate-800 rounded-3xl p-6 animate-pulse space-y-3">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800">
        <div className="w-36 h-4 bg-slate-700 rounded"></div>
        <div className="w-16 h-3 bg-slate-800 rounded"></div>
      </div>
      <div className="space-y-2.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800"></div>
              <div className="space-y-1.5">
                <div className="w-32 h-3.5 bg-slate-700 rounded"></div>
                <div className="w-20 h-2 bg-slate-800 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-5 bg-slate-800 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
