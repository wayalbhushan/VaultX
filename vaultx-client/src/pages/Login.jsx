import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // 👉 For now, just simulate successful login
    if (email && password) {
      // later we will add real backend auth here
      navigate("/dashboard"); // ✅ redirect to dashboard
    } else {
      alert("Please enter email and password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-green-400 font-mono">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md border border-green-500"
      >
        <h2 className="text-3xl font-bold mb-6 text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.7)]">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 bg-black text-green-400 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 bg-black text-green-400 rounded border border-green-500 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-green-400 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.6)] hover:shadow-[0_0_25px_rgba(0,255,0,0.9)]"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
