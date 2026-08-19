// Data architecture for Premium Executive Dashboard
// Structured for easy replacement with live Google Sheets / REST API endpoints

export interface DashboardMetricData {
  totalMembers: number;
  totalMembersGrowth: number;
  totalMembersGrowthPct: number;
  totalClaims: number;
  totalClaimsGrowth: number;
  totalClaimsGrowthPct: number;
  totalContribution: number;
  totalContributionGrowthPct: number;
  activeApplications: number;
  activeApplicationsNote: string;
}

export type MemberStatusType = 'active' | 'renewal' | 'expired' | 'pending';

export interface MemberExecutiveProfile {
  id: string;
  nama: string;
  nik: string;
  no_hp: string;
  status: MemberStatusType;
  statusText: string;
  joinedDate: string;
  protectionActiveSince: string;
  protectionExpireDate: string;
  currentYearMonthsPaid: number; // e.g. 8 out of 12
  timelyPaymentPct: number; // e.g. 80%
  arrearsAmount: number; // e.g. 0 or 100.000
}

export interface MonthPaymentStatus {
  month: string;
  shortName: string;
  status: 'paid' | 'late' | 'unpaid';
  amount: number;
  datePaid?: string;
}

export interface YearPaymentHistory {
  year: number;
  totalAmount: number;
  timelyPct: number;
  latePct: number;
  unpaidPct: number;
  months: MonthPaymentStatus[];
}

export interface ActivityItem {
  id: string;
  type: 'claim' | 'payment' | 'member_update' | 'system' | 'service';
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
  actor: string;
  badgeColor: 'blue' | 'emerald' | 'purple' | 'amber' | 'rose';
}

// Year payment dataset for 2026, 2027, 2028
export const paymentDataStore: Record<number, YearPaymentHistory> = {
  2026: {
    year: 2026,
    totalAmount: 125450000,
    timelyPct: 80,
    latePct: 15,
    unpaidPct: 5,
    months: [
      { month: 'Januari', shortName: 'Jan', status: 'paid', amount: 10450000, datePaid: '05 Jan 2026' },
      { month: 'Februari', shortName: 'Feb', status: 'paid', amount: 10600000, datePaid: '04 Feb 2026' },
      { month: 'Maret', shortName: 'Mar', status: 'paid', amount: 11200000, datePaid: '08 Mar 2026' },
      { month: 'April', shortName: 'Apr', status: 'paid', amount: 10500000, datePaid: '05 Apr 2026' },
      { month: 'Mei', shortName: 'Mei', status: 'paid', amount: 10800000, datePaid: '06 Mei 2026' },
      { month: 'Juni', shortName: 'Jun', status: 'paid', amount: 10900000, datePaid: '07 Jun 2026' },
      { month: 'Juli', shortName: 'Jul', status: 'paid', amount: 11100000, datePaid: '05 Jul 2026' },
      { month: 'Agustus', shortName: 'Agt', status: 'paid', amount: 10700000, datePaid: '08 Agt 2026' },
      { month: 'September', shortName: 'Sep', status: 'late', amount: 9800000, datePaid: '20 Sep 2026' },
      { month: 'Oktober', shortName: 'Okt', status: 'unpaid', amount: 0 },
      { month: 'November', shortName: 'Nov', status: 'unpaid', amount: 0 },
      { month: 'Desember', shortName: 'Des', status: 'unpaid', amount: 0 },
    ]
  },
  2027: {
    year: 2027,
    totalAmount: 138000000,
    timelyPct: 85,
    latePct: 10,
    unpaidPct: 5,
    months: [
      { month: 'Januari', shortName: 'Jan', status: 'paid', amount: 11500000 },
      { month: 'Februari', shortName: 'Feb', status: 'paid', amount: 11500000 },
      { month: 'Maret', shortName: 'Mar', status: 'paid', amount: 11500000 },
      { month: 'April', shortName: 'Apr', status: 'paid', amount: 11500000 },
      { month: 'Mei', shortName: 'Mei', status: 'paid', amount: 11500000 },
      { month: 'Juni', shortName: 'Jun', status: 'paid', amount: 11500000 },
      { month: 'Juli', shortName: 'Jul', status: 'paid', amount: 11500000 },
      { month: 'Agustus', shortName: 'Agt', status: 'paid', amount: 11500000 },
      { month: 'September', shortName: 'Sep', status: 'paid', amount: 11500000 },
      { month: 'Oktober', shortName: 'Okt', status: 'paid', amount: 11500000 },
      { month: 'November', shortName: 'Nov', status: 'paid', amount: 11500000 },
      { month: 'Desember', shortName: 'Des', status: 'paid', amount: 11500000 },
    ]
  },
  2028: {
    year: 2028,
    totalAmount: 152000000,
    timelyPct: 90,
    latePct: 8,
    unpaidPct: 2,
    months: [
      { month: 'Januari', shortName: 'Jan', status: 'paid', amount: 12600000 },
      { month: 'Februari', shortName: 'Feb', status: 'paid', amount: 12600000 },
      { month: 'Maret', shortName: 'Mar', status: 'paid', amount: 12600000 },
      { month: 'April', shortName: 'Apr', status: 'paid', amount: 12600000 },
      { month: 'Mei', shortName: 'Mei', status: 'paid', amount: 12600000 },
      { month: 'Juni', shortName: 'Jun', status: 'paid', amount: 12600000 },
      { month: 'Juli', shortName: 'Jul', status: 'paid', amount: 12600000 },
      { month: 'Agustus', shortName: 'Agt', status: 'paid', amount: 12600000 },
      { month: 'September', shortName: 'Sep', status: 'paid', amount: 12600000 },
      { month: 'Oktober', shortName: 'Okt', status: 'paid', amount: 12600000 },
      { month: 'November', shortName: 'Nov', status: 'paid', amount: 12600000 },
      { month: 'Desember', shortName: 'Des', status: 'paid', amount: 12600000 },
    ]
  }
};

