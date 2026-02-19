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
}: QuestionViewProps) {
  const isFeedbackCorrect = feedback.startsWith("✓");

  return (
    <div className="relative" dir="rtl">
      <section className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          سوال {totalRiddles}
        </h2>
        <div className="mb-4 text-slate-700 dark:text-slate-200">
          {riddle.question}
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <input
            value={currentAnswer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="پاسخ خود را اینجا وارد کنید"
            disabled={isLoading}
            className="mt-1 w-full rounded-md border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 disabled:opacity-50"
            autoFocus
            aria-label="answer input"
          />
          <div>
            <Button
              type="submit"
              variant={"green"}
              disabled={isLoading}
              aria-label="submit answer"
            >
              ثبت پاسخ
            </Button>
          </div>
        </form>
        {feedback && (
          <div
            className={`mt-4 text-lg font-semibold transition-colors ${
              isFeedbackCorrect ? "text-green-600" : "text-red-600"
            }`}
            role="status"
            aria-live="polite"
          >
            {feedback}
          </div>
        )}
      </section>

      <MusicControlButton
        isPlaying={mainMusicPlaying}
        onToggle={onToggleMainMusic}
        label={mainMusicPlaying ? "Pause main music" : "Play main music"}
      />
    </div>
  );
}
