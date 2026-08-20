export const maskNik = (nik?: string | null): string => {
  if (!nik || nik === '-') return '-';
  const str = nik.toString().trim();
  if (str.length <= 3) return str;
  return str.slice(0, 3) + 'x'.repeat(str.length - 3);
};

export const maskPhone = (phone?: string | null): string => {
  if (!phone || phone === '-') return '-';
  const str = phone.toString().trim();
  if (str.length <= 3) return str;
  return 'x'.repeat(str.length - 3) + str.slice(-3);
};

export const formatRupiah = (amount: number | string): string => {
  if (amount === undefined || amount === null) return 'Rp 0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.')) : amount;
  if (isNaN(num)) return 'Rp 0';
  return 'Rp ' + Math.floor(num).toLocaleString('id-ID');
};

export const formatRupiahCompact = (amount: number | string): string => {
  if (amount === undefined || amount === null) return 'Rp 0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9,-]/g, '').replace(',', '.')) : amount;
  if (isNaN(num) || !num) return 'Rp 0';
  if (Math.abs(num) >= 1_000_000_000) {
    return `Rp ${(num / 1_000_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} M`;
  }
  if (Math.abs(num) >= 1_000_000) {
    return `Rp ${(num / 1_000_000).toLocaleString('id-ID', { maximumFractionDigits: 2 })} jt`;
  }
  if (Math.abs(num) >= 1_000) {
    return `Rp ${(num / 1_000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} rb`;
  }
  return `Rp ${Math.floor(num).toLocaleString('id-ID')}`;
};

export const formatDateIndo = (dateStr?: string | Date | null): string => {
  if (!dateStr) return '-';
  const d = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return String(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};
