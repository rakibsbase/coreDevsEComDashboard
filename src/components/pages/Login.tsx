import { FormEvent, useState } from "react";
import { Lock, LogIn, Mail, Moon, Sun } from "lucide-react";
import { useApp } from "@/context/AppContext";

const DEMO_EMAIL = "admin@coredevs.com";
const DEMO_PASSWORD = "coredevs2026";

export default function Login() {
  const { darkMode, setDarkMode, login } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!login(email, password)) {
      setError(
        "Invalid email or password. Please use the demo credentials shown below.",
      );
    }
  };

  const useDemoCredentials = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  };

  return (
    <main className="min-h-screen bg-bg-app text-text-primary flex items-center justify-center px-4 py-8 transition-colors relative overflow-hidden">
      {/* Subtle background orbs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-[0.06]"
          style={{ background: "var(--primary)", filter: "blur(80px)" }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full opacity-[0.05]"
          style={{ background: "var(--primary)", filter: "blur(72px)" }}
        />
      </div>

      {/* Dark mode toggle */}
      <button
        type="button"
        onClick={() => setDarkMode(!darkMode)}
        className="fixed right-5 top-5 p-2.5 rounded-xl border border-border-divider bg-bg-card text-text-secondary hover:text-text-primary hover:border-primary/40 hover:bg-primary-light transition-all cursor-pointer shadow-sm"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? (
          <Sun size={16} className="text-amber-400" />
        ) : (
          <Moon size={16} />
        )}
      </button>

      <section className="w-full max-w-[420px] relative">
        {/* Logo */}
        {/* <div className="flex justify-center mb-7">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-primary/20 shadow-lg shadow-primary/10">
              <img
                src={logo}
                alt="Core Devs Logo"
                className="w-full h-full object-cover"
              />
            </div>
   
            <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-bg-card" />
          </div>
        </div> */}

        {/* Main card */}
        <div className="bg-bg-card border border-border-divider rounded-2xl shadow-xl shadow-black/5 overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-7 pb-6">
            <h1 className="font-display text-[22px] font-black text-text-primary tracking-tight leading-tight">
              Welcome back
            </h1>
            <p className="mt-1.5 text-xs font-medium text-text-secondary">
              Sign in to your dashboard account
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-border-divider mx-0" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-[11px] font-bold text-text-secondary uppercase tracking-widest"
              >
                Email address
              </label>
              <div className="relative group">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors"
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={DEMO_EMAIL}
                  className="w-full h-[42px] rounded-xl border border-border-divider bg-bg-app/60 pl-9 pr-4 text-[13px] font-medium text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-text-secondary/50 hover:border-primary/30"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-password"
                className="text-[11px] font-bold text-text-secondary uppercase tracking-widest"
              >
                Password
              </label>
              <div className="relative group">
                <Lock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors"
                />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-[42px] rounded-xl border border-border-divider bg-bg-app/60 pl-9 pr-4 text-[13px] font-medium text-text-primary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder:text-text-secondary/40 hover:border-primary/30"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 dark:border-red-900/40 dark:bg-red-950/30">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <p className="text-[11.5px] font-semibold text-red-600 dark:text-red-400 leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full h-[42px] rounded-xl text-white text-[13px] font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "var(--primary)",
                boxShadow: "0 4px 14px rgba(139,92,246,0.25)",
              }}
            >
              <LogIn size={15} />
              Sign in to Dashboard
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mx-7 mb-7">
            <div
              className="rounded-xl border border-border-divider overflow-hidden"
              style={{ background: "var(--bg-app)" }}
            >
              <div
                className="flex items-center justify-between px-4 py-2.5 border-b border-border-divider"
                style={{ background: "var(--primary-light)" }}
              >
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest text-text-secondary">
                    Demo credentials
                  </span>
                </div>
                <button
                  type="button"
                  onClick={useDemoCredentials}
                  className="text-[11px] font-extrabold cursor-pointer px-2.5 py-1 rounded-lg transition-all hover:bg-bg-card"
                  style={{ color: "var(--primary)" }}
                >
                  Autofill →
                </button>
              </div>

              <div className="px-4 py-3 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-secondary min-w-[56px]">
                    Email
                  </span>
                  <input
                    readOnly
                    value={DEMO_EMAIL}
                    className="flex-1 rounded-lg border border-border-divider bg-bg-card px-3 py-1.5 text-[12px] font-bold text-text-primary outline-none select-all text-right cursor-text"
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-text-secondary min-w-[56px]">
                    Password
                  </span>
                  <input
                    readOnly
                    value={DEMO_PASSWORD}
                    className="flex-1 rounded-lg border border-border-divider bg-bg-card px-3 py-1.5 text-[12px] font-bold text-text-primary outline-none select-all text-right cursor-text"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-[11px] font-medium text-text-secondary/60">
          Core Devs Dashboard &mdash; Demo Environment
        </p>
      </section>
    </main>
  );
}

