import React, { useState, useEffect } from 'react';
import { sijakaEngine } from '../services/sijakaEngine';
import { 
  Users, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Wallet, 
  Plus, 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  UserPlus, 
  FileText, 
  Calendar, 
  Building2, 
  ShieldCheck,
  Search,
  Heart,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Lock,
  ShieldAlert,
  Info,
  Pencil,
  Trash2,
  Edit3,
  Printer,
  FileSpreadsheet
} from 'lucide-react';
import { KeluargaMember } from '../types';
import { maskNik, maskPhone } from '../utils/formatters';
import { KuitansiModal } from './KuitansiModal';
import { LaporanKasPdfModal } from './LaporanKasPdfModal';
import { DynamicHero } from './DynamicHero';
import { QuickActionsPanel } from './QuickActionsPanel';
import { ExecutiveKpiCards } from './ExecutiveKpiCards';
import { ProgressIuranPanel } from './ProgressIuranPanel';
import { InteractivePaymentChart } from './InteractivePaymentChart';
import { RecentActivitiesPanel } from './RecentActivitiesPanel';
import { RecentMembersTable } from './RecentMembersTable';
import { SijakaEmptyState } from './SijakaEmptyState';
import { KpiSkeleton, ChartSkeleton, ActivitySkeleton, MemberListSkeleton } from './SijakaSkeleton';
import { 
  fetchDashboardData, 
  fetchPaymentHistory, 
  fetchActivities, 
  MemberStatusType, 
  DashboardMetricData, 
  YearPaymentHistory, 
  ActivityItem,
  paymentDataStore,
  defaultRecentActivities
} from '../services/dashboardService';

import { SijakaRole } from '../types';
import { PublicDashboard } from './dashboards/PublicDashboard';
import { MemberDashboard } from './dashboards/MemberDashboard';
import { OfficerDashboard } from './dashboards/OfficerDashboard';
import { ChairmanDashboard } from './dashboards/ChairmanDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';

interface WebDashboardProps {
  userRole?: SijakaRole;
  setUserRole?: (role: SijakaRole) => void;
  onOpenWaBotSimulator?: () => void;
  onOpenProfile?: () => void;
  onOpenSettings?: () => void;
  onNavigateTab?: (tab: 'webApp' | 'waBot' | 'sheets' | 'code' | 'security') => void;
  activeSubTab?: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan';
  onSelectSubTab?: (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => void;
}

export const WebDashboard: React.FC<WebDashboardProps> = ({ 
  userRole = 'Anggota', 
  setUserRole, 
  onOpenWaBotSimulator,
  onOpenProfile,
  onOpenSettings,
  onNavigateTab,
  activeSubTab: externalSubTab,
  onSelectSubTab
}) => {
  const [data, setData] = useState(sijakaEngine.getData());
  const [internalSubTab, setInternalSubTab] = useState<'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan'>('kematian');
  const activeSubTab = externalSubTab || internalSubTab;
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAnggotaId, setExpandedAnggotaId] = useState<string | null>(null);

