import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import CyberLoader, { SkeletonStat } from "../components/SkeletonLoader";
import {
  Shield,
  Key,
  Star,
  Clock,
  Smartphone,
  Plus,
  RefreshCw,
  Copy,
  Check,
  Lock,
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Terminal,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, favorites: 0, expired: 0, sessions: 0 });
  const [recentSecrets, setRecentSecrets] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Generator Modal State
  const [showGenModal, setShowGenModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passLength, setPassLength] = useState(16);
  const [copiedPass, setCopiedPass] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const userRes = await API.get("/user/me");
      setUser(userRes.data.user || userRes.data);

      const secretsRes = await API.get("/secrets");
      const secretsData = secretsRes.data.secrets || secretsRes.data || [];
      setRecentSecrets(secretsData.slice(0, 5));

      const favCount = secretsData.filter((s) => s.isFavorite).length;
      const expCount = secretsData.filter(
        (s) => s.expiresAt && new Date(s.expiresAt) < new Date()
      ).length;

      let sessionCount = 1;
      try {
        const sessRes = await API.get("/user/sessions");
        sessionCount = (sessRes.data.sessions || []).length;
      } catch (e) {
        sessionCount = 1;
      }

      setStats({
        total: secretsData.length,
        favorites: favCount,
        expired: expCount,
        sessions: sessionCount,
      });

      try {
        const logsRes = await API.get("/activity");
        const logsData = logsRes.data.activities || logsRes.data || [];
        setRecentLogs(logsData.slice(0, 5));
      } catch (e) {
        setRecentLogs([]);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}";
    const array = new Uint8Array(passLength);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < passLength; i++) {
      result += chars[array[i] % chars.length];
    }
    setGeneratedPassword(result);
    setCopiedPass(false);
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content View */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Top Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-widest uppercase mb-2">
              <Terminal size={13} /> SECURE CONSOLE ACCESS ACTIVE
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-mono text-white tracking-tight">
              Welcome back, <span className="text-emerald-400">{user?.username || "Security User"}</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-mono mt-1">
              Vault Status: Active • Encryption: AES-256-GCM AEAD Mode
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                generatePassword();
                setShowGenModal(true);
              }}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider rounded-none transition flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.15)]"
            >
              <Zap size={14} />
              <span>Password Generator</span>
            </button>

            <Link
              to="/dashboard/secrets"
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-none shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 transition"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>Add New Secret</span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <CyberLoader message="AUTHENTICATING VAULT SESSION..." />
        ) : (
          <>
            {/* Stat Cards Grid (Sharp Box Geometry) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-none shadow-sm hover:border-emerald-400 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Total Secrets
                  </span>
                  <div className="w-8 h-8 rounded-none bg-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Lock size={16} />
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">
                  {stats.total}
                </div>
                <Link
                  to="/dashboard/secrets"
                  className="text-[11px] font-mono text-slate-400 hover:text-emerald-400 transition flex items-center gap-1 mt-2"
                >
                  <span>Manage secrets</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-none shadow-sm hover:border-amber-500/50 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Favorite Secrets
                  </span>
                  <div className="w-8 h-8 rounded-none bg-slate-950 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Star size={16} />
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-amber-400 mb-1">
                  {stats.favorites}
                </div>
                <Link
                  to="/dashboard/secrets?filter=favorites"
                  className="text-[11px] font-mono text-slate-400 hover:text-amber-400 transition flex items-center gap-1 mt-2"
                >
                  <span>View starred</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-none shadow-sm hover:border-rose-500/50 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Expired Credentials
                  </span>
                  <div className="w-8 h-8 rounded-none bg-slate-950 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <AlertTriangle size={16} />
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-rose-400 mb-1">
                  {stats.expired}
                </div>
                <span className="text-[11px] font-mono text-slate-500 block mt-2">
                  {stats.expired === 0 ? "All payloads current" : "Requires key rotation"}
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-none shadow-sm hover:border-cyan-500/50 transition-colors group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">
                    Active Devices
                  </span>
                  <div className="w-8 h-8 rounded-none bg-slate-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Smartphone size={16} />
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-cyan-400 mb-1">
                  {stats.sessions}
                </div>
                <Link
                  to="/dashboard/settings"
                  className="text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition flex items-center gap-1 mt-2"
                >
                  <span>Session settings</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>

            {/* Main Content Grid: Recent Secrets & Audit Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Vault Items (2 cols) */}
              <div className="lg:col-span-2 bg-slate-900/90 border border-emerald-500/30 p-6 rounded-none shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div className="flex items-center gap-2">
                    <Lock size={18} className="text-emerald-400" />
                    <h2 className="text-lg font-bold font-mono text-white">Recent Vault Items</h2>
                  </div>
                  <Link
                    to="/dashboard/secrets"
                    className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All Vault</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                {recentSecrets.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 font-mono text-xs">
                    <p>No secrets stored yet.</p>
                    <Link
                      to="/dashboard/secrets"
                      className="inline-block mt-3 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-mono text-xs font-bold rounded-none"
                    >
                      + Create First Secret
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 font-mono">
                    {recentSecrets.map((secret) => (
                      <div
                        key={secret._id}
                        className="p-4 bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 rounded-none flex items-center justify-between transition group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-none bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                            <Key size={16} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                              {secret.title}
                            </h3>
                            <p className="text-xs text-slate-400 truncate font-sans">
                              {secret.notes || "Encrypted credential payload"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                            {secret.category || "General"}
                          </span>
                          <Link
                            to={`/dashboard/secrets`}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-none border border-slate-700"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Audit Feed (1 col) */}
              <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-none shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                    <div className="flex items-center gap-2">
                      <Activity size={18} className="text-cyan-400" />
                      <h2 className="text-lg font-bold font-mono text-white">Recent Activity</h2>
                    </div>
                    <Link
                      to="/dashboard/activity"
                      className="text-xs font-mono text-cyan-400 hover:underline"
                    >
                      Audit Log
                    </Link>
                  </div>

                  {recentLogs.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 font-mono text-xs">
                      No recent activity logs recorded.
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-xs">
                      {recentLogs.map((log) => (
                        <div
                          key={log._id || Math.random()}
                          className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-none space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                              {log.action}
                            </span>
                            <span className="text-slate-500 text-[10px]">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-slate-300 text-[11px] truncate font-sans">
                            {log.details || `Executed ${log.action}`}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-slate-800/80 mt-6">
                  <Link
                    to="/dashboard/activity"
                    className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-cyan-400 border border-cyan-500/30 font-mono text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-2 transition"
                  >
                    <span>Verify Cryptographic Ledger</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Password Generator Modal */}
        {showGenModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-emerald-500/40 p-6 rounded-none max-w-md w-full font-mono space-y-5 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap size={18} className="text-emerald-400" />
                  <span>Web Crypto Password Generator</span>
                </h3>
                <button
                  onClick={() => setShowGenModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Length: {passLength} characters
                </label>
                <input
                  type="range"
                  min="8"
                  max="64"
                  value={passLength}
                  onChange={(e) => {
                    setPassLength(Number(e.target.value));
                    generatePassword();
                  }}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-sm font-mono text-emerald-400 font-bold break-all select-all">
                  {generatedPassword}
                </span>
                <button
                  onClick={copyPassword}
                  className="ml-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-mono font-bold shrink-0 flex items-center gap-1"
                >
                  {copiedPass ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedPass ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <button
                onClick={generatePassword}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs uppercase tracking-wider font-bold rounded-none transition flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                <span>Regenerate Password</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
