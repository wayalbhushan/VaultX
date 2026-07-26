import { useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";

export default function LandingPage() {
  const [copiedDemo, setCopiedDemo] = useState(false);

  const handleDemoCopy = () => {
    navigator.clipboard.writeText("vx_sample_9f8a3b2c1d0e4f5a6b7c8d9e0f");
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  };

  const featureCards = [
    {
      icon: <ShieldCheck size={24} className="text-emerald-400" />,
      title: "AES-256-GCM AEAD Encryption",
      description:
        "Every secret is encrypted with 256-bit GCM AEAD mode, 12-byte random IVs, and 16-byte authentication tags to guarantee payload integrity.",
    },
    {
      icon: <Fingerprint size={24} className="text-emerald-400" />,
      title: "TOTP Two-Factor Protection",
      description:
        "Mandatory 2FA authentication flow compatible with Google Authenticator and Authy with encrypted TOTP secret storage.",
    },
    {
      icon: <History size={24} className="text-cyan-400" />,
      title: "Immutable Hash-Chained Audit Log",
      description:
        "Every vault operation is written to a SHA-256 hash-chained ledger that prevents database tampering and supports instant integrity verification.",
    },
    {
      icon: <RotateCcw size={24} className="text-emerald-400" />,
      title: "Secret Versioning & Rollback",
      description:
        "Maintain complete revision snapshots upon updates. Inspect past secret values and restore any version with 1-click rollback.",
    },
    {
      icon: <Download size={24} className="text-cyan-400" />,
      title: "PBKDF2 Encrypted Backup Container",
      description:
        "Export encrypted vault backups protected by PBKDF2 key derivation (100,000 iterations) for secure offsite storage and batch recovery.",
    },
    {
      icon: <Smartphone size={24} className="text-emerald-400" />,
      title: "Active Device Session Control",
      description:
        "Inspect active sessions with IP and browser user-agent metadata, and revoke unrecognized devices remotely in real time.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Ambient Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-emerald-400 mb-8 shadow-sm">
          <Sparkles size={14} className="text-amber-400" />
          <span>AES-256-GCM AEAD & Zero-Knowledge Architecture</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          Enterprise Secrets Security, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Re-engineered for Production.
          </span>
        </h1>

        {/* Hero Description */}
        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Centralize, rotate, and manage API keys, database credentials, and certificates with hardware-grade GCM encryption, 2FA protection, and cryptographic audit ledgers.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/get-started"
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <span>Start Vaulting Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/learn-more"
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>View Security Specs</span>
          </Link>
        </div>

        {/* Hero Product Preview Mockup */}
        <div className="mt-16 max-w-4xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-slate-950 backdrop-blur-xl relative text-left">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-slate-500 font-mono ml-2">vaultx-console.internal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} /> GCM Tag Verified
              </span>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Key size={16} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-semibold truncate">AWS_SECRET_ACCESS_KEY</span>
                    <span className="px-1.5 py-0.5 bg-slate-900 text-slate-400 text-[10px] rounded border border-slate-800">
                      v2.0
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">Encrypted Payload (AEAD AES-256-GCM)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDemoCopy}
                  className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedDemo ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedDemo ? "Copied" : "Copy Payload"}</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/50 flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-cyan-400" />
                <span>POSTGRES_DB_PASSWORD</span>
              </div>
              <span className="text-slate-500 text-[11px]">v1.0 • Protected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/80 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            Built for Real-World Security Engineers
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400">
            A comprehensive suite of cryptographic features designed to eliminate single points of failure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureCards.map((card, i) => (
            <div
              key={i}
              className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 backdrop-blur-xl rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Architecture Callout */}
      <section className="py-20 px-6 max-w-7xl mx-auto z-10 relative">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-3">
              Ready to Upgrade Your Secrets Infrastructure?
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create an account in less than 30 seconds. Protect your credentials with AES-256-GCM encryption, 2FA app verification, and cookie security.
            </p>
          </div>

          <Link
            to="/get-started"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/25 shrink-0 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <span>Create Free Account</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
