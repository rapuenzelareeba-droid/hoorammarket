import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Crown, Gift, Percent, Compass, CheckCircle2, Copy } from 'lucide-react';

export default function VipClubPage() {
  const [points, setPoints] = useState(2450);
  const [claimedReward, setClaimedReward] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const VIP_COUPONS = [
    { code: 'HOORAM30', discount: '30% OFF', desc: 'Saves 30% on all orders above $100. Ultimate premium loyalty discount.', minSpend: 100 },
    { code: 'HOORAM50', discount: '$50 FLAT', desc: 'Flat $50 off on purchases above $200. Ideal for luxury audio or espresso appliances.', minSpend: 200 },
    { code: 'WELCOME20', discount: '20% OFF', desc: 'Welcome bonus code for newly registered premium users.', minSpend: 50 },
  ];

  const handleClaimReward = (rewardName: string, cost: number) => {
    if (points >= cost) {
      setPoints(prev => prev - cost);
      setClaimedReward(rewardName);
      setTimeout(() => setClaimedReward(null), 3500);
    } else {
      alert("Insufficient points. Discover more collections to accumulate additional premium points!");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-12 py-4">
      {/* VIP Status Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-tr from-dark via-gray-900 to-indigo-950 text-white p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 border border-white/10">
        
        {/* Left Side: Status */}
        <div className="space-y-4 text-center md:text-left z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-400/30 text-[10px] font-semibold uppercase tracking-widest">
            <Crown className="w-3.5 h-3.5 fill-amber-400/20" /> Diamond Elite Member
          </span>
          <div className="space-y-1">
            <h1 className="font-display font-bold text-3xl md:text-4xl tracking-tight">Hooram VIP Club</h1>
            <p className="text-gray-300 font-light text-xs md:text-sm">
              Your loyalty index is computed at standard luxury levels.
            </p>
          </div>
          <div className="flex gap-4 pt-2 justify-center md:justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/5 text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Available Balance</span>
              <span className="text-xl font-bold font-mono text-primary">{points} pts</span>
            </div>
            <div className="bg-white/10 rounded-2xl px-4 py-2 border border-white/5 text-center">
              <span className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider">Next Tier Reward</span>
              <span className="text-xl font-bold font-mono text-amber-400">3,000 pts</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Badge */}
        <div className="relative flex items-center justify-center w-36 h-36 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-inner shrink-0">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-dashed border-primary/20"
          />
          <Crown className="w-16 h-16 text-amber-400 animate-pulse" />
        </div>
      </div>

      {/* Success Notification for Claimed Rewards */}
      <AnimatePresence>
        {claimedReward && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs rounded-2xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Claim Successful!</span> Your rewards code has been sent to your registered concierge profile for: <span className="underline font-semibold">{claimedReward}</span>.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* VIP Loyalty Rewards points claim */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-dark tracking-tight">Claim Premium Gifts</h2>
            <p className="text-[11px] text-gray-400">Redeem your available points balance for instant luxury upgrades.</p>
          </div>

          <div className="space-y-4">
            {/* Reward 1 */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:border-gray-100 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <span className="text-2xl">📦</span>
                <div>
                  <h4 className="font-bold text-xs text-dark">Complimentary Express Courier Shipping</h4>
                  <p className="text-[10px] text-gray-400">Normally $25. Fully insured premium overnight delivery.</p>
                </div>
              </div>
              <button
                onClick={() => handleClaimReward("Complimentary Express Shipping", 300)}
                disabled={points < 300}
                className="px-3 py-1.5 bg-primary disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-full text-[10px] font-bold cursor-pointer transition-all"
              >
                300 pts
              </button>
            </div>

            {/* Reward 2 */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:border-gray-100 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <span className="text-2xl">🎁</span>
                <div>
                  <h4 className="font-bold text-xs text-dark">Custom Artisan Gift Wrapping</h4>
                  <p className="text-[10px] text-gray-400">Premium heavy cardboard box with a custom gold wax seal.</p>
                </div>
              </div>
              <button
                onClick={() => handleClaimReward("Custom Artisan Gift Wrapping", 500)}
                disabled={points < 500}
                className="px-3 py-1.5 bg-primary disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-full text-[10px] font-bold cursor-pointer transition-all"
              >
                500 pts
              </button>
            </div>

            {/* Reward 3 */}
            <div className="p-4 border border-gray-50 rounded-2xl hover:border-gray-100 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <span className="text-2xl">🎟️</span>
                <div>
                  <h4 className="font-bold text-xs text-dark">Extra $100 Direct Voucher</h4>
                  <p className="text-[10px] text-gray-400">Grants flat $100 off on any purchase with zero minimum spend.</p>
                </div>
              </div>
              <button
                onClick={() => handleClaimReward("Extra $100 Direct Voucher", 1500)}
                disabled={points < 1500}
                className="px-3 py-1.5 bg-primary disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-full text-[10px] font-bold cursor-pointer transition-all"
              >
                1500 pts
              </button>
            </div>
          </div>
        </div>

        {/* Active VIP Coupons */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-dark tracking-tight">Active VIP Coupons</h2>
            <p className="text-[11px] text-gray-400">These elite promotional keys are automatically available for your account.</p>
          </div>

          <div className="space-y-4">
            {VIP_COUPONS.map((coupon) => (
              <div key={coupon.code} className="p-4 bg-gray-50/40 border border-gray-100 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded border border-primary/20">
                      {coupon.code}
                    </span>
                    <span className="text-xs font-bold text-dark font-display">{coupon.discount}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-light">{coupon.desc}</p>
                  <p className="text-[9px] text-gray-400 font-mono">Min spend: ${coupon.minSpend}</p>
                </div>

                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="p-2.5 bg-white hover:bg-primary/5 text-gray-500 hover:text-primary rounded-xl border border-gray-100 transition-colors cursor-pointer flex-shrink-0"
                  title="Copy Code"
                >
                  {copiedCode === coupon.code ? (
                    <span className="text-[9px] font-mono text-emerald-600 font-bold">Copied!</span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
