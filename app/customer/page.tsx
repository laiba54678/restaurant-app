"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Menu as MenuIcon,
  ShoppingCart,
  ClipboardList,
  Calendar,
  LogOut,
  X,
  CreditCard,
  Wallet,
} from "lucide-react";

/* ----------------------- keys for per-user storage ----------------------- */
const CURRENT_KEY = "laurent-current";
const cartKey = (email) => `laurent-cart:${email}`;
const ordersKey = (email) => `laurent-orders:${email}`;

/* --------------------------------- page ---------------------------------- */
export default function CustomerDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // UI
  const [showSidebar, setShowSidebar] = useState(false); // mobile drawer
  const [showCart, setShowCart] = useState(false); // slide-over / bottom sheet
  const [showPayment, setShowPayment] = useState(false); // payment modal
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState("");

  // Refs for GSAP (kept for other parts)
  const topbarRef = useRef(null);
  const menuCardsRef = useRef(null);
  const cartPanelRef = useRef(null);
  const payModalRef = useRef(null);

  /* ------------------------------ boot / load ------------------------------ */
  useEffect(() => {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(CURRENT_KEY) : null;
    if (!raw) {
      router.replace("/login");
      return;
    }
    const me = JSON.parse(raw);
    setUser(me);

    // Demo menu (replace with API later)
    setMenu([
      {
        id: 1,
        name: "Burger",
        price: 8,
        image: "/images/burger.jpg",
        category: "Main Course",
      },
      {
        id: 2,
        name: "Pizza",
        price: 12,
        image: "/images/pizza.jpg",
        category: "Main Course",
      },
      {
        id: 3,
        name: "Pasta",
        price: 10,
        image: "/images/pasta.jpg",
        category: "Main Course",
      },
      {
        id: 4,
        name: "Salad",
        price: 6,
        image: "/images/salad.jpg",
        category: "Starters",
      },
    ]);

    // Restore per-user cart & orders
    const email = (me?.email || "").toLowerCase();
    const savedCart =
      safeParse(localStorage.getItem(cartKey(email))) || [];
    const savedOrders =
      safeParse(localStorage.getItem(ordersKey(email))) || [];
    setCart(savedCart);
    setOrders(savedOrders);
  }, [router]);

  /* -------------------------- entrance animations -------------------------- */
  useEffect(() => {
    if (!user) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    if (topbarRef.current) {
      tl.fromTo(
        topbarRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    }
    if (menuCardsRef.current) {
      tl.fromTo(
        menuCardsRef.current.querySelectorAll(".menu-card"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.08 },
        "-=0.2"
      );
    }
  }, [user]);

  /* ---------------------------- lock body scroll --------------------------- */
  useEffect(() => {
    const lock = showSidebar || showCart || showPayment;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [showSidebar, showCart, showPayment]);

  /* ---------------------------- cart panel slide --------------------------- */
  useEffect(() => {
    if (!cartPanelRef.current) return;
    const el = cartPanelRef.current;
    const mq = window.matchMedia("(min-width: 768px)"); // md breakpoint
    if (showCart) {
      if (mq.matches) {
        gsap.fromTo(
          el,
          { x: 360, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }
        );
      } else {
        gsap.fromTo(
          el,
          { y: 400 },
          { y: 0, duration: 0.35, ease: "power3.out" }
        );
      }
    } else {
      if (mq.matches) {
        gsap.to(el, { x: 360, opacity: 0, duration: 0.3, ease: "power3.in" });
      } else {
        gsap.to(el, { y: 400, duration: 0.3, ease: "power3.in" });
      }
    }
  }, [showCart]);

  /* ---------------------------- payment modal anim ------------------------- */
  useEffect(() => {
    if (!payModalRef.current) return;
    const el = payModalRef.current;
    if (showPayment) {
      gsap.set(el, { display: "flex" });
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(
        el.querySelector(".modal-card"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25 }
      );
    } else {
      gsap.to(el, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [showPayment]);

  /* -------------------------------- actions -------------------------------- */
  function logout() {
    localStorage.removeItem(CURRENT_KEY);
    router.replace("/login");
  }

  function addToCart(item) {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      const next = exists
        ? prev.map((c) =>
            c.id === item.id ? { ...c, qty: c.qty + 1 } : c
          )
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
      const next = prev.map((c) =>
        c.id === id ? { ...c, qty: c.qty + 1 } : c
      );
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
    return cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  }

  // Cash on Delivery: create local order and clear cart
  function placeOrderCOD() {
    if (cart.length === 0 || !user) return;
    const newOrder = {
      id: Date.now(),
      items: cart,
      total: totalCart(),
      status: "COD - Pending",
      date: new Date().toLocaleString(),
    };
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    persistOrders(nextOrders);
    setCart([]);
    persistCart([]);
    setShowPayment(false);
    setShowCart(false);
  }

  // Stripe: call backend (to be implemented later)
  async function placeOrderStripe() {
    try {
      setPayLoading(true);
      setPayError("");

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: cart.map((c) => ({
            id: c.id,
            name: c.name,
            price: c.price,
            qty: c.qty,
          })),
          user: { email: user?.email, name: user?.name },
        }),
      });

      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json(); // { url: "https://checkout.stripe.com/..." }
      if (data?.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        throw new Error("No checkout URL");
      }
    } catch (err) {
      setPayError(err?.message || "Unable to start payment.");
    } finally {
      setPayLoading(false);
    }
  }

  // Cancel order (only if pending)
  function cancelOrder(orderId) {
    const nextOrders = orders.map((o) =>
      o.id === orderId && o.status.includes("Pending")
        ? { ...o, status: "Cancelled" }
        : o
    );
    setOrders(nextOrders);
    persistOrders(nextOrders);
  }

  function persistCart(next) {
    if (!user) return;
    const email = (user.email || "").toLowerCase();
    localStorage.setItem(cartKey(email), JSON.stringify(next));
  }
  function persistOrders(next) {
    if (!user) return;
    const email = (user.email || "").toLowerCase();
    localStorage.setItem(ordersKey(email), JSON.stringify(next));
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#0f0f0f] text-white">
      {/* ---------- Sidebar (desktop static, mobile drawer) ---------- */}
      {/* Desktop */}
      <aside className="hidden md:flex w-64 bg-[#141414] border-r border-[#d4af37]/30 p-4 flex-col">
        <Brand />
        <SidebarNav logout={logout} />
      </aside>

      {/* Mobile overlay + drawer (CSS transitions, no GSAP) */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setShowSidebar(false)}
      />
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-[80vw] max-w-xs
          bg-[#141414] border-r border-[#d4af37]/30 p-4 flex-col md:hidden
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#d4af37] text-2xl font-serif">Laurent</h2>
          <button
            type="button"
            onClick={() => setShowSidebar(false)}
            className="p-2 rounded hover:bg-[#1f1f1f]"
          >
            <X size={18} />
          </button>
        </div>
        <SidebarNav logout={logout} onNavigate={() => setShowSidebar(false)} />
      </aside>

      {/* ---------- Main column ---------- */}
      <div className="flex-1 flex flex-col relative">
        {/* Topbar */}
        <header
          ref={topbarRef}
          className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#d4af37]/30 bg-[#0f0f0f] sticky top-0 z-30"
        >
          <div className="flex items-center gap-3">
            {/* Hamburger on mobile */}
            <button
              className="md:hidden p-2 rounded hover:bg-[#1f1f1f]"
              onClick={() => setShowSidebar(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={20} />
            </button>
            <h1 className="text-lg sm:text-xl text-[#d4af37] font-serif">
              Welcome, {user.name || user.email}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative p-2 rounded hover:bg-[#1f1f1f]"
              onClick={() => setShowCart((p) => !p)}
              aria-label="Open cart"
            >
              <ShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px] bg-red-600 rounded-full px-1.5 py-0.5">
                  {cart.reduce((n, i) => n + i.qty, 0)}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-gray-700 rounded-full" />
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 space-y-10">
          {/* Menu */}
          <section id="menu">
            <SectionTitle>Menu</SectionTitle>
            <div
              ref={menuCardsRef}
              className="grid gap-4 sm:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            >
              {menu.map((item) => (
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

          {/* Orders */}
          <section id="orders">
            <SectionTitle>My Orders</SectionTitle>
            <div className="bg-[#141414] p-3 sm:p-4 rounded border border-[#d4af37]/30">
              {orders.length === 0 ? (
                <p className="text-gray-400 text-sm sm:text-base">
                  No orders yet.
                </p>
              ) : (
                <ul className="space-y-3">
                  {orders.map((o) => (
                    <li
                      key={o.id}
                      className="border border-[#d4af37]/20 rounded p-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <p className="text-sm text-gray-400">{o.date}</p>
                        <div className="flex items-center gap-3">
                          <p>
                            <span className="text-[#d4af37] font-medium">
                              ${o.total}
                            </span>{" "}
                            — <span className="text-gray-300">{o.status}</span>
                          </p>
                          {o.status.includes("Pending") && (
                            <button
                              onClick={() => cancelOrder(o.id)}
                              className="text-red-400 text-xs px-2 py-1 border border-red-400 rounded hover:bg-red-400 hover:text-black transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      <ul className="text-sm mt-2 text-gray-300 grid sm:grid-cols-2 gap-x-6">
                        {o.items.map((i) => (
                          <li key={i.id}>
                            {i.name} × {i.qty}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Reservations (placeholder) */}
          <section id="reservations">
            <SectionTitle>My Reservations</SectionTitle>
            <div className="bg-[#141414] p-3 sm:p-4 rounded border border-[#d4af37]/30">
              <p className="text-gray-400 text-sm sm:text-base">
                No reservations yet.{" "}
                <a href="/#reservation" className="underline text-[#d4af37]">
                  Make one now
                </a>
              </p>
            </div>
          </section>
        </main>

        {/* Cart Panel (desktop right slide-over, mobile bottom sheet) */}
        <div
          ref={cartPanelRef}
          className={`${
            showCart ? "pointer-events-auto" : "pointer-events-none"
          } fixed md:absolute md:top-0 md:right-0 md:h-full md:w-80 bottom-0 left-0 w-full md:w-80
            bg-[#141414] border-t md:border-t-0 md:border-l border-[#d4af37]/30 shadow-2xl z-40`}
          style={{ display: showCart ? "block" : "none" }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#d4af37]/20">
            <h2 className="text-lg font-semibold text-[#d4af37]">My Cart</h2>
            <button
              className="p-2 rounded hover:bg-[#1f1f1f]"
              onClick={() => setShowCart(false)}
            >
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
              <span className="text-[#d4af37] font-semibold">
                ${totalCart()}
              </span>
            </div>
            <button
              onClick={() => (cart.length ? setShowPayment(true) : null)}
              disabled={cart.length === 0}
              className="w-full py-2 rounded bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437] disabled:opacity-60"
            >
              Choose Payment
            </button>
          </div>
        </div>

        {/* Payment Modal */}
        <div
          ref={payModalRef}
          className="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 px-4"
        >
          <div className="modal-card w-full max-w-md bg-[#141414] border border-[#d4af37]/40 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#d4af37]">
                Select Payment Method
              </h3>
              <button
                onClick={() => setShowPayment(false)}
                className="p-2 rounded hover:bg-[#1f1f1f]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={placeOrderStripe}
                disabled={payLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded bg-white text-black font-medium hover:opacity-90 disabled:opacity-60"
              >
                <CreditCard size={18} />
                {payLoading ? "Connecting to Stripe..." : "Pay with Stripe"}
              </button>

              <button
                onClick={placeOrderCOD}
                className="w-full flex items-center justify-center gap-2 py-3 rounded bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437]"
              >
                <Wallet size={18} />
                Cash on Delivery
              </button>

              {payError && (
                <p className="text-red-400 text-sm text-center">{payError}</p>
              )}
              <p className="text-xs text-gray-400 text-center mt-1">
                You’ll be redirected to Stripe for secure payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- components ------------------------------- */
function Brand() {
  return <h2 className="text-[#d4af37] text-2xl font-serif mb-8">Laurent</h2>;
}

function SidebarNav({ logout, onNavigate }) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 space-y-2">
        <a
          href="#menu"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1f1f1f]"
          onClick={onNavigate}
        >
          <MenuIcon size={18} /> Menu
        </a>
        <a
          href="#orders"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1f1f1f]"
          onClick={onNavigate}
        >
          <ClipboardList size={18} /> My Orders
        </a>
        <a
          href="#reservations"
          className="flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1f1f1f]"
          onClick={onNavigate}
        >
          <Calendar size={18} /> Reservations
        </a>
      </nav>
      <button
        onClick={logout}
        className="mt-3 flex items-center gap-3 px-3 py-2 rounded hover:bg-[#1f1f1f] text-red-400"
      >
        <LogOut size={18} /> Logout
      </button>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-xl font-semibold text-[#d4af37] mb-4">{children}</h2>;
}

/* --------------------------------- utils ---------------------------------- */
function safeParse(raw) {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
