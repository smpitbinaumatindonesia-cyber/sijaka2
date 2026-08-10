export function terbilang(nominal: number): string {
  const angka = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  
  if (nominal < 0) return "minus " + terbilang(Math.abs(nominal));
  if (nominal < 12) return angka[nominal];
  if (nominal < 20) return terbilang(nominal - 10) + " belas";
  if (nominal < 100) return terbilang(Math.floor(nominal / 10)) + " puluh " + (nominal % 10 !== 0 ? " " + terbilang(nominal % 10) : "");
  if (nominal < 200) return "seratus" + (nominal - 100 !== 0 ? " " + terbilang(nominal - 100) : "");
  if (nominal < 1000) return terbilang(Math.floor(nominal / 100)) + " ratus" + (nominal % 100 !== 0 ? " " + terbilang(nominal % 100) : "");
  if (nominal < 2000) return "seribu" + (nominal - 1000 !== 0 ? " " + terbilang(nominal - 1000) : "");
  if (nominal < 1000000) return terbilang(Math.floor(nominal / 1000)) + " ribu" + (nominal % 1000 !== 0 ? " " + terbilang(nominal % 1000) : "");
  if (nominal < 1000000000) return terbilang(Math.floor(nominal / 1000000)) + " juta" + (nominal % 1000000 !== 0 ? " " + terbilang(nominal % 1000000) : "");
  if (nominal < 1000000000000) return terbilang(Math.floor(nominal / 1000000000)) + " milyar" + (nominal % 1000000000 !== 0 ? " " + terbilang(nominal % 1000000000) : "");
  return nominal.toString();
}

export function formatTerbilangRupiah(nominalStr: string | number): string {
  const num = typeof nominalStr === 'string' ? parseInt(nominalStr.replace(/[^0-9]/g, ''), 10) : nominalStr;
  if (isNaN(num) || num <= 0) return "Nol Rupiah";
  const kata = terbilang(Math.floor(num)).trim();
  return (kata.charAt(0).toUpperCase() + kata.slice(1)).replace(/\s+/g, ' ') + " Rupiah";
}
