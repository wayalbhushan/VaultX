import { Link } from "react-router-dom";
import { ShieldCheck, KeyRound, Fingerprint, History, Zap, Lock } from "lucide-react";

export default function LearnMore() {
  const securityFeatures = [
    {
      icon: <ShieldCheck size={32} className="text-green-400" />,
      title: "AES-256 Encryption",
      description: "Your data is encrypted at rest using the Advanced Encryption Standard (AES-256), the same grade of security trusted by governments and financial institutions worldwide."
    },
    {
      icon: <KeyRound size={32} className="text-green-400" />,
      title: "JWT Authentication",
      description: "Access to your vault is secured using JSON Web Tokens (JWT), ensuring that every request to your data is verified and authenticated, preventing unauthorized access."
    },
    {
      icon: <Fingerprint size={32} className="text-green-400" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account with 2FA. By requiring a second verification step, you can protect your vault even if your password is compromised."
    }
  ];

  const keyFeatures = [
    { icon: <Lock className="text-green-300" />, text: "Securely store secrets, keys, and passwords." },
    { icon: <Zap className="text-green-300" />, text: "Generate strong, random passwords instantly." },
    { icon: <History className="text-green-300" />, text: "Track all actions with a detailed activity log." },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono overflow-x-hidden">
      {/* Animated background grid */}
      <div className="animated-bg"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-[0_0_15px_rgba(0,255,0,0.8)] animate-fade-in-down">
            The <span className="text-green-500">Security</span> Behind VaultX
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-green-300 leading-relaxed animate-fade-in-down animation-delay-300">
            VaultX isn't just another secrets manager. It's a fortress for your digital life, built on a foundation of proven, enterprise-grade security principles. Your privacy is not a feature—it's the entire mission.
          </p>
        </div>

        {/* Security Model Section */}
        <div className="mb-20">
            <h2 className="text-4xl font-semibold text-center mb-10 text-green-400 animate-fade-in-up">Our Security Model</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {securityFeatures.map((feature, index) => (
                    <div key={index} className="bg-gray-900/80 border border-green-500/50 rounded-lg p-6 shadow-lg hover:shadow-green-500/30 transition-shadow duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 200 + 400}ms` }}>
                        <div className="mb-4">{feature.icon}</div>
                        <h3 className="text-2xl font-bold text-green-300 mb-2">{feature.title}</h3>
                        <p className="text-green-400/80">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Key Features & CTA */}
        <div className="text-center">
            <h2 className="text-4xl font-semibold mb-6 text-green-400 animate-fade-in-up">Key Features at a Glance</h2>
            <ul className="inline-block text-left space-y-3 text-lg text-green-300 mb-10 animate-fade-in-up animation-delay-200">
                {keyFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                        {feature.icon}
                        <span>{feature.text}</span>
                    </li>
                ))}
            </ul>
            <div className="animate-fade-in-up animation-delay-400">
                <Link to="/get-started" className="inline-block bg-green-500 text-black px-10 py-4 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.9)]">
                    Secure Your Data Now
                </Link>
            </div>
        </div>
      </div>

      <style>{`
        .animated-bg {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: linear-gradient(to right, rgba(0, 255, 0, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 0, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: move-bg 30s linear infinite;
          z-index: 0;
        }
        @keyframes move-bg {
          from { background-position: 0 0; }
          to { background-position: 100px 100px; }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; opacity: 0; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; opacity: 0; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
}
