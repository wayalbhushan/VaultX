import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, Shield, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClassName = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? "text-emerald-400 font-semibold" : "text-slate-400 hover:text-slate-200"
    }`;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Learn More", path: "/learn-more" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Shield size={20} className="stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white">VaultX</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={navLinkClassName}>
              {link.name}
            </NavLink>
          ))}
          <Link
            to="/get-started"
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-[0.98]"
          >
            <span>Get Started</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 backdrop-blur-xl p-6 border-b border-slate-800 space-y-4">
          <div className="flex flex-col space-y-4">
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
              className="bg-emerald-500 text-slate-950 text-center px-4 py-2.5 rounded-xl font-semibold text-xs transition shadow-md shadow-emerald-500/20"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
