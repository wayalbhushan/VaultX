import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import { SkeletonCard, SkeletonStat } from "../components/SkeletonLoader";
import {
  Shield,
  Key,
  Lock,
  Star,
  Activity,
  Plus,
  Copy,
  Check,
  Eye,
  Clock,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";

// Password generator helper
function generateSecurePassword(len = 20) {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}";
  let out = "";
  const arr = new Uint32Array(len);
  window.crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) out += chars[arr[i] % chars.length];
  return out;
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [secrets, setSecrets] = useState([]);
  const [activities, setActivities] = useState([]);
  const [expiredCount, setExpiredCount] = useState(0);
  const [activeSessionCount, setActiveSessionCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSecret, setNewSecret] = useState({
    title: "",
    data: "",
    type: "secret",
    description: "",
    folder: "",
    tags: "",
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [viewingSecret, setViewingSecret] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [userRes, secretsRes, activitiesRes, expiredRes, sessionsRes] =
        await Promise.all([
          API.get("/user/me"),
          API.get("/secrets"),
          API.get("/activity"),
          API.get("/secrets/expired").catch(() => ({ data: [] })),
          API.get("/user/sessions").catch(() => ({ data: [] })),
        ]);

      setUser(userRes.data.user);
      setSecrets(secretsRes.data);
      setActivities(activitiesRes.data);
      setExpiredCount(expiredRes.data?.length || 0);
      setActiveSessionCount(sessionsRes.data?.length || 1);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      if (err.response?.status === 401) {
        navigate("/get-started");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSecret = async (secretId) => {
    const title = secrets.find((s) => s._id === secretId)?.title || "Secret";
    setViewingSecret({ title, data: "Loading..." });
    try {
      const res = await API.get(`/secrets/${secretId}`);
      setViewingSecret(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to load secret.";
      setViewingSecret({ title, error: msg });
    }
  };

  const handleAddSecret = async (e) => {
    e.preventDefault();
    if (!newSecret.title || !newSecret.data) return;
    try {
      const tagArray = newSecret.tags
        ? newSecret.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const res = await API.post("/secrets", {
        ...newSecret,
        tags: tagArray,
      });

      setSecrets([res.data, ...secrets]);
      setNewSecret({
        title: "",
        data: "",
        type: "secret",
        description: "",
        folder: "",
        tags: "",
      });
      setShowAddModal(false);

      const resActivities = await API.get("/activity");
      setActivities(resActivities.data);
    } catch (err) {
      console.error("Failed to create secret:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const handleGeneratePassword = () => {
    const pwd = generateSecurePassword(20);
    setGeneratedPassword(pwd);
  };

  const favoriteCount = secrets.filter((s) => s.isFavorite).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <Sidebar user={user} onAddSecretClick={() => setShowAddModal(true)} />

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 mt-16 md:mt-0 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              Welcome back, {user ? user.username : "..."} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Your secrets vault is active and encrypted with AES-256-GCM
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleGeneratePassword}
              className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-sm"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>Generate Password</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-emerald-500/20"
            >
              <Plus size={16} className="stroke-[2.5]" />
              <span>Add Secret</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <>
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
              <SkeletonStat />
            </>
          ) : (
            <>
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Secrets</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Shield size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">{secrets.length}</span>
                  <Link to="/dashboard/secrets" className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1">
                    Manage <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Favorites</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Star size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">{favoriteCount}</span>
                  <Link to="/dashboard/secrets?isFavorite=true" className="text-[11px] text-amber-400 hover:underline flex items-center gap-1">
                    View <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Expired / Expiring</span>
                  <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <AlertTriangle size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">{expiredCount}</span>
                  <span className="text-[11px] text-rose-400 font-medium">
                    {expiredCount > 0 ? "Rotation needed" : "All active"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Active Devices</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-white font-mono">{activeSessionCount}</span>
                  <Link to="/dashboard/settings" className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1">
                    Sessions <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dashboard Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Secrets Card */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Lock size={18} className="text-emerald-400" />
                  <h2 className="text-lg font-semibold text-white">Recent Vault Items</h2>
                </div>
                <Link
                  to="/dashboard/secrets"
                  className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                >
                  View All Vault <ArrowRight size={12} />
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : secrets.length > 0 ? (
                <div className="divide-y divide-slate-800/60">
                  {secrets.slice(0, 4).map((s) => (
                    <div
                      key={s._id}
                      className="py-3.5 flex items-center justify-between group hover:bg-slate-800/30 px-3 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 border border-slate-700/50 shrink-0">
                          {s.type === "key" ? (
                            <Key size={16} />
                          ) : s.type === "password" ? (
                            <Lock size={16} />
                          ) : (
                            <Shield size={16} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-slate-200 group-hover:text-white truncate">
                            {s.title}
                          </h3>
                          <p className="text-xs text-slate-400 truncate">
                            {s.description || `Type: ${s.type}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewSecret(s._id)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg transition flex items-center gap-1.5 ml-4 shrink-0"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <Shield size={36} className="mx-auto mb-3 opacity-30 text-slate-400" />
                  <p className="text-sm">No secrets added yet.</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-xs text-emerald-400 hover:underline inline-block font-semibold"
                  >
                    + Add your first secret
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" />
                  <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                </div>
                <Link
                  to="/dashboard/activity"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition"
                >
                  Log
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  <div className="h-10 bg-slate-800/50 rounded-xl animate-pulse"></div>
                  <div className="h-10 bg-slate-800/50 rounded-xl animate-pulse"></div>
                </div>
              ) : activities.length > 0 ? (
                <ul className="space-y-3 text-xs">
                  {activities.slice(0, 5).map((a) => (
                    <li
                      key={a._id}
                      className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl flex items-start gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-300 font-medium truncate">{a.action}</p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(a.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 text-center py-8">No activity recorded.</p>
              )}
            </div>

            <Link
              to="/dashboard/activity"
              className="mt-6 w-full py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded-xl text-center transition block"
            >
              View Full Security Audit Log
            </Link>
          </div>
        </div>
      </main>

      {/* Add Secret Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Plus size={18} className="text-emerald-400" />
              <span>Add New Secret</span>
            </h3>
            <form onSubmit={handleAddSecret} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Production Master Key"
                  value={newSecret.title}
                  onChange={(e) => setNewSecret({ ...newSecret, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Secret Data</label>
                <textarea
                  placeholder="Paste confidential text or key string..."
                  value={newSecret.data}
                  onChange={(e) => setNewSecret({ ...newSecret, data: e.target.value })}
                  className="w-full p-2.5 h-24 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Type</label>
                  <select
                    value={newSecret.type}
                    onChange={(e) => setNewSecret({ ...newSecret, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  >
                    <option value="secret">Secret</option>
                    <option value="key">Key</option>
                    <option value="password">Password</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Folder (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Production"
                    value={newSecret.folder}
                    onChange={(e) => setNewSecret({ ...newSecret, folder: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. aws, prod, database"
                  value={newSecret.tags}
                  onChange={(e) => setNewSecret({ ...newSecret, tags: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
                <input
                  type="text"
                  placeholder="Additional context or usage notes..."
                  value={newSecret.description}
                  onChange={(e) => setNewSecret({ ...newSecret, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl shadow-md shadow-emerald-500/20 transition"
                >
                  Save Secret
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Viewing Secret Modal */}
      {viewingSecret && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setViewingSecret(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 truncate pr-6 flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <span>{viewingSecret.title}</span>
            </h3>

            {viewingSecret.error ? (
              <p className="text-xs text-rose-400 p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
                {viewingSecret.error}
              </p>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-1">
                    Decrypted Payload (AES-256-GCM Verified)
                  </label>
                  <div className="flex justify-between items-center gap-3">
                    <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap break-all flex-1 select-all">
                      {viewingSecret.data}
                    </pre>
                    <button
                      onClick={() => handleCopy(viewingSecret.data)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0"
                    >
                      {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copySuccess || "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 block">Type</span>
                    <span className="font-semibold capitalize text-slate-200">{viewingSecret.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Current Version</span>
                    <span className="font-semibold text-emerald-400">v{viewingSecret.version || 1}</span>
                  </div>
                </div>

                {viewingSecret.description && (
                  <div className="text-xs">
                    <span className="text-slate-500 block">Description</span>
                    <p className="text-slate-300 mt-0.5">{viewingSecret.description}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingSecret(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Generator Modal */}
      {generatedPassword && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-400" />
              <span>Generated Password</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Cryptographically secure random password generated locally via Web Crypto API.
            </p>

            <div className="flex justify-between items-center bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-amber-300 font-mono text-sm mb-4">
              <span className="truncate select-all font-bold">{generatedPassword}</span>
              <button
                onClick={() => handleCopy(generatedPassword)}
                className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ml-2"
              >
                {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                <span>{copySuccess || "Copy"}</span>
              </button>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setGeneratedPassword("")}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl"
              >
                Done
              </button>
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setNewSecret({
                    title: "Generated Password",
                    data: generatedPassword,
                    type: "password",
                    description: `Auto-generated on ${new Date().toLocaleDateString()}`,
                    folder: "",
                    tags: "generated",
                  });
                  setGeneratedPassword("");
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl"
              >
                Save as Secret
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
