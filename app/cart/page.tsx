"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  CreditCard,
  Wallet,
} from "lucide-react";

/* ----------------------- shared storage keys ----------------------- */
const CURRENT_KEY = "laurent-current";
const cartKey = (email) => `laurent-cart:${email || "guest"}`;

/* ----------------------------- page -------------------------------- */
export default function CartPage() {
  const router = useRouter();

  const [me, setMe] = useState(null);
  const [cart, setCart] = useState([]);
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(CURRENT_KEY);
    const u = raw ? JSON.parse(raw) : null;
    setMe(u);

    const email = (u?.email || "guest").toLowerCase();
    const saved = safeParse(localStorage.getItem(cartKey(email))) || [];
    setCart(saved);
  }, []);

  function persistCart(next) {
    const email = (me?.email || "guest").toLowerCase();
    localStorage.setItem(cartKey(email), JSON.stringify(next));
  }

  function decQty(id) {
    setCart((prev) => {
      const next = prev
        .map((c) => (c.id === id ? { ...c, qty: Math.max(1, c.qty - 1) } : c))
        .filter((c) => c.qty > 0);
      persistCart(next);
      return next;
    });
  }
  function incQty(id) {
    setCart((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, qty: c.qty + 1 } : c));
      persistCart(next);
      return next;
    });
  }
  function removeFromCart(id) {
    setCart((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persistCart(next);
      return next;
    });
  }

  const total = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  async function payStripe() {
    if (!me?.email) { router.push("/login"); return; }
    try {
      setPayLoading(true);
      setPayError("");

      // call your backend later; for now just simulate:
      // const res = await fetch("/api/checkout", { ... })
      // const data = await res.json(); window.location.href = data.url;
      setTimeout(() => {
        alert("Stripe redirect (demo). Wire /api/checkout later.");
        setPayLoading(false);
      }, 800);
    } catch (e) {
      setPayError(e?.message || "Unable to start payment.");
      setPayLoading(false);
    }
  }

  function payCOD() {
    if (!me?.email) { router.push("/login"); return; }
    // In your real flow you’d create the order on backend.
    // For now just navigate to dashboard so they see the same cart.
    router.push("/customer");
  }

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#d4af37]/30 sticky top-0 bg-[#0f0f0f] z-30">
        <h1 className="text-xl sm:text-2xl font-serif text-[#d4af37]">Your Cart</h1>
        <button onClick={() => router.push("/menu")} className="text-sm border border-[#d4af37] text-[#d4af37] px-3 py-1.5 rounded-full hover:bg-[#d4af37] hover:text-black">
          Back to Menu
        </button>
      </header>

      <section className="px-4 sm:px-6 py-6 max-w-3xl mx-auto">
        <div className="bg-[#141414] rounded border border-[#d4af37]/30">
          <div className="p-4 border-b border-[#d4af37]/20">
            <p className="text-sm text-gray-300">Items in your cart</p>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm">Your cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 border border-[#d4af37]/20 rounded px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => decQty(item.id)} className="w-7 h-7 rounded bg-[#1f1f1f] text-white">-</button>
                    <span className="w-6 text-center">{item.qty}</span>
                    <button onClick={() => incQty(item.id)} className="w-7 h-7 rounded bg-[#1f1f1f] text-white">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 text-xs">Remove</button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-[#d4af37]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm">Total</span>
              <span className="text-[#d4af37] font-semibold">${total}</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-2">
              <button
                onClick={payStripe}
                disabled={cart.length === 0 || payLoading}
                className="w-full py-2 rounded bg-white text-black font-semibold hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                {payLoading ? "Connecting..." : "Pay with Stripe"}
              </button>

              <button
                onClick={payCOD}
                disabled={cart.length === 0}
                className="w-full py-2 rounded bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Wallet size={18} />
                Cash on Delivery
              </button>
            </div>

            {payError && <p className="text-red-400 text-sm mt-2">{payError}</p>}

            {!me?.email && (
              <p className="text-xs text-gray-400 mt-2">
                You’ll need to log in to complete checkout.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------- helpers ------------------------------- */
function safeParse(raw) {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
