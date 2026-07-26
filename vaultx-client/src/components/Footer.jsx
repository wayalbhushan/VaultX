import { Link } from "react-router-dom";
import { Shield, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 px-6 font-sans relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="md:col-span-2 space-y-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold">
              <Shield size={18} className="stroke-[2.5]" />
            </div>
            <span className="text-xl font-bold font-display text-white">VaultX</span>
          </Link>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Enterprise secrets management system engineered with AES-256-GCM AEAD encryption, HTTP-Only cookie security, and cryptographic audit ledgers.
          </p>
          <div className="flex items-center gap-3 pt-2 text-[11px]">
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 font-mono flex items-center gap-1.5">
              <Lock size={12} /> AES-256-GCM
            </span>
            <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-cyan-400 font-mono">
              PBKDF2 SHA-256
            </span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-mono">
            Navigation
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link to="/" className="hover:text-emerald-400 transition">
                Home Overview
              </Link>
            </li>
            <li>
              <Link to="/learn-more" className="hover:text-emerald-400 transition">
                Security Architecture
              </Link>
            </li>
            <li>
              <Link to="/get-started" className="hover:text-emerald-400 transition">
                Get Started / Login
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 font-mono">
            Security Features
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="text-slate-400">AES-256-GCM AEAD Storage</li>
            <li className="text-slate-400">TOTP Two-Factor Auth</li>
            <li className="text-slate-400">Hash-Chained Audit Logs</li>
            <li className="text-slate-400">Active Device Revocation</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>VaultX © {new Date().getFullYear()} — Built for Production Security</p>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Privacy First</span>
          <span>•</span>
          <span>Zero Knowledge</span>
          <span>•</span>
          <span>Encrypted at Rest</span>
        </div>
      </div>
    </footer>
  );
}
