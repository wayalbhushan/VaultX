import { useState, useEffect } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import CyberLoader from "../components/SkeletonLoader";
import {
  Lock,
  Plus,
  Search,
  Star,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  Edit,
  Folder,
  Tag,
  Shield,
  History,
  X,
} from "lucide-react";

export default function SecretsPage() {
  const [user, setUser] = useState(null);
  const [secrets, setSecrets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [secretVersions, setSecretVersions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    value: "",
    category: "General",
    notes: "",
    folder: "",
    tags: "",
  });
  const [copiedId, setCopiedId] = useState(null);
  const [revealedIds, setRevealedIds] = useState({});

  // Export / Import Passphrase State
  const [exportPassphrase, setExportPassphrase] = useState("");
  const [importPassphrase, setImportPassphrase] = useState("");
  const [importFile, setImportFile] = useState(null);

  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    setIsLoading(true);
    try {
      const userRes = await API.get("/user/me");
      setUser(userRes.data.user || userRes.data);

      const secretsRes = await API.get("/secrets");
      setSecrets(secretsRes.data.secrets || secretsRes.data || []);
    } catch (err) {
      console.error("Secrets fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSecret = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
      };
      await API.post("/secrets", payload);
      setShowAddModal(false);
      setFormData({ title: "", value: "", category: "General", notes: "", folder: "", tags: "" });
      fetchSecrets();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to create secret payload.");
    }
  };

  const handleDeleteSecret = async (id) => {
    if (!window.confirm("Are you sure you want to purge this secret payload?")) return;
    try {
      await API.delete(`/secrets/${id}`);
      fetchSecrets();
    } catch (err) {
      alert("Failed to delete secret.");
    }
  };

  const toggleFavorite = async (id, currentVal) => {
    try {
      await API.put(`/secrets/${id}/favorite`, { isFavorite: !currentVal });
      fetchSecrets();
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleCopyValue = (id, val) => {
    navigator.clipboard.writeText(val);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleReveal = (id) => {
    setRevealedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchVersionHistory = async (secret) => {
    setSelectedSecret(secret);
    try {
      const res = await API.get(`/secrets/${secret._id}/versions`);
      setSecretVersions(res.data.versions || []);
      setShowVersionModal(true);
    } catch (err) {
      alert("Failed to load revision history.");
    }
  };

  const handleRollback = async (targetVersion) => {
    if (!selectedSecret) return;
    try {
      await API.post(`/secrets/${selectedSecret._id}/rollback/${targetVersion}`);
      setShowVersionModal(false);
      fetchSecrets();
    } catch (err) {
      alert("Rollback failed.");
    }
  };

  const filteredSecrets = secrets.filter((s) => {
    const matchesQuery =
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.folder?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar user={user} onAddSecretClick={() => setShowAddModal(true)} />

      <main className="flex-1 md:ml-64 p-6 md:p-10 pt-20 md:pt-10 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-mono text-white tracking-tight flex items-center gap-2">
              <Lock size={24} className="text-emerald-400" />
              <span>Encrypted Secrets Vault</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              AES-256-GCM AEAD Mode • Strict Multi-Field Isolation ({secrets.length} total items)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-mono text-xs font-bold uppercase tracking-wider rounded-none transition flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export Vault</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider rounded-none shadow-[0_0_15px_rgba(16,185,129,0.3)] transition flex items-center gap-2"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>New Secret</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 font-mono">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search secrets, tags, folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-none text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {["All", "General", "API Key", "Database", "SSH Key"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider rounded-none transition ${
                  categoryFilter === cat
                    ? "bg-slate-900 text-emerald-400 border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)]"
                    : "text-slate-400 hover:text-slate-200 border border-transparent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <CyberLoader message="FETCHING ENCRYPTED VAULT PAYLOADS..." />
        ) : filteredSecrets.length === 0 ? (
          <div className="py-16 text-center border border-slate-800 bg-slate-900/40 rounded-none font-mono">
            <Lock size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-xs">No secrets found in this query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono">
            {filteredSecrets.map((secret) => (
              <div
                key={secret._id}
                className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 p-5 rounded-none shadow-sm transition group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-none bg-slate-950 border border-slate-700 flex items-center justify-center text-emerald-400 shrink-0">
                        <Lock size={15} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                          {secret.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 block font-sans">
                          {secret.category} • Version {secret.version || 1}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleFavorite(secret._id, secret.isFavorite)}
                      className={`p-1.5 rounded-none border ${
                        secret.isFavorite
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "text-slate-500 border-slate-800 hover:text-slate-300"
                      }`}
                    >
                      <Star size={15} fill={secret.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Secret Value Display Box */}
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-none mb-3 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-400 truncate max-w-[200px]">
                      {revealedIds[secret._id] ? secret.value : "••••••••••••••••••••"}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleReveal(secret._id)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="Toggle visibility"
                      >
                        {revealedIds[secret._id] ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => handleCopyValue(secret._id, secret.value)}
                        className="p-1 text-slate-400 hover:text-emerald-400"
                        title="Copy to clipboard"
                      >
                        {copiedId === secret._id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <button
                    onClick={() => fetchVersionHistory(secret)}
                    className="hover:text-cyan-400 flex items-center gap-1"
                  >
                    <History size={13} />
                    <span>Revisions ({secret.versions?.length || 1})</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSecret(secret._id)}
                    className="hover:text-rose-400 p-1"
                    title="Delete payload"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Secret Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-950 border border-emerald-500/40 p-6 rounded-none max-w-lg w-full font-mono space-y-4 shadow-[0_0_40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus size={18} className="text-emerald-400" />
                  <span>New Encrypted Secret Payload</span>
                </h3>
                <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateSecret} className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-300 mb-1">Title / Identifier</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS_SECRET_ACCESS_KEY"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Secret Value / Key</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter confidential text"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="General">General</option>
                      <option value="API Key">API Key</option>
                      <option value="Database">Database</option>
                      <option value="SSH Key">SSH Key</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Folder</label>
                    <input
                      type="text"
                      placeholder="e.g. Production"
                      value={formData.folder}
                      onChange={(e) => setFormData({ ...formData, folder: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-none text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider rounded-none shadow-[0_0_15px_rgba(16,185,129,0.3)] transition"
                >
                  Encrypt & Save Payload
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