export const multiYearComparison = [
  { year: '2026', total: 125.45, kepatuhan: 80, santunan: 86, anggota: 1248 },
  { year: '2027', total: 138.00, kepatuhan: 85, santunan: 74, anggota: 1390 },
  { year: '2028', total: 152.00, kepatuhan: 90, santunan: 68, anggota: 1520 },
  { year: '2029', total: 165.50, kepatuhan: 92, santunan: 71, anggota: 1680 },
  { year: '2030', total: 180.00, kepatuhan: 94, santunan: 65, anggota: 1850 },
  { year: '2031', total: 195.00, kepatuhan: 95, santunan: 62, anggota: 2010 },
  { year: '2032', total: 210.00, kepatuhan: 96, santunan: 60, anggota: 2200 },
];

export const defaultRecentActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'claim',
    title: 'Pengajuan santunan baru',
    description: 'Pengajuan atas nama Bpk. Ahmad S. (ANG-001) terverifikasi RT/RW.',
    timestamp: '2026-08-18T18:50:00Z',
    timeAgo: '10 menit lalu',
    actor: 'Bpk. Ahmad S.',
    badgeColor: 'rose'
  },
  {
    id: 'act-2',
    type: 'payment',
    title: 'Iuran anggota diterima',
    description: 'Pembayaran iuran Rp 50.000 (Agustus 2026) dari Ibu Siti Aisyah.',
    timestamp: '2026-08-18T18:25:00Z',
    timeAgo: '35 menit lalu',
    actor: 'Ibu Siti Aisyah',
    badgeColor: 'emerald'
  },
  {
    id: 'act-3',
    type: 'member_update',
    title: 'Data anggota diperbarui',
    description: 'Penambahan 2 tanggungan keluarga oleh Admin Pengurus.',
    timestamp: '2026-08-18T17:55:00Z',
    timeAgo: '1 jam lalu',
    actor: 'Admin Pengurus',
    badgeColor: 'blue'
  },
  {
    id: 'act-4',
    type: 'service',
    title: 'Pencairan Santunan Selesai',
    description: 'Santunan Rp 2.500.000 diserahkan kepada ahli waris Alm. Bpk. Suparman.',
    timestamp: '2026-08-18T15:30:00Z',
    timeAgo: '3 jam lalu',
    actor: 'Bendahara SIJAKA',
    badgeColor: 'purple'
  }
];

// Extensible fetch functions for future live API / Google Sheets integration
export async function fetchDashboardData(engineData?: any): Promise<DashboardMetricData> {
  if (engineData) {
    return {
      totalMembers: engineData.anggota?.length || 1248,
      totalMembersGrowth: 12,
      totalMembersGrowthPct: 1.2,
      totalClaims: engineData.kematian?.length || 86,
      totalClaimsGrowth: 8,
      totalClaimsGrowthPct: 10.2,
      totalContribution: engineData.summaryKas?.masuk || 125450000,
      totalContributionGrowthPct: 5.8,
      activeApplications: engineData.kematian?.filter((k: any) => k.status !== 'Selesai')?.length || 7,
      activeApplicationsNote: 'Menunggu verifikasi'
    };
  }
  return {
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
  };
}

export async function fetchPaymentHistory(year: number = 2026): Promise<YearPaymentHistory> {
  return paymentDataStore[year] || paymentDataStore[2026];
}

export async function fetchActivities(): Promise<ActivityItem[]> {
  return defaultRecentActivities;
}
