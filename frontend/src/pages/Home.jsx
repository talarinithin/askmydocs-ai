export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">

      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold">
          AskMyDocs AI
        </h1>

        <div className="flex gap-4">
          <a
            href="/login"
            className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition-all"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-black font-semibold transition-all"
          >
            Register
          </a>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-8 pt-20 grid md:grid-cols-2 gap-12 items-center">

        {/* Left */}
        <div>
          <p className="text-cyan-400 text-sm tracking-widest uppercase mb-3">
            AI Powered Learning
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Upload Notes. <br />
            Learn Faster. <br />
            Ask Smarter 🚀
          </h1>

          <p className="mt-6 text-zinc-300 text-lg">
            Chat with your PDFs, notes, and study material using AI.
            Built for students to save time and learn better.
          </p>

          <div className="mt-8 flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-black rounded-2xl font-semibold transition-all"
            >
              Get Started
            </a>

            <a
              href="/login"
              className="px-6 py-3 border border-white/20 rounded-2xl hover:bg-white/10 transition-all"
            >
              Login
            </a>
          </div>

          <p className="mt-8 text-sm text-zinc-400">
            Developed by{" "}
            <span className="text-white font-semibold">
              Talari Nithin
            </span>
          </p>
        </div>

        {/* Right */}
        <div className="relative flex justify-center">

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl">

            <div className="text-6xl mb-4">🤖</div>

            <h2 className="text-2xl font-bold mb-4">
              Why Students Love It
            </h2>

            <div className="space-y-4 text-zinc-300">
              <div className="p-4 rounded-2xl bg-white/5">
                ⚡ Instant answers from notes
              </div>

              <div className="p-4 rounded-2xl bg-white/5">
                📚 Learn from PDFs easily
              </div>

              <div className="p-4 rounded-2xl bg-white/5">
                🤖 AI powered assistant
              </div>

              <div className="p-4 rounded-2xl bg-white/5">
                🔐 Secure private account
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -left-6 text-4xl">🚀</div>
          <div className="absolute bottom-0 -right-6 text-4xl">💡</div>
        </div>
      </div>
    </div>
  );
}