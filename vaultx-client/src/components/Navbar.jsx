import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for the mobile menu

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define styles for NavLink active state for cleaner code
  const navLinkClassName = ({ isActive }) =>
    `relative text-green-300 hover:text-green-200 transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:h-[2px] after:w-full after:bg-green-400 after:scale-x-0 after:origin-left after:transition-transform after:duration-300 ${
      isActive ? "after:scale-x-100 text-green-200" : "hover:after:scale-x-100"
    }`;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Learn More", path: "/learn-more" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-green-500/30 shadow-lg shadow-green-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-green-400 font-bold text-2xl drop-shadow-[0_0_5px_rgba(0,255,0,0.7)] hover:text-green-300 transition-all">
          VaultX
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
            className="bg-green-500 text-black px-5 py-2 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,0,0.5)] hover:shadow-[0_0_20px_rgba(0,255,0,0.8)]"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-green-400">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-lg p-6 border-t border-green-500/30">
          <div className="flex flex-col items-center space-y-6">
            {navLinks.map((link) => (
              <NavLink key={link.name} to={link.path} className={navLinkClassName} onClick={() => setIsMobileMenuOpen(false)}>
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/get-started"
              className="bg-green-500 text-black w-full text-center px-5 py-3 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,255,0,0.5)]"
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