  // Executive Dashboard State
  const [memberStatus, setMemberStatus] = useState<MemberStatusType>('active');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [metrics, setMetrics] = useState<DashboardMetricData>({
    totalMembers: 1248,
    totalMembersGrowth: 12,
    totalMembersGrowthPct: 1.2,
    totalClaims: 86,
    totalClaimsGrowth: 8,
    totalClaimsGrowthPct: 10.2,
    totalContribution: 125450000,
    totalContributionGrowthPct: 5.8,
    activeApplications: 7,
    activeApplicationsNote: 'Menunggu verifikasi'
  });
  const [paymentHistory, setPaymentHistory] = useState<YearPaymentHistory>(paymentDataStore[2026]);
  const [activities, setActivities] = useState<ActivityItem[]>(defaultRecentActivities);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      fetchDashboardData(data).then(setMetrics),
      fetchPaymentHistory(selectedYear).then(setPaymentHistory),
      fetchActivities().then(setActivities)
    ]).finally(() => {
      setIsLoading(false);
    });
  }, [data, selectedYear]);

  // Keyboard handler for modal dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModalKematian(false);
        setShowModalIuran(false);
        setShowModalAnggota(false);
        setShowModalKeluarga(false);
        setShowModalEditAnggota(false);
        setShowModalEditKeluarga(false);
        setShowRestrictedModal(false);
        setKuitansiModal(prev => ({ ...prev, isOpen: false }));
        setIsLaporanKasModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Active Anggota Login state for Anggota mode
  const [activeAnggotaId, setActiveAnggotaId] = useState<string>('ANG-001');

  // Modals state
  const [showModalKematian, setShowModalKematian] = useState(false);
  const [showModalIuran, setShowModalIuran] = useState(false);
  const [showModalAnggota, setShowModalAnggota] = useState(false);
  const [showModalKeluarga, setShowModalKeluarga] = useState(false);
  const [showModalEditAnggota, setShowModalEditAnggota] = useState(false);
  const [showModalEditKeluarga, setShowModalEditKeluarga] = useState(false);
  const [showRestrictedModal, setShowRestrictedModal] = useState(false);
  const [restrictedFeatureName, setRestrictedFeatureName] = useState('');

  // Kuitansi & Laporan Kas PDF Modal States
  const [kuitansiModal, setKuitansiModal] = useState<{
    isOpen: boolean;
    type: 'iuran' | 'santunan';
    item: any;
  }>({ isOpen: false, type: 'iuran', item: null });
  const [isLaporanKasModalOpen, setIsLaporanKasModalOpen] = useState(false);

  // Form inputs
  const [kematianForm, setKematianForm] = useState({ id_anggota: 'ANG-001', jenazah: 'Utama', waktu_kematian: '09-08-2026 04:30', tempat: 'RS Merdeka' });
  const [iuranForm, setIuranForm] = useState({ id_anggota: 'ANG-001', bulan_tahun: 'Agustus 2026', nominal: '50.000', keterangan: 'Iuran Rutin Bulanan' });

  // Edit Forms
  const [editAnggotaForm, setEditAnggotaForm] = useState<{
    id: string;
    nik: string;
    nama: string;
    alamat: string;
    no_hp: string;
    status: 'Aktif' | 'Nonaktif';
  }>({ id: '', nik: '', nama: '', alamat: '', no_hp: '', status: 'Aktif' });

  const [editKeluargaForm, setEditKeluargaForm] = useState<{
    id: string;
    id_anggota: string;
    nik: string;
    nama: string;
    hubungan: KeluargaMember['hubungan'];
    status: 'Hidup' | 'Meninggal';
  }>({ id: '', id_anggota: '', nik: '', nama: '', hubungan: 'Anak', status: 'Hidup' });

  // Permission Check: Admin can edit anyone, Anggota can ONLY edit own family
  const canEditAnggota = (targetIdAnggota: string) => {
    if (userRole === 'Admin') return true;
    return targetIdAnggota.toUpperCase() === activeAnggotaId.toUpperCase();
  };

  const handleOpenEditAnggota = (anggota: any) => {
    if (!canEditAnggota(anggota.id)) {
      setRestrictedFeatureName(`Edit Data Kepala Keluarga (${anggota.nama} - ${anggota.id})`);
      setShowRestrictedModal(true);
      return;
    }
    setEditAnggotaForm({
      id: anggota.id,
      nik: anggota.nik,
      nama: anggota.nama,
      alamat: anggota.alamat,
      no_hp: anggota.no_hp,
      status: anggota.status || 'Aktif'
    });
    setShowModalEditAnggota(true);
  };

  const handleOpenEditKeluarga = (f: KeluargaMember) => {
    if (!canEditAnggota(f.id_anggota)) {
      setRestrictedFeatureName(`Edit Anggota Keluarga (${f.nama})`);
      setShowRestrictedModal(true);
      return;
    }
    setEditKeluargaForm({
      id: f.id,
      id_anggota: f.id_anggota,
      nik: f.nik,
      nama: f.nama,
      hubungan: f.hubungan,
      status: f.status || 'Hidup'
    });
    setShowModalEditKeluarga(true);
  };

  const handleDeleteKeluarga = (f: KeluargaMember) => {
    if (!canEditAnggota(f.id_anggota)) {
      setRestrictedFeatureName(`Hapus Anggota Keluarga (${f.nama})`);
      setShowRestrictedModal(true);
      return;
    }
    if (confirm(`Apakah Anda yakin ingin menghapus data anggota keluarga "${f.nama}" (${f.hubungan})?`)) {
      sijakaEngine.deleteKeluarga(f.id);
      refreshData();
    }
  };

  const handleEditAnggotaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAnggotaForm.nama) return alert('Input Nama');
    sijakaEngine.updateAnggota(editAnggotaForm.id, {
      nik: editAnggotaForm.nik,
      nama: editAnggotaForm.nama,
      alamat: editAnggotaForm.alamat,
      no_hp: editAnggotaForm.no_hp,
      status: editAnggotaForm.status
    });
    alert(`✅ Data Kepala Keluarga ${editAnggotaForm.nama} (${editAnggotaForm.id}) berhasil diperbarui!`);
    setShowModalEditAnggota(false);
    refreshData();
  };

  const handleEditKeluargaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editKeluargaForm.nama) return alert('Input Nama');
    sijakaEngine.updateKeluarga(editKeluargaForm.id, {
      nik: editKeluargaForm.nik,
      nama: editKeluargaForm.nama,
      hubungan: editKeluargaForm.hubungan,
      status: editKeluargaForm.status
    });
    alert(`✅ Data Anggota Keluarga ${editKeluargaForm.nama} (${editKeluargaForm.hubungan}) berhasil diperbarui!`);
    setShowModalEditKeluarga(false);
    refreshData();
  };

  const handleRestrictedAction = (featureName: string) => {
    if (userRole === 'Anggota') {
      setRestrictedFeatureName(featureName);
      setShowRestrictedModal(true);
      return true; // was restricted
    }
    return false; // allowed
  };

  const handleSubTabChange = (tab: 'kematian' | 'iuran' | 'anggota' | 'bukukas' | 'users' | 'layanan') => {
    if (userRole === 'Anggota' && (tab === 'users' || tab === 'layanan')) {
      const names: Record<string, string> = {
        users: 'Manajemen Accounts & Sessions',
        layanan: 'Pencairan Santunan & Pemulasaraan'
      };
      setRestrictedFeatureName(names[tab] || 'Fitur Khusus Admin');
      setShowRestrictedModal(true);
      return;
    }
    setInternalSubTab(tab);
    if (onSelectSubTab) {
      onSelectSubTab(tab);
    }
  };

  const [anggotaForm, setAnggotaForm] = useState<{
    nik: string;
    nama: string;
    alamat: string;
    no_hp: string;
    keluargaList: Array<{ idTemp: string; nik: string; nama: string; hubungan: KeluargaMember['hubungan'] }>;
  }>({ 
    nik: '', 
    nama: '', 
    alamat: '', 
    no_hp: '',
    keluargaList: []
  });

  const handleAddKeluargaRow = () => {
    setAnggotaForm(prev => ({
      ...prev,
      keluargaList: [
        ...prev.keluargaList,
        { idTemp: 'KLG-ROW-' + Date.now() + '-' + Math.floor(Math.random() * 1000), nik: '', nama: '', hubungan: 'Anak' }
      ]
    }));
  };

  const handleRemoveKeluargaRow = (idTemp: string) => {
    setAnggotaForm(prev => ({
      ...prev,
      keluargaList: prev.keluargaList.filter(k => k.idTemp !== idTemp)
    }));
  };

  const handleKeluargaRowChange = (idTemp: string, field: 'nik' | 'nama' | 'hubungan', value: string) => {
    setAnggotaForm(prev => ({
      ...prev,
      keluargaList: prev.keluargaList.map(k => {
        if (k.idTemp === idTemp) {
          return { ...k, [field]: value as any };
        }
        return k;
      })
    }));
  };

  const handleOpenTambahAnggota = () => {
    setAnggotaForm({
      nik: '',
      nama: '',
      alamat: '',
      no_hp: '',
      keluargaList: []
    });
    setShowModalAnggota(true);
  };

  const [keluargaForm, setKeluargaForm] = useState<{
    id_anggota: string;
    nik: string;
    nama: string;
    hubungan: KeluargaMember['hubungan'];
  }>({
    id_anggota: 'ANG-001',
    nik: '',
    nama: '',
    hubungan: 'Istri'
  });

  const refreshData = () => {
    setData(sijakaEngine.getData());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleKematianSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kematianForm.id_anggota) return alert('Pilih/Input ID Anggota');
    const res = sijakaEngine.submitKematian({
      id_anggota: kematianForm.id_anggota,
      waktu_kematian: kematianForm.waktu_kematian,
      tempat: kematianForm.jenazah !== 'Utama' ? `${kematianForm.tempat} (An. ${kematianForm.jenazah})` : kematianForm.tempat
    });
    alert(`✅ Laporan Kematian berhasil dibuat! ID Laporan: ${res.id_laporan}\n\n📲 Sistem telah otomatis mengirimkan WA Broadcast ke Pengurus SIJAKA & Ahli Waris.`);
    setShowModalKematian(false);
    refreshData();
  };

  const handleIuranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!iuranForm.id_anggota) return alert('Input ID Anggota');
    sijakaEngine.submitIuran(iuranForm);
    alert('✅ Pembayaran iuran berhasil dicatat ke Sheet Iuran & Buku Kas!');
    setShowModalIuran(false);
    refreshData();
  };

  const handleAnggotaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anggotaForm.nama.trim()) return alert('Input Nama Lengkap Kepala Keluarga');
    if (!anggotaForm.nik.trim()) return alert('Input NIK Kepala Keluarga');
    if (!anggotaForm.no_hp.trim()) return alert('Input No. WhatsApp');
    
    const validKeluarga = anggotaForm.keluargaList
      .filter(k => k.nama.trim().length > 0)
      .map(k => ({
        nik: k.nik.trim() || '-',
        nama: k.nama.trim(),
        hubungan: k.hubungan
      }));

    const res = sijakaEngine.submitAnggota({
      nik: anggotaForm.nik.trim(),
      nama: anggotaForm.nama.trim(),
      alamat: anggotaForm.alamat.trim(),
      no_hp: anggotaForm.no_hp.trim(),
      keluargaAwal: validKeluarga
    });

    alert(`✅ Anggota Baru "${anggotaForm.nama.trim()}" & ${validKeluarga.length} Data Keluarga berhasil terdaftar!\nID Anggota SIJAKA: ${res.id_anggota}`);
    setShowModalAnggota(false);
    setAnggotaForm({
      nik: '',
      nama: '',
      alamat: '',
      no_hp: '',
      keluargaList: []
    });
    refreshData();
  };

  const handleDeleteAnggota = (anggotaItem: any) => {
    if (userRole !== 'Admin') {
      setRestrictedFeatureName(`Hapus Data Kepala Keluarga (${anggotaItem.nama} - ${anggotaItem.id})`);
      setShowRestrictedModal(true);
      return;
    }
    if (confirm(`⚠️ Peringatan Hapus Anggota:\n\nApakah Anda yakin ingin menghapus data Kepala Keluarga "${anggotaItem.nama}" (${anggotaItem.id}) beserta seluruh data keluarganya?\n\nTindakan ini khusus Admin dan tidak dapat dibatalkan.`)) {
      sijakaEngine.deleteAnggota(anggotaItem.id);
      alert(`✅ Data Kepala Keluarga "${anggotaItem.nama}" (${anggotaItem.id}) beserta keluarganya berhasil dihapus.`);
      refreshData();
    }
  };

  const handleKeluargaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keluargaForm.nama) return alert('Input Nama Anggota Keluarga');
    sijakaEngine.submitKeluarga(keluargaForm);
    alert(`✅ Anggota keluarga baru (${keluargaForm.nama} - ${keluargaForm.hubungan}) berhasil ditambahkan ke ID ${keluargaForm.id_anggota}!`);
    setShowModalKeluarga(false);
    setKeluargaForm({ id_anggota: 'ANG-001', nik: '', nama: '', hubungan: 'Anak' });
    refreshData();
  };

  const handleUpdateStatus = (idLaporan: string) => {
    if (confirm(`Verifikasi & selesaikan laporan kematian ${idLaporan}? Santunan Rp 2.500.000 akan otomatis dicatat sebagai pengeluaran di Buku Kas.`)) {
      sijakaEngine.updateKematianStatus(idLaporan, 'Selesai');
      refreshData();
    }
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + Number(num || 0).toLocaleString('id-ID');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-7 font-sans">
      
      {/* A. INITIAL ROLE-SPECIFIC DASHBOARDS (When no subtab is active) */}
      {!externalSubTab ? (
        <>
          {userRole === 'Public' && (
            <PublicDashboard
              onLoginClick={() => {
                if (setUserRole) setUserRole('Anggota');
              }}
              onSelectRole={(r) => {
                if (setUserRole) setUserRole(r);
              }}
              onOpenWaContact={() => {
                if (onOpenWaBotSimulator) onOpenWaBotSimulator();
              }}
              totalMembersCount={data.anggota.length}
              totalProtectedSouls={metrics.totalMembers}
            />
          )}

          {userRole === 'Anggota' && (
            <MemberDashboard
              activeAnggota={data.anggota.find(a => a.id.toUpperCase() === activeAnggotaId.toUpperCase()) || data.anggota[0]}
              keluargaList={data.keluarga}
              iuranList={data.iuran}
              kematianList={data.kematian}
              memberStatus={memberStatus}
              onStatusChange={setMemberStatus}
              onOpenLaporKematian={() => setShowModalKematian(true)}
              onOpenInputIuran={() => {
                if (!handleRestrictedAction('Input Iuran')) {
                  setShowModalIuran(true);
                }
              }}
              onOpenTambahKeluarga={() => setShowModalKeluarga(true)}
              onOpenEditKeluarga={handleOpenEditKeluarga}
              onOpenEditAnggota={handleOpenEditAnggota}
              onSelectSubTab={handleSubTabChange}
              activities={activities}
              allAnggota={data.anggota}
              onSelectAnggotaId={setActiveAnggotaId}
            />
          )}

          {userRole === 'Pengurus' && (
            <OfficerDashboard
              officerName="Budi Santoso"
              metrics={metrics}
              anggotaList={data.anggota}
              iuranList={data.iuran}
              kematianList={data.kematian}
              bukuKasList={data.bukukas}
              summaryKas={data.summaryKas}
              activities={activities}
              onOpenInputIuran={() => setShowModalIuran(true)}
              onOpenLaporKematian={() => setShowModalKematian(true)}
              onOpenTambahAnggota={handleOpenTambahAnggota}
              onSelectSubTab={handleSubTabChange}
            />
          )}

          {userRole === 'Ketua' && (
            <ChairmanDashboard
              chairmanName="H. Ahmad"
              metrics={metrics}
              anggotaList={data.anggota}
              iuranList={data.iuran}
              kematianList={data.kematian}
              bukuKasList={data.bukukas}
              summaryKas={data.summaryKas}
              paymentHistory={paymentHistory}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              activities={activities}
              onSelectSubTab={handleSubTabChange}
            />
          )}

          {(userRole === 'Admin' || userRole === 'Super Admin') && (
            <AdminDashboard
              userRole={userRole}
              metrics={metrics}
              anggotaList={data.anggota}
              iuranList={data.iuran}
              kematianList={data.kematian}
              bukuKasList={data.bukukas}
              summaryKas={data.summaryKas}
              paymentHistory={paymentHistory}
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              activities={activities}
              onOpenWaBotSimulator={onOpenWaBotSimulator}
              onOpenSettings={onOpenSettings}
              onNavigateTab={onNavigateTab}
              onSelectSubTab={handleSubTabChange}
              onOpenTambahAnggota={handleOpenTambahAnggota}
              onOpenInputIuran={() => setShowModalIuran(true)}
              onOpenLaporKematian={() => setShowModalKematian(true)}
            />
          )}
        </>
      ) : (
        /* B. SUB-TAB DETAILED DATA & OPERATIONAL WORKSPACE (When subtab is selected) */
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Breadcrumb / Back Navigation Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#0B1428] border border-slate-800 shadow-sm">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (onSelectSubTab) onSelectSubTab(undefined as any);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700 shadow-sm"
              >
                <span>← Kembali ke Dashboard Utama</span>
              </button>
              <div className="text-xs text-slate-400">
                Modul: <span className="text-white font-bold capitalize">{activeSubTab}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Peran Aktif:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                {userRole}
              </span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <QuickActionsPanel
            onOpenLaporKematian={() => setShowModalKematian(true)}
            onOpenInputIuran={() => {
              if (!handleRestrictedAction('Input Iuran')) {
                setShowModalIuran(true);
              }
            }}
            onOpenTambahAnggota={handleOpenTambahAnggota}
            onSelectSubTab={handleSubTabChange}
            onOpenWaBotSimulator={() => {
              if (onOpenWaBotSimulator) onOpenWaBotSimulator();
            }}
            onOpenProfile={onOpenProfile}
            userRole={userRole}
          />

          {/* Role Permission Guidance Banner */}
          <div className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 shadow-sm ${
            userRole === 'Anggota'
              ? 'bg-slate-900 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-900 border-amber-500/40 text-amber-300'
          }`}>
            <div className="flex items-start sm:items-center gap-3">
              <div className={`p-2.5 rounded-xl shrink-0 ${
                userRole === 'Anggota' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-amber-600 text-white shadow-sm'
              }`}>
                {userRole === 'Anggota' ? <UserCheck className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-extrabold text-sm flex items-center gap-2 flex-wrap">
                  <span>Mode Hak Akses Aktif: <strong className="underline">{userRole}</strong></span>
                  {userRole === 'Anggota' ? (
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                      Batasan Akses Terpasang
                    </span>
                  ) : (
                    <span className="bg-amber-950 text-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      Pengurus / Super Admin
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {userRole === 'Anggota' 
                    ? 'Hak akses Anggota: 1. Dashboard Ringkasan, 2. Pelaporan Kematian, 3. Pendaftaran Anggota, & 4. Edit Data Keluarga Sendiri (Kepala Keluarga).'
                    : 'Akses Pengurus/Admin penuh: Bebas mengelola Iuran, Buku Kas Financials, User Accounts, Edit Semua Anggota, & WA Gateway.'}
                </p>

                {userRole === 'Anggota' && (
                  <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Akun Kepala Keluarga Aktif:</span>
                    </span>
                    <select
                      value={activeAnggotaId}
                      onChange={(e) => setActiveAnggotaId(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 font-bold text-white text-xs shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {data.anggota.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.id} - {a.nama} ({a.keluarga?.length || 0} Tanggungan)
                        </option>
                      ))}
                    </select>
                    <span className="text-[11px] text-slate-400 font-medium italic">
                      (Hanya berhak mengedit data keluarga milik ID {activeAnggotaId})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {setUserRole && (
              <button
                onClick={() => setUserRole(userRole === 'Anggota' ? 'Admin' : 'Anggota')}
                className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-[0.98] shrink-0 ${
                  userRole === 'Anggota'
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-600'
                    : 'bg-amber-700 hover:bg-amber-800 text-white border-amber-600'
                }`}
              >
                Ubah Mode ke {userRole === 'Anggota' ? 'Admin / Pengurus' : 'Anggota'}
              </button>
            )}
          </div>

          {/* Financial Health Progress Visualizer */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-white text-xs sm:text-sm">Ringkasan Kesehatan Kas Utama SIJAKA</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span>
                  Masuk: {formatRupiah(data.summaryKas.masuk)}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block"></span>
                  Santunan: {formatRupiah(data.summaryKas.keluar)}
                </span>
                <span className="flex items-center gap-1.5 font-semibold text-blue-400">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block"></span>
                  Saldo: {formatRupiah(data.summaryKas.saldo)}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden flex shadow-inner">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (data.summaryKas.masuk / Math.max(1, data.summaryKas.masuk)) * 100)}%` }}
                title="Kas Masuk"
              ></div>
              <div 
                className="bg-rose-500 h-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (data.summaryKas.keluar / Math.max(1, data.summaryKas.masuk)) * 100)}%` }}
                title="Kas Keluar"
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Content Container (Rendered when subtab is active) */}
      {externalSubTab && (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">
        
        {/* Navigation Sub-Tabs & Controls */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-4 bg-slate-50/90 border-b border-slate-200/80 gap-3">
          
          <div className="flex flex-wrap gap-1.5 bg-slate-200/70 p-1.5 rounded-xl">
            <button
              onClick={() => handleSubTabChange('kematian')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'kematian'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>
                {userRole === 'Anggota' ? 'Pengajuan Santunan' : userRole === 'Ketua' ? 'Ringkasan Pengajuan' : 'Laporan Kematian'}
              </span>
              <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                {data.kematian.length}
              </span>
            </button>

            <button
              onClick={() => handleSubTabChange('iuran')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'iuran'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>
                {userRole === 'Anggota' ? 'Riwayat Iuran Saya' : userRole === 'Ketua' ? 'Rekap Iuran' : 'Data Iuran'}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                {data.iuran.length}
              </span>
            </button>

            <button
              onClick={() => handleSubTabChange('anggota')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'anggota'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>
                {userRole === 'Anggota' ? 'Data Keluarga Saya' : userRole === 'Ketua' ? 'Data Jamaah' : 'Anggota & Keluarga'}
              </span>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                {data.anggota.length}
              </span>
            </button>

            <button
              onClick={() => handleSubTabChange('bukukas')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === 'bukukas'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>
                {userRole === 'Anggota' ? 'Transparansi Kas' : userRole === 'Ketua' ? 'Laporan Keuangan' : 'Buku Kas'}
              </span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                {data.bukukas.length}
              </span>
            </button>

            {(userRole === 'Admin' || userRole === 'Super Admin') && (
              <>
                <button
                  onClick={() => handleSubTabChange('users')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    activeSubTab === 'users'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Users & Sessions</span>
                  <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                    {(data as any).users?.length || 0}
                  </span>
                </button>

                <button
                  onClick={() => handleSubTabChange('layanan')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    activeSubTab === 'layanan'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <Heart className="w-4 h-4 text-teal-600" />
                  <span>Pelayanan & Santunan</span>
                  <span className="bg-teal-100 text-teal-800 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
                    {(data as any).pelayanan?.length || 0}
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Search bar & Dynamic Add Button */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kata kunci..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-white text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder-slate-400 shadow-sm"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {activeSubTab === 'anggota' && (
              <button
                onClick={() => setShowModalAnggota(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ Anggota</span>
              </button>
            )}

            {activeSubTab === 'bukukas' && (
              <button
                onClick={() => setIsLaporanKasModalOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all shrink-0"
                title="Export Laporan Buku Kas ke PDF / Excel"
              >
                <Printer className="w-4 h-4" />
                <span>Export PDF / Excel</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: LAPORAN KEMATIAN */}
        {activeSubTab === 'kematian' && (() => {
          const filteredKematian = data.kematian.filter(k => 
            k.id_laporan.toLowerCase().includes(searchTerm.toLowerCase()) || 
            k.id_anggota.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredKematian.length === 0) {
            return (
              <div className="p-4">
                <SijakaEmptyState
                  icon={Heart}
                  title="Belum ada pengajuan santunan saat ini."
                  description="Semua pengajuan santunan telah diproses atau belum ada pelaporan kematian baru yang masuk."
                  actionText="Ajukan Santunan"
                  onAction={() => setShowModalKematian(true)}
                  actionVariant="rose"
                  secondaryActionText={searchTerm ? "Reset Pencarian" : undefined}
                  onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
                />
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID Laporan</th>
                    <th className="px-4 py-3">Tanggal Lapor</th>
                    <th className="px-4 py-3">ID Anggota</th>
                    <th className="px-4 py-3">Waktu Kematian</th>
                    <th className="px-4 py-3">Tempat</th>
                    <th className="px-4 py-3">Status Verifikasi</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKematian.map((r) => (
                    <tr key={r.id_laporan} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{r.id_laporan}</td>
                      <td className="px-4 py-3 text-slate-600">{r.tanggal_lapor}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 font-mono text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {r.id_anggota}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{r.waktu_kematian}</td>
                      <td className="px-4 py-3 text-slate-700">{r.tempat}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                          r.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60'
                            : r.status === 'Terverifikasi'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200/60'
                            : 'bg-amber-100 text-amber-800 border border-amber-200/60'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'Selesai' ? 'bg-emerald-600' : 'bg-amber-600'
                          }`}></span>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                        {r.status !== 'Selesai' ? (
                          <button
                            onClick={() => handleUpdateStatus(r.id_laporan)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-md text-[11px] transition-colors"
                          >
                            Verifikasi & Santunan
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" /> Selesai
                          </span>
                        )}

                        <button
                          onClick={() => setKuitansiModal({ isOpen: true, type: 'santunan', item: r })}
                          className="inline-flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold px-2 py-1 rounded-md text-[11px] transition-colors shadow-sm"
                          title="Cetak Kuitansi Penyerahan Santunan Duka"
                        >
                          <Printer className="w-3.5 h-3.5 text-amber-700" />
                          <span>Kuitansi</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* TAB 2: DATA IURAN */}
        {activeSubTab === 'iuran' && (() => {
          const filteredIuran = data.iuran.filter(i => 
            i.id_iuran.toLowerCase().includes(searchTerm.toLowerCase()) || 
            i.id_anggota.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredIuran.length === 0) {
            return (
              <div className="p-4">
                <SijakaEmptyState
                  icon={DollarSign}
                  title="Data pembayaran Anda belum tersedia."
                  description="Belum ada catatan setoran iuran yang tercatat pada kriteria pencarian ini."
                  actionText="Input Iuran"
                  onAction={() => setShowModalIuran(true)}
                  actionVariant="emerald"
                  secondaryActionText={searchTerm ? "Reset Pencarian" : undefined}
                  onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
                />
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID Iuran</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">ID Anggota</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-right">Kuitansi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredIuran.map((r) => (
                    <tr key={r.id_iuran} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">{r.id_iuran}</td>
                      <td className="px-4 py-3 text-slate-600">{r.tanggal}</td>
                      <td className="px-4 py-3">
                        <span className="bg-slate-100 font-mono text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                          {r.id_anggota}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{r.bulan_tahun}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{formatRupiah(r.nominal)}</td>
                      <td className="px-4 py-3 text-slate-500">{r.keterangan}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setKuitansiModal({ isOpen: true, type: 'iuran', item: r })}
                          className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold px-2.5 py-1 rounded-md text-[11px] transition-colors shadow-sm"
                          title="Cetak Bukti Kuitansi Pembayaran Iuran"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Cetak Kuitansi</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* TAB 3: DATA ANGGOTA & KELUARGA */}
        {activeSubTab === 'anggota' && (() => {
          const filteredAnggota = data.anggota.filter(a => 
            a.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (a.keluarga && a.keluarga.some(k => k.nama.toLowerCase().includes(searchTerm.toLowerCase())))
          );

          if (filteredAnggota.length === 0) {
            return (
              <div className="p-4">
                <SijakaEmptyState
                  icon={Users}
                  title="Belum ada data anggota yang terdaftar."
                  description="Daftarkan kepala keluarga baru untuk memulai perlindungan jaminan kematian jamaah."
                  actionText="Tambah Anggota"
                  onAction={handleOpenTambahAnggota}
                  actionVariant="blue"
                  secondaryActionText={searchTerm ? "Reset Pencarian" : undefined}
                  onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
                />
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID Anggota</th>
                    <th className="px-4 py-3">NIK Kepala</th>
                    <th className="px-4 py-3">Nama Anggota Utama</th>
                    <th className="px-4 py-3">Alamat</th>
                    <th className="px-4 py-3">No. WhatsApp</th>
                    <th className="px-4 py-3">Tanggungan / Keluarga</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAnggota.map((r) => {
                    const isExpanded = expandedAnggotaId === r.id;
                    const familyList = r.keluarga || [];

                    return (
                      <React.Fragment key={r.id}>
                        <tr className={`hover:bg-slate-50/80 transition-colors ${isExpanded ? 'bg-blue-50/40' : ''}`}>
                          <td className="px-4 py-3 font-semibold text-blue-600 font-mono">{r.id}</td>
                          <td className="px-4 py-3 font-mono text-slate-600" title={`NIK Asli: ${r.nik}`}>{maskNik(r.nik)}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{r.nama}</td>
                          <td className="px-4 py-3 text-slate-700">{r.alamat}</td>
                          <td className="px-4 py-3 font-mono text-slate-700" title={`No. Asli: ${r.no_hp}`}>{maskPhone(r.no_hp)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setExpandedAnggotaId(isExpanded ? null : r.id)}
                              className="inline-flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] px-2.5 py-1 rounded-md border border-purple-200 transition-colors"
                            >
                              <Users className="w-3.5 h-3.5" />
                              <span>{familyList.length} Anggota Keluarga</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                              r.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit Kepala Keluarga Button */}
                              <button
                                onClick={() => handleOpenEditAnggota(r)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm ${
                                  canEditAnggota(r.id)
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                                }`}
                                title={canEditAnggota(r.id) ? 'Edit Data Kepala Keluarga' : `Akses khusus Kepala Keluarga (${r.id}) atau Admin`}
                              >
                                {canEditAnggota(r.id) ? <Pencil className="w-3 h-3" /> : <Lock className="w-3 h-3 text-amber-600" />}
                                <span>Edit KK</span>
                              </button>

                              {/* + Keluarga Button */}
                              <button
                                onClick={() => {
                                  if (!canEditAnggota(r.id)) {
                                    setRestrictedFeatureName(`Tambah Keluarga ke (${r.nama} - ${r.id})`);
                                    setShowRestrictedModal(true);
                                    return;
                                  }
                                  setKeluargaForm({ id_anggota: r.id, nik: '', nama: '', hubungan: 'Anak' });
                                  setShowModalKeluarga(true);
                                }}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm ${
                                  canEditAnggota(r.id)
                                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                                }`}
                                title={canEditAnggota(r.id) ? 'Tambah Anggota Keluarga untuk ID ini' : `Akses khusus Kepala Keluarga (${r.id}) atau Admin`}
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>+ Keluarga</span>
                              </button>

                              {/* Hapus Anggota Button (Strictly Admin / Pengurus) */}
                              <button
                                onClick={() => handleDeleteAnggota(r)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all inline-flex items-center gap-1 shadow-sm ${
                                  userRole === 'Admin'
                                    ? 'bg-rose-600 hover:bg-rose-700 text-white'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300'
                                }`}
                                title={userRole === 'Admin' ? 'Hapus Anggota & Data Keluarga (Khusus Admin)' : 'Khusus Admin / Pengurus'}
                              >
                                {userRole === 'Admin' ? <Trash2 className="w-3 h-3" /> : <Lock className="w-3 h-3 text-rose-500" />}
                                <span>Hapus</span>
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expandable Family Members Row */}
                        {isExpanded && (
                          <tr className="bg-slate-50/90">
                            <td colSpan={8} className="p-4 pl-12 border-b border-slate-200">
                              <div className="bg-white p-3.5 rounded-xl border border-purple-100 shadow-sm space-y-3">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-purple-600" />
                                    <span className="font-bold text-slate-800 text-xs">
                                      Daftar Anggota Keluarga / Tanggungan ({r.nama} - {r.id})
                                    </span>
                                    {!canEditAnggota(r.id) && (
                                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200 flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-amber-700" /> Mode Terkunci (Bukan Keluarga Anda)
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => {
                                      if (!canEditAnggota(r.id)) {
                                        setRestrictedFeatureName(`Tambah Keluarga ke (${r.nama} - ${r.id})`);
                                        setShowRestrictedModal(true);
                                        return;
                                      }
                                      setKeluargaForm({ id_anggota: r.id, nik: '', nama: '', hubungan: 'Anak' });
                                      setShowModalKeluarga(true);
                                    }}
                                    className="text-[11px] text-purple-700 font-semibold hover:underline flex items-center gap-1"
                                  >
                                    <Plus className="w-3 h-3" /> Tambah Keluarga
                                  </button>
                                </div>

                                {familyList.length > 0 ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                    {familyList.map((f) => (
                                      <div key={f.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start justify-between text-xs hover:border-purple-300 transition-all">
                                        <div className="space-y-0.5">
                                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                            <span>{f.nama}</span>
                                            <span className="bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded text-[10px]">
                                              {f.hubungan}
                                            </span>
                                          </div>
                                          <div className="text-[11px] text-slate-500 font-mono" title={`NIK Asli: ${f.nik}`}>NIK: {maskNik(f.nik)}</div>
                                          <div className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${f.status === 'Hidup' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Hidup' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            <span>Status: {f.status}</span>
                                          </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0 ml-2">
                                          <button
                                            onClick={() => handleOpenEditKeluarga(f)}
                                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1 ${
                                              canEditAnggota(r.id)
                                                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200 shadow-sm'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}
                                            title={canEditAnggota(r.id) ? 'Edit Data Anggota Keluarga' : `Khusus Kepala Keluarga ${r.id} atau Admin`}
                                          >
                                            {canEditAnggota(r.id) ? <Pencil className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-500" />}
                                            <span className="hidden sm:inline">Edit</span>
                                          </button>

                                          <button
                                            onClick={() => handleDeleteKeluarga(f)}
                                            className={`p-1.5 rounded-lg border text-[11px] font-bold transition-all flex items-center gap-1 ${
                                              canEditAnggota(r.id)
                                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border-rose-200 shadow-sm'
                                                : 'bg-slate-100 text-slate-400 border-slate-200'
                                            }`}
                                            title={canEditAnggota(r.id) ? 'Hapus Anggota Keluarga' : `Khusus Kepala Keluarga ${r.id} atau Admin`}
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-slate-400 italic text-[11px] py-1">
                                    Belum ada data anggota keluarga terdaftar untuk {r.nama}. Silakan klik "+ Keluarga" di atas.
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* TAB 4: BUKU KAS */}
        {activeSubTab === 'bukukas' && (() => {
          const filteredKas = data.bukukas.filter(b => 
            b.keterangan.toLowerCase().includes(searchTerm.toLowerCase()) || 
            b.id_kas.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredKas.length === 0) {
            return (
              <div className="p-4">
                <SijakaEmptyState
                  icon={FileText}
                  title="Belum ada transaksi kas tercatat."
                  description="Pencatatan kas masuk dan santunan keluar akan muncul di sini secara otomatis."
                  actionText="Export Laporan"
                  onAction={() => setIsLaporanKasModalOpen(true)}
                  actionVariant="purple"
                  secondaryActionText={searchTerm ? "Reset Pencarian" : undefined}
                  onSecondaryAction={searchTerm ? () => setSearchTerm('') : undefined}
                />
              </div>
            );
          }

          return (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">ID Kas</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Tipe</th>
                    <th className="px-4 py-3">Nominal</th>
                    <th className="px-4 py-3">Keterangan Transaksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredKas.map((r) => {
                    const isMasuk = r.tipe === 'Masuk';
                    return (
                      <tr key={r.id_kas} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-semibold text-slate-900">{r.id_kas}</td>
                        <td className="px-4 py-3 text-slate-600">{r.tanggal}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                            isMasuk ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-rose-100 text-rose-800 border border-rose-200/60'
                          }`}>
                            {isMasuk ? 'MASUK' : 'KELUAR'}
                          </span>
                        </td>
                        <td className={`px-4 py-3 font-semibold ${isMasuk ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {isMasuk ? '+' : '-'}{formatRupiah(r.nominal)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">{r.keterangan}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })()}

        {/* TAB 5: USERS & SESSIONS */}
        {activeSubTab === 'users' && (
          <div className="p-4 space-y-6">
            <div>
              <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-purple-600" />
                Sheet 'Users' - Akun Pengurus & Hak Akses
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-purple-50 text-purple-900 font-semibold border-b border-purple-200">
                    <tr>
                      <th className="px-4 py-2.5">id_user</th>
                      <th className="px-4 py-2.5">username</th>
                      <th className="px-4 py-2.5">password</th>
                      <th className="px-4 py-2.5">role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {((data as any).users || []).map((u: any) => (
                      <tr key={u.id_user} className="hover:bg-purple-50/40">
                        <td className="px-4 py-2.5 font-bold text-purple-700">{u.id_user}</td>
                        <td className="px-4 py-2.5 font-sans font-bold text-slate-900">{u.username}</td>
                        <td className="px-4 py-2.5 text-slate-500">{u.password || '••••••'}</td>
                        <td className="px-4 py-2.5 font-sans">
                          <span className="bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded text-[10px] border border-purple-200">
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Sheet 'Sessions' - Riwayat Login Pengurus
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">session_id</th>
                      <th className="px-4 py-2.5">username</th>
                      <th className="px-4 py-2.5">last_login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {((data as any).sessions || []).map((s: any) => (
                      <tr key={s.session_id} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-semibold text-purple-700">{s.session_id}</td>
                        <td className="px-4 py-2.5 font-sans font-semibold text-slate-900">{s.username}</td>
                        <td className="px-4 py-2.5 text-slate-600">{s.last_login}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: PELAYANAN & SANTUNAN */}
        {activeSubTab === 'layanan' && (
          <div className="p-4 space-y-6">
            <div>
              <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600" />
                Sheet 'Pelayanan' - Tracking Pemulasaraan Jenazah
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50 text-emerald-900 font-semibold border-b border-emerald-200">
                    <tr>
                      <th className="px-4 py-2.5">ID_Laporan</th>
                      <th className="px-4 py-2.5">Petugas</th>
                      <th className="px-4 py-2.5">Dimandikan</th>
                      <th className="px-4 py-2.5">Dikafani</th>
                      <th className="px-4 py-2.5">Disalatkan</th>
                      <th className="px-4 py-2.5">Dimakamkan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {((data as any).pelayanan || []).map((p: any) => (
                      <tr key={p.ID_Laporan} className="hover:bg-emerald-50/40">
                        <td className="px-4 py-2.5 font-bold text-rose-700">{p.ID_Laporan}</td>
                        <td className="px-4 py-2.5 font-sans font-semibold text-slate-900">{p.Petugas}</td>
                        <td className="px-4 py-2.5 font-sans">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            {String(p.Dimandikan)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-sans">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            {String(p.Dikafani)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-sans">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            {String(p.Disalatkan)}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-sans">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-200">
                            {String(p.Dimakamkan)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Sheet 'Santunan' - Pencairan Dana Santunan Kematian
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-50 text-emerald-900 font-semibold border-b border-emerald-200">
                    <tr>
                      <th className="px-4 py-2.5">ID_Laporan</th>
                      <th className="px-4 py-2.5">Tgl_Pencairan</th>
                      <th className="px-4 py-2.5">Nama_Penerima</th>
                      <th className="px-4 py-2.5">Nominal_Santunan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono">
                    {((data as any).santunan || []).map((s: any) => (
                      <tr key={s.ID_Laporan} className="hover:bg-emerald-50/40">
                        <td className="px-4 py-2.5 font-bold text-rose-700">{s.ID_Laporan}</td>
                        <td className="px-4 py-2.5 text-slate-600">{s.Tgl_Pencairan}</td>
                        <td className="px-4 py-2.5 font-sans font-bold text-slate-900">{s.Nama_Penerima}</td>
                        <td className="px-4 py-2.5 font-semibold text-emerald-700">{formatRupiah(s.Nominal_Santunan)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>
      )}

      {/* MODAL LAPOR KEMATIAN */}
      {showModalKematian && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-rose-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Formulir Pelaporan Kematian</span>
              <button onClick={() => setShowModalKematian(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleKematianSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Anggota / Kepala Keluarga</label>
                <select
                  value={kematianForm.id_anggota}
                  onChange={(e) => setKematianForm({ ...kematianForm, id_anggota: e.target.value, jenazah: 'Utama' })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-mono"
                >
                  {data.anggota.map(a => (
                    <option key={a.id} value={a.id}>{a.id} - {a.nama} ({a.keluarga ? a.keluarga.length : 0} Keluarga)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Yang Meninggal Dunia (Jenazah)</label>
                <select
                  value={kematianForm.jenazah}
                  onChange={(e) => setKematianForm({ ...kematianForm, jenazah: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Utama">Anggota Utama (Kepala Keluarga)</option>
                  {data.anggota
                    .find(a => a.id === kematianForm.id_anggota)?.keluarga
                    ?.filter(k => k.status === 'Hidup')
                    ?.map(k => (
                      <option key={k.id} value={`${k.nama} (${k.hubungan})`}>
                        Keluarga: {k.nama} ({k.hubungan})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Kematian</label>
                <input
                  type="text"
                  value={kematianForm.waktu_kematian}
                  onChange={(e) => setKematianForm({ ...kematianForm, waktu_kematian: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tempat Kematian / Rumah Duka</label>
                <input
                  type="text"
                  value={kematianForm.tempat}
                  onChange={(e) => setKematianForm({ ...kematianForm, tempat: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                📲 Sistem akan otomatis mengirimkan <strong>WA Broadcast Notifikasi Kematian</strong> ke seluruh Kontak Pengurus & Ahli Waris.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalKematian(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-md shadow-rose-600/30"
                >
                  Simpan & Broadcast WA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL INPUT IURAN */}
      {showModalIuran && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-emerald-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><DollarSign className="w-5 h-5" /> Input Pembayaran Iuran</span>
              <button onClick={() => setShowModalIuran(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleIuranSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Anggota</label>
                <select
                  value={iuranForm.id_anggota}
                  onChange={(e) => setIuranForm({ ...iuranForm, id_anggota: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                >
                  {data.anggota.map(a => (
                    <option key={a.id} value={a.id}>{a.id} - {a.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Periode (Bulan/Tahun)</label>
                <input
                  type="text"
                  value={iuranForm.bulan_tahun}
                  onChange={(e) => setIuranForm({ ...iuranForm, bulan_tahun: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nominal (Rp)</label>
                <input
                  type="text"
                  value={iuranForm.nominal}
                  onChange={(e) => setIuranForm({ ...iuranForm, nominal: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan</label>
                <input
                  type="text"
                  value={iuranForm.keterangan}
                  onChange={(e) => setIuranForm({ ...iuranForm, keterangan: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalIuran(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/30"
                >
                  Simpan Iuran & Buku Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH ANGGOTA */}
      {showModalAnggota && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full my-8 overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><UserPlus className="w-5 h-5" /> Pendaftaran Anggota Baru & Keluarga</span>
              <button onClick={() => setShowModalAnggota(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleAnggotaSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-3">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  1. Data Utama Kepala Keluarga / Anggota
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">NIK Kepala Keluarga</label>
                  <input
                    type="text"
                    value={anggotaForm.nik}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, nik: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={anggotaForm.nama}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, nama: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                  <textarea
                    value={anggotaForm.alamat}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, alamat: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">No. WhatsApp Active</label>
                  <input
                    type="text"
                    value={anggotaForm.no_hp}
                    onChange={(e) => setAnggotaForm({ ...anggotaForm, no_hp: e.target.value })}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    required
                  />
                </div>
              </div>

              {/* Data Keluarga Opsional - Dynamic Unlimited */}
              <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-100/80 pb-2">
                  <div className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-purple-600" />
                    2. Data Anggota Keluarga / Tanggungan (Tanpa Batas)
                  </div>
                  <button
                    type="button"
                    onClick={handleAddKeluargaRow}
                    className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Anggota Keluarga</span>
                  </button>
                </div>

                {anggotaForm.keluargaList.length === 0 ? (
                  <div className="text-center py-4 bg-white/80 rounded-xl border border-dashed border-purple-200 text-slate-500 text-xs space-y-1">
                    <p className="font-medium text-slate-700">Belum ada anggota keluarga ditambahkan.</p>
                    <p className="text-[11px] text-slate-500">Klik tombol <strong className="text-purple-700 font-bold">+ Tambah Anggota Keluarga</strong> di atas untuk mendaftarkan pasangan, anak, atau anggota keluarga lainnya tanpa batasan jumlah.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {anggotaForm.keluargaList.map((k, index) => (
                      <div key={k.idTemp} className="bg-white p-3 rounded-xl border border-purple-200 space-y-2 relative shadow-sm">
                        <div className="flex justify-between items-center border-b border-purple-100 pb-1.5">
                          <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-800 text-[10px] flex items-center justify-center font-extrabold">{index + 1}</span>
                            Anggota Keluarga #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeluargaRow(k.idTemp)}
                            className="text-rose-600 hover:text-rose-800 p-1 rounded-md hover:bg-rose-50 transition-colors text-[11px] flex items-center gap-1 font-semibold"
                            title="Hapus Baris Ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Nama Anggota Keluarga</label>
                            <input
                              type="text"
                              placeholder="Nama lengkap anggota keluarga"
                              value={k.nama}
                              onChange={(e) => handleKeluargaRowChange(k.idTemp, 'nama', e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">Hubungan Keluarga</label>
                            <select
                              value={k.hubungan}
                              onChange={(e) => handleKeluargaRowChange(k.idTemp, 'hubungan', e.target.value)}
                              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
                            >
                              <option value="Istri">Istri</option>
                              <option value="Suami">Suami</option>
                              <option value="Anak">Anak</option>
                              <option value="Orang Tua">Orang Tua</option>
                              <option value="Mertua">Mertua</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-700 mb-0.5">NIK Anggota Keluarga (Opsional)</label>
                          <input
                            type="text"
                            placeholder="320101..."
                            value={k.nik}
                            onChange={(e) => handleKeluargaRowChange(k.idTemp, 'nik', e.target.value)}
                            className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalAnggota(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Daftarkan Anggota & Keluarga</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH KELUARGA (UNTUK ANGGOTA EKSISTING) */}
      {showModalKeluarga && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-purple-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><Heart className="w-5 h-5" /> Tambah Anggota Keluarga / Tanggungan</span>
              <button onClick={() => setShowModalKeluarga(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleKeluargaSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Kepala Keluarga / ID Anggota</label>
                <select
                  value={keluargaForm.id_anggota}
                  onChange={(e) => setKeluargaForm({ ...keluargaForm, id_anggota: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                >
                  {data.anggota.map(a => (
                    <option key={a.id} value={a.id}>{a.id} - {a.nama}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anggota Keluarga</label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Saputra"
                  value={keluargaForm.nama}
                  onChange={(e) => setKeluargaForm({ ...keluargaForm, nama: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hubungan Keluarga</label>
                <select
                  value={keluargaForm.hubungan}
                  onChange={(e) => setKeluargaForm({ ...keluargaForm, hubungan: e.target.value as KeluargaMember['hubungan'] })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK Anggota Keluarga (Opsional)</label>
                <input
                  type="text"
                  placeholder="320101..."
                  value={keluargaForm.nik}
                  onChange={(e) => setKeluargaForm({ ...keluargaForm, nik: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalKeluarga(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30"
                >
                  Simpan Anggota Keluarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT KEPALA KELUARGA */}
      {showModalEditAnggota && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-blue-200 animate-in fade-in zoom-in-95">
            <div className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><Pencil className="w-5 h-5 text-amber-300" /> Edit Data Kepala Keluarga</span>
              <button onClick={() => setShowModalEditAnggota(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleEditAnggotaSubmit} className="p-5 space-y-3.5">
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs flex justify-between items-center">
                <span className="font-bold text-blue-900">ID Anggota:</span>
                <span className="font-mono font-extrabold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">{editAnggotaForm.id}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Kepala Keluarga</label>
                <input
                  type="text"
                  value={editAnggotaForm.nama}
                  onChange={(e) => setEditAnggotaForm({ ...editAnggotaForm, nama: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK Kepala Keluarga</label>
                <input
                  type="text"
                  value={editAnggotaForm.nik}
                  onChange={(e) => setEditAnggotaForm({ ...editAnggotaForm, nik: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                  🔒 Tampilan Publik: <strong className="font-mono text-blue-700">{maskNik(editAnggotaForm.nik)}</strong> (3 digit awal + xxxxx)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Rumah</label>
                <input
                  type="text"
                  value={editAnggotaForm.alamat}
                  onChange={(e) => setEditAnggotaForm({ ...editAnggotaForm, alamat: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">No. HP / WhatsApp</label>
                <input
                  type="text"
                  value={editAnggotaForm.no_hp}
                  onChange={(e) => setEditAnggotaForm({ ...editAnggotaForm, no_hp: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                  🔒 Tampilan Publik: <strong className="font-mono text-blue-700">{maskPhone(editAnggotaForm.no_hp)}</strong> (xxxxxx + 3 digit akhir)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Keanggotaan</label>
                <select
                  value={editAnggotaForm.status}
                  onChange={(e) => setEditAnggotaForm({ ...editAnggotaForm, status: e.target.value as 'Aktif' | 'Nonaktif' })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 font-bold"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModalEditAnggota(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Simpan Perubahan KK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDIT ANGGOTA KELUARGA / TANGGUNGAN */}
      {showModalEditKeluarga && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-purple-200 animate-in fade-in zoom-in-95">
            <div className="bg-purple-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2"><Pencil className="w-5 h-5 text-amber-300" /> Edit Anggota Keluarga</span>
              <button onClick={() => setShowModalEditKeluarga(false)} className="text-white hover:text-slate-200 text-lg">✕</button>
            </div>
            <form onSubmit={handleEditKeluargaSubmit} className="p-5 space-y-3.5">
              <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs flex justify-between items-center">
                <span className="font-bold text-purple-900">Kepala Keluarga / ID Anggota:</span>
                <span className="font-mono font-extrabold text-purple-700 bg-white px-2 py-0.5 rounded border border-purple-200">{editKeluargaForm.id_anggota}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Anggota Keluarga</label>
                <input
                  type="text"
                  value={editKeluargaForm.nama}
                  onChange={(e) => setEditKeluargaForm({ ...editKeluargaForm, nama: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">NIK Anggota Keluarga</label>
                <input
                  type="text"
                  value={editKeluargaForm.nik}
                  onChange={(e) => setEditKeluargaForm({ ...editKeluargaForm, nik: e.target.value })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 block mt-1 font-sans">
                  🔒 Tampilan Publik: <strong className="font-mono text-purple-700">{maskNik(editKeluargaForm.nik)}</strong> (3 digit awal + xxxxx)
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hubungan Keluarga</label>
                <select
                  value={editKeluargaForm.hubungan}
                  onChange={(e) => setEditKeluargaForm({ ...editKeluargaForm, hubungan: e.target.value as KeluargaMember['hubungan'] })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold"
                >
                  <option value="Suami">Suami</option>
                  <option value="Istri">Istri</option>
                  <option value="Anak">Anak</option>
                  <option value="Orang Tua">Orang Tua</option>
                  <option value="Mertua">Mertua</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Kehidupan</label>
                <select
                  value={editKeluargaForm.status}
                  onChange={(e) => setEditKeluargaForm({ ...editKeluargaForm, status: e.target.value as 'Hidup' | 'Meninggal' })}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 font-bold"
                >
                  <option value="Hidup">Hidup</option>
                  <option value="Meninggal">Meninggal</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModalEditKeluarga(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md shadow-purple-600/30 flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Simpan Perubahan Keluarga
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PERINGATAN BATASAN HAK AKSES ANGGOTA */}
      {showRestrictedModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-rose-200 animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-rose-600 to-red-600 text-white p-4 font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-amber-300" />
                Akses Dibatasi untuk Anggota
              </span>
              <button onClick={() => setShowRestrictedModal(false)} className="text-white hover:text-slate-200 text-lg font-bold">✕</button>
            </div>

            <div className="p-6 space-y-4">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="font-extrabold text-slate-900 text-base">
                  Fitur "{restrictedFeatureName}" Khusus Admin
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sesuai kebijakan keamanan sistem SIJAKA, akun dengan peran <span className="font-bold text-emerald-600">Anggota</span> hanya diizinkan mengakses:
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1. Dashboard Web (Statistik & Data Anggota)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2. Lapor Kematian (Pelaporan Musibah Anggota)</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>3. Tambah Anggota (Pendaftaran Anggota & Keluarga)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center">
                Untuk mencatat transaksi iuran, mengelola buku kas, atau akun pengguna, silakan ubah mode hak akses ke <span className="font-bold text-amber-600">Admin / Pengurus</span>.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowRestrictedModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                >
                  Tutup
                </button>
                {setUserRole && (
                  <button
                    onClick={() => {
                      setUserRole('Admin');
                      setShowRestrictedModal(false);
                    }}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/30 transition-all"
                  >
                    Ubah ke Mode Admin
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CETAK KUITANSI MODAL */}
      <KuitansiModal
        isOpen={kuitansiModal.isOpen}
        onClose={() => setKuitansiModal({ isOpen: false, type: 'iuran', item: null })}
        type={kuitansiModal.type}
        item={kuitansiModal.item}
        anggotaList={data.anggota}
      />

      {/* EXPORT & CETAK LAPORAN KAS PDF/EXCEL MODAL */}
      <LaporanKasPdfModal
        isOpen={isLaporanKasModalOpen}
        onClose={() => setIsLaporanKasModalOpen(false)}
        bukuKasList={data.bukukas}
      />

    </div>
  );
};
