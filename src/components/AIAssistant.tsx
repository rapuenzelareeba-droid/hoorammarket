import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, X, Send, User, ChevronUp } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

// Smart Client-Side Fallback Generator when API is unreachable or on static host (Vercel/Netlify)
function generateSmartClientFallback(userMsg: string): string {
  const query = userMsg.toLowerCase();
  let reply = "Welcome to **HooramMarket**! I am your luxury AI Shopping Assistant.\n\nBased on our catalog, here is a curated selection for you:\n\n";

  if (query.includes('headphone') || query.includes('headset') || query.includes('sound') || query.includes('music') || query.includes('audio') || query.includes('ear')) {
    const headphone = INITIAL_PRODUCTS.find(p => p.id === 'prod-1') || INITIAL_PRODUCTS[0];
    reply += `🎧 **${headphone?.name}** ($${headphone?.price})\n- Features dynamic hybrid noise cancelling, lambskin memory cushion, and spatial acoustic clarity.\n\nWould you like to add this to your bag or inspect active discount codes?`;
  } else if (query.includes('watch') || query.includes('wearable') || query.includes('smartwatch')) {
    const watch = INITIAL_PRODUCTS.find(p => p.id === 'prod-2') || INITIAL_PRODUCTS[1];
    reply += `⌚ **${watch?.name}** ($${watch?.price})\n- A luxurious hybrid watch featuring mechanical hand dials combined with a transparent AMOLED biometric tracking screen.\n\nShall I help you proceed with an order?`;
  } else if (query.includes('espresso') || query.includes('coffee') || query.includes('brew') || query.includes('kitchen')) {
    const espresso = INITIAL_PRODUCTS.find(p => p.id === 'prod-5') || INITIAL_PRODUCTS[2];
    reply += `☕ **${espresso?.name}** ($${espresso?.price})\n- Calibrated to 0.1°C thermal stability with dual brass boilers for professional pressure profiling.\n\nYou can use coupon code \`HOORAM50\` for $50 off this brewer!`;
  } else if (query.includes('coupon') || query.includes('deal') || query.includes('discount') || query.includes('sale') || query.includes('code')) {
    reply += `🎟️ **Exclusive Active Promotions:**\n\n1. \`WELCOME20\` - **20% Off** orders above $50.\n2. \`HOORAM50\` - **$50 Off** luxury purchases above $200.\n3. \`SAVE10\` - **$10 Off** your $30+ orders.\n\nSimply input these codes inside your checkout drawer to claim instant reductions!`;
  } else if (query.includes('shoe') || query.includes('sneaker') || query.includes('footwear')) {
    const shoes = INITIAL_PRODUCTS.find(p => p.id === 'prod-6') || INITIAL_PRODUCTS[3];
    reply += `👟 **${shoes?.name}** ($${shoes?.price})\n- Engineered with zero-gravity nitrogen foam soles and recycled organic knit fabric for supreme comfort.\n\nWould you like to select your size in our storefront?`;
  } else {
    reply += `✨ **Bespoke Recommendations:**\n\n- 🎧 **Aether S9 Acoustic Headphones** ($349.99) - Dynamic spatial audio & noise isolation.\n- ☕ **Element-H6 Precision Espresso Brewer** ($649.99) - The gold standard of home brewing.\n- 🧥 **Nordic Studio Architectural Trench Coat** ($195.00) - Tailored organic fashion.\n\nUse coupon code **HOORAM50** at checkout for $50 off orders over $200! How else may I assist your shopping today?`;
  }

  return reply;
}

// Simple parsing helper to render bold text and bullet points from Markdown without requiring massive external libraries
function parseMarkdownToHTML(text: string) {
  // Replace double asterisks with bold tags
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-dark">$1</strong>');
  // Replace asterisks with bullet dots
  html = html.replace(/^\*\s(.*)$/gm, '<li class="ml-4 list-disc pl-1 text-gray-700 font-light mt-1">$1</li>');
  // Convert standard newlines to paragraph spacers
  html = html.split('\n').map((line) => {
    if (line.startsWith('<li')) return line;
    if (line.trim() === '') return '<div class="h-2"></div>';
    return `<p class="leading-relaxed text-gray-700 font-light text-xs py-0.5">${line}</p>`;
  }).join('');

  return <div dangerouslySetInnerHTML={{ __html: html }} className="space-y-1" />;
}

export default function AIAssistant({ isOpen, onClose, onOpen }: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to **HooramMarket**! I am your premium AI Concierge. Let me help you discover our high-end acoustic systems, custom luxury attire, or apply active coupons to your cart." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    const userText = textToSend.trim();
    if (!userText) return;

    setInput('');
    const newHistory = [...messages, { role: 'user' as const, content: userText }];
    setMessages(newHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHistory })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.content || generateSmartClientFallback(userText) }]);
      } else {
        // Fallback gracefully on static hosting (e.g. Vercel static without backend)
        const fallback = generateSmartClientFallback(userText);
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
      }
    } catch (e) {
      console.warn('Chat API route unavailable, using client AI advisor fallback:', e);
      const fallback = generateSmartClientFallback(userText);
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const SUGGESTIONS = [
    'Recommend active coupon codes',
    'What premium headsets do you have?',
    'Show me smart kitchen brewing appliances',
    'Do you have any custom shoes?'
  ];

  return (
    <>
      {/* Floating launcher bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onOpen}
            className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center border border-white/20 cursor-pointer"
            title="Chat with AI Assistant"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Chat Panel Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white border border-white/10">
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight">AI Concierge</h4>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-teal-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Neural Advisor Live</span>
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/10 rounded-full text-white cursor-pointer transition-colors"
                title="Close Advisor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Log (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      AI
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs border ${
                    m.role === 'user'
                      ? 'bg-primary text-white border-primary rounded-tr-none font-medium'
                      : 'bg-white text-dark border-gray-100 rounded-tl-none font-light'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="leading-relaxed text-xs">{m.content}</p>
                    ) : (
                      parseMarkdownToHTML(m.content)
                    )}
                  </div>
                </div>
              ))}

              {/* Thinker Spinner */}
              {loading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/15 text-primary flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                    AI
                  </div>
                  <div className="bg-white text-gray-500 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-2 text-xs font-mono space-y-1">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
                    </div>
                    <span className="text-[9px] text-gray-400 font-light">Consulting luxury registers...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions Drawer section */}
            <div className="px-3 py-2 border-t border-gray-50 bg-white/80 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSendMessage(s)}
                  className="px-2.5 py-1.5 bg-gray-50 hover:bg-primary/5 text-gray-500 hover:text-primary border border-gray-100 rounded-full text-[10px] font-semibold cursor-pointer transition-all flex-shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Form Input Footer */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white flex gap-2">
              <input
                type="text"
                placeholder="Ask about headsets, coffee, coupons..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 bg-primary hover:bg-dark disabled:bg-gray-200 text-white rounded-xl transition-all shadow-md cursor-pointer"
                title="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
