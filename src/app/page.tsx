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

// Slider slides mock data
const slides = [
  {
    title: "Refined Vision",
    subtitle: "Explore our curated collection of premium designer sunglasses.",
    cta: "Shop Sunglasses",
    link: "/shop?category=sunglasses",
    image: "/images/sunglasses_hero.jpg",
    bgGradient: "from-zinc-900 to-zinc-950"
  },
  {
    title: "Next-Gen Tech",
    subtitle: "Innovative gadgets and portable devices designed for modern living.",
    cta: "Explore Gadgets",
    link: "/shop?category=gadgets",
    image: "/images/gadgets_hero.jpg",
    bgGradient: "from-slate-900 to-slate-950"
  },
  {
    title: "Timeless Precision",
    subtitle: "Luxury sports and casual watches crafted for elegance.",
    cta: "Browse Watches",
    link: "/shop?category=watches",
    image: "/images/watches_hero.jpg",
    bgGradient: "from-neutral-900 to-neutral-950"
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
  
  // Auto-rotate hero slider slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
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
      <section className="relative h-[65vh] w-full overflow-hidden bg-zinc-950 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient} flex items-center`}
          >
            {/* Slide Background Image Overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
              style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
            />
            
            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full z-10">
              <div className="max-w-2xl">
                <motion.span 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block text-xs font-bold tracking-widest text-brand-primary-400 uppercase mb-3 font-sans"
                >
                  Featured Collection
                </motion.span>
                <motion.h1 
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 text-white"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="font-sans text-base sm:text-lg text-white/80 mb-8"
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
                      variant="primary"
                      className="font-sans font-medium rounded-xl shadow-lg hover:shadow-brand-primary-500/25 px-8 py-6 cursor-pointer"
                    >
                      {slides[currentSlide].cta}
                    </Button>
                  </Link>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "Men", tag: "men", desc: "Premium gadgets & watches", image: "/images/sunglasses_hero.jpg" },
            { name: "Women", tag: "women", desc: "Sophisticated catalog designs", image: "/images/watches_hero.jpg" },
            { name: "Kids", tag: "kids", desc: "Compact electronics & accessories", image: "/images/gadgets_hero.jpg" }
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Aviator Gold", price: "$149.00", original: "$199.00", tag: "sunglasses", img: "/images/sunglasses_hero.jpg" },
              { title: "Sport Chronograph", price: "$299.00", original: "$399.00", tag: "watches", img: "/images/watches_hero.jpg" },
              { title: "True Wireless Earbuds", price: "$89.00", original: "$129.00", tag: "gadgets", img: "/images/gadgets_hero.jpg" }
            ].map((prod, idx) => (
              <div key={idx} className="group flex flex-col rounded-2xl bg-background border border-border-accent overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-60 overflow-hidden bg-zinc-100">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-102 transition-transform duration-500"
                    style={{ backgroundImage: `url(${prod.img})` }}
                  />
                  <span className="absolute top-4 left-4 bg-brand-primary-500 text-white font-sans text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Sale
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="font-sans text-[10px] text-brand-primary-500 font-bold uppercase mb-1">{prod.tag}</span>
                  <h4 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-brand-primary-500 transition-colors">
                    {prod.title}
                  </h4>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-sans text-base font-bold text-foreground">{prod.price}</span>
                    <span className="font-sans text-xs text-foreground/45 line-through">{prod.original}</span>
                  </div>
                  <Link href={`/shop`} className="mt-auto">
                    <Button variant="secondary" className="w-full font-sans font-medium rounded-xl cursor-pointer">
                      View Catalog
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
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
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-primary-700 to-indigo-900 text-white p-8 md:p-12 shadow-xl">
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
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 w-full">
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
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full text-center">
        <div className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border border-border-accent bg-background shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary-500/10 text-brand-primary-600 dark:text-brand-primary-400 mx-auto mb-4">
            <FiMail size={22} />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">Subscribe to our Newsletter</h3>
          <p className="font-sans text-xs text-foreground/60 mb-6">
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
      </section>

    </div>
  );
}
