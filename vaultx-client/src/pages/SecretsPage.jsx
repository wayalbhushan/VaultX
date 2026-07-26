import { useEffect, useState } from "react";
import API from "../utils/api";
import Sidebar from "../components/Sidebar";
import { SkeletonCard } from "../components/SkeletonLoader";
import {
  Lock,
  Key,
  Shield,
  Star,
  Search,
  Plus,
  Copy,
  Check,
  Edit,
  Trash2,
  X,
  History,
  Download,
  Upload,
  RotateCcw,
  Tag,
  Folder,
} from "lucide-react";

export default function SecretsPage() {
  const [secrets, setSecrets] = useState([]);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSecret, setEditedSecret] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // Version History Modal
  const [showVersionsModal, setShowVersionsModal] = useState(false);
  const [versionsData, setVersionsData] = useState(null);

  // Export / Import Modals
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportPassphrase, setExportPassphrase] = useState("");
  const [exportedJson, setExportedJson] = useState("");

  const [showImportModal, setShowImportModal] = useState(false);
  const [importPassphrase, setImportPassphrase] = useState("");
  const [importJsonText, setImportJsonText] = useState("");
  const [importMsg, setImportMsg] = useState("");

  useEffect(() => {
    fetchSecretsAndUser();
  }, []);

  const fetchSecretsAndUser = async () => {
    setIsLoading(true);
    try {
      const [secRes, userRes] = await Promise.all([
        API.get("/secrets"),
        API.get("/user/me").catch(() => null),
      ]);
      setSecrets(secRes.data);
      if (userRes) setUser(userRes.data.user);
    } catch (err) {
      console.error("Failed to fetch secrets:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewSecret = async (secretId) => {
    setSelectedSecret({ title: "Loading..." });
    try {
      const res = await API.get(`/secrets/${secretId}`);
      setSelectedSecret(res.data);
      setEditedSecret(res.data);
    } catch (err) {
      console.error("Failed to view secret:", err);
      setSelectedSecret({ title: "Error", error: "Could not load secret details." });
    }
  };

  const handleToggleFavorite = async (e, secretId) => {
    e.stopPropagation();
    try {
      const res = await API.put(`/secrets/${secretId}/favorite`);
      setSecrets(
        secrets.map((s) => (s._id === secretId ? { ...s, isFavorite: res.data.isFavorite } : s))
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleUpdateSecret = async (e) => {
    e.preventDefault();
    try {
      const { _id, title, data, type, description, folder, tags } = editedSecret;
      const tagArray = typeof tags === "string" ? tags.split(",").map((t) => t.trim()) : tags;

      const res = await API.put(`/secrets/${_id}`, {
        title,
        data,
        type,
        description,
        folder,
        tags: tagArray,
      });

      setSecrets(secrets.map((s) => (s._id === _id ? res.data : s)));
      setIsEditMode(false);
      setSelectedSecret(editedSecret);
    } catch (err) {
      console.error("Failed to update secret:", err);
    }
  };

  const handleDeleteSecret = async () => {
    if (!selectedSecret) return;
    try {
      await API.delete(`/secrets/${selectedSecret._id}`);
      setSecrets(secrets.filter((s) => s._id !== selectedSecret._id));
      closeModals();
    } catch (err) {
      console.error("Failed to delete secret:", err);
    }
  };

  const handleFetchVersions = async (secretId) => {
    try {
      const res = await API.get(`/secrets/${secretId}/versions`);
      setVersionsData(res.data);
      setShowVersionsModal(true);
    } catch (err) {
      console.error("Failed to fetch versions:", err);
    }
  };

  const handleRollbackVersion = async (targetVersion) => {
    if (!selectedSecret) return;
    try {
      const res = await API.post(
        `/secrets/${selectedSecret._id}/rollback/${targetVersion}`
      );
      setSelectedSecret(res.data.secret);
      setSecrets(secrets.map((s) => (s._id === res.data.secret._id ? res.data.secret : s)));
      setShowVersionsModal(false);
    } catch (err) {
      console.error("Failed to rollback:", err);
    }
  };

  const handleExportVault = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/secrets/export", { passphrase: exportPassphrase });
      setExportedJson(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Export error:", err);
    }
  };

  const handleImportVault = async (e) => {
    e.preventDefault();
    setImportMsg("");
    try {
      const backupData = JSON.parse(importJsonText);
      const res = await API.post("/secrets/import", {
        passphrase: importPassphrase,
        backupData,
      });
      setImportMsg(`✅ ${res.data.message}`);
      fetchSecretsAndUser();
      setTimeout(() => setShowImportModal(false), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid passphrase or JSON structure.";
      setImportMsg(`❌ ${msg}`);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000);
  };

  const closeModals = () => {
    setSelectedSecret(null);
    setIsEditMode(false);
    setShowConfirmDelete(false);
    setShowVersionsModal(false);
    setEditedSecret(null);
  };

  // Search & tab filter logic
  const filteredSecrets = secrets.filter((s) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "favorites"
        ? s.isFavorite
        : s.type === activeTab;

    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.tags && s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col md:flex-row">
      <Sidebar user={user} />

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 md:ml-64 mt-16 md:mt-0 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              <Shield className="text-emerald-400" size={26} />
              <span>Encrypted Vault</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Manage your confidential credentials with versioning and PBKDF2 backups
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setExportPassphrase("");
                setExportedJson("");
                setShowExportModal(true);
              }}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Download size={14} className="text-cyan-400" />
              <span>Export</span>
            </button>
            <button
              onClick={() => {
                setImportPassphrase("");
                setImportJsonText("");
                setImportMsg("");
                setShowImportModal(true);
              }}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <Upload size={14} className="text-emerald-400" />
              <span>Import</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-900 p-1 rounded-xl border border-slate-800">
            {["all", "secret", "key", "password", "favorites"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-slate-800 text-emerald-400 border border-slate-700/50 shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {tab === "favorites" ? "★ Favorites" : tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative md:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search title, tag, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
        </div>

        {/* Vault Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredSecrets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSecrets.map((s) => (
              <div
                key={s._id}
                onClick={() => handleViewSecret(s._id)}
                className="cursor-pointer bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-sm transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 shrink-0">
                        {s.type === "key" ? (
                          <Key size={16} />
                        ) : s.type === "password" ? (
                          <Lock size={16} />
                        ) : (
                          <Shield size={16} />
                        )}
                      </div>
                      <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white truncate">
                        {s.title}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => handleToggleFavorite(e, s._id)}
                      className={`p-1.5 rounded-lg transition ${
                        s.isFavorite
                          ? "text-amber-400 hover:bg-amber-400/10"
                          : "text-slate-600 hover:text-slate-300"
                      }`}
                    >
                      <Star size={16} fill={s.isFavorite ? "currentColor" : "none"} />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                    {s.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    v{s.version || 1}
                  </span>
                  <span className="capitalize">{s.type}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
            <Shield size={40} className="mx-auto mb-3 opacity-20 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-300">No vault items found</h3>
            <p className="text-xs text-slate-500 mt-1">Try clearing filters or search terms.</p>
          </div>
        )}
      </main>

      {/* View/Edit Secret Modal */}
      {selectedSecret && !showConfirmDelete && !showVersionsModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={closeModals}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-bold text-white mb-4 truncate pr-6 flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" />
              <span>{isEditMode ? "Edit Secret" : selectedSecret.title}</span>
            </h2>

            {selectedSecret.error ? (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                {selectedSecret.error}
              </p>
            ) : isEditMode ? (
              <form onSubmit={handleUpdateSecret} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                  <input
                    type="text"
                    value={editedSecret.title}
                    onChange={(e) => setEditedSecret({ ...editedSecret, title: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Data Payload</label>
                  <textarea
                    value={editedSecret.data}
                    onChange={(e) => setEditedSecret({ ...editedSecret, data: e.target.value })}
                    className="w-full p-2.5 h-24 bg-slate-950 border border-slate-800 rounded-xl text-sm font-mono text-slate-100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                  <input
                    type="text"
                    value={editedSecret.description || ""}
                    onChange={(e) =>
                      setEditedSecret({ ...editedSecret, description: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl"
                  >
                    Save & Snapshot Version
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-[10px] uppercase font-mono text-slate-400 block mb-1">
                    Payload
                  </label>
                  <div className="flex justify-between items-center gap-3">
                    <pre className="text-sm font-mono text-emerald-400 whitespace-pre-wrap break-all flex-1 select-all">
                      {selectedSecret.data}
                    </pre>
                    <button
                      onClick={() => handleCopy(selectedSecret.data)}
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copySuccess || "Copy"}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Type</span>
                    <span className="font-semibold text-slate-200 capitalize">{selectedSecret.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Version</span>
                    <span className="font-semibold text-emerald-400">v{selectedSecret.version || 1}</span>
                  </div>
                </div>

                {selectedSecret.description && (
                  <div className="text-xs">
                    <span className="text-slate-500 block">Description</span>
                    <p className="text-slate-300 mt-0.5">{selectedSecret.description}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <button
                    onClick={() => handleFetchVersions(selectedSecret._id)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <History size={14} />
                    <span>View Revision History</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg flex items-center gap-1"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setShowConfirmDelete(true)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-semibold text-rose-400 rounded-lg flex items-center gap-1"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Version History Modal */}
      {showVersionsModal && versionsData && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative">
            <button
              onClick={() => setShowVersionsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <History size={18} className="text-cyan-400" />
              <span>Secret Revision History</span>
            </h3>

            {versionsData.history && versionsData.history.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {versionsData.history.map((v) => (
                  <div
                    key={v.version}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-emerald-400">Version {v.version}</span>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {new Date(v.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRollbackVersion(v.version)}
                      className="px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg flex items-center gap-1"
                    >
                      <RotateCcw size={12} /> Rollback
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No previous versions snapshot recorded.</p>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowVersionsModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Download size={18} className="text-cyan-400" />
              <span>Export Encrypted Vault</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Protects backup with PBKDF2-SHA256 (100,000 iterations) + AES-256-GCM encryption.
            </p>

            {!exportedJson ? (
              <form onSubmit={handleExportVault} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Export Passphrase (Min 6 chars)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter encryption passphrase..."
                    value={exportPassphrase}
                    onChange={(e) => setExportPassphrase(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md shadow-cyan-500/20"
                  >
                    Generate Export
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <textarea
                  readOnly
                  value={exportedJson}
                  className="w-full h-40 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300 select-all"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => handleCopy(exportedJson)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    {copySuccess ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copySuccess || "Copy Backup Payload"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Upload size={18} className="text-emerald-400" />
              <span>Import Encrypted Vault</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste your `.vaultx` JSON container and decryption passphrase to restore items.
            </p>

            {importMsg && (
              <p className="text-xs mb-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                {importMsg}
              </p>
            )}

            <form onSubmit={handleImportVault} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Decryption Passphrase
                </label>
                <input
                  type="password"
                  placeholder="Enter export passphrase..."
                  value={importPassphrase}
                  onChange={(e) => setImportPassphrase(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Backup JSON Payload
                </label>
                <textarea
                  placeholder="Paste JSON container structure..."
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  className="w-full h-28 p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md shadow-emerald-500/20"
                >
                  Import Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <h3 className="text-lg font-bold text-rose-400 mb-2">Delete Secret?</h3>
            <p className="text-xs text-slate-300 mb-6">
              This action cannot be undone. "{selectedSecret?.title}" will be permanently removed.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSecret}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
              >
                Delete Secret
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
