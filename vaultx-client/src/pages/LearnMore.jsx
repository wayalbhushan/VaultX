import { Link } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";
import {
  ShieldCheck,
  KeyRound,
  Fingerprint,
  History,
  ArrowRight,
  Database,
  Cpu,
  FileCheck,
  Lock,
  Terminal,
} from "lucide-react";

export default function LearnMore() {
  const securityPillars = [
    {
      icon: <ShieldCheck size={26} className="text-emerald-400" />,
      title: "AES-256-GCM AEAD Encryption",
      description:
        "Every payload is encrypted at rest using AES-256 in Galois/Counter Mode (GCM). Unlike CBC, GCM includes an explicit 16-byte authentication tag that prevents ciphertext tampering and bit-flipping attacks.",
    },
    {
      icon: <KeyRound size={26} className="text-emerald-400" />,
      title: "HTTP-Only & SameSite=Strict Cookies",
      description:
        "Access and Refresh tokens are stored in isolated HTTP-Only cookies with SameSite=Strict flags, effectively eliminating Cross-Site Scripting (XSS) token extraction vulnerabilities.",
    },
    {
      icon: <Fingerprint size={26} className="text-emerald-400" />,
      title: "Encrypted TOTP 2FA Verification",
      description:
        "Mandatory two-factor step-up authentication using standard TOTP authenticator apps. 2FA secrets are encrypted at rest in MongoDB using server master keys.",
    },
    {
      icon: <History size={26} className="text-cyan-400" />,
      title: "Cryptographic Audit Ledger",
      description:
        "Audit log records form a cryptographic SHA-256 hash chain (hash = SHA256(userId + action + timestamp + previousHash)). ORM hooks block any update or delete operations on log documents.",
    },
    {
      icon: <Database size={26} className="text-emerald-400" />,
      title: "Strict Multi-Field Query Isolation",
      description:
        "All database CRUD operations filter strictly by both secret ID AND authenticated user ID ({ _id, userId }). Requests for unauthorized resources return 404 Not Found to block IDOR probing.",
    },
    {
      icon: <FileCheck size={26} className="text-cyan-400" />,
      title: "PBKDF2 Encrypted Backup Exports",
      description:
        "Export your vault into a standalone .vaultx backup container encrypted via 100,000 PBKDF2 iterations + AES-256-GCM using your custom export passphrase.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Matrix Digital Rain Background */}
      <MatrixBackground opacity={0.05} speed={50} />

      {/* Glow Orbs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-xs font-mono text-emerald-400 shadow-sm">
            <Cpu size={14} className="text-emerald-400" />
            <span>CRYPTOGRAPHIC ARCHITECTURE SPECIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-white leading-tight">
            Security & Cryptographic Model <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Behind VaultX.
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            VaultX is engineered around defense-in-depth security principles. Your credentials are never stored in plaintext, and all sensitive endpoints enforce strict authorization and input verification.
          </p>
        </div>

        {/* Security Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityPillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/50 rounded-xl p-6 shadow-sm flex flex-col justify-between group hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300"
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-400 mb-2 font-mono transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div>
            <h2 className="text-2xl font-bold font-mono text-white mb-2">
              Start Protecting Your Secrets Today
            </h2>
            <p className="text-xs text-slate-300 font-sans">
              Deploy your encrypted vault in under a minute with mandatory 2FA and GCM encryption.
            </p>
          </div>

          <Link
            to="/get-started"
            className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] shrink-0 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Lock size={15} />
            <span>Launch Cyber Vault</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
