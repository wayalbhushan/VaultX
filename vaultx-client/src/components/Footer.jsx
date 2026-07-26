import { Link } from "react-router-dom";
import { Shield, Lock, Terminal, CheckCircle2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950/90 border-t border-emerald-500/20 text-slate-400 py-12 px-6 font-mono relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <Shield size={18} className="stroke-[2.2]" />
            </div>
            <span className="text-xl font-bold font-mono tracking-tight text-white">VaultX</span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-sans">
            Cyber security secrets manager engineered with AES-256-GCM AEAD encryption, 2FA app verification, and cryptographic hash-chained audit ledgers.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px]">
            <span className="px-2.5 py-1 bg-slate-900 border border-emerald-500/30 rounded text-emerald-400 font-mono flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
              <Lock size={11} /> AES-256-GCM AEAD
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-cyan-500/30 rounded text-cyan-400 font-mono">
              PBKDF2 SHA-256
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded text-slate-400 font-mono flex items-center gap-1">
              <CheckCircle2 size={11} className="text-emerald-400" /> TOTP 2FA
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/" className="hover:text-emerald-400 transition-colors">
                Vault Console
              </Link>
            </li>
            <li>
              <Link to="/learn-more" className="hover:text-emerald-400 transition-colors">
                Security Architecture
              </Link>
            </li>
            <li>
              <Link to="/get-started" className="hover:text-emerald-400 transition-colors">
                Authenticate / Sign In
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-4 font-mono">
            Cryptographic Specs
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-mono">
            <li>• 256-bit GCM Cipher Keys</li>
            <li>• 12-byte Random IV Vectors</li>
            <li>• 16-byte GCM Auth Tags</li>
            <li>• 100,000 PBKDF2 Iterations</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>VaultX © {new Date().getFullYear()} — Enterprise Cyber Secrets Platform</p>
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <span>ZERO KNOWLEDGE</span>
          <span>•</span>
          <span>AEAD PROTECTION</span>
          <span>•</span>
          <span>HTTPONLY COOKIES</span>
        </div>
      </div>
    </footer>
  );
}
