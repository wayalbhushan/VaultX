import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import { SkeletonTableRow } from "../components/SkeletonLoader";
import { Activity, ShieldCheck, AlertOctagon, CheckCircle2, RefreshCw, Hash, Lock } from "lucide-react";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Audit Ledger Verification state
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [actRes, userRes] = await Promise.all([
        API.get("/activity"),
        API.get("/user/me").catch(() => null),
      ]);
      setActivities(actRes.data);
      if (userRes) setUser(userRes.data.user);
    } catch (err) {
      console.error("Failed to fetch activity:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyLedger = async () => {
    setIsVerifying(true);
    try {
      const res = await API.get("/activity/verify");
      setVerificationResult(res.data);
    } catch (err) {
      console.error("Failed to verify audit ledger:", err);
      setVerificationResult({ verified: false, status: "Verification service error." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 mt-16 md:mt-0 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <Activity className="text-cyan-400" size={26} />
              <span>Immutable Audit Ledger</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Cryptographically hash-chained activity log with SHA-256 tamper verification
            </p>
          </div>
          <div>
            <button
              onClick={handleVerifyLedger}
              disabled={isVerifying}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              <ShieldCheck size={16} />
              <span>{isVerifying ? "Verifying Hash Chain..." : "Verify Ledger Integrity"}</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        {verificationResult && (
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-all ${
              verificationResult.verified
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {verificationResult.verified ? (
              <CheckCircle2 size={20} className="shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertOctagon size={20} className="shrink-0 text-rose-400 mt-0.5" />
            )}
            <div className="flex-1 text-xs">
              <h4 className="font-bold text-sm">{verificationResult.status}</h4>
              <p className="mt-1 opacity-90">
                Verified {verificationResult.totalEntries} audit log chain entries. Every SHA-256 hash match confirms zero database tampering.
              </p>
            </div>
          </div>
        )}

        {/* Activity Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          {isLoading ? (
            <div className="space-y-4">
              <SkeletonTableRow />
              <SkeletonTableRow />
              <SkeletonTableRow />
            </div>
          ) : activities.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {activities.map((act) => (
                <div key={act._id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 border border-slate-700/50 shrink-0">
                      <Lock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-200 group-hover:text-white">
                        {act.action}
                      </p>
                      <span className="text-xs text-slate-500">
                        {new Date(act.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {act.hash && (
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 self-start md:self-auto">
                      <Hash size={12} className="text-emerald-400" />
                      <span className="truncate max-w-[180px]">{act.hash}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500">
              <Activity size={40} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">No activity recorded yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
