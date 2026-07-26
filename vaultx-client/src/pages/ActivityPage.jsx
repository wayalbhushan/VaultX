import { useState, useEffect } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import CyberLoader from "../components/SkeletonLoader";
import {
  Activity,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  RefreshCw,
  Terminal,
  Hash,
} from "lucide-react";

export default function ActivityPage() {
  const [user, setUser] = useState(null);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [auditResult, setAuditResult] = useState(null);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    setIsLoading(true);
    try {
      const userRes = await API.get("/user/me");
      setUser(userRes.data.user || userRes.data);

      const res = await API.get("/activity");
      setActivities(res.data.activities || res.data || []);
    } catch (err) {
      console.error("Activity fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLedger = async () => {
    setVerifying(true);
    setAuditResult(null);
    try {
      const res = await API.get("/activity/verify");
      setAuditResult(res.data);
    } catch (err) {
      setAuditResult({
        verified: false,
        message: err.response?.data?.error || "Ledger verification failed.",
      });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-slate-900 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-widest mb-2">
              <Hash size={13} /> SHA-256 HASH-CHAINED AUDIT LEDGER
            </div>
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
              <Activity size={24} className="text-cyan-400" />
              <span>Immutable Activity Audit Log</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Cryptographically chained entries • Pre-save update/delete immutability enforcement
            </p>
          </div>

          <button
            onClick={handleVerifyLedger}
            disabled={verifying}
            className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-none shadow-[0_0_15px_rgba(6,182,212,0.3)] transition flex items-center gap-2 disabled:opacity-50"
          >
            {verifying ? (
              <RefreshCw size={15} className="animate-spin" />
            ) : (
              <ShieldCheck size={15} className="stroke-[2.5]" />
            )}
            <span>Verify Ledger Integrity</span>
          </button>
        </div>

        {/* Audit Verification Banner */}
        {auditResult && (
          <div
            className={`mb-8 p-4 border rounded-none font-mono text-xs flex items-start gap-3 ${
              auditResult.verified
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                : "bg-rose-500/10 border-rose-500/40 text-rose-300"
            }`}
          >
            {auditResult.verified ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertOctagon size={20} className="shrink-0 text-rose-400 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold uppercase tracking-wider">
                {auditResult.verified ? "CRYPTOGRAPHIC LEDGER VALIDATED" : "AUDIT FAILURE DETECTED"}
              </p>
              <p className="text-slate-300 font-sans">{auditResult.message}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <CyberLoader message="COMPUTING SHA-256 HASH CHAINS..." />
        ) : activities.length === 0 ? (
          <div className="py-16 text-center border border-slate-800 bg-slate-900/40 rounded-none font-mono">
            <Activity size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-xs">No audit logs recorded yet.</p>
          </div>
        ) : (
          <div className="bg-slate-900/90 border border-slate-800 rounded-none overflow-hidden font-mono shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Details</th>
                    <th className="p-4">SHA-256 Hash Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {activities.map((act) => (
                    <tr key={act._id} className="hover:bg-slate-950/60 transition">
                      <td className="p-4 text-slate-400 whitespace-nowrap">
                        {new Date(act.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                          {act.action}
                        </span>
                      </td>
                      <td className="p-4 text-slate-200 font-sans">{act.details || "N/A"}</td>
                      <td className="p-4 font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                        {act.hash ? `${act.hash.substring(0, 16)}...` : "0000000000000000..."}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
