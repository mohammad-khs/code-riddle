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
    <div
      style={backgroundStyle}
      className="h-svh flex justify-center items-center fixed top-0 left-0 w-full"
    >
      <section className="max-w-3xl mx-6 sm:mx-auto overflow-y-scroll h-[500px] bg-black/30 backdrop-blur-sm dark:border-slate-700 rounded-lg p-6">
        <div
          dir="rtl"
          className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 text-lg"
        >
          {prize.letter}
        </div>
      </section>

      {prize.music && (
        <MusicControlButton
          isPlaying={isPlaying}
          onToggle={onTogglePlay}
          label={isPlaying ? "Pause music" : "Play music"}
        />
      )}
    </div>
  );
}
