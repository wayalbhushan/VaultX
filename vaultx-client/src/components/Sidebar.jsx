import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import API from "../utils/api";
import {
  Shield,
  Settings,
  Home,
  Activity,
  User,
  LogOut,
  Menu,
  X,
  Lock,
  Plus,
  Terminal,
} from "lucide-react";

export default function Sidebar({ user, onAddSecretClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (e) {
      console.error(e);
    }
    navigate("/get-started");
  };

  const navLinkClassName = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-mono text-xs tracking-wider uppercase transition-all duration-200 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)] font-bold"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <Shield size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">VaultX</h1>
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-400/90 font-bold block -mt-1">
              Cyber Console
            </span>
          </div>
        </div>

        {/* Action Button */}
        {onAddSecretClick && (
          <button
            onClick={() => {
              setIsOpen(false);
              onAddSecretClick();
            }}
            className="w-full mb-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)] transition-all active:scale-[0.98]"
          >
            <Plus size={16} className="stroke-[2.5]" />
            <span>New Secret Payload</span>
          </button>
        )}

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <NavLink to="/dashboard" end className={navLinkClassName} onClick={() => setIsOpen(false)}>
            <Home size={16} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/dashboard/secrets" className={navLinkClassName} onClick={() => setIsOpen(false)}>
            <Lock size={16} />
            <span>My Vault</span>
          </NavLink>
          <NavLink to="/dashboard/activity" className={navLinkClassName} onClick={() => setIsOpen(false)}>
            <Activity size={16} />
            <span>Audit Log</span>
          </NavLink>
          <NavLink to="/dashboard/settings" className={navLinkClassName} onClick={() => setIsOpen(false)}>
            <Settings size={16} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="pt-4 border-t border-slate-900">
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <User size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-mono font-bold text-slate-200 truncate">
                {user ? user.username : "User"}
              </p>
              <p className="text-[10px] font-mono text-slate-500 truncate">
                {user ? user.email : "user@vaultx.local"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Top Mobile Bar (< md) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/95 backdrop-blur-md border-b border-emerald-500/20 px-4 flex items-center justify-between z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Shield size={18} />
          </div>
          <span className="font-bold font-mono text-white tracking-tight">VaultX</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sliding Drawer */}
      <aside
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 bg-slate-950 border-r border-emerald-500/30 p-6 z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Permanent Sidebar (>= md) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950/95 border-r border-emerald-500/20 p-6 fixed top-0 left-0 bottom-0 z-20 backdrop-blur-xl">
        {sidebarContent}
      </aside>
    </>
  );
}
