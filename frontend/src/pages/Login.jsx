import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        { email, password }
      );

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      window.location.href = "/dashboard";
    } catch {
      alert("Login Failed");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">

      {/* Left */}
      <div className="hidden md:flex w-1/2 items-center justify-center flex-col p-10 text-center">

        <div className="text-8xl mb-6">🤖</div>

        <h1 className="text-4xl font-bold mb-4">
          Welcome Back
        </h1>

        <p className="text-zinc-300 max-w-md">
          Continue learning smarter with your AI assistant.
        </p>
      </div>

      {/* Right */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8">

          <h1 className="text-3xl font-bold text-center mb-2">
            Login 👋
          </h1>

          <p className="text-center text-zinc-300 mb-6">
            Access your account
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-4 rounded-xl bg-black/30 outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-4 rounded-xl bg-black/30 outline-none focus:ring-2 focus:ring-cyan-500"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={loginUser}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-black p-3 rounded-xl font-semibold"
          >
            Login
          </button>

          <p className="text-center mt-6 text-zinc-300">
            New user?{" "}
            <a href="/register" className="text-cyan-400">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}