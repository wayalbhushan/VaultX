import { Shield, Lock, Terminal, Cpu } from "lucide-react";

export default function CyberLoader({ message = "DECRYPTING AEAD VAULT PAYLOADS..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[320px] bg-slate-950/80 border border-emerald-500/30 rounded-none relative overflow-hidden font-mono shadow-[0_0_30px_rgba(0,0,0,0.9)]">
      {/* Laser Scanning Beam */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent animate-pulse pointer-events-none" />

      {/* Center Shield Spinner */}
      <div className="relative mb-6">
        {/* Outer Rotating Glowing Ring */}
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-emerald-400 animate-spin" />
        
        {/* Inner Shield Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-emerald-400">
          <Shield size={26} className="animate-pulse" />
        </div>
      </div>

      {/* Terminal Loading Text Stream */}
      <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold bg-slate-900 border border-emerald-500/30 px-4 py-2 rounded-none shadow-[0_0_10px_rgba(16,185,129,0.2)]">
        <Terminal size={14} className="animate-bounce" />
        <span>{message}</span>
      </div>

      {/* Subtle status ticker */}
      <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-slate-500">
        <span className="flex items-center gap-1">
          <Lock size={10} className="text-emerald-400" /> AES-256-GCM
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Cpu size={10} className="text-cyan-400" /> SHA-256 LEDGER
        </span>
      </div>
    </div>
  );
}
