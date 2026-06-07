

export default function Pricing() {
  return (
    <section className="relative py-24 bg-slate-950 overflow-hidden font-sans border-t border-slate-900">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50">
            Limitless Creativity.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Craft Bigger Surprises!
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Break the limits by upgrading your account. Create a fully
            personalized, professional, and ad-free experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {/* Basic */}
          <div className="relative group rounded-3xl p-[2px] overflow-hidden border border-white/10 bg-slate-800">
            {/* گرادیانت متحرک حاشیه نقره‌ای (شروع از بالا سمت چپ ~ 315deg) */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_315deg,transparent_0_340deg,#cbd5e1_360deg)] animate-[spin_3s_linear_infinite]" />

            <div className="relative flex flex-col h-full bg-slate-900 rounded-[22px] p-10 z-10">
              <h3 className="text-2xl font-bold text-slate-200 mb-2">Basic</h3>
              <p className="text-sm text-slate-400 mb-6">Free Forever</p>

              <div className="text-5xl font-black text-white mb-8">$0</div>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-center text-slate-300">
                  <span className="mr-3 text-emerald-400">✓</span> Create basic
                  puzzles
                </li>
                <li className="flex items-center text-slate-300">
                  <span className="mr-3 text-emerald-400">✓</span> 3 default
                  backgrounds
                </li>
                <li className="flex items-center text-slate-600">
                  <span className="mr-3">✕</span> Upload custom music
                </li>
                <li className="flex items-center text-slate-600">
                  <span className="mr-3">✕</span> Remove watermark
                </li>
              </ul>

              <button className="w-full py-4 px-6 rounded-xl font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 relative overflow-hidden">
                Start for Free
              </button>
            </div>
          </div>

          {/* Professional */}
          <div className="relative group rounded-3xl p-[2px] overflow-hidden border border-amber-400/40 bg-slate-800 shadow-[0_0_50px_rgba(245,158,11,0.15)]">
            {/* گرادیانت متحرک حاشیه طلایی (شروع از پایین سمت راست ~ 135deg) */}
            <div className="absolute inset-[-100%] bg-[conic-gradient(from_135deg,transparent_0_340deg,#fcd340_360deg)] animate-[spin_3s_linear_infinite]" />

            <div className="relative flex flex-col h-full bg-slate-900 rounded-[22px] p-10 z-10">
              <div className="absolute top-0 right-8 transform -translate-y-1/4">
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl rounded-t-none uppercase tracking-widest shadow-lg">
                  Recommended
                </span>
              </div>

              <h3 className="text-2xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                Professional
              </h3>
              <p className="text-sm text-slate-400 mb-6">Premium Experience</p>

              <div className="text-5xl font-black text-white mb-8 flex items-baseline gap-1">
                $4.99{" "}
                <span className="text-lg text-slate-400 font-medium">
                  / month
                </span>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                <li className="flex items-start text-slate-200">
                  <span className="mr-3 mt-1 text-amber-400">✦</span>
                  <span>
                    <strong>Upload Custom Music</strong> (Nostalgic vibes)
                  </span>
                </li>
                <li className="flex items-start text-slate-200">
                  <span className="mr-3 mt-1 text-amber-400">✦</span>
                  <span>
                    <strong>Unlimited</strong> animated backgrounds
                  </span>
                </li>
                <li className="flex items-start text-slate-200">
                  <span className="mr-3 mt-1 text-amber-400">✦</span>
                  <span>
                    <strong>No Watermarks</strong> (Make it truly yours)
                  </span>
                </li>
                <li className="flex items-start text-slate-200">
                  <span className="mr-3 mt-1 text-amber-400">✦</span>
                  <span>
                    <strong>Live Analytics & Advanced Locks</strong>
                  </span>
                </li>
              </ul>

              <button className="w-full py-4 px-6 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-1">
                Upgrade to Professional
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
