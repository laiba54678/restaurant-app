"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Menu as MenuIcon,
  ShoppingCart,
  X,
  Filter,
} from "lucide-react";

/* ----------------------- shared storage keys ----------------------- */
const CURRENT_KEY = "laurent-current";
const cartKey = (email) => `laurent-cart:${email || "guest"}`;

/* ----------------------------- page -------------------------------- */
export default function MenuPage() {
  const router = useRouter();

  // auth (optional)
  const [me, setMe] = useState(null);

  // UI state
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [cart, setCart] = useState([]);

  // refs for GSAP
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const cartPanelRef = useRef(null);

  /* ------------------------------ boot ------------------------------ */
  useEffect(() => {
    const raw = localStorage.getItem(CURRENT_KEY);
    setMe(raw ? JSON.parse(raw) : null);

    // You can replace this with admin-managed menu from localStorage if you want:
    // const adminMenu = safeParse(localStorage.getItem("laurent-menu"));
    // setMenu(adminMenu?.length ? adminMenu : FALLBACK_MENU);
    setMenu(FALLBACK_MENU);

    // load cart
    const email = (JSON.parse(raw || "{}")?.email || "guest").toLowerCase();
    const saved = safeParse(localStorage.getItem(cartKey(email))) || [];
    setCart(saved);
  }, []);

  /* ------------------------- entrance anims ------------------------- */
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (headerRef.current) {
      tl.fromTo(headerRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 });
    }
    if (gridRef.current) {
      tl.fromTo(
        gridRef.current.querySelectorAll(".menu-card"),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 },
        "-=0.15"
      );
    }
  }, [menu, category]);

  /* ------------------------ body scroll lock ------------------------ */
  useEffect(() => {
    document.body.style.overflow = showCart ? "hidden" : "auto";
  }, [showCart]);

  /* ----------------------------- actions ---------------------------- */
  function addToCart(item) {
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      const next = found
        ? prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c))
        : [...prev, { ...item, qty: 1 }];
      persistCart(next);
      return next;
    });
    setShowCart(true);
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

  function totalCart() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function persistCart(next) {
    const email = (me?.email || "guest").toLowerCase();
    localStorage.setItem(cartKey(email), JSON.stringify(next));
  }

  function checkout() {
    // If logged in → go to dashboard cart or /cart page
    // If not, ask to login
    if (me?.email) {
      router.push("/cart"); // or /customer, your choice
    } else {
      router.push("/login");
    }
  }

  const filteredMenu = useMemo(() => {
    if (category === "All") return menu;
    return menu.filter((m) => m.category === category);
  }, [menu, category]);

  const qtyBadge = cart.reduce((n, i) => n + i.qty, 0);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top bar */}
      <header
        ref={headerRef}
        className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#d4af37]/30 sticky top-0 bg-[#0f0f0f] z-30"
      >
        <h1 className="text-xl sm:text-2xl font-serif text-[#d4af37]">Laurent — Menu</h1>

        <div className="flex items-center gap-2">
          <button
            className="relative p-2 rounded hover:bg-[#1f1f1f]"
            onClick={() => setShowCart(true)}
            aria-label="Open cart"
          >
            <ShoppingCart />
            {qtyBadge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-red-600 rounded-full px-1.5 py-0.5">
                {qtyBadge}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 sm:px-6 py-4 flex items-center gap-2 overflow-auto">
        {["All", "Starters", "Main Course", "Desserts", "Drinks"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-sm px-3 py-1.5 rounded border ${
              category === c
                ? "bg-[#d4af37] text-black border-[#d4af37]"
                : "border-[#d4af37]/40 hover:bg-[#1f1f1f]"
            }`}
          >
            {c}
          </button>
        ))}
        <div className="ml-auto hidden sm:flex items-center gap-2 text-gray-300">
          <Filter size={16} />
          <span className="text-sm">Filter</span>
        </div>
      </div>

      {/* Menu grid */}
      <section className="px-4 sm:px-6 pb-24">
        <div
          ref={gridRef}
          className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filteredMenu.map((item) => (
            <article
              key={item.id}
              className="menu-card bg-[#141414] border border-[#d4af37]/30 rounded-lg overflow-hidden flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-28 sm:h-32 md:h-36 object-cover"
              />
              <div className="p-3 sm:p-4 flex flex-col gap-2">
                <h3 className="font-medium leading-tight">{item.name}</h3>
                <p className="text-sm text-gray-400">${item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-1 w-full bg-[#d4af37] text-black rounded py-1.5 hover:bg-[#c9a437]"
                >
                  Add to Cart
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Cart slide-over */}
      <div
        ref={cartPanelRef}
        className={`fixed md:absolute md:top-0 md:right-0 md:h-full md:w-80 bottom-0 left-0 w-full md:w-80
        bg-[#141414] border-t md:border-t-0 md:border-l border-[#d4af37]/30 shadow-2xl z-40
        transform transition-transform duration-300 ease-in-out
        ${showCart ? "translate-x-0 md:translate-x-0" : "translate-y-full md:translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#d4af37]/20">
          <h2 className="text-lg font-semibold text-[#d4af37]">My Cart</h2>
          <button className="p-2 rounded hover:bg-[#1f1f1f]" onClick={() => setShowCart(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 max-h-[65vh] md:max-h-[calc(100vh-120px)] overflow-auto">
          {cart.length === 0 ? (
            <p className="text-gray-400 text-sm">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border border-[#d4af37]/20 rounded px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">${item.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decQty(item.id)}
                    className="w-7 h-7 rounded bg-[#1f1f1f] text-white"
                  >
                    -
                  </button>
                  <span className="w-6 text-center">{item.qty}</span>
                  <button
                    onClick={() => incQty(item.id)}
                    className="w-7 h-7 rounded bg-[#1f1f1f] text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-400 text-xs"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#d4af37]/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm">Total</span>
            <span className="text-[#d4af37] font-semibold">${totalCart()}</span>
          </div>
          <button
            onClick={checkout}
            disabled={cart.length === 0}
            className="w-full py-2 rounded bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437] disabled:opacity-60"
          >
            Go to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------- helpers ------------------------------- */
const FALLBACK_MENU = [
  { id: 1, name: "Burger", price: 8, image: "/images/burger.jpg", category: "Main Course" },
  { id: 2, name: "Pizza",  price: 12, image: "/images/pizza.jpg",  category: "Main Course" },
  { id: 3, name: "Pasta",  price: 10, image: "/images/pasta.jpg",  category: "Main Course" },
  { id: 4, name: "Salad",  price: 6, image: "/images/salad.jpg",  category: "Starters" },
];

function safeParse(raw) {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
