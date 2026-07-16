"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Input } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiShield, 
  FiTruck, 
  FiAward, 
  FiPhoneCall,
  FiChevronDown,
  FiMail
} from "react-icons/fi";
import { fetchFeaturedProducts } from "@/lib/api/product";
import type { IProductItem } from "@/lib/api/product";
import ProductCard from "@/components/product/ProductCard";

// Slider slides mock data
const slides = [
  {
    title: "Precision in Every Second",
    subtitle: "Discover our exclusive collection of premium men's watches — where craftsmanship meets modern design.",
    cta: "Shop Watches",
    link: "/shop?category=watches",
    image: "/images/slide1.png",
    bgGradient: "from-blue-950 via-blue-900 to-indigo-950"
  },
  {
    title: "Elegance That Endures",
    subtitle: "Adorn yourself with our stunning diamond ring collection — timeless beauty crafted for life's cherished moments.",
    cta: "Shop Rings",
    link: "/shop?category=rings",
    image: "/images/slide2.png",
    bgGradient: "from-red-700 via-pink-700 to-rose-700"
  },
  {
    title: "Dominate the Game",
    subtitle: "Unleash your gaming potential with high-performance laptops built for speed, graphics, and non-stop action.",
    cta: "Explore Laptops",
    link: "/shop?category=laptops",
    image: "/images/slide3.png",
    bgGradient: "from-slate-900 via-cyan-900 to-blue-900"
  }
];

