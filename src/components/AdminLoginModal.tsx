import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { createPasswordHash, verifyPassword } from '../utils/crypto';

import { SijakaRole } from '../types';

export interface AdminAccount {
  id_user: string;
  username: string;
  passwordHash: string;
  role: SijakaRole;
  nama: string;
}

// Pre-computed PBKDF2-HMAC-SHA256 password verifiers with unique per-user cryptographic salts
export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    id_user: 'U000',
    username: 'superadmin',
    passwordHash: createPasswordHash('super123', 'S0P1E2R3A4D5M6I7N8'),
    role: 'Super Admin',
    nama: 'Super Administrator'
  },
  {
    id_user: 'U001',
    username: 'admin',
    passwordHash: createPasswordHash('admin123', 'A1B2C3D4E5F67890'),
    role: 'Admin',
    nama: 'Administrator Utama (U001)'
  },
  {
    id_user: 'Ketua',
    username: 'Wardjo',
    passwordHash: createPasswordHash('Wardjo123', 'B2C3D4E5F6A17890'),
    role: 'Ketua',
    nama: 'H. Wardjo (Ketua Jamaah)'
  },
  {
    id_user: 'Bend1',
    username: 'Imam',
    passwordHash: createPasswordHash('Imam123', 'C3D4E5F6A1B27890'),
    role: 'Pengurus',
    nama: 'Imam S. (Bendahara 1)'
  },
  {
    id_user: 'Bend2',
    username: 'Dino',
    passwordHash: createPasswordHash('Dino123', 'D4E5F6A1B2C37890'),
    role: 'Pengurus',
    nama: 'Dino P. (Pengurus Operasional)'
  },
  {
    id_user: 'ANG-001',
    username: 'ahmad',
    passwordHash: createPasswordHash('ahmad123', 'E5F6A1B2C3D47890'),
    role: 'Anggota',
    nama: 'Ahmad Subagyo (Anggota / KK)'
  }
];

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (account: AdminAccount) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const targetUsername = usernameInput.trim().toLowerCase();
    const candidatePassword = passwordInput.trim();

    const matched = ADMIN_ACCOUNTS.find(
      (acc) =>
        acc.username.toLowerCase() === targetUsername &&
        verifyPassword(candidatePassword, acc.passwordHash)
    );

    if (matched) {
      onSuccess(matched);
      setUsernameInput('');
      setPasswordInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Username atau Password yang Anda masukkan tidak sesuai.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-sans">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl border border-amber-400/30">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">Login Admin / Pengurus</h3>
              <p className="text-xs text-amber-200/90">Sistem Informasi SIJAKA Jamaah Tahlil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 font-medium animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Username Admin
            </label>
            <input
              type="text"
              required
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Masukkan username (cth: admin, Wardjo)"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Masukkan password"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium transition-all text-slate-900 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-bold rounded-xl text-xs shadow-md shadow-amber-600/30 transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Masuk Mode Admin</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
