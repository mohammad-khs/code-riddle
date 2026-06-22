import React from "react";
import Image from "next/image";

import mailSvg from "@/public/assets/images/mail.svg";
import musicSvg from "@/public/assets/images/music.svg";
import giftSvg from "@/public/assets/images/gift.svg";

const steps = [
  {
    id: 1,
    title: "Choose Your Path",
    description:
      "First, decide what you want to create: a simple heartfelt letter, a challenging multi-step puzzle, or a secret encrypted message. Pick your preferred template to start.",
    icon: mailSvg,
    color: "from-blue-600 to-sky-400",
  },
  {
    id: 2,
    title: "Customize & Add Magic",
    description:
      "Now it’s time to get creative! Edit your text with our Word-like editor, change the background, and upload your own audio or choose from our music library to set the perfect mood.",
    icon: musicSvg,
    color: "from-indigo-500 to-blue-500",
  },
  {
    id: 3,
    title: "Set the Prize & Share",
    description:
      "Plan a surprise for the end of the journey! It could be a congratulatory message, a download link, or a gift code. Generate your unique link and share it with your friends.",
    icon: giftSvg,
    color: "from-amber-500 to-orange-400",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden border-t border-slate-900/50">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50">
            Create a Unique Experience
            <br className="hidden md:block mt-2" /> in Just 3 Simple Steps
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            No technical skills required; you bring the creativity, we provide
            the tools.
          </p>
        </div>

        <div className="relative">
          {/* خط تایم‌لاین با طیف رنگی سورمه‌ای-آبی */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-indigo-500/50 to-amber-500/50 transform md:-translate-x-1/2 rounded-full"></div>

          <div className="space-y-24 md:space-y-32 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={step.id}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? "md:flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-full md:w-1/2 pl-24 md:pl-0 ${isEven ? "md:text-left" : "md:text-right"}`}
                  >
                    <span className="text-sm font-bold tracking-widest uppercase text-blue-400 mb-3 block">
                      Step {step.id}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>

                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 pl-24 md:pl-0 flex justify-center">
                    <div
                      className={`relative w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-gradient-to-br ${step.color} p-[2px] shadow-2xl transition-transform hover:scale-105 duration-300`}
                    >
                      <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center relative overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10`}
                        ></div>
                        <div className="relative z-10 w-20 h-20 md:w-28 md:h-28">
                          <Image
                            src={step.icon}
                            alt={step.title}
                            fill
                            className="object-contain drop-shadow-2xl"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
