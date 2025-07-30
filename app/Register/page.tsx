"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";

/** ----------------- tiny inline "temp auth" (localStorage) ----------------- */
type User = { name: string; email: string; password: string };
const USERS_KEY = "laurent-users";
const CURRENT_KEY = "laurent-current";

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function writeUsers(users: User[]) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
/** ------------------------------------------------------------------------- */

export default function RegisterPage() {
  const router = useRouter();

  // UI state
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
// at top of your Register component
const [name, setName] = useState("");
// const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  // Refs for GSAP animations
  const headerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Page load animations
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      .fromTo(cardRef.current,   { y: 40,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.1")
      .fromTo(".reg-input",      { y: 16,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.2")
      .fromTo(btnRef.current,    { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 }, "-=0.25");
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const name = (fd.get("name") as string)?.trim();
    const _email = (fd.get("email") as string)?.trim().toLowerCase();
    const password = (fd.get("password") as string) ?? "";

    // --- Client validations (customer only) ---
    if (!name || !_email || !password) {
      setError("Please fill all fields.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // Do NOT allow registering the admin email here
    if (_email === "admin@laurent.com") {
      setError("Admin account already exists. Please use Login instead.");
      return;
    }

    // Check duplicate email (local only while no backend)
    const users = readUsers();
    if (users.some(u => u.email.toLowerCase() === _email)) {
      setError("This email is already registered. Try logging in.");
      return;
    }

    setLoading(true);

    // Save temp user locally and "log in"
    const newUser: User = { name, email: _email, password };
    users.push(newUser);
    writeUsers(users);
    localStorage.setItem(CURRENT_KEY, JSON.stringify(newUser));

    // tiny tap feedback
    gsap.fromTo(btnRef.current, { scale: 1 }, { scale: 0.97, yoyo: true, repeat: 1, duration: 0.12 });

    setTimeout(() => {
      setLoading(false);
      router.push("/customer");
    }, 250);
  }

  return (
    <main className="relative min-h-screen bg-[#0f0f0f] text-white overflow-hidden">
      {/* Global golden frame */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="absolute top-0 left-0 w-full h-px bg-[#d4af37]" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-[#d4af37]" />
        <div className="absolute top-0 left-0 h-full w-px bg-[#d4af37]" />
        <div className="absolute top-0 right-0 h-full w-px bg-[#d4af37]" />
      </div>

      {/* Subtle pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="gold-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" stroke="#d4af37" fill="none" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gold-pattern)" />
        </svg>
      </div>

      {/* Soft radial glow */}
      <div
        className="absolute z-10 top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-2xl"
        style={{ width: 720, height: 720 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#d4af37" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="360" cy="360" r="330" fill="url(#goldGlow)" />
        </svg>
      </div>

      {/* Top bar */}
      <header ref={headerRef} className="relative z-20 flex items-center justify-between px-6 md:px-16 py-6">
        <Link href="/" className="text-[#d4af37] text-2xl font-serif">Laurent</Link>
        <Link
          href="/login"
          className="text-sm tracking-wider border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-full hover:bg-[#d4af37] hover:text-black transition"
        >
          Back to Login
        </Link>
      </header>

      {/* Register card */}
      <section className="relative z-20 flex items-center justify-center px-6 pb-16 pt-2">
        <div ref={cardRef} className="w-full max-w-md bg-[#141414]/90 border border-[#d4af37] rounded-2xl p-8 shadow-lg">
          <div className="flex justify-center mb-6">
            <svg width="140" height="12" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H140" stroke="#d4af37" strokeWidth="2" />
            </svg>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif text-center text-[#d4af37] mb-2">Register</h1>
          <p className="text-center text-sm text-gray-300 mb-6">Create your customer account</p>

          {error && <p className="mb-4 text-center text-red-400">{error}</p>}

          <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
  <input
    name="name"
    type="text"
    placeholder="Full Name"
    autoComplete="name"                 // good hint; not prefilled with email
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="reg-input w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#d4af37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
  />

  <input
    name="email"
    type="email"
    placeholder="Email Address"
    autoComplete="off"                  // or use "email" if you *want* autofill
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="reg-input w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#d4af37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
  />

  <input
    name="password"
    type="password"
    placeholder="Password (min 6 chars)"
    autoComplete="new-password"         // prevents saved password autofill
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="reg-input w-full px-4 py-3 rounded-lg bg-[#0f0f0f] border border-[#d4af37] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
  />

  {/* Create Account Button */}
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437] disabled:opacity-50 transition-all"
  >
    {loading ? "Creating..." : "Create Account"}
  </button>
</form>


          <p className="text-center text-sm text-gray-300 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#d4af37] hover:underline">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
