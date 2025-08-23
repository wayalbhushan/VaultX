import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Fingerprint, History, Terminal } from "lucide-react";

export default function LandingPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00ff00";
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, index) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, index * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }
        drops[index]++;
      });
    };

    const interval = setInterval(draw, 50);
    return () => clearInterval(interval);
  }, []);

  // UPDATED: Features section now accurately reflects the built application
  const features = [
    {
      icon: <ShieldCheck size={28} className="text-green-400" />,
      title: "AES-256 Encryption",
      text: "Every secret is protected with AES-256, ensuring your data is unreadable to anyone but you."
    },
    {
      icon: <Fingerprint size={28} className="text-green-400" />,
      title: "Two-Factor Authentication",
      text: "Secure your account with an extra layer of verification, protecting you from unauthorized access."
    },
    {
      icon: <History size={28} className="text-green-400" />,
      title: "Complete Audit Trail",
      text: "Maintain full visibility with a detailed activity log that tracks every action taken in your vault."
    }
  ];

  return (
    <div className="relative bg-gray-950 text-green-400 font-mono overflow-hidden">
      {/* Matrix background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      ></canvas>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 bg-gradient-to-br from-gray-900/80 via-black/80 to-gray-950/80 animate-fadeIn transition-all duration-700">
        <h1 className="text-6xl font-bold mb-6 drop-shadow-[0_0_10px_rgba(0,255,0,0.7)] animate-slideUp">
          VaultX
        </h1>
        <p className="text-lg max-w-2xl mb-8 text-green-300 animate-fadeIn delay-200">
          Secure. Encrypted. Unbreakable. Your secrets, locked away in next-gen
          cyber vaults.
        </p>
        <div className="flex gap-4 animate-fadeIn delay-500">
          <Link
            to="/get-started"
            className="bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.9)]"
          >
            Get Started
          </Link>
          <Link
            to="/learn-more"
            className="border border-green-400 px-6 py-3 rounded-lg hover:bg-green-400 hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.9)]"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 px-6 bg-gray-900 text-center transition-all duration-700">
        <h2 className="text-4xl font-bold mb-12 text-green-300 animate-fadeIn">
          Why Choose VaultX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((card, i) => (
            <div
              key={i}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transition-transform duration-500 border border-green-500 hover:shadow-[0_0_20px_rgba(0,255,0,0.8)] animate-fadeIn"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="mb-4 flex justify-center">{card.icon}</div>
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p>{card.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-16 bg-gradient-to-r from-gray-900 via-black to-gray-950 text-center transition-all duration-700">
        <h2 className="text-4xl font-bold mb-6 text-green-300 animate-fadeIn">
          Ready to Secure Your Secrets?
        </h2>
        <Link
          to="/get-started"
          className="bg-green-500 text-black px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.9)] animate-bounce"
        >
          Get Started Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 bg-black text-center border-t border-green-500 transition-all duration-700">
        <p className="text-sm text-green-400">
          © {new Date().getFullYear()} VaultX. All rights reserved.
        </p>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 1s ease-in-out forwards; }
        .animate-slideUp { animation: slideUp 1s ease-out forwards; }
      `}</style>
    </div>
  );
}
