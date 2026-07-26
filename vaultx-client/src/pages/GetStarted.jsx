import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import { LoaderCircle, Shield, Lock, Mail, User, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

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

  // 2FA State
  const [show2fa, setShow2fa] = useState(false);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [tempToken, setTempToken] = useState(null);
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
      const res = await API.post("/auth/signup", {
        username: signupName,
        email: signupEmail,
        password: signupPassword,
      });
      setMessageType("success");
      setMessage(res.data.message || "Signup successful! Please log in.");
      setIsLogin(true);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setSignupConfirm("");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed. Please check your details.";
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
      const res = await API.post("/auth/login", {
        email: loginEmail,
        password: loginPassword,
      });

      if (res.status === 206 && res.data.twoFactorRequired) {
        setTempToken(res.data.tempToken);
        setShow2fa(true);
      } else {
        const { user } = res.data;
        setMessageType("success");
        setMessage(`Welcome back, ${user.username}!`);
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.response?.data?.error || "Invalid credentials.";
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
      const res = await API.post("/auth/validate-2fa", {
        tempToken,
        token: twoFactorToken,
      });
      const { user } = res.data;
      setMessageType("success");
      setMessage(`2FA verified! Welcome back, ${user.username}!`);
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || err.response?.data?.message || "2FA validation failed.";
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
    setTempToken(null);
    setTwoFactorToken("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Logo */}
      <div className="mb-8 text-center relative z-10">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            <Shield size={26} className="stroke-[2.5]" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight font-display text-white">
            VaultX
          </span>
        </Link>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          {show2fa
            ? "Enter your 6-digit authenticator security code"
            : isLogin
            ? "Access your encrypted secrets vault"
            : "Create an account to start safeguarding your credentials"}
        </p>
      </div>

      {/* Auth Card Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Toggle Switch (Hidden during 2FA) */}
        {!show2fa && (
          <div className="grid grid-cols-2 bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800/80">
            <button
              onClick={() => {
                setIsLogin(true);
                setMessage("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                isLogin
                  ? "bg-slate-800 text-emerald-400 shadow border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setMessage("");
              }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                !isLogin
                  ? "bg-slate-800 text-emerald-400 shadow border border-slate-700/50"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Status Message Alert */}
        {message && (
          <div
            role="alert"
            className={`mb-6 p-3.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
              messageType === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {messageType === "error" ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{message}</span>
          </div>
        )}

        {/* 2FA Form */}
        {show2fa ? (
          <form onSubmit={handle2faValidation} className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                <KeyRound size={22} />
              </div>
              <p className="text-xs text-slate-400">Two-Factor Authentication Enforced</p>
            </div>
            <div>
              <input
                type="text"
                value={twoFactorToken}
                onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ""))}
                maxLength={6}
                placeholder="123456"
                className="w-full text-center tracking-[0.6em] text-2xl font-mono py-3 px-4 bg-slate-950 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all placeholder:tracking-normal placeholder:text-slate-600"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || twoFactorToken.length !== 6}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <LoaderCircle className="animate-spin" size={18} /> : "Verify Code"}
            </button>
            <button
              type="button"
              onClick={resetForms}
              className="w-full text-xs text-slate-400 hover:text-slate-200 transition-colors pt-2"
            >
              ← Return to login
            </button>
          </form>
        ) : isLogin ? (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          /* Signup Form */
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="johndoe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Master Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Min 8 chars, 1 upper, 1 special"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold py-2.5 px-4 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer copyright */}
      <p className="mt-8 text-xs text-slate-500 relative z-10">
        VaultX © {new Date().getFullYear()} — AES-256-GCM Encrypted & Cookie Auth Protected
      </p>
    </div>
  );
}
