import { GoogleGenAI } from '@google/genai';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../src/data.js';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  const catalogSummary = INITIAL_PRODUCTS.map(p => 
    `- ${p.name} (Brand: ${p.brand}, Category: ${p.category}, Price: $${p.price}, Stock: ${p.stock})`
  ).join('\n');

  const couponSummary = INITIAL_COUPONS.map(c => 
    `- Code: ${c.code} (${c.description}, Min spend: $${c.minPurchase})`
  ).join('\n');

  const systemPrompt = `You are the highly advanced, sophisticated AI Shopping Assistant of HooramMarket.
Your purpose is to assist customers with product discovery, details, recommendations, and pricing.
=== HOORAMMARKET CATALOG ===
${catalogSummary}

=== ACTIVE STORE COUPONS ===
${couponSummary}`;

  const lastUserMsg = messages[messages.length - 1]?.content || 'Hello!';

  const generateFallbackResponse = () => {
    const query = lastUserMsg.toLowerCase();
    let reply = "Welcome to **HooramMarket**! I am your luxury AI Shopping Assistant.\n\nBased on our catalog, here is a curated selection for you:\n\n";

    if (query.includes('headphone') || query.includes('sound') || query.includes('music') || query.includes('audio') || query.includes('ear')) {
      const headphone = INITIAL_PRODUCTS.find(p => p.id === 'prod-1') || INITIAL_PRODUCTS[0];
      reply += `🎧 **${headphone?.name}** ($${headphone?.price})\n- Features dynamic hybrid noise cancelling and lambskin comfort. Perfect for focus or deep acoustic immersion.\n\nWould you like me to guide you to the checkout or show you active coupons?`;
    } else if (query.includes('watch') || query.includes('wearable') || query.includes('smartwatch')) {
      const watch = INITIAL_PRODUCTS.find(p => p.id === 'prod-2') || INITIAL_PRODUCTS[1];
      reply += `⌚ **${watch?.name}** ($${watch?.price})\n- A luxurious hybrid watch featuring standard hand dials combined with a transparent AMOLED biometric tracking screen.\n\nShall I add this masterpiece to your catalog inspection?`;
    } else if (query.includes('espresso') || query.includes('coffee') || query.includes('brew')) {
      const espresso = INITIAL_PRODUCTS.find(p => p.id === 'prod-5') || INITIAL_PRODUCTS[2];
      reply += `☕ **${espresso?.name}** ($${espresso?.price})\n- Calibrated to 0.1°C with professional pressure profiling, it elevates counter espresso to a pure scientific art form.\n\nLet me know if you would like to apply our \`HOORAM50\` coupon for an instant $50 discount!`;
    } else if (query.includes('coupon') || query.includes('deal') || query.includes('discount') || query.includes('sale')) {
      reply += `🎟️ **Exclusive Active Promotions:**\n\n1. \`WELCOME20\` - **20% Off** orders above $50.\n2. \`HOORAM50\` - **$50 Off** luxury purchases above $200.\n3. \`SAVE10\` - **$10 Off** your $30+ orders.\n\nSimply input these codes inside your checkout drawer to claim instant reductions!`;
    } else {
      reply += `✨ **Bespoke Recommendations:**\n\n- 🎧 **Aether S9 Acoustic Headphones** ($349.99) - Ultra-comfort, elite audio.\n- ☕ **Element-H6 Precision Espresso Brewer** ($649.99) - The absolute gold standard of home brewing.\n- 🧥 **Nordic Studio Architectural Trench Coat** ($195.00) - Tailored organic fashion.\n\nWhat lifestyle category are you looking to elevate today?`;
    }
    return reply;
  };

  try {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY' && key.trim() !== '') {
      const ai = new GoogleGenAI({ apiKey: key.trim() });
      const history = messages.slice(0, messages.length - 1).map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: lastUserMsg }] }
        ],
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });

      const reply = response.text || "I am currently polishing my recommendations. How can I help you discover something beautiful today?";
      return res.status(200).json({ content: reply });
    } else {
      return res.status(200).json({ content: generateFallbackResponse() });
    }
  } catch (err: any) {
    console.error('Vercel Chat API error:', err);
    return res.status(200).json({ content: generateFallbackResponse() });
  }
}
