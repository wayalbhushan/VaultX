import { useEffect, useState } from "react";
import API from "../utils/api";
import { NavLink, useNavigate } from "react-router-dom";
import { Shield, Settings, Home, Activity, User, LogOut, Eye, EyeOff, LoaderCircle, X } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const navigate = useNavigate();

  // State for Change Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // --- State for 2FA ---
  const [show2faModal, setShow2faModal] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [passwordForDisable, setPasswordForDisable] = useState("");


  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoadingUser(true);
    try {
      const res = await API.get("/user/me");
      setUser(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      if (err.response?.status === 401) {
        executeLogout();
      }
    } finally {
      setIsLoadingUser(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsUpdating(true);
    if (newPassword !== confirmPassword) {
      setMessageType("error");
      setMessage("New passwords do not match.");
      setIsUpdating(false);
      return;
    }
    try {
      const res = await API.put("/user/change-password", { currentPassword, newPassword });
      setMessageType("success");
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "An error occurred.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 2FA Handlers ---
  const handleEnable2fa = async () => {
    setIsGenerating(true);
    setShow2faModal(true);
    setMessage("");
    try {
      const res = await API.post("/2fa/generate");
      setQrCodeUrl(res.data.qrCodeUrl);
    } catch (err) {
      setMessageType("error");
      setMessage("Could not generate QR code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVerify2fa = async () => {
    setIsVerifying(true);
    setMessage("");
    try {
      const res = await API.post("/2fa/verify", { token: twoFactorToken });
      setMessageType("success");
      setMessage(res.data.message);
      setShow2faModal(false);
      setTwoFactorToken("");
      fetchUser(); 
    } catch (err) {
      setMessageType("error");
      setMessage(err.response?.data?.message || "Verification failed.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisable2fa = async () => {
    setIsVerifying(true); // Reuse verifying state for loading
    setMessage("");
    try {
        const res = await API.post("/2fa/disable", { password: passwordForDisable });
        setMessageType("success");
        setMessage(res.data.message);
        setShowDisableModal(false);
        setPasswordForDisable("");
        fetchUser(); // Refresh user data
    } catch (err) {
        setMessageType("error");
        setMessage(err.response?.data?.message || "Could not disable 2FA.");
    } finally {
        setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    // This now just shows the confirmation modal
    // setShowConfirmLogout(true); // Assuming you have this state for a logout modal
    executeLogout(); // Or logout directly if no confirmation is needed on settings page
  };

  const executeLogout = () => {
    localStorage.removeItem("vaultxToken");
    delete API.defaults.headers.common['Authorization'];
    navigate("/get-started");
  }

  const activeLinkStyle = "bg-green-500/10 text-green-300 font-semibold";
  const inactiveLinkStyle = "text-green-500 hover:bg-gray-800/50 hover:text-green-300";
  const navLinkClassName = ({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? activeLinkStyle : inactiveLinkStyle}`;

  const PasswordInput = ({ value, onChange, placeholder, show, onToggle }) => (
    <div className="relative"><input type={show ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} required className="w-full px-4 py-2 pr-10 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" /><button type="button" onClick={onToggle} className="absolute inset-y-0 right-0 px-3 flex items-center text-green-500">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono flex pt-16">
      <aside className="w-64 bg-gray-900/95 border-r border-green-500/30 p-6 flex flex-col shadow-lg fixed top-0 left-0 bottom-0 z-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)] mb-10 text-center">VaultX</h1>
          <nav className="flex flex-col gap-2">
            <NavLink to="/dashboard" className={navLinkClassName}><Home size={18} /> Dashboard</NavLink>
            <NavLink to="/dashboard/secrets" className={navLinkClassName}><Shield size={18} /> My Secrets</NavLink>
            <NavLink to="/dashboard/activity" className={navLinkClassName}><Activity size={18} /> Activity</NavLink>
            <NavLink to="/dashboard/settings" className={navLinkClassName}><Settings size={18} /> Settings</NavLink>
          </nav>
        </div>
        <div className="mt-auto border-t border-green-500/20 pt-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-green-500/50"><User size={20} className="text-green-400" /></div>
                <div><p className="font-semibold text-green-300 truncate">{user ? user.username : '...'}</p><button onClick={handleLogout} className="text-xs text-red-400 hover:underline flex items-center gap-1"><LogOut size={12}/> Logout</button></div>
            </div>
        </div>
      </aside>

      <main className="flex-1 p-10 ml-64">
        <h1 className="text-4xl font-bold text-green-300 mb-8">Settings</h1>
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="bg-gray-900/80 border border-green-500 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b border-green-500/30 pb-3">Account Information</h2>
                {isLoadingUser ? <p>Loading...</p> : user ? (
                    <div className="space-y-3">
                        <div><label className="text-sm text-green-500">Username</label><p className="text-lg text-green-300">{user.username}</p></div>
                        <div><label className="text-sm text-green-500">Email</label><p className="text-lg text-green-300">{user.email}</p></div>
                    </div>
                ) : <p>Could not load user information.</p>}
            </div>

            <div className="bg-gray-900/80 border border-green-500 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b border-green-500/30 pb-3">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <PasswordInput value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current Password" show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                    <PasswordInput value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New Password" show={showNew} onToggle={() => setShowNew(!showNew)} />
                    <PasswordInput value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" show={showNew} onToggle={() => setShowNew(!showNew)} />
                    {message && (<div className={`text-center p-2 rounded ${messageType === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{message}</div>)}
                    <button type="submit" disabled={isUpdating} className="w-full bg-green-500 text-black font-semibold py-2 rounded hover:bg-green-400 transition shadow-[0_0_10px_rgba(0,255,0,0.6)] flex items-center justify-center disabled:bg-gray-600">{isUpdating ? <><LoaderCircle size={20} className="animate-spin mr-2" /> Updating...</> : "Update Password"}</button>
                </form>
            </div>

            <div className="bg-gray-900/80 border border-green-500 rounded-lg p-6 shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 border-b border-green-500/30 pb-3">Security</h2>
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg text-green-300">Two-Factor Authentication (2FA)</h3>
                        <p className="text-sm text-green-500/80">Status: <span className={user?.isTwoFactorEnabled ? "text-green-300 font-bold" : "text-red-400 font-bold"}>{user?.isTwoFactorEnabled ? "Enabled" : "Disabled"}</span></p>
                    </div>
                    {user?.isTwoFactorEnabled ? (
                        <button onClick={() => { setShowDisableModal(true); setMessage(""); }} className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg">Disable 2FA</button>
                    ) : (
                        <button onClick={handleEnable2fa} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg">Enable 2FA</button>
                    )}
                </div>
            </div>
        </div>
      </main>

      {/* 2FA Setup Modal */}
      {show2faModal && (<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"><div className="bg-gray-900 border border-green-500 rounded-lg shadow-xl p-6 w-full max-w-md text-center"><button onClick={() => setShow2faModal(false)} className="absolute top-4 right-4 text-green-400 hover:text-green-200"><X size={20} /></button><h2 className="text-2xl font-bold text-green-300 mb-4">Set Up 2FA</h2>{isGenerating ? (<LoaderCircle size={32} className="animate-spin mx-auto my-8 text-green-400" />) : qrCodeUrl ? (<><p className="text-green-300 mb-4">1. Scan QR code with your authenticator app.</p><div className="bg-white p-4 rounded-lg inline-block mb-4"><img src={qrCodeUrl} alt="2FA QR Code" /></div><p className="text-green-300 mb-4">2. Enter the 6-digit code from your app.</p><input type="text" value={twoFactorToken} onChange={e => setTwoFactorToken(e.target.value)} maxLength={6} placeholder="123456" className="w-48 mx-auto text-center tracking-[0.5em] text-2xl p-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" /><button onClick={handleVerify2fa} disabled={isVerifying || twoFactorToken.length !== 6} className="w-full mt-4 bg-green-500 text-black font-semibold py-2 rounded hover:bg-green-400 transition flex items-center justify-center disabled:bg-gray-600">{isVerifying ? <><LoaderCircle size={20} className="animate-spin mr-2" /> Verifying...</> : "Verify & Enable"}</button></>) : (<p className="text-red-400">{message}</p>)}</div></div>)}
    
      {/* Disable 2FA Confirmation Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-red-500 rounded-lg shadow-xl p-6 w-full max-w-md text-center">
                <button onClick={() => {setShowDisableModal(false); setMessage("");}} className="absolute top-4 right-4 text-green-400 hover:text-green-200"><X size={20} /></button>
                <h2 className="text-2xl font-bold text-red-400 mb-4">Disable Two-Factor Authentication</h2>
                <p className="text-green-300 mb-4">For your security, please enter your current password to confirm.</p>
                <PasswordInput value={passwordForDisable} onChange={e => setPasswordForDisable(e.target.value)} placeholder="Current Password" show={showCurrent} onToggle={() => setShowCurrent(!showCurrent)} />
                {message && (<div className={`text-center p-2 mt-4 rounded ${messageType === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>{message}</div>)}
                <button onClick={handleDisable2fa} disabled={isVerifying || !passwordForDisable} className="w-full mt-4 bg-red-600 text-white font-semibold py-2 rounded hover:bg-red-500 transition flex items-center justify-center disabled:bg-gray-600">
                    {isVerifying ? <><LoaderCircle size={20} className="animate-spin mr-2" /> Disabling...</> : "Confirm & Disable"}
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
