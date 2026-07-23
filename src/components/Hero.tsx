import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

const HERO_SLIDES = [
  {
    title: 'Precision Acoustics. Absolute Silence.',
    subtitle: 'THE AETHER S9 SERIES',
    description: 'Aircraft-grade aluminum paired with lambskin leather casing, housing hybrid acoustic active noise cancellation technology.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200',
    color: '#215E61',
    cta: 'Discover Sonic Artistry',
    link: 'electronics'
  },
  {
    title: 'Structured Nordics, Fluid Silhouettes.',
    subtitle: 'THE AUTUMN / SUMMER BLEND',
    description: 'Individually tailored trench coats crafted with Belgian-sourced organic flax linen and weather-proof organic cotton weave.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200',
    color: '#B5945B',
    cta: 'Explore Apparel',
    link: 'fashion'
  },
  {
    title: 'The Counter-Top Espresso Laboratory.',
    subtitle: 'THE PRECISION ELEMENT-H6',
    description: 'Commercial-grade dual boilers calibrated to 0.1°C with complete real-time digital extraction profiling up to 9 bars.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&q=80&w=1200',
    color: '#1D2128',
    cta: 'Upgrade Your Brew',
    link: 'home'
  }
];

interface HeroProps {
  onExplore: (category: string) => void;
}

export default function Hero({ onExplore }: HeroProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <div className="relative w-full h-[460px] md:h-[520px] bg-dark overflow-hidden rounded-3xl shadow-2xl">
      {/* Slides Background Image with Fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0.3, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_SLIDES[current].image})` }}
        >
          {/* Overlay gradient to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/75 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Sparkle / Active Badge */}
      <div className="absolute top-6 left-6 z-10 hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-xs text-white uppercase font-mono tracking-widest">
        <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
        <span>Curated Luxury Catalog</span>
      </div>

      {/* Slide Text Content */}
      <div className="absolute inset-y-0 left-0 z-10 flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-2xl text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <span className="font-mono text-xs tracking-widest text-primary bg-primary/20 backdrop-blur-sm border border-primary/20 px-3 py-1 rounded-full inline-block">
              {HERO_SLIDES[current].subtitle}
            </span>
            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight tracking-tight">
              {HERO_SLIDES[current].title}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed">
              {HERO_SLIDES[current].description}
            </p>
            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onExplore(HERO_SLIDES[current].link)}
                className="flex items-center gap-2 px-6 py-3.5 bg-primary hover:bg-opacity-90 text-white rounded-full text-sm font-medium shadow-xl shadow-primary/20 cursor-pointer"
              >
                <span>{HERO_SLIDES[current].cta}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Left/Right Controls */}
      <button
        onClick={handlePrev}
        className="absolute bottom-6 right-20 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
        title="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={handleNext}
        className="absolute bottom-6 right-6 z-20 p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
        title="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex gap-2">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${idx === current ? 'w-8 bg-primary' : 'w-2.5 bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
}
