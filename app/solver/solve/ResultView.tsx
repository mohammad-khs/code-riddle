import MusicControlButton from "@/app/components/ui/MusicControlButton";
import { Prize } from "@/types/solver-solve";

interface ResultViewProps {
  prize: Prize;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export default function ResultView({
  prize,
  isPlaying,
  onTogglePlay,
}: ResultViewProps) {
  const backgroundStyle = prize.backgroundImage
    ? {
        backgroundImage: `url(${prize.backgroundImage})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : {};

  return (
    <>
      <div
        style={backgroundStyle}
        className="flex min-h-dvh w-full max-w-[1080px] items-start justify-center bg-slate-950/95 px-6 pt-12"
      >
        <section className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
          <header className="border-b border-slate-800 pb-4 mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
              Congratulations
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-50">
              You Solved It!
            </h2>
          </header>

          {prize.letter && (
            <div className="max-h-[400px] overflow-y-auto">
              <p className="whitespace-pre-wrap text-slate-300 text-lg leading-relaxed">
                {prize.letter}
              </p>
            </div>
          )}
        </section>
      </div>

      {prize.music && (
        <MusicControlButton
          isPlaying={isPlaying}
          onToggle={onTogglePlay}
          label={isPlaying ? "Pause prize music" : "Play prize music"}
        />
      )}
    </>
  );
}