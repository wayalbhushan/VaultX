import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";
import { Lock, Key, Shield, Settings, Home, Activity, Copy, X, Edit, Trash2 } from "lucide-react";

export default function SecretsPage() {
  const [secrets, setSecrets] = useState([]);
  const [selectedSecret, setSelectedSecret] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');

  // New state for edit and delete functionality
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSecret, setEditedSecret] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);


  useEffect(() => {
    fetchSecrets();
  }, []);

  const fetchSecrets = async () => {
    try {
      const res = await API.get("/secrets");
      setSecrets(res.data);
    } catch (err) {
      console.error("Failed to fetch secrets:", err);
    }
  };

  const handleViewSecret = async (secretId) => {
    setIsLoading(true);
    setSelectedSecret({ title: "Loading..." });
    try {
      const res = await API.get(`/secrets/${secretId}`);
      setSelectedSecret(res.data);
      setEditedSecret(res.data); // Pre-populate edit form
    } catch (err) {
      console.error("Failed to fetch secret details:", err);
      setSelectedSecret({ title: "Error", error: "Could not load secret." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSecret = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const { _id, title, data, type, description } = editedSecret;
        const res = await API.put(`/secrets/${_id}`, { title, data, type, description });
        
        // Update the secret in the main list
        setSecrets(secrets.map(s => s._id === _id ? res.data : s));
        
        // Exit edit mode and show the updated (view) modal
        setIsEditMode(false);
        setSelectedSecret(editedSecret);

    } catch (err) {
        console.error("Failed to update secret:", err);
        // Optionally show an error message in the modal
    } finally {
        setIsLoading(false);
    }
  };

  const handleDeleteSecret = async () => {
    if (!selectedSecret) return;
    setIsLoading(true);
    try {
        await API.delete(`/secrets/${selectedSecret._id}`);
        // Remove the secret from the main list
        setSecrets(secrets.filter(s => s._id !== selectedSecret._id));
        // Close all modals
        closeModals();
    } catch (err) {
        console.error("Failed to delete secret:", err);
    } finally {
        setIsLoading(false);
    }
  };


  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const closeModals = () => {
    setSelectedSecret(null);
    setIsEditMode(false);
    setShowConfirmDelete(false);
    setEditedSecret(null);
  }

  const groupedSecrets = {
    secret: secrets.filter((s) => s.type === "secret"),
    key: secrets.filter((s) => s.type === "key"),
    password: secrets.filter((s) => s.type === "password"),
  };

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex pt-16">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-green-500 p-6 flex flex-col justify-between shadow-lg fixed top-0 left-0 bottom-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)]">
            VaultX
          </h1>
          <nav className="flex flex-col gap-4 mt-6">
            <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-300 transition"><Home size={18} /> Dashboard</Link>
            <Link to="/dashboard/secrets" className="flex items-center gap-2 text-green-200 font-bold"><Shield size={18} /> My Secrets</Link>
            <Link to="/dashboard/activity" className="flex items-center gap-2 hover:text-green-300 transition"><Activity size={18} /> Activity</Link>
            <Link to="/dashboard/settings" className="flex items-center gap-2 hover:text-green-300 transition"><Settings size={18} /> Settings</Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 ml-64">
        <h1 className="text-4xl font-bold text-green-300 mb-8">Your Vault</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Secrets Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-400 border-b border-green-500/50 pb-2"><Shield size={20} /> Secrets</h2>
            {groupedSecrets.secret.length > 0 ? (groupedSecrets.secret.map((s) => (<div key={s._id} onClick={() => handleViewSecret(s._id)} className="cursor-pointer bg-gray-900/80 border border-green-500 rounded-lg p-4 shadow-md hover:shadow-green-500/30 hover:border-green-400 transition"><h3 className="font-bold truncate">{s.title}</h3></div>))) : (<p className="text-green-500/70">No secrets stored.</p>)}
          </div>
          {/* Keys Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-400 border-b border-green-500/50 pb-2"><Key size={20} /> Keys</h2>
            {groupedSecrets.key.length > 0 ? (groupedSecrets.key.map((s) => (<div key={s._id} onClick={() => handleViewSecret(s._id)} className="cursor-pointer bg-gray-900/80 border border-green-500 rounded-lg p-4 shadow-md hover:shadow-green-500/30 hover:border-green-400 transition"><h3 className="font-bold truncate">{s.title}</h3></div>))) : (<p className="text-green-500/70">No keys stored.</p>)}
          </div>
          {/* Passwords Column */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold flex items-center gap-2 text-green-400 border-b border-green-500/50 pb-2"><Lock size={20} /> Passwords</h2>
            {groupedSecrets.password.length > 0 ? (groupedSecrets.password.map((s) => (<div key={s._id} onClick={() => handleViewSecret(s._id)} className="cursor-pointer bg-gray-900/80 border border-green-500 rounded-lg p-4 shadow-md hover:shadow-green-500/30 hover:border-green-400 transition"><h3 className="font-bold truncate">{s.title}</h3></div>))) : (<p className="text-green-500/70">No passwords stored.</p>)}
          </div>
        </div>
      </main>

      {/* View/Edit Secret Modal */}
      {selectedSecret && !showConfirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-green-500 rounded-lg shadow-xl p-6 w-full max-w-lg relative">
            <button onClick={closeModals} className="absolute top-4 right-4 text-green-400 hover:text-green-200"><X size={20} /></button>
            <h2 className="text-2xl font-bold text-green-300 mb-4 truncate">{isEditMode ? "Edit Secret" : selectedSecret.title}</h2>
            
            {isLoading ? (<p>Loading...</p>) : selectedSecret.error ? (<p className="text-red-500">{selectedSecret.error}</p>) : 
            
            isEditMode ? (
                <form onSubmit={handleUpdateSecret} className="space-y-4">
                    <input type="text" value={editedSecret.title} onChange={e => setEditedSecret({...editedSecret, title: e.target.value})} className="w-full p-2 bg-gray-800 border border-green-500 rounded text-green-300" />
                    <textarea value={editedSecret.data} onChange={e => setEditedSecret({...editedSecret, data: e.target.value})} className="w-full p-2 h-24 bg-gray-800 border border-green-500 rounded text-green-300" />
                    <textarea value={editedSecret.description} onChange={e => setEditedSecret({...editedSecret, description: e.target.value})} placeholder="Description" className="w-full p-2 bg-gray-800 border border-green-500 rounded text-green-300" />
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={() => setIsEditMode(false)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-green-500 text-black rounded">Save Changes</button>
                    </div>
                </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 p-3 rounded">
                  <label className="text-xs text-green-400">Secret Data</label>
                  <div className="flex justify-between items-center mt-1">
                    <pre className="text-green-200 whitespace-pre-wrap break-all flex-1">{selectedSecret.data}</pre>
                    <button onClick={() => handleCopyToClipboard(selectedSecret.data)} className="bg-green-500 px-3 py-1 rounded text-black ml-4 text-sm flex items-center gap-1"><Copy size={14} /> {copySuccess || 'Copy'}</button>
                  </div>
                </div>
                <p><strong className="text-green-400">Type:</strong> {selectedSecret.type}</p>
                <p><strong className="text-green-400">Description:</strong> {selectedSecret.description || "N/A"}</p>
                <p className="text-xs text-green-500/80">Created: {new Date(selectedSecret.createdAt).toLocaleString()}</p>
                <div className="flex justify-end gap-3 pt-4 border-t border-green-500/20">
                    <button onClick={() => setIsEditMode(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-500/80 text-white rounded"><Edit size={16}/> Edit</button>
                    <button onClick={() => setShowConfirmDelete(true)} className="flex items-center gap-2 px-4 py-2 bg-red-600/80 hover:bg-red-500/80 text-white rounded"><Trash2 size={16}/> Delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-red-500 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-bold text-red-400 mb-4">Are you sure?</h3>
                <p className="text-green-300 mb-6">This action cannot be undone. The secret "{selectedSecret?.title}" will be permanently deleted.</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setShowConfirmDelete(false)} className="px-6 py-2 bg-gray-700 rounded">Cancel</button>
                    <button onClick={handleDeleteSecret} className="px-6 py-2 bg-red-600 text-white rounded">{isLoading ? "Deleting..." : "Delete"}</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
