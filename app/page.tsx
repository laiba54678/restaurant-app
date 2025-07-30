"use client";


import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import { Menu, X, ShoppingCart } from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1613145993481-3a2eec930534?auto=format&fit=crop&w=1500&q=80"; // Replace if needed
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600891963933-19946e1f3ed1?auto=format&fit=crop&w=1500&q=80";
const ABOUT_IMG_LEFT =
  "https://images.unsplash.com/photo-1600891963933-19946e1f3ed1?auto=format&fit=crop&w=800&q=80";
const ABOUT_IMG_RIGHT =
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80";
const FOOD_IMAGE =
  "https://images.unsplash.com/photo-1617191514009-5c5317e497a4?auto=format&fit=crop&w=1500&q=80";

export default function Home() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subheadingRef = useRef<HTMLHeadingElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const flower1Ref = useRef<SVGSVGElement | null>(null);
const flower2Ref = useRef<SVGSVGElement | null>(null);
const flower3Ref = useRef<SVGSVGElement | null>(null);


  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
    );

    gsap.fromTo(
      subheadingRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1.2, delay: 0.3, ease: "power3.out" }
    );

    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, delay: 0.7, ease: "power3.out" }
    );


    
  }, []);
  function MobileRight() {
    const [menuOpen, setMenuOpen] = useState(false);
    const cartCount = 0;
  
    return (
      <>
        <div className="md:hidden flex items-center gap-3 text-white">
          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:text-[#d4af37] transition">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] leading-none w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </Link>
  
          {/* Hamburger */}
          <button
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            className="p-2 hover:text-[#d4af37] transition"
          >
            {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
  
        {/* Slide-down panel */}
        <div
          className={`md:hidden overflow-hidden border-t border-[#d4af37]/70 bg-[#0f0f0f]/95 backdrop-blur-sm transition-[max-height,opacity] duration-300 ease-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-6 py-4 text-white">
            <Link href="#" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="#about" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="#login" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link href="#menu" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link href="#reservation" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Reservation</Link>
          </div>
        </div>
      </>
    );
  }

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    

    <main className="relative bg-[#0f0f0f] text-white overflow-x-hidden">
      {/* NAVBAR: OUTSIDE SECTION, FIXED TOP */}

    {/* NAVBAR */}
    <nav className="fixed top-0 left-0 w-full z-50">
        <div className="flex justify-between items-center px-6 md:px-16 py-6 text-sm font-semibold tracking-widest">
          {/* Brand */}
          <span className="text-[#d4af37] text-2xl font-serif">Laurent</span>

          {/* Desktop: links + cart */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              <Link href="#" className="hover:text-[#d4af37]">Home</Link>
              {/* <Link href="#about" className="hover:text-[#d4af37]">About</Link> */}
              
<Link href="/login" className="hover:text-[#d4af37]">Login</Link>
{/* <Link href="#login" className="hover:text-[#d4af37]">Login</Link> */}
              
              <Link href="/menu" className="hover:text-[#d4af37]">Menu</Link>
              <Link href="#Reservation" className="hover:text-[#d4af37]">Reservation</Link>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative hover:text-[#d4af37] transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>
          </div>

          {/* Mobile right: cart + hamburger (state is here, not in a child) */}
          <div className="md:hidden flex items-center gap-3 text-white">
            <Link href="/cart" className="relative p-2 hover:text-[#d4af37] transition">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#d4af37] text-black text-[10px] leading-none w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </Link>

            <button
              type="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              className="p-2 hover:text-[#d4af37] transition"
            >
              {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down panel (mounted all the time; only height/opacity toggles) */}
        <div
          className={`md:hidden overflow-hidden border-t border-[#d4af37]/70 bg-[#0f0f0f]/95 backdrop-blur-sm transition-[max-height,opacity] duration-300 ease-out ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col px-6 py-4 text-white">
            <Link href="#home" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="#about" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>About</Link>
            {/* <Link href="#login" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Login</Link> */}
            <Link href="/login" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>
  Login
</Link>


            <Link href="#menu" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Menu</Link>
            <Link href="#Reservation" className="py-3 hover:text-[#d4af37]" onClick={() => setMenuOpen(false)}>Reservation</Link>
          </div>
        </div>

       
      </nav>


  <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-32 overflow-hidden">




  {/* Global Border Lines */}
  <div className="pointer-events-none absolute inset-0 z-10">
    <div className="absolute top-0 left-0 w-full h-px bg-[#d4af37]" />
    <div className="absolute bottom-0 left-0 w-full h-px bg-[#d4af37]" />
    <div className="absolute top-0 left-0 h-full w-px bg-[#d4af37]" />
    <div className="absolute top-0 right-0 h-full w-px bg-[#d4af37]" />
  </div>


  {/* Background */}
  <div className="absolute inset-0 -z-20">
    <Image
      src={HERO_BG}
      alt="Hero Background"
      fill
      className="object-cover brightness-[.5]"
      priority
    />
    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/95" />
  </div>

  {/* GOLDEN PATTERN (above gradient, below content) */}
  <div className="absolute inset-0 z-10 opacity-10 pointer-events-none">
    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gold-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 40 20 L 20 40 L 0 20 Z" stroke="#d4af37" fill="none" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gold-pattern)" />
    </svg>
  </div>


 {/* 🔆 GOLD GLOW (Now correctly layered) */}
 <div className="absolute z-20 top-[12%]  left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none blur-3xl">
    <svg width="720" height="720" viewBox="0 0 720 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#d4af37" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="360" cy="360" r="330" fill="url(#goldGlow)" />
    </svg>
  </div>

  {/* Hero Content */}
  <div className="flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto z-10 mt-10">
    <h2 ref={subheadingRef} className="text-xl md:text-2xl mb-2 font-serif text-[#d4af37] italic tracking-wider">
      Welcome to Laurent
    </h2>
    <h1
      ref={headingRef}
      className="text-5xl md:text-7xl font-bold mb-6"
      style={{
        fontFamily: 'Cinzel, Playfair Display, serif',
        letterSpacing: "0.1em",
        textShadow: "0 2px 16px #0008",
        color: "#d4af37",
      }}
    >
      THE BEST DISHES
    </h1>
    <p
      className="mb-8 text-lg md:text-xl font-light max-w-xl mx-auto"
      style={{ fontFamily: 'Poppins, serif' }}
    >
      We have a proper passion for cooking. Love is the secret ingredient that makes all our meals taste better and magical.
    </p>
    <Button
      ref={buttonRef}
      className="px-8 py-3 rounded-full font-medium text-lg border border-[#d4af37] text-white hover:bg-[#d4af37] hover:text-black transition duration-300"
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      View More
    </Button>
  </div>
</section>







{/* SECTION 2: ABOUT US */}
<section id="about" className="relative bg-[#0f0f0f] text-white py-24 px-6 text-center mt-52">

  {/* Decorative Golden Borders */}
  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#d4af37]"></div>
  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37]"></div>
  <div className="absolute top-0 left-0 h-full w-0.5 bg-[#d4af37]"></div>
  <div className="absolute top-0 right-0 h-full w-0.5 bg-[#d4af37]"></div>

  {/* Decorative Line above "Our Story" */}
  <div className="flex justify-center mb-4">
    <svg width="120" height="10" viewBox="0 0 120 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 5H120" stroke="#d4af37" strokeWidth="2" />
    </svg>
  </div>

  <h3
    className="text-xl uppercase tracking-widest mb-2"
    style={{ color: "#d4af37", fontFamily: "Playfair Display, serif" }}
  >
    Our Story
  </h3>
  <h2
    className="text-5xl md:text-6xl font-bold tracking-wider mb-6"
    style={{ fontFamily: "Cinzel, serif", color: "#d4af37" }}
  >
    ABOUT US
  </h2>
  <p
    className="max-w-2xl mx-auto mb-12 text-lg leading-relaxed"
    style={{ fontFamily: "Poppins, sans-serif" }}
  >
    At Laurent, we believe that food is an experience to be cherished.
    Every plate we serve is crafted with love, passion, and a desire to
    leave you smiling. From fine ambiance to bold flavors, discover a new
    way to dine.
  </p>

  {/* Grid Section */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center max-w-6xl mx-auto px-4">
    {/* Left Image */}
    <div>
      <Image
        src="/ap.jpg"
        alt="Pakistani Biryani"
        width={400}
        height={500}
        className="rounded-lg object-cover mx-auto"
      />
    </div>

     {/* Middle Pattern (WIDER) */}
  <div className="hidden md:flex justify-center">
    <svg
      width="240"
      height="300"
      viewBox="0 0 240 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern
          id="diamond"
          x="0"
          y="0"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 40 20 L 20 40 L 0 20 Z"
            stroke="#d4af37"
            fill="transparent"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="240" height="300" fill="url(#diamond)" />
    </svg>
  </div>






    {/* Right Image */}
    <div>
      <Image
        src="/tr.jpg"
        alt="Pakistani Karahi"
        width={400}
        height={500}
        className="rounded-lg object-cover mx-auto"
      />
    </div>
  </div>


  

</section>










{/* SECTION 3: SPECIALTIES / FOOD HEAVEN */}
<section className="bg-[#0f0f0f] text-white py-24 px-6 text-center mt-10">



  {/* Top Decorative Line */}
  <div className="flex justify-center mb-10">
    <svg width="140" height="12" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6H140" stroke="#d4af37" strokeWidth="2" />
    </svg>
  </div>

  <h3 className="text-xl uppercase tracking-widest text-[#d4af37] font-serif text-center mb-2">
    Food Heaven
  </h3>
  <h2 className="text-5xl md:text-6xl font-bold tracking-wider text-[#d4af37] text-center mb-10" style={{ fontFamily: 'Cinzel, serif' }}>
    OUR SPECIALTIES
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto px-6">
    {/* Dish 1 */}
    <div className="bg-[#1a1a1a] border border-[#d4af37] p-6 rounded-xl hover:scale-105 transition duration-300">
      <img src="/bir.png" alt="Biryani" className="w-full h-64 object-cover rounded-lg mb-4" />
      <h4 className="text-2xl text-[#d4af37] font-semibold mb-2 font-serif">Royal Biryani</h4>
      <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Aromatic rice layered with tender meat and rich spices, slow-cooked to perfection.
      </p>
    </div>

    {/* Dish 2 */}
    <div className="bg-[#1a1a1a] border border-[#d4af37] p-6 rounded-xl hover:scale-105 transition duration-300">
      <img src="/kar.png" alt="Karahi" className="w-full h-64 object-cover rounded-lg mb-4" />
      <h4 className="text-2xl text-[#d4af37] font-semibold mb-2 font-serif">Spicy Karahi</h4>
      <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
        Fiery tomato-based curry loaded with flavors, served sizzling in a traditional wok.
      </p>
    </div>

    {/* Dish 3 */}

    <div className="bg-[#1a1a1a] border border-[#d4af37] p-6 rounded-xl hover:scale-105 transition duration-300">
    <img src="/sweet.jpg" alt="Sweet Dish" className="w-full h-64 object-cover rounded-lg mb-4" />

      <h4 className="text-2xl text-[#d4af37] font-semibold mb-2 font-serif">Sweet Desires</h4>
      <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>
        A medley of traditional Pakistani desserts curated to complete your culinary journey.
      </p>
    </div>
  </div>

    {/* Bottom Decorative Line */} 
    <div className="flex justify-center mt-16">
    <svg width="140" height="12" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6H140" stroke="#d4af37" strokeWidth="2" />
    </svg>
  </div>
</section> 


{/* SECTION 5: CONTACT */}
<section id="Reservation" className="bg-[#0f0f0f] text-white py-24 px-6 relative overflow-hidden border-t border-[#d4af37]">

  {/* Decorative Top Line */}
  <div className="flex justify-center mb-12">
    <svg width="140" height="12" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6H140" stroke="#d4af37" strokeWidth="2" />
    </svg>
  </div>

  <h2 className="text-5xl md:text-6xl font-bold tracking-wider text-[#d4af37] text-center mb-4 font-serif">
    Reservation
  </h2>
  <p className="text-center text-sm md:text-lg font-light mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Poppins, sans-serif' }}>
    Have a question or want to make a reservation? Reach out to us and we'll get back to you as soon as possible.
  </p>

  <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

    {/* Contact Info */}
    <div className="space-y-6">
      <div>
        <h4 className="text-[#d4af37] text-xl font-semibold font-serif mb-1">Phone</h4>
        <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>+92 300 1234567</p>
      </div>
      <div>
        <h4 className="text-[#d4af37] text-xl font-semibold font-serif mb-1">Email</h4>
        <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>info@laurentrestaurant.com</p>
      </div>
      <div>
        <h4 className="text-[#d4af37] text-xl font-semibold font-serif mb-1">Location</h4>
        <p className="text-sm font-light" style={{ fontFamily: 'Poppins, sans-serif' }}>Main Boulevard, Gulberg, Lahore</p>
      </div>
    </div>

    <form className="space-y-6">
  <input
    type="text"
    placeholder="Your Name"
    className="w-full p-3 rounded-md bg-[#1a1a1a] border border-[#d4af37] text-white placeholder-gray-400"
  />
  <input
    type="email"
    placeholder="Your Email"
    className="w-full p-3 rounded-md bg-[#1a1a1a] border border-[#d4af37] text-white placeholder-gray-400"
  />
  <input
    type="date"
    className="w-full p-3 rounded-md bg-[#1a1a1a] border border-[#d4af37] text-white"
  />
  <input
    type="time"
    className="w-full p-3 rounded-md bg-[#1a1a1a] border border-[#d4af37] text-white"
  />
  <select
    className="w-full p-3 rounded-md bg-[#1a1a1a] border border-[#d4af37] text-white"
  >
    <option value="">Select Guests</option>
    <option value="1">1 Guest</option>
    <option value="2">2 Guests</option>
    <option value="3">3 Guests</option>
    <option value="4+">4+ Guests</option>
  </select>
  <button
    type="submit"
    className="px-6 py-3 border border-[#d4af37] text-[#d4af37] hover:bg-[#d4af37] hover:text-black transition duration-300 rounded-full font-medium"
    style={{ fontFamily: 'Playfair Display, serif' }}
  >
    Reserve Table
  </button>
</form>


  </div>

  {/* Decorative Bottom Line */}
  <div className="flex justify-center mt-16">
    <svg width="140" height="12" viewBox="0 0 140 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 6H140" stroke="#d4af37" strokeWidth="2" />
    </svg>
  </div>
</section>


</main>     

);         
}           
