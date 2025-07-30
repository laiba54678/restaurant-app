"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Menu as MenuIcon,
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  Settings,
  LogOut,
  X,
  Check,
  Truck,
  Ban,
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

/* ------------------------------ KEYS / HELPERS ---------------------------- */
const CURRENT_KEY = "laurent-current";       // logged-in user
const USERS_KEY   = "laurent-users";         // all users (from your fake auth)
const MENU_KEY    = "laurent-menu";          // admin-managed menu catalog
const ORDERS_KEY  = "laurent-orders-all";    // all orders (admin wide)

const isAdminEmail = (email) =>
  typeof email === "string" && email.toLowerCase() === "admin@laurent.com";

const safeParse = (raw) => {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* ---------------------------------- TYPES --------------------------------- */
// Keeping plain JS—no TS types to avoid build issues.

/* ---------------------------------- PAGE ---------------------------------- */
export default function AdminDashboard() {
  const router = useRouter();

  /* ------------------------------- STATE ---------------------------------- */
  const [me, setMe] = useState(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [section, setSection] = useState("overview"); // overview | orders | menu | users | settings

  const [cards, setCards] = useState([
    { key: "revenue", label: "Revenue (demo)", value: 12540 },
    { key: "orders",  label: "Total Orders",   value: 342 },
    { key: "pending", label: "Pending",        value: 7 },
    { key: "users",   label: "Customers",      value: 89 },
  ]);

  const [orders, setOrders] = useState([]);
  const [menu,   setMenu]   = useState([]);
  const [users,  setUsers]  = useState([]);

  // Menu modal / form
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category: "Main Course", image: "", available: true });

  /* ------------------------------- REFS ----------------------------------- */
  const topbarRef    = useRef(null);
  const cardsRef     = useRef(null);
  const listRef      = useRef(null);
  const sidebarRef   = useRef(null);
  const overlayRef   = useRef(null);
  const modalRef     = useRef(null);

  /* ------------------------------ AUTH GUARD ------------------------------ */
  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CURRENT_KEY) : null;
    if (!raw) { router.replace("/login"); return; }
    const u = JSON.parse(raw);
    if (!isAdminEmail(u?.email)) { router.replace("/login"); return; } // simple guard
    setMe(u);
  }, [router]);

  /* ------------------------------- LOAD DATA ------------------------------ */
  useEffect(() => {
    if (!me) return;

    // Seed demo menu if missing
    const existingMenu = safeParse(localStorage.getItem(MENU_KEY));
    if (!existingMenu || !existingMenu.length) {
      const seed = [
        { id: 1, name: "Burger", price: 8, category: "Main Course", image: "/images/burger.jpg", available: true },
        { id: 2, name: "Pizza",  price: 12, category: "Main Course", image: "/images/pizza.jpg",  available: true },
        { id: 3, name: "Pasta",  price: 10, category: "Main Course", image: "/images/pasta.jpg",  available: true },
        { id: 4, name: "Salad",  price: 6, category: "Starters",     image: "/images/salad.jpg",  available: true },
      ];
      write(MENU_KEY, seed);
    }

    const m = safeParse(localStorage.getItem(MENU_KEY)) || [];
    setMenu(m);

    // Seed demo orders if missing
    const existingOrders = safeParse(localStorage.getItem(ORDERS_KEY));
    if (!existingOrders || !existingOrders.length) {
      const now = new Date();
      const seedOrders = [
        {
          id: now.getTime() - 1,
          customer: "laiba@gmail.com",
          total: 22,
          status: "Pending",
          date: now.toLocaleString(),
          items: [
            { id: 2, name: "Pizza", price: 12, qty: 1 },
            { id: 4, name: "Salad", price: 6, qty: 1 },
            { id: 1, name: "Burger", price: 4, qty: 1 }, // demo mix
          ],
        },
        {
          id: now.getTime() - 99999,
          customer: "awais@gmail.com",
          total: 18,
          status: "Confirmed",
          date: new Date(now.getTime() - 86400000).toLocaleString(),
          items: [{ id: 1, name: "Burger", price: 9, qty: 2 }],
        },
      ];
      write(ORDERS_KEY, seedOrders);
    }

    const o = safeParse(localStorage.getItem(ORDERS_KEY)) || [];
    setOrders(o);

    const u = safeParse(localStorage.getItem(USERS_KEY)) || [];
    setUsers(u);

  }, [me]);

  /* --------------------------- ENTRANCE ANIMATIONS ------------------------ */
  useEffect(() => {
    if (topbarRef.current) {
      gsap.fromTo(topbarRef.current, { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" });
    }
  }, [me]);

  useEffect(() => {
    if (!cardsRef.current) return;
    gsap.fromTo(
      cardsRef.current.querySelectorAll(".stat-card"),
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" }
    );
  }, [section]);

  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.querySelectorAll(".list-row"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.28, stagger: 0.04, ease: "power2.out" }
    );
  }, [section, orders, menu, users]);

  /* ------------------------------ BODY LOCK ------------------------------- */
  useEffect(() => {
    const lock = showSidebar || showItemModal;
    document.body.style.overflow = lock ? "hidden" : "auto";
  }, [showSidebar, showItemModal]);

  /* ---------------------------- SIDEBAR TOGGLE ---------------------------- */
  // Use CSS transitions instead of GSAP for reliability
  const Sidebar = (
    <>
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          showSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={() => setShowSidebar(false)}
      />
      <aside
        ref={sidebarRef}
        className={`fixed z-50 top-0 left-0 h-full w-[80vw] max-w-xs bg-[#141414] border-r border-[#d4af37]/30 p-4 flex flex-col md:static md:w-64 md:flex
          transform transition-transform duration-300 ease-in-out 
          ${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[#d4af37] text-2xl font-serif">Laurent</span>
          </div>
          <button onClick={() => setShowSidebar(false)} className="p-2 rounded hover:bg-[#1f1f1f] md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <SideLink icon={<LayoutDashboard size={18} />} label="Overview" active={section === "overview"} onClick={() => { setSection("overview"); setShowSidebar(false); }} />
          <SideLink icon={<ClipboardList   size={18} />} label="Orders"   active={section === "orders"}   onClick={() => { setSection("orders");   setShowSidebar(false); }} />
          <SideLink icon={<UtensilsCrossed size={18} />} label="Menu"     active={section === "menu"}     onClick={() => { setSection("menu");     setShowSidebar(false); }} />
          <SideLink icon={<Users           size={18} />} label="Users"    active={section === "users"}    onClick={() => { setSection("users");    setShowSidebar(false); }} />
          <SideLink icon={<Settings        size={18} />} label="Settings" active={section === "settings"} onClick={() => { setSection("settings"); setShowSidebar(false); }} />
        </nav>

        <button onClick={logout} className="mt-3 flex items-center gap-2 px-3 py-2 rounded hover:bg-[#1f1f1f] text-red-400">
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );

  /* -------------------------------- ACTIONS ------------------------------- */
  function logout() {
    localStorage.removeItem(CURRENT_KEY);
    router.replace("/login");
  }

  // Orders
  function setStatus(id, status) {
    const next = orders.map((o) => (o.id === id ? { ...o, status } : o));
    setOrders(next);
    write(ORDERS_KEY, next);
  }
  function cancelOrder(id) { setStatus(id, "Cancelled"); }
  function confirmOrder(id) { setStatus(id, "Confirmed"); }
  function deliverOrder(id) { setStatus(id, "Delivered"); }

  // Menu
  function openNewItem() {
    setEditingItem(null);
    setForm({ name: "", price: "", category: "Main Course", image: "", available: true });
    setShowItemModal(true);
  }
  function openEditItem(item) {
    setEditingItem(item);
    setForm({ name: item.name, price: String(item.price), category: item.category, image: item.image || "", available: !!item.available });
    setShowItemModal(true);
  }
  function saveItem(e) {
    e?.preventDefault?.();
    const priceNum = Number(form.price);
    if (!form.name || isNaN(priceNum) || priceNum <= 0) return;

    if (editingItem) {
      const next = menu.map((m) => (m.id === editingItem.id ? { ...m, ...form, price: priceNum } : m));
      setMenu(next); write(MENU_KEY, next);
    } else {
      const next = [{ id: Date.now(), ...form, price: priceNum }, ...menu];
      setMenu(next); write(MENU_KEY, next);
    }
    setShowItemModal(false);
  }
  function deleteItem(id) {
    const next = menu.filter((m) => m.id !== id);
    setMenu(next); write(MENU_KEY, next);
  }
  function toggleAvailability(id) {
    const next = menu.map((m) => (m.id === id ? { ...m, available: !m.available } : m));
    setMenu(next); write(MENU_KEY, next);
  }

  // Users (read-only from local)
  const customers = useMemo(
    () => (users || []).filter((u) => !isAdminEmail(u.email)),
    [users]
  );

  /* -------------------------------- RENDER -------------------------------- */
  if (!me) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex">
      {/* Sidebar (desktop static, mobile drawer) */}
      <div className="hidden md:flex">{Sidebar}</div>
      {/* On mobile we render Sidebar JSX directly to allow overlay */}
      <div className="md:hidden">{Sidebar}</div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header
          ref={topbarRef}
          className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#d4af37]/30 sticky top-0 bg-[#0f0f0f] z-30"
        >
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded hover:bg-[#1f1f1f]" onClick={() => setShowSidebar(true)} aria-label="Open menu">
              <MenuIcon size={22} />
            </button>
            <h1 className="text-lg sm:text-xl text-[#d4af37] font-serif">Admin Dashboard</h1>
          </div>
          <div className="text-sm text-gray-300">Welcome, {me?.name || me?.email}</div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 space-y-8">
          {section === "overview" && (
            <section>
              <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {cards.map((c) => (
                  <div key={c.key} className="stat-card bg-[#141414] rounded-lg border border-[#d4af37]/30 p-4">
                    <p className="text-xs sm:text-sm text-gray-400">{c.label}</p>
                    <p className="text-xl sm:text-2xl font-semibold mt-1 text-[#d4af37]">${c.value}</p>
                    {/* simple bar to suggest trend */}
                    <div className="mt-3 h-2 w-full bg-[#1f1f1f] rounded">
                      <div className="h-2 rounded bg-[#d4af37]" style={{ width: `${Math.min(100, (c.value % 100) + 15)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick list of latest orders */}
              <div className="mt-6">
                <SectionTitle>Latest Orders</SectionTitle>
                <div ref={listRef} className="space-y-3">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o.id} className="list-row bg-[#141414] rounded border border-[#d4af37]/20 p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="text-sm">
                        <div className="font-medium">{o.customer}</div>
                        <div className="text-gray-400">{o.date}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[#d4af37] font-medium">${o.total}</span>
                        <span className="text-xs px-2 py-1 rounded border border-[#d4af37]/40">{o.status}</span>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && <p className="text-gray-400 text-sm">No orders yet.</p>}
                </div>
              </div>
            </section>
          )}

          {section === "orders" && (
            <section>
              <SectionTitle>Orders</SectionTitle>
              <div ref={listRef} className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="list-row bg-[#141414] rounded border border-[#d4af37]/20 p-3 sm:p-4">
                    <div className="flex flex-col sm:grid sm:grid-cols-5 sm:gap-3">
                      <div className="col-span-2">
                        <p className="text-sm font-medium">{o.customer}</p>
                        <p className="text-xs text-gray-400">{o.date}</p>
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <p className="text-sm text-gray-300">Items:</p>
                        <p className="text-xs text-gray-400 truncate">
                          {o.items.map((i) => `${i.name}×${i.qty}`).join(", ")}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 flex items-center gap-2">
                        <span className="text-[#d4af37] font-semibold">${o.total}</span>
                        <span className="text-xs px-2 py-1 rounded border border-[#d4af37]/40">{o.status}</span>
                      </div>
                      <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                        <button onClick={() => confirmOrder(o.id)} className="px-2 py-1 text-xs rounded border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black flex items-center gap-1">
                          <Check size={14} /> Confirm
                        </button>
                        <button onClick={() => deliverOrder(o.id)} className="px-2 py-1 text-xs rounded border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black flex items-center gap-1">
                          <Truck size={14} /> Delivered
                        </button>
                        <button onClick={() => cancelOrder(o.id)} className="px-2 py-1 text-xs rounded border border-red-400 text-red-300 hover:bg-red-400 hover:text-black flex items-center gap-1">
                          <Ban size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && <p className="text-gray-400 text-sm">No orders yet.</p>}
              </div>
            </section>
          )}

          {section === "menu" && (
            <section>
              <div className="flex items-center justify-between">
                <SectionTitle>Menu</SectionTitle>
                <button onClick={openNewItem} className="flex items-center gap-2 px-3 py-2 rounded bg-[#d4af37] text-black hover:bg-[#c9a437]">
                  <Plus size={16} /> Add Item
                </button>
              </div>

              <div ref={listRef} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {menu.map((m) => (
                  <div key={m.id} className="list-row bg-[#141414] rounded border border-[#d4af37]/20 overflow-hidden">
                    <div className="flex gap-3 p-3">
                      <div className="w-16 h-16 bg-[#1f1f1f] rounded overflow-hidden shrink-0">
                        {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{m.name}</p>
                        <p className="text-xs text-gray-400 truncate">{m.category}</p>
                        <p className="text-[#d4af37] font-semibold mt-1">${m.price}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <button onClick={() => openEditItem(m)} className="text-xs px-2 py-1 rounded border border-[#d4af37]/50 hover:bg-[#d4af37] hover:text-black flex items-center gap-1">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => deleteItem(m.id)} className="text-xs px-2 py-1 rounded border border-red-400 text-red-300 hover:bg-red-400 hover:text-black flex items-center gap-1">
                            <Trash2 size={14} /> Delete
                          </button>
                          <button onClick={() => toggleAvailability(m.id)} className="text-xs px-2 py-1 rounded border border-[#d4af37]/40 flex items-center gap-1">
                            {m.available ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                            {m.available ? "Available" : "Hidden"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {menu.length === 0 && <p className="text-gray-400 text-sm">No items yet.</p>}
              </div>

              {/* Add/Edit Modal */}
              <div
                ref={modalRef}
                className={`fixed inset-0 z-50 ${showItemModal ? "flex" : "hidden"} items-center justify-center bg-black/60 px-4`}
              >
                <div className="w-full max-w-md bg-[#141414] border border-[#d4af37]/40 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#d4af37]">{editingItem ? "Edit Item" : "Add Item"}</h3>
                    <button onClick={() => setShowItemModal(false)} className="p-2 rounded hover:bg-[#1f1f1f]"><X size={18} /></button>
                  </div>
                  <form onSubmit={saveItem} className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-300">Name</label>
                      <input
                        className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Item name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm text-gray-300">Price</label>
                        <input
                          type="number"
                          step="0.01"
                          className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/40"
                          value={form.price}
                          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300">Category</label>
                        <select
                          className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2"
                          value={form.category}
                          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        >
                          <option>Main Course</option>
                          <option>Starters</option>
                          <option>Desserts</option>
                          <option>Drinks</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-300">Image URL (optional)</label>
                      <input
                        className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2"
                        value={form.image}
                        onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                        placeholder="/images/pizza.jpg or https://..."
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="available"
                        type="checkbox"
                        checked={form.available}
                        onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
                      />
                      <label htmlFor="available" className="text-sm">Available</label>
                    </div>
                    <div className="pt-1 flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowItemModal(false)} className="px-3 py-2 rounded border border-[#d4af37]/40 hover:bg-[#1f1f1f]">Cancel</button>
                      <button type="submit" className="px-3 py-2 rounded bg-[#d4af37] text-black font-semibold hover:bg-[#c9a437]">
                        {editingItem ? "Save Changes" : "Add Item"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}

          {section === "users" && (
            <section>
              <SectionTitle>Customers</SectionTitle>
              <div ref={listRef} className="space-y-3">
                {customers.map((u) => (
                  <div key={u.email} className="list-row bg-[#141414] rounded border border-[#d4af37]/20 p-3 sm:p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{u.name || "(no name)"}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded border border-[#d4af37]/40">Customer</span>
                  </div>
                ))}
                {customers.length === 0 && <p className="text-gray-400 text-sm">No customers yet.</p>}
              </div>
            </section>
          )}

          {section === "settings" && (
            <section>
              <SectionTitle>Settings</SectionTitle>
              <div className="bg-[#141414] rounded border border-[#d4af37]/30 p-4 space-y-4">
                <div>
                  <p className="text-sm text-gray-300">Restaurant Name</p>
                  <input className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2" defaultValue="Laurent" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <p className="text-sm text-gray-300">Opening Hours</p>
                    <input className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2" placeholder="e.g., 10:00 - 22:00" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Stripe Public Key (to wire later)</p>
                    <input className="mt-1 w-full bg-[#0f0f0f] border border-[#d4af37]/40 rounded px-3 py-2" placeholder="pk_live_..." />
                  </div>
                </div>
                <p className="text-xs text-gray-500">These settings are only UI placeholders. We’ll wire them to your backend later.</p>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

/* -------------------------------- COMPONENTS ------------------------------ */
function SideLink({ icon, label, active, onClick }) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded ${active ? "bg-[#1f1f1f] text-[#d4af37]" : "hover:bg-[#1f1f1f]"}`}
      onClick={onClick}
    >
      {icon} <span className="text-sm">{label}</span>
    </button>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg sm:text-xl font-semibold text-[#d4af37] mb-4">{children}</h2>;
}
