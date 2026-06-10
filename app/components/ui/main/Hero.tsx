import Link from "next/link";
import Image from "next/image";

import giftSvg from "@/public/assets/images/gift.svg";
import starSvg from "@/public/assets/images/star.svg";
import musicSvg from "@/public/assets/images/music.svg";
import mailSvg from "@/public/assets/images/mail.svg";
import heartSvg from "@/public/assets/images/heart.svg";
import casteSvg from "@/public/assets/images/caste.svg";
import rocketSvg from "@/public/assets/images/rocket.svg";
import pictureSvg from "@/public/assets/images/picture.svg";

export default function Hero() {
  const icons = [
    { src: giftSvg, alt: "gift" },
    { src: starSvg, alt: "star" },
    { src: musicSvg, alt: "music" },
    { src: mailSvg, alt: "mail" },
    { src: heartSvg, alt: "heart" },
    { src: casteSvg, alt: "caste" },
    { src: rocketSvg, alt: "rocket" },
    { src: pictureSvg, alt: "picture" },
  ];

  const orbitDuration = 24;
  const delayStep = orbitDuration / icons.length;

  return (
    <section className="min-h-[90vh] flex flex-col justify-center items-center text-center p-8 relative">
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes counter-orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
        @keyframes float-pulse {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.4));
          }
          50% { 
            transform: translateY(-8px) scale(1.15); 
            filter: drop-shadow(0 0 16px rgba(59, 130, 246, 0.8));
          }
        }
      `}</style>

      {/* افکت نوری پس‌زمینه (Glow Effect) برای القای حس جادویی */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-12">
        <div className="flex-1 text-center md:text-left space-y-6 z-10">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold tracking-wide mb-2">
            ✨ An Unforgettable Experience
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-50">
            Don’t Just Send a Message.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
              Create an Adventure!
            </span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
            Turn a simple greeting into an exciting letter or a mysterious
            riddle. Combine text, music, and rewards to blow your friends’ minds
            with an interactive experience.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <Link
              href="/creator/register"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
            >
              Craft Your Mystery
            </Link>
            <Link
              href="/solver/login"
              className="inline-block bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1"
            >
              Dive into Puzzles
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center mt-10 md:mt-0 z-10">
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border border-slate-800/80 bg-slate-900/30 backdrop-blur-sm">
            {icons.map((icon, index) => {
              const delay = `-${index * delayStep}s`;
              return (
                <div
                  key={index}
                  className="absolute inset-0 origin-center"
                  style={{
                    animation: `orbit ${orbitDuration}s linear infinite`,
                    animationDelay: delay,
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div
                      style={{
                        animation: `counter-orbit ${orbitDuration}s linear infinite`,
                        animationDelay: delay,
                      }}
                    >
                      <div
                        style={{
                          animation: "float-pulse 3s ease-in-out infinite",
                          animationDelay: `${index * 0.3}s`,
                        }}
                      >
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-full shadow-lg hover:bg-slate-700 transition-colors cursor-pointer">
                          <Image
                            src={icon.src}
                            alt={icon.alt}
                            width={32}
                            height={32}
                            className="w-8 h-8 md:w-10 md:h-10 opacity-90"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-blue-600/10 border border-blue-500/30 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.2)] backdrop-blur-md">
              <span className="text-blue-400 font-black text-3xl tracking-widest animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
