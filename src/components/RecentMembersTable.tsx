import React from 'react';
import { 
  Users, 
  ChevronRight, 
  Calendar, 
  Eye
} from 'lucide-react';

interface RecentMembersTableProps {
  anggotaList: any[];
  onViewAllMembers: () => void;
  onOpenAnggotaDetail?: (anggota: any) => void;
}

export const RecentMembersTable: React.FC<RecentMembersTableProps> = ({
  anggotaList,
  onViewAllMembers,
  onOpenAnggotaDetail
}) => {
  const displayList = anggotaList.slice(0, 5);
  const mobileDisplayList = anggotaList.slice(0, 3); // Max 3 items on mobile as requested

  return (
    <div className="bg-[#0B1428] border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              ANGGOTA TERBARU
            </h3>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Daftar kepala keluarga terdaftar dalam jaminan kematian
            </p>
          </div>
        </div>

        <button
          onClick={onViewAllMembers}
          className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Table View */}
      {anggotaList.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800/60 mt-3">
          Belum ada data anggota yang terdaftar saat ini.
        </div>
      ) : (
        <>
          <div className="hidden sm:block mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 font-semibold border-b border-slate-800/80 pb-2">
                  <th className="pb-2 text-xs">Nama Anggota (KK)</th>
                  <th className="pb-2 text-xs">Status</th>
                  <th className="pb-2 text-xs">Iuran Terakhir</th>
                  <th className="pb-2 text-xs text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {displayList.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-900/50 transition-colors group">
                    <td className="py-2.5">
                      <div className="font-semibold text-white group-hover:text-blue-300 transition-colors text-xs">
                        {a.nama}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                        <span>ID: {a.id}</span>
                        <span>•</span>
                        <span>{a.keluarga?.length || 0} Jiwa</span>
                      </div>
                    </td>
                    <td className="py-2.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>Aktif</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-300 font-medium text-xs">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-400" />
                        <span>Mei 2026</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={onViewAllMembers}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-all inline-flex items-center gap-1 text-[11px] font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View (Strictly max 3 items with clean card format) */}
          <div className="sm:hidden mt-3.5 space-y-2.5">
            {mobileDisplayList.map((a) => (
              <div
                key={a.id}
                onClick={onViewAllMembers}
                className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-white">{a.nama}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                      <span>Aktif</span>
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>Iuran terakhir: <strong className="text-slate-200">Mei 2026</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 pl-2">
                  <span className="text-[11px]">Detail</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};
