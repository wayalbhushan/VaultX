import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Shield, Terminal, ArrowRight, Lock } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClassName = ({ isActive }) =>
    `text-xs font-mono tracking-wider uppercase transition-all duration-200 px-3 py-1.5 rounded-md ${
      isActive
        ? "text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
    }`;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Security Architecture", path: "/learn-more" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/85 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-slate-900 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)] group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all">
            <Shield size={20} className="stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xl font-bold font-mono tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              VaultX
            </span>
            <span className="text-[10px] font-mono tracking-widest text-emerald-400/80 block -mt-1 uppercase">
              Cyber Secrets
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={navLinkClassName}>
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/get-started"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.7)] flex items-center gap-2 transition-all active:scale-[0.98]"
          >
            <Lock size={13} />
            <span>Launch Vault</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-emerald-400 rounded-lg bg-slate-900 border border-slate-800"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl p-6 border-b border-emerald-500/30 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={navLinkClassName}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/get-started"
              className="bg-emerald-500 text-slate-950 text-center px-4 py-2.5 rounded-lg font-mono font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Launch Vault
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
