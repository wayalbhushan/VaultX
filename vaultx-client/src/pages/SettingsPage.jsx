import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import {
  Settings,
  User,
  Shield,
  Lock,
  Smartphone,
  Eye,
  EyeOff,
  LoaderCircle,
  X,
  KeyRound,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Globe,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordMsgType, setPasswordMsgType] = useState("error");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // 2FA State
  const [show2faModal, setShow2faModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [isGenerating2fa, setIsGenerating2fa] = useState(false);
  const [isVerifying2fa, setIsVerifying2fa] = useState(false);
  const [showDisable2faModal, setShowDisable2faModal] = useState(false);
  const [passwordForDisable, setPasswordForDisable] = useState("");

  // Sessions State
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  useEffect(() => {
    fetchUserAndSessions();
  }, []);

  const fetchUserAndSessions = async () => {
    setIsLoadingUser(true);
    setIsLoadingSessions(true);
    try {
      const [userRes, sessionsRes] = await Promise.all([
        API.get("/user/me"),
        API.get("/user/sessions").catch(() => ({ data: [] })),
      ]);
      setUser(userRes.data.user);
      setSessions(sessionsRes.data || []);
    } catch (err) {
      console.error("Failed to load settings data:", err);
    } finally {
      setIsLoadingUser(false);
      setIsLoadingSessions(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setIsUpdatingPassword(true);

    if (newPassword !== confirmPassword) {
      setPasswordMsgType("error");
      setPasswordMsg("New passwords do not match.");
      setIsUpdatingPassword(false);
      return;
    }

    try {
      const res = await API.put("/user/change-password", {
        currentPassword,
        newPassword,
      });
      setPasswordMsgType("success");
      setPasswordMsg(res.data.message || "Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err.response?.data?.message || err.response?.data?.error || "Password update failed.";
      setPasswordMsgType("error");
      setPasswordMsg(msg);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleEnable2fa = async () => {
    setIsGenerating2fa(true);
    setShow2faModal(true);
    try {
      const res = await API.post("/2fa/generate");
      setQrCodeUrl(res.data.qrCodeUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating2fa(false);
    }
  };

  const handleVerify2fa = async () => {
    setIsVerifying2fa(true);
    try {
      const res = await API.post("/2fa/verify", { token: twoFactorToken });
      setShow2faModal(false);
      setTwoFactorToken("");
      fetchUserAndSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying2fa(false);
    }
  };

  const handleDisable2fa = async () => {
    setIsVerifying2fa(true);
    try {
      await API.post("/2fa/disable", { password: passwordForDisable });
      setShowDisable2faModal(false);
      setPasswordForDisable("");
      fetchUserAndSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying2fa(false);
    }
  };

  const handleRevokeSession = async (sessionId) => {
    try {
      await API.delete(`/user/sessions/${sessionId}`);
      setSessions(sessions.filter((s) => s._id !== sessionId));
    } catch (err) {
      console.error("Failed to revoke session:", err);
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      await API.post("/user/sessions/revoke-others");
      fetchUserAndSessions();
    } catch (err) {
      console.error("Failed to revoke other sessions:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 mt-16 md:mt-0 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800/80 pb-6">
          <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
            <Settings className="text-emerald-400" size={26} />
            <span>Security Settings</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your account credentials, 2FA authenticator, and active devices
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <User size={18} className="text-emerald-400" />
            <span>Account Profile</span>
          </h2>
          {isLoadingUser ? (
            <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse" />
          ) : user ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block">Username</span>
                <span className="text-sm font-semibold text-slate-100">{user.username}</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-slate-500 block">Email Address</span>
                <span className="text-sm font-semibold text-slate-100">{user.email}</span>
              </div>
            </div>
          ) : null}
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Lock size={18} className="text-emerald-400" />
            <span>Change Master Password</span>
          </h2>

          {passwordMsg && (
            <div
              className={`mb-4 p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                passwordMsgType === "error"
                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              }`}
            >
              {passwordMsgType === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
              <span>{passwordMsg}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">New Master Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="Min 8 chars, upper, lower, number & special"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
            >
              {isUpdatingPassword ? "Updating Password..." : "Update Master Password"}
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <KeyRound size={18} className="text-amber-400" />
                <span>Two-Factor Authentication (2FA)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Status:{" "}
                <span
                  className={
                    user?.isTwoFactorEnabled
                      ? "text-emerald-400 font-bold"
                      : "text-rose-400 font-bold"
                  }
                >
                  {user?.isTwoFactorEnabled ? "Active & Enforced" : "Disabled"}
                </span>
              </p>
            </div>
            {user?.isTwoFactorEnabled ? (
              <button
                onClick={() => setShowDisable2faModal(true)}
                className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl"
              >
                Disable 2FA
              </button>
            ) : (
              <button
                onClick={handleEnable2fa}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20"
              >
                Enable 2FA Authenticator
              </button>
            )}
          </div>
        </div>

        {/* Active Sessions & Device Management Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Smartphone size={18} className="text-cyan-400" />
                <span>Active Logged-In Sessions & Devices</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Revoke unrecognized devices or log out active sessions remotely
              </p>
            </div>
            {sessions.length > 1 && (
              <button
                onClick={handleRevokeOtherSessions}
                className="px-3.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold rounded-xl shrink-0"
              >
                Log Out All Other Devices
              </button>
            )}
          </div>

          {isLoadingSessions ? (
            <div className="h-20 bg-slate-800/50 rounded-xl animate-pulse" />
          ) : sessions.length > 0 ? (
            <div className="divide-y divide-slate-800/60">
              {sessions.map((s) => (
                <div key={s._id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <Globe size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200 truncate">
                          {s.ipAddress}
                        </span>
                        {s.isCurrentSession && (
                          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded">
                            Current Device
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 truncate max-w-md">{s.userAgent}</p>
                    </div>
                  </div>

                  {!s.isCurrentSession && (
                    <button
                      onClick={() => handleRevokeSession(s._id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                      title="Revoke session"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No active sessions tracked.</p>
          )}
        </div>
      </main>

      {/* 2FA Setup Modal */}
      {show2faModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative text-center">
            <button
              onClick={() => setShow2faModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Set Up 2FA Authenticator</h3>

            {isGenerating2fa ? (
              <LoaderCircle size={32} className="animate-spin mx-auto my-8 text-emerald-400" />
            ) : qrCodeUrl ? (
              <div className="space-y-4 text-xs text-slate-300">
                <p>1. Scan this QR code with Google Authenticator or Authy.</p>
                <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-40 h-40" />
                </div>
                <p>2. Enter the 6-digit code generated by your app.</p>
                <input
                  type="text"
                  value={twoFactorToken}
                  onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  placeholder="123456"
                  className="w-48 mx-auto text-center tracking-[0.5em] text-2xl font-mono p-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <button
                  onClick={handleVerify2fa}
                  disabled={isVerifying2fa || twoFactorToken.length !== 6}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 rounded-xl transition shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {isVerifying2fa ? "Verifying..." : "Verify & Enable 2FA"}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Disable 2FA Modal */}
      {showDisable2faModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative text-center">
            <button
              onClick={() => setShowDisable2faModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-rose-400 mb-2">Disable 2FA</h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter your master password to confirm disabling 2FA.
            </p>
            <input
              type="password"
              placeholder="Master Password"
              value={passwordForDisable}
              onChange={(e) => setPasswordForDisable(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 mb-4"
            />
            <button
              onClick={handleDisable2fa}
              disabled={isVerifying2fa || !passwordForDisable}
              className="w-full bg-rose-600 hover:bg-rose-500 text-white font-semibold py-2.5 text-xs rounded-xl transition shadow-md disabled:opacity-50"
            >
              Confirm & Disable
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
