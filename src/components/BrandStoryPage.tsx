import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Heart, Eye, Award } from 'lucide-react';

export default function BrandStoryPage() {
  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-dark text-white p-8 md:p-16 flex flex-col justify-center min-h-[340px] shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/95 to-transparent" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" /> Our Heritage
          </span>
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight leading-tight">
            The Philosophy of <span className="text-primary font-light">HooramMarket</span>
          </h1>
          <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed">
            Born out of a desire for uncompromising precision, HooramMarket brings together elite acoustics, handcrafted slow fashion, and advanced wellness tech into a singular cohesive lifestyle canvas.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars of Hooram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Pillar 1 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
            🔊
          </div>
          <h3 className="font-display font-bold text-lg text-dark">Acoustic Science</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            We partner with legacy acoustic labs to engineer micro-acoustic systems. From composite lambskin earcups to titanium diaphragms, our speaker series delivers high-fidelity sound exactly as recorded.
          </p>
        </motion.div>

        {/* Pillar 2 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            🧥
          </div>
          <h3 className="font-display font-bold text-lg text-dark">Slow Fashion</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            We reject the disposable nature of fast apparel. Every trench coat, knit sweater, and footwear piece from our collections is constructed from biodegradable materials—including pure Mongolian cashmere and Belgian linen.
          </p>
        </motion.div>

        {/* Pillar 3 */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            🧘
          </div>
          <h3 className="font-display font-bold text-lg text-dark">Wellness Technology</h3>
          <p className="text-xs text-gray-500 leading-relaxed font-light">
            Our wellness products are calibrated around human homeostasis. By incorporating circadian wave patterns, air ionization, and thermal profiling, we elevate standard sleep and daily work habits into active health metrics.
          </p>
        </motion.div>
      </div>

      {/* Creative Timeline / Detail Section */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display font-bold text-2xl text-dark tracking-tight">Our Zero-Compromise Pledges</h2>
            <p className="text-xs text-gray-400">Standardized across all our manufacturing and design hubs.</p>
          </div>

          <div className="space-y-4 font-light text-xs text-gray-600">
            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
              <div>
                <h4 className="font-semibold text-dark text-sm">Carbon-Balanced Freight</h4>
                <p className="leading-relaxed text-gray-500 mt-0.5">Every international cargo transit is paired with direct reforestation and ocean coral restoration contributions.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
              <div>
                <h4 className="font-semibold text-dark text-sm">Fair Artisan Renovation</h4>
                <p className="leading-relaxed text-gray-500 mt-0.5">We buy direct from family-operated weavers in Sweden and Piedmont, ensuring they get paid standard liveable luxury premiums.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
              <div>
                <h4 className="font-semibold text-dark text-sm">Fully Persistent Design</h4>
                <p className="leading-relaxed text-gray-500 mt-0.5">We build products with fully serviceable components, removable batteries, and modular cables so they last a lifetime.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl overflow-hidden aspect-video lg:aspect-square shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600" 
            alt="Artisan Workspace" 
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-primary/10" />
        </div>
      </div>
    </div>
  );
}
