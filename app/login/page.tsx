"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

/** ---------- INLINE FAKE AUTH (no imports) ---------- */
type Role = "admin" | "customer";
type User = { name: string; email: string; password: string; role: Role };

const USERS_KEY = "laurent-users";
const CURRENT_KEY = "laurent-current";
const ADMIN_EMAIL = "admin@laurent.com";
const ADMIN_PASS = "admin123";

function readUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function seedAdminIfMissing() {
  const users = readUsers();
  if (!users.some((u) => u.email.toLowerCase() === ADMIN_EMAIL)) {
    users.push({ name: "Admin", email: ADMIN_EMAIL, password: ADMIN_PASS, role: "admin" });
    writeUsers(users);
  }
}
function loginUser(email: string, password: string) {
  seedAdminIfMissing();
  const users = readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return { ok: false as const, error: "No account found for this email." };
  if (user.password !== password) return { ok: false as const, error: "Incorrect password." };
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user));
  return { ok: true as const, user };
}
/** ---------------------------------------------------- */

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Ensure admin exists (runs only on client because of "use client")
  useEffect(() => {
    seedAdminIfMissing();
  }, []);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string)?.trim();
    const password = (fd.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const res = loginUser(email, password);
    setLoading(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (res.user.role === "admin") router.push("/Admin");
    else router.push("/customer");
  }

  return (
    <main className="relative min-h-screen flex flex-col text-white overflow-hidden bg-black">
     
      
{/* Make sure the parent (e.g., <main>) has className="relative" */}
<div className="absolute inset-0 z-0 pointer-events-none select-none">
  <svg
    className="block w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern
        id="gold-pattern"
        x="0"
        y="0"
        width="40"
        height="40"
        patternUnits="userSpaceOnUse"
      >
        {/* Put opacity into the stroke color itself */}
        <path
          d="M20 0 L40 20 L20 40 L0 20 Z"
          fill="none"
          stroke="rgba(212,175,55,0.18)"  /* ~18% */
          strokeWidth="1"
          shapeRendering="crispEdges"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#gold-pattern)" />
  </svg>
</div>





      {/* Soft vignette to focus the card */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_40%_at_50%_50%,rgba(212,175,55,0.08),transparent_70%)]" />

      {/* Thin golden frame */}
      <div className="pointer-events-none absolute inset-4 rounded-xl border border-[#d4af37]/30" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 md:px-16 py-5">
        <Link href="/" className="text-[#d4af37] text-2xl font-serif">Laurent</Link>
        <Link
          href="/"
          className="text-sm border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-full hover:bg-[#d4af37] hover:text-black transition"
        >
          Back to Home
        </Link>
      </header>

      {/* Centered card */}
      <section className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md bg-[#141414]/95 border border-[#d4af37]/50 rounded-2xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur">
          {/* Heading with thin divider to match Register */}
          <div className="flex flex-col items-center">
            <span className="h-px w-24 bg-[#d4af37]/60 mb-3" />
            <h1 className="text-3xl md:text-4xl font-serif text-center text-[#d4af37]">Login</h1>
            <p className="mt-2 text-sm text-gray-300">Access your account</p>
          </div>

          {error && <p className="mt-4 mb-2 text-center text-red-400">{error}</p>}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <input
  name="email"
  type="email"
  placeholder="Email address"
  autoComplete="off" // turn off autofill completely
  defaultValue=""     // start empty by default
  className="w-full px-4 py-3 rounded-lg bg-black text-white border border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
/>

<input
  name="password"
  type="password"
  placeholder="Password"
  autoComplete="new-password" // prevent autofill
  defaultValue=""
  className="w-full px-4 py-3 rounded-lg bg-black text-white border border-[#d4af37]/50 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/50"
/>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437] disabled:opacity-50 transition-all"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-300 mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/Register" className="text-[#d4af37] hover:underline">
              Register
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
