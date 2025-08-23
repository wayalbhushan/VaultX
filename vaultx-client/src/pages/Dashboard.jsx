import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../utils/api";
import { Shield, Settings, Home, Activity, User, LogOut, Copy, X, Edit, Trash2 } from "lucide-react";

// Strong password generator
function cryptoRandom(len = 16) {
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
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSecret, setNewSecret] = useState({ title: "", data: "", type: "secret", description: "" });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [viewingSecret, setViewingSecret] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("vaultxToken");
    if (!token) {
      navigate("/get-started");
      return;
    }
    setAuthToken(token);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [userRes, secretsRes, activitiesRes] = await Promise.all([
        API.get("/user/me"),
        API.get("/secrets"),
        API.get("/activity")
      ]);
      // FIX: The user object is nested inside a `user` property in the API response.
      setUser(userRes.data.user);
      setSecrets(secretsRes.data);
      setActivities(activitiesRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      if (err.response?.status === 401) {
        executeLogout();
      }
    } finally {
        setIsLoading(false);
    }
  };

  const handleViewSecret = async (secretId) => {
    const secretTitle = secrets.find(s => s._id === secretId)?.title || '...';
    setViewingSecret({ title: secretTitle, data: 'Loading...' }); 
    try {
      const res = await API.get(`/secrets/${secretId}`);
      setViewingSecret(res.data);
    } catch (error) {
      console.error("Failed to fetch secret details", error);
      const serverError = error.response?.data?.message || 'An error occurred.';
      setViewingSecret({ title: secretTitle, error: `Failed to load: ${serverError}` });
    }
  };

  const handleAddSecret = async () => {
    if (!newSecret.title || !newSecret.data) return;
    try {
      const res = await API.post("/secrets", newSecret);
      setSecrets([res.data, ...secrets]);
      setNewSecret({ title: "", data: "", type: "secret", description: "" });
      setShowAddModal(false);
      const resActivities = await API.get("/activity");
      setActivities(resActivities.data);
    } catch (err) {
      console.error("Failed to add secret:", err);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  const generatePassword = () => {
    const pwd = cryptoRandom(16);
    setGeneratedPassword(pwd);
  };

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const executeLogout = () => {
    localStorage.removeItem("vaultxToken");
    delete API.defaults.headers.common['Authorization'];
    navigate("/get-started");
  };

  const activeLinkStyle = "bg-green-500/10 text-green-300 font-semibold";
  const inactiveLinkStyle = "text-green-500 hover:bg-gray-800/50 hover:text-green-300";
  const navLinkClassName = ({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? activeLinkStyle : inactiveLinkStyle}`;

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex pt-16">
      <aside className="w-64 bg-gray-900/95 border-r border-green-500/30 p-6 flex flex-col shadow-lg fixed top-0 left-0 bottom-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)] mb-10 text-center">
            VaultX
          </h1>
          <nav className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={navLinkClassName}><Home size={18} /> Dashboard</NavLink>
            <NavLink to="/dashboard/secrets" className={navLinkClassName}><Shield size={18} /> My Secrets</NavLink>
            <NavLink to="/dashboard/activity" className={navLinkClassName}><Activity size={18} /> Activity</NavLink>
            <NavLink to="/dashboard/settings" className={navLinkClassName}><Settings size={18} /> Settings</NavLink>
          </nav>
        </div>
        <div className="mt-auto border-t border-green-500/20 pt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-green-500/50">
                    <User size={20} className="text-green-400" />
                </div>
                <div>
                    <p className="font-semibold text-green-300 truncate">{user ? user.username : '...'}</p>
                    <button onClick={handleLogout} className="text-xs text-red-400 hover:underline flex items-center gap-1"><LogOut size={12}/> Logout</button>
                </div>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-10 ml-64 space-y-6">
        <h2 className="text-4xl mb-6">Welcome, {user ? user.username : "..."} 👋</h2>
        {isLoading ? <p>Loading dashboard...</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-green-500 shadow-lg flex flex-col">
                    <h3 className="text-2xl font-semibold mb-4">🔑 Recent Secrets</h3>
                    <ul className="space-y-2 text-green-300 flex-1 overflow-y-auto max-h-64">
                    {secrets.length > 0 ? (secrets.slice(0, 3).map((s) => (<li key={s._id} className="flex justify-between items-center pr-2"><span className="truncate">{s.title}</span><button onClick={() => handleViewSecret(s._id)} className="text-xs bg-green-800/50 hover:bg-green-700/50 px-2 py-1 rounded flex-shrink-0 ml-2">View</button></li>))) : (<li>No secrets added yet.</li>)}
                    </ul>
                    <Link to="/dashboard/secrets" className="mt-4 inline-block bg-green-500 text-black px-4 py-2 rounded-lg text-center hover:bg-green-400 transition">View All</Link>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-green-500 shadow-lg flex flex-col">
                    <h3 className="text-2xl font-semibold mb-4">📊 Recent Activity</h3>
                    <ul className="space-y-2 text-green-300 flex-1 overflow-y-auto max-h-64">
                    {activities.length > 0 ? (activities.slice(0, 3).map((a) => (<li key={a._id} className="truncate">[{new Date(a.createdAt).toLocaleTimeString()}] {a.action}</li>))) : (<li>No recent activity.</li>)}
                    </ul>
                    <Link to="/dashboard/activity" className="mt-4 inline-block bg-green-500 text-black px-4 py-2 rounded-lg text-center hover:bg-green-400 transition">View All</Link>
                </div>
                <div className="bg-gray-900 p-6 rounded-lg border border-green-500 shadow-lg flex flex-col justify-center">
                    <h3 className="text-2xl font-semibold mb-4 text-center">⚡ Actions</h3>
                    <div className="flex flex-col gap-3">
                    <button onClick={generatePassword} className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition">Generate Password</button>
                    <button onClick={() => setShowAddModal(true)} className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition">Add Secret</button>
                    <Link to="/dashboard/settings" className="bg-green-500 text-black px-4 py-2 rounded-lg hover:bg-green-400 transition text-center">Security Settings</Link>
                    </div>
                </div>
            </div>
        )}
      </main>

      {showAddModal && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gray-900 p-6 rounded-lg w-96 border border-green-500"><h3 className="text-xl font-semibold mb-4">➕ Add New Secret</h3><input type="text" placeholder="Title" value={newSecret.title} onChange={(e) => setNewSecret({ ...newSecret, title: e.target.value })} className="w-full p-2 mb-3 bg-gray-800 border border-green-500 rounded text-green-300" /><textarea placeholder="Secret data..." value={newSecret.data} onChange={(e) => setNewSecret({ ...newSecret, data: e.target.value })} className="w-full p-2 mb-3 bg-gray-800 border border-green-500 rounded text-green-300" /><select value={newSecret.type} onChange={(e) => setNewSecret({ ...newSecret, type: e.target.value })} className="w-full p-2 mb-3 bg-gray-800 border border-green-500 rounded text-green-300"><option value="secret">Secret</option><option value="key">Key</option><option value="password">Password</option></select><div className="flex justify-end gap-3"><button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button><button onClick={handleAddSecret} className="px-4 py-2 bg-green-500 text-black rounded">Save</button></div></div></div>)}
      {viewingSecret && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gray-900 p-6 rounded-lg w-full max-w-lg border border-green-500"><h3 className="text-xl font-semibold mb-4 truncate">View Secret: {viewingSecret.title}</h3>{viewingSecret.error ? (<p className="text-red-500">{viewingSecret.error}</p>) : (<div className="space-y-3"><div className="bg-gray-800 p-3 rounded"><label className="text-xs text-green-400">Secret Data</label><div className="flex justify-between items-center mt-1"><pre className="text-green-200 whitespace-pre-wrap break-all flex-1">{viewingSecret.data}</pre><button onClick={() => handleCopy(viewingSecret.data)} className="bg-green-500 px-3 py-1 rounded text-black ml-4 text-sm">{copySuccess || 'Copy'}</button></div></div><p><strong className="text-green-400">Type:</strong> {viewingSecret.type}</p><p><strong className="text-green-400">Created:</strong> {new Date(viewingSecret.createdAt).toLocaleString()}</p></div>)}<div className="flex justify-end mt-4"><button onClick={() => setViewingSecret(null)} className="px-4 py-2 bg-gray-700 rounded">Close</button></div></div></div>)}
      {generatedPassword && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gray-900 p-6 rounded-lg w-96 border border-green-500"><h3 className="text-xl font-semibold mb-4">Generated Password</h3><div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg text-green-300 mb-4"><span className="truncate">{generatedPassword}</span><button onClick={() => handleCopy(generatedPassword)} className="bg-green-500 px-2 py-1 rounded text-black ml-2">{copySuccess || 'Copy'}</button></div><p className="mb-4 text-green-300">Do you want to save this as a new secret?</p><div className="flex justify-end gap-3"><button onClick={() => setGeneratedPassword("")} className="px-4 py-2 bg-gray-700 rounded">Cancel</button><button onClick={() => { setShowAddModal(true); setNewSecret({ title: "Generated Password", data: generatedPassword, type: "password", description: "Auto-generated on " + new Date().toLocaleDateString(), }); setGeneratedPassword(""); }} className="px-4 py-2 bg-green-500 text-black rounded">Save</button></div></div></div>)}
      
      {showConfirmLogout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-red-500 rounded-lg shadow-xl p-6 w-full max-w-sm text-center">
                <h3 className="text-xl font-bold text-red-400 mb-4">Confirm Logout</h3>
                <p className="text-green-300 mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-center gap-4">
                    <button onClick={() => setShowConfirmLogout(false)} className="px-6 py-2 bg-gray-700 rounded">Cancel</button>
                    <button onClick={executeLogout} className="px-6 py-2 bg-red-600 text-white rounded">Logout</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