// FAQs mock data
const faqs = [
  {
    question: "Are your products covered by warranty?",
    answer: "Yes, all NextMart gadgets and luxury watches include a 1-year comprehensive manufacturer warranty from the date of purchase."
  },
  {
    question: "What is your return and refund policy?",
    answer: "We offer a 30-day risk-free return policy. If you are not satisfied with your purchase, you can return it in its original packaging for a full refund."
  },
  {
    question: "Do you offer free shipping?",
    answer: "We provide complimentary premium express shipping on all domestic orders over $50."
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState<IProductItem[]>([]);
  
  // Auto-rotate hero slider slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch featured products (positions 1-8)
  useEffect(() => {
    fetchFeaturedProducts()
      .then((data) => setFeaturedProducts(data.products))
      .catch(() => setFeaturedProducts([]));
  }, []);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing to NextMart!");
    setEmailInput("");
  };

  return (
    <div className="flex-1 flex flex-col bg-background transition-colors duration-300">
      
      {/* SECTION 1: HERO VIEWPORT SLIDER */}
      <section className="relative min-h-[60vh] sm:h-[65vh] w-full overflow-hidden bg-zinc-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient}`}
          >
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full h-full z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full items-center">
                {/* Left: Text Content */}
                <div className="py-12 lg:py-0">
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block text-xs font-bold tracking-widest text-brand-primary-300 uppercase mb-3 font-sans"
                  >
                    Featured Collection
                  </motion.span>
                  <motion.h1 
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-4 text-white leading-tight"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="font-sans text-sm sm:text-base lg:text-lg text-white/80 mb-8 max-w-lg"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.p>
                  <motion.div 
                    initial={{ y: 35, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link href={slides[currentSlide].link}>
                      <Button 
                        variant="ghost"
                        className="font-sans font-semibold rounded-xl border-2 border-white text-white bg-transparent hover:bg-white/10 px-7 sm:px-8 py-5 sm:py-6 text-sm sm:text-base cursor-pointer"
                      >
                        {slides[currentSlide].cta}
                      </Button>
                    </Link>
                  </motion.div>
                </div>

                {/* Right: Product Image */}
                <motion.div 
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.7 }}
                  className="hidden lg:flex items-center justify-center"
                >
                  <div className="relative w-full max-w-md xl:max-w-lg">
                    <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl" />
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="relative w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slider Controls */}
        <button 
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
        >
          <FiArrowLeft size={18} />
        </button>
        <button 
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors backdrop-blur-sm cursor-pointer"
        >
          <FiArrowRight size={18} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? "w-8 bg-brand-primary-500" : "w-2.5 bg-white/30"
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECTION 2: DEMOGRAPHICS CATEGORIES GRID */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-extrabold text-foreground mb-3">Shop by Category</h2>
          <p className="font-sans text-sm text-foreground/60">Tailored inventory curated across specialized e-commerce collections.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { name: "Men", tag: "men", desc: "Premium fashion & accessories", image: "/images/sunglasses_hero.jpg" },
            { name: "Women", tag: "women", desc: "Elegant styles & luxury pieces", image: "/images/watches_hero.jpg" },
            { name: "Gaming", tag: "gaming", desc: "High-performance gear & consoles", image: "/images/ps7.jpeg" },
            { name: "Gadgets", tag: "gadgets", desc: "Innovative tech & smart devices", image: "/images/drone.jpeg" }
          ].map((cat, idx) => (
            <Link key={idx} href={`/shop?category=${cat.tag}`} className="group relative h-80 rounded-2xl overflow-hidden shadow-md">
              <div 
                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6" style={{ contentVisibility: 'auto' }}>
                <h3 className="font-display text-2xl font-bold text-white mb-1">{cat.name}</h3>
                <p className="font-sans text-xs text-white/70 mb-4">{cat.desc}</p>
                <span className="font-sans text-xs font-semibold text-brand-primary-400 group-hover:underline">Explore Collection &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED PRODUCTS PREVIEW */}
      <section className="bg-card-bg border-y border-border-accent">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-extrabold text-foreground mb-3">Seasonal Highlights</h2>
            <p className="font-sans text-sm text-foreground/60">Take a look at this season's featured premium releases.</p>
          </div>
          
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <p className="text-center font-sans text-sm text-foreground/50 py-8">
              No featured products yet.
            </p>
          )}
        </div>
      </section>

      {/* SECTION 4: BRAND TRUST BADGES */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 w-full border-b border-border-accent">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: <FiTruck size={24} />, title: "Free Shipping", desc: "On all orders above $50" },
            { icon: <FiShield size={24} />, title: "Secure Checkout", desc: "100% encrypted stripe payments" },
            { icon: <FiAward size={24} />, title: "Authentic Quality", desc: "Genuine brand warranties" },
            { icon: <FiPhoneCall size={24} />, title: "24/7 Support", desc: "Dedicated e-commerce agents" }
          ].map((badge, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 mb-3">
                {badge.icon}
              </div>
              <h5 className="font-display text-sm font-bold text-foreground mb-1">{badge.title}</h5>
              <p className="font-sans text-[11px] text-foreground/50">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: PROMOTIONAL GRADIENT BANNER */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-primary-700 to-brand-secondary-700 text-white p-8 md:p-12 shadow-xl">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay"
            style={{ backgroundImage: `url('/images/gadgets_hero.jpg')` }}
          />
          <div className="relative max-w-lg z-10">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-brand-primary-300">Limited Offer</span>
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold mt-2 mb-4">Summer Catalog Inbound Up to 40% Off</h3>
            <p className="font-sans text-sm text-white/80 mb-6">
              Unlock exclusive deals on sunglasses, high-end watches, and electronic devices. Guaranteed authentic brand inventory.
            </p>
            <Link href="/shop">
              <Button className="bg-white hover:bg-zinc-100 text-brand-primary-700 font-sans font-semibold rounded-xl px-6 py-3 cursor-pointer shadow-md">
                Claim Offer
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ ACCORDION */}
      <section className="bg-card-bg border-y border-border-accent">
        <div className="mx-auto max-w-3xl py-16 w-full">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-extrabold text-foreground mb-2">Frequently Asked Questions</h2>
            <p className="font-sans text-sm text-foreground/60">Everything you need to know about NextMart catalog orders.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="rounded-2xl border border-border-accent bg-background overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left font-sans font-semibold text-foreground hover:text-brand-primary-500 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-foreground/50"
                    >
                      <FiChevronDown size={18} />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 pt-0 font-sans text-sm text-foreground/60 border-t border-border-accent/30 mt-1">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 7: NEWSLETTER SUBSCRIPTION PANEL */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center ">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-primary-700 to-brand-secondary-700 p-0.5 shadow-xl">
          <div className="rounded-3xl  p-8 sm:p-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-500/50  mx-auto mb-4">
              <FiMail size={22} className="text-white" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white mb-2">Subscribe to our Newsletter</h3>
            <p className="font-sans text-xs text-white/60 mb-6">
              Get the latest notifications on price drops, limited variations, and fresh arrivals delivered straight to your inbox.
            </p>
            
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="font-sans flex-1"
              />
              <Button
                type="submit"
                variant="secondary"
                className="font-sans font-semibold rounded-xl cursor-pointer py-6"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
