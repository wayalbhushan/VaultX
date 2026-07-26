import { useState, useEffect } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import CyberLoader from "../components/SkeletonLoader";
import {
  Settings,
  Shield,
  Smartphone,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Lock,
  User,
  LogOut,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passMsgType, setPassMsgType] = useState("error");

  // 2FA Modal state
  const [show2faModal, setShow2faModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secretCode, setSecretCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [twoFaMsg, setTwoFaMsg] = useState("");

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    setIsLoading(true);
    try {
      const userRes = await API.get("/user/me");
      setUser(userRes.data.user || userRes.data);

      try {
        const sessRes = await API.get("/user/sessions");
        setSessions(sessRes.data.sessions || []);
      } catch (e) {
        setSessions([]);
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg("");

    if (newPassword !== confirmPassword) {
      setPassMsgType("error");
      setPassMsg("New passwords do not match.");
      return;
    }

    try {
      await API.put("/user/change-password", {
        currentPassword,
        newPassword,
      });
      setPassMsgType("success");
      setPassMsg("Master password successfully updated.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorDetails = err.response?.data?.details;
      const errorMsg =
        Array.isArray(errorDetails) && errorDetails.length > 0
          ? errorDetails.map((d) => d.message).join(" • ")
          : err.response?.data?.error || err.response?.data?.message || "Failed to update password.";
      setPassMsgType("error");
      setPassMsg(errorMsg);
    }
  };

  const handleSetup2FA = async () => {
    setTwoFaMsg("");
    try {
      const res = await API.post("/auth/setup-2fa");
      setQrCodeUrl(res.data.qrCode);
      setSecretCode(res.data.secret);
      setShow2faModal(true);
    } catch (err) {
      alert("Failed to initiate 2FA setup.");
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setTwoFaMsg("");
    try {
      await API.post("/auth/enable-2fa", { token: verificationCode });
      setShow2faModal(false);
      setVerificationCode("");
      fetchSettingsData();
    } catch (err) {
      setTwoFaMsg(err.response?.data?.error || "Invalid 2FA token.");
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await API.delete(`/user/sessions/${sessionId}`);
      fetchSettingsData();
    } catch (err) {
      alert("Failed to revoke session.");
    }
  };

  const handleRevokeOthers = async () => {
    if (!window.confirm("Revoke all other active sessions except current device?")) return;
    try {
      await API.post("/user/sessions/revoke-others");
      fetchSettingsData();
    } catch (err) {
      alert("Failed to revoke sessions.");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar user={user} />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800">
          <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
            <Settings size={24} className="text-emerald-400" />
            <span>Security Settings & Device Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Authentication Policies • 2FA Enforcement • Active Device Revocation
          </p>
        </div>

        {isLoading ? (
          <CyberLoader message="FETCHING SECURITY CONFIGURATION..." />
        ) : (
          <div className="space-y-8 max-w-4xl font-mono">
            {/* User Profile Card */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-none shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-none bg-slate-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <User size={24} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{user?.username}</h2>
                  <p className="text-xs text-slate-400 font-sans">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-none border ${
                    user?.isTwoFactorEnabled
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}
                >
                  {user?.isTwoFactorEnabled ? "2FA Active" : "2FA Disabled"}
                </span>
              </div>
            </div>

            {/* Change Password Form */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-none shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Lock size={18} className="text-emerald-400" />
                <h3 className="text-base font-bold text-white">Update Master Password</h3>
              </div>

              {passMsg && (
                <div
                  className={`p-3 text-xs font-mono border rounded-none flex items-center gap-2 ${
                    passMsgType === "error"
                      ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                  }`}
                >
                  {passMsgType === "error" ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                  <span>{passMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Current Master Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">New Master Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 chars, 1 upper, 1 special"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-none shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Update Master Password
                </button>
              </form>
            </div>

            {/* Active Sessions Management */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-none shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Smartphone size={18} className="text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Active Devices & Sessions</h3>
                </div>

                {sessions.length > 1 && (
                  <button
                    onClick={handleRevokeOthers}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-mono text-xs font-bold uppercase rounded-none transition"
                  >
                    Revoke Other Sessions
                  </button>
                )}
              </div>

              {sessions.length === 0 ? (
                <p className="text-xs text-slate-500">No active session records found.</p>
              ) : (
                <div className="space-y-3">
                  {sessions.map((sess) => (
                    <div
                      key={sess._id}
                      className="p-4 bg-slate-950 border border-slate-800 rounded-none flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {sess.ipAddress || "127.0.0.1"}
                          </span>
                          {sess.isCurrent && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                              CURRENT DEVICE
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 font-sans truncate max-w-md">
                          {sess.userAgent || "User Agent Browser"}
                        </p>
                      </div>

                      {!sess.isCurrent && (
                        <button
                          onClick={() => handleRevokeSession(sess._id)}
                          className="p-2 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30"
                          title="Revoke session"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
