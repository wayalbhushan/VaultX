import { useState } from "react";
import { Link } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";
import {
  Shield,
  ShieldCheck,
  Key,
  Fingerprint,
  History,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  RotateCcw,
  Smartphone,
  Download,
  Lock,
  Terminal,
  Cpu,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);

  const handleDemoCopy = () => {
    navigator.clipboard.writeText("vx_sample_9f8a3b2c1d0e4f5a6b7c8d9e0f");
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  const featureCards = [
    {
      icon: <ShieldCheck size={22} className="text-emerald-400" />,
      title: "AES-256-GCM AEAD Encryption",
      description:
        "Every secret payload is encrypted at rest using AES-256 in Galois/Counter Mode with random 12-byte IVs and 16-byte authentication tag validation.",
      tag: "CRYPTOGRAPHY",
    },
    {
      icon: <Fingerprint size={22} className="text-emerald-400" />,
      title: "Encrypted TOTP 2FA Verification",
      description:
        "Enforced 2FA step-up authentication flow using Google Authenticator or Authy with encrypted TOTP secret storage.",
      tag: "AUTHENTICATION",
    },
    {
      icon: <History size={22} className="text-cyan-400" />,
      title: "Cryptographic Hash-Chained Ledger",
      description:
        "Audit log entries compute SHA-256 hash chains (hash = SHA256(userId + action + timestamp + previousHash)) with ORM immutability hooks.",
      tag: "AUDIT LEDGER",
    },
    {
      icon: <RotateCcw size={22} className="text-emerald-400" />,
      title: "Secret Versioning & 1-Click Rollback",
      description:
        "Maintain complete version snapshots upon updates. Inspect past values and restore prior revisions instantly.",
      tag: "REVISION CONTROL",
    },
    {
      icon: <Download size={22} className="text-cyan-400" />,
      title: "PBKDF2 Encrypted Vault Export",
      description:
        "Export password-protected backup containers derived via 100,000 PBKDF2 iterations for secure offsite recovery.",
      tag: "BACKUP & RESTORE",
    },
    {
      icon: <Smartphone size={22} className="text-emerald-400" />,
      title: "Active Device Session Management",
      description:
        "Track active devices with IP address and browser user-agent metadata. Revoke unrecognized sessions remotely.",
      tag: "SESSION CONTROL",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Dynamic Digital Rain Matrix Background */}
      <MatrixBackground opacity={0.05} speed={50} />

      {/* Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-500/15 via-cyan-500/5 to-transparent blur-[150px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-8 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Terminal size={14} className="text-emerald-400" />
          <span>CYBER SECRETS VAULT • AES-256-GCM AEAD ENCRYPTED</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-mono tracking-tight text-white max-w-4xl mx-auto leading-[1.15] drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]">
          Enterprise Cyber Vault, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            Hardware-Grade Protection.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
          Centralize, rotate, and safeguard API keys, database credentials, and certificates with GCM authenticated encryption, 2FA app verification, and cryptographic hash-chained audit ledgers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/get-started"
            className="w-full sm:w-auto px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Lock size={15} />
            <span>Launch Cyber Vault</span>
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/learn-more"
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/30 hover:border-emerald-400/80 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow-sm"
          >
            <Cpu size={15} className="text-cyan-400" />
            <span>Security Architecture</span>
          </Link>
        </div>

        {/* Interactive Cyber Vault Terminal Mockup */}
        <div className="mt-16 max-w-4xl mx-auto bg-slate-950/95 border border-emerald-500/40 rounded-xl p-5 sm:p-7 shadow-[0_0_40px_rgba(0,0,0,0.9)] relative text-left backdrop-blur-2xl group hover:border-emerald-400/80 transition-all duration-300">
          {/* Laser scan line effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent opacity-40 pointer-events-none rounded-xl animate-pulse" />

          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-emerald-400 font-mono ml-2 font-bold flex items-center gap-1.5">
                <Terminal size={14} /> vaultx://console.aead.gcm
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold rounded flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={12} /> AUTH TAG 100% VERIFIED
              </span>
            </div>
          </div>

          {/* Live Interactive Secret Cipher Row */}
          <div className="space-y-3 font-mono text-xs relative z-10">
            <div className="p-4 bg-slate-900/90 rounded-lg border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Key size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold tracking-tight">PROD_DATABASE_MASTER_KEY</span>
                    <span className="px-2 py-0.5 bg-slate-950 text-emerald-400 text-[10px] rounded border border-slate-800 font-mono">
                      v2.0
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-2">
                    <span>Ciphertext:</span>
                    <span className="text-emerald-400/90 font-mono truncate max-w-xs">
                      {isDecrypted
                        ? "vx_master_7f8a9b2c3d4e5f6a7b8c9d0e"
                        : "7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => setIsDecrypted(!isDecrypted)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition"
                >
                  {isDecrypted ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{isDecrypted ? "Mask Cipher" : "Decrypt Payload"}</span>
                </button>
                <button
                  onClick={handleDemoCopy}
                  className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-md text-xs font-mono font-semibold flex items-center gap-1.5 transition shadow-[0_0_10px_rgba(16,185,129,0.15)]"
                >
                  {copiedDemo ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copiedDemo ? "Copied" : "Copy Payload"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/80 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-cyan-400" />
                <span className="font-semibold text-slate-300">AWS_PRODUCTION_SECRET_TOKEN</span>
              </div>
              <span className="text-slate-500 text-[11px] font-mono">v1.0 • AES-256-GCM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-emerald-500/20 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            ENTERPRISE CYBER ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-white">
            Cryptographic Protection Across Every Layer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Engineered from scratch to eliminate single points of failure and unauthorized payload access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 rounded-xl p-6 shadow-sm hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
                    {card.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 mb-2 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Callout Banner */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
              READY FOR PRODUCTION
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-mono text-white">
              Safeguard Your Digital Credentials Today.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Create an account in less than 30 seconds. Experience hardware-grade AES-256-GCM encryption, 2FA app protection, and immutable hash-chained audit logging.
            </p>
          </div>

          <Link
            to="/get-started"
            className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <span>Launch Cyber Vault</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
