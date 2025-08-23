import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../utils/api";
import { LoaderCircle } from "lucide-react";

export default function GetStarted() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form States
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  // --- 2FA State ---
  const [show2fa, setShow2fa] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Message State
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    if (signupPassword !== signupConfirm) {
      setMessageType("error");
      setMessage("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    try {
      const res = await API.post("/auth/signup", { username: signupName, email: signupEmail, password: signupPassword });
      setMessageType("success");
      setMessage(res.data.message || "Signup successful! Please log in.");
      setIsLogin(true);
      setSignupName(""); setSignupEmail(""); setSignupPassword(""); setSignupConfirm("");
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Signup failed!";
      setMessageType("error");
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { email: loginEmail, password: loginPassword });
      
      if (res.status === 206 && res.data.twoFactorRequired) {
        setUserId(res.data.userId);
        setShow2fa(true);
      } else {
        const { token, user } = res.data;
        localStorage.setItem("vaultxToken", token);
        setAuthToken(token);
        setMessageType("success");
        setMessage(`Welcome back, ${user.username}!`);
        setTimeout(() => navigate("/dashboard"), 1000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Login failed!";
      setMessageType("error");
      setMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2faValidation = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
        const res = await API.post("/auth/validate-2fa", { userId, token: twoFactorToken });
        const { token, user } = res.data;
        localStorage.setItem("vaultxToken", token);
        setAuthToken(token);
        setMessageType("success");
        setMessage(`Welcome back, ${user.username}!`);
        setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
        const errorMsg = err.response?.data?.error || "2FA validation failed!";
        setMessageType("error");
        setMessage(errorMsg);
    } finally {
        setIsLoading(false);
    }
  };

  const resetForms = () => {
    setIsLogin(true);
    setShow2fa(false);
    setMessage("");
    setUserId(null);
    setTwoFactorToken("");
  }

  // Determine a key for the form container to re-trigger animations on change
  const formKey = show2fa ? '2fa' : isLogin ? 'login' : 'signup';

  return (
    <div className="relative bg-gray-950 text-green-400 font-mono overflow-hidden min-h-screen">
      {/* Animated background grid */}
      <div className="animated-bg"></div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-5xl font-bold mb-6 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)] animate-fade-in-down">
          {show2fa ? "Two-Factor Authentication" : "Get Started with VaultX"}
        </h1>
        <p className="text-lg max-w-3xl mb-8 text-green-300 animate-fade-in-down animation-delay-300">
          {show2fa ? "Enter the 6-digit code from your authenticator app." : "Ready to safeguard your secrets? Create an account or log in."}
        </p>

        {!show2fa && (
            <div className="flex gap-4 mb-4 animate-fade-in-up animation-delay-500">
                <button onClick={() => { setIsLogin(false); setMessage(""); }} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${!isLogin ? "bg-green-500 text-black" : "border border-green-400 hover:bg-green-400 hover:text-black"}`}>Sign Up</button>
                <button onClick={() => { setIsLogin(true); setMessage(""); }} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isLogin ? "bg-green-500 text-black" : "border border-green-400 hover:bg-green-400 hover:text-black"}`}>Log In</button>
            </div>
        )}

        {message && (<div className={`mb-4 px-4 py-2 rounded animate-fade-in ${messageType === "error" ? "bg-red-700 text-white" : "bg-green-600 text-black"}`}>{message}</div>)}

        <div key={formKey} className="relative w-full max-w-md bg-gray-900/70 p-6 rounded-lg border border-green-500 shadow-lg shadow-green-500/20 animate-fade-in-up">
            {show2fa ? (
                <form onSubmit={handle2faValidation} className="space-y-4">
                    <input type="text" value={twoFactorToken} onChange={e => setTwoFactorToken(e.target.value)} maxLength={6} placeholder="123456" className="w-full text-center tracking-[0.5em] text-2xl p-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" required />
                    <button type="submit" disabled={isLoading || twoFactorToken.length !== 6} className="w-full bg-green-500 text-black font-semibold py-2 rounded hover:bg-green-400 transition flex items-center justify-center disabled:bg-gray-600">{isLoading ? <LoaderCircle className="animate-spin"/> : "Verify"}</button>
                    <button type="button" onClick={resetForms} className="text-sm text-green-400 hover:underline">Back to Login</button>
                </form>
            ) : isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-black font-semibold py-2 rounded hover:bg-green-400 transition flex items-center justify-center disabled:bg-gray-600">{isLoading ? <LoaderCircle className="animate-spin"/> : "Log In"}</button>
                </form>
            ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                    <input type="text" placeholder="Username" value={signupName} onChange={e => setSignupName(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <input type="email" placeholder="Email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <input type="password" placeholder="Password" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <input type="password" placeholder="Confirm Password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} required className="w-full px-4 py-2 bg-black border border-green-500 rounded focus:outline-none focus:border-green-300" />
                    <button type="submit" disabled={isLoading} className="w-full bg-green-500 text-black font-semibold py-2 rounded hover:bg-green-400 transition flex items-center justify-center disabled:bg-gray-600">{isLoading ? <LoaderCircle className="animate-spin"/> : "Sign Up"}</button>
                </form>
            )}
        </div>
      </section>
      
      {/* Add styles for new animations */}
      <style>{`
        .animated-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(to right, rgba(0, 255, 0, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 0, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: move-bg 30s linear infinite;
          z-index: 0;
        }
        @keyframes move-bg {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out forwards; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
