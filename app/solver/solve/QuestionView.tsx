import { Button } from "@/app/components/ui/button";
import MusicControlButton from "@/app/components/ui/MusicControlButton";
import { Riddle } from "@/types/solver-solve";

interface QuestionViewProps {
  riddle: Riddle;
  totalRiddles: number;
  currentAnswer: string;
  feedback: string;
  isLoading: boolean;
  mainMusicPlaying: boolean;
  mainMusic: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onToggleMainMusic: () => void;
}

export default function QuestionView({
  riddle,
  totalRiddles,
  currentAnswer,
  feedback,
  isLoading,
  mainMusicPlaying,
  onAnswerChange,
  onSubmit,
  onToggleMainMusic,
  mainMusic,
}: QuestionViewProps) {
  const isFeedbackCorrect = feedback.startsWith("✓");

  return (
    <>
      <section className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
        <header className="border-b border-slate-800 pb-4 mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
            Question
          </p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-50">
            Riddle {totalRiddles}
          </h2>
        </header>

        {riddle.media && (
          <div className="mb-6 aspect-video w-full overflow-hidden rounded-xl border border-slate-700">
            {riddle.mediaType === "video" ? (
              <video
                src={riddle.media}
                className="h-full w-full object-cover"
                controls
              />
            ) : (
              <img
                src={riddle.media}
                alt="Riddle visual"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        )}

        <div className="mb-6">
          <p className="text-slate-300 text-lg leading-relaxed">{riddle.question}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              value={currentAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Enter your answer here"
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition-all"
              autoFocus
              aria-label="answer input"
            />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              variant={"green"}
              disabled={isLoading}
              aria-label="submit answer"
            >
              {isLoading ? "Submitting..." : "Submit Answer"}
            </Button>

            {feedback && (
              <div
                className={`text-lg font-semibold transition-colors ${
                  isFeedbackCorrect ? "text-emerald-400" : "text-rose-400"
                }`}
                role="status"
                aria-live="polite"
              >
                {feedback}
              </div>
            )}
          </div>
        </form>
      </section>

      {mainMusic && (
        <MusicControlButton
          isPlaying={mainMusicPlaying}
          onToggle={onToggleMainMusic}
          label={mainMusicPlaying ? "Pause background music" : "Play background music"}
        />
      )}
    </>
  );
}