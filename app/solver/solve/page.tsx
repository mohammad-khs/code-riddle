"use client";
import { useEffect, useRef, useState } from "react";

export default function SolverSolve() {
  const [riddles, setRiddles] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mainMusic, setMainMusic] = useState("");
  const [isMainPlaying, setIsMainPlaying] = useState(false);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Get solver username from localStorage
    const solver =
      localStorage.getItem("username") || localStorage.getItem("solver") || "";
    if (!solver) return;
    fetch(`/api/riddles?solver=${encodeURIComponent(solver)}`)
      .then((r) => r.json())
      .then((d) => {
        setRiddles(d.riddles || []);
        setMainMusic(d.mainMusic || "");
      })
      .catch(() => {});
  }, []);

  function submitAnswer(e: any) {
    e.preventDefault();
    setFeedback("");

    // Check if current answer is correct
    const currentRiddle = riddles[index];
    const userAnswer = currentAnswer.trim().toLowerCase();
    const correctAnswer = (currentRiddle.answer || "")
      .toString()
      .trim()
      .toLowerCase();

    if (userAnswer === correctAnswer) {
      // Answer is correct
      const nextAnswers = [...answers];
      nextAnswers[index] = currentAnswer;
      setAnswers(nextAnswers);
      setCurrentAnswer("");
      setFeedback("✓ Correct!");

      // Move to next riddle or finish
      setTimeout(() => {
        if (index + 1 < riddles.length) {
          setIndex(index + 1);
          setFeedback("");
        } else {
          // All riddles completed
          finish(nextAnswers);
        }
      }, 800);
    } else {
      // Answer is incorrect
      setFeedback("✗ Incorrect. Try again.");
    }
  }

  async function finish(ans: string[]) {
    const solver =
      localStorage.getItem("username") || localStorage.getItem("solver") || "";
    if (!solver) return;
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solver, answers: ans }),
    });
    const j = await res.json();
    setResult(j);
  }

  useEffect(() => {
    // when main music is set, try to autoplay
    if (mainMusic && mainAudioRef.current) {
      try {
        mainAudioRef.current.src = mainMusic;
        mainAudioRef.current.loop = true;
        const p = mainAudioRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => setIsMainPlaying(true)).catch(() =>
            setIsMainPlaying(false)
          );
        }
      } catch (e) {
        // ignore autoplay errors
      }
    }
  }, [mainMusic]);

  useEffect(() => {
    // when prize arrives and has music, try to autoplay and pause main music
    if (result && result.success && result.prize && result.prize.music) {
      try {
        if (mainAudioRef.current && isMainPlaying) {
          mainAudioRef.current.pause();
          setIsMainPlaying(false);
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = result.prize.music;
          const p = audioRef.current.play();
          if (p && typeof p.then === "function") {
            p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        }
      } catch (e) {
        // ignore autoplay errors
      }
    }
  }, [result, isMainPlaying]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }

  function toggleMainPlay() {
    if (!mainAudioRef.current) return;
    if (isMainPlaying) {
      mainAudioRef.current.pause();
      setIsMainPlaying(false);
    } else {
      mainAudioRef.current
        .play()
        .then(() => setIsMainPlaying(true))
        .catch(() => setIsMainPlaying(false));
    }
  }

  if (result && result.success) {
    return (
      <div className="relative">
        <section className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
            Congratulations!
          </h2>
          <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 text-lg">
            {result.prize.letter}
          </div>
        </section>

        {/* hidden audio element - controls hidden */}
        {result.prize.music && (
          <audio ref={audioRef} src={result.prize.music} className="hidden" />
        )}

        {/* floating play/pause control at bottom-right */}
        {result.prize.music && (
          <div className="fixed right-4 bottom-4 z-50">
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow"
            >
              <span className="sr-only">
                {isPlaying ? "Pause music" : "Play music"}
              </span>
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-900 dark:text-slate-100"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-900 dark:text-slate-100"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 3v18l15-9L5 3z" />
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!riddles || riddles.length === 0) {
    return <div className="max-w-3xl mx-auto p-6">No riddles available.</div>;
  }

  const item = riddles[index];

  return (
    <div className="relative">
      <section className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
          Riddle {index + 1} of {riddles.length}
        </h2>
        <div className="mb-4 text-slate-700 dark:text-slate-200">
          {item.question}
        </div>
        <form onSubmit={submitAnswer} className="space-y-3">
          <input
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Your answer"
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          />
          <div>
            <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md">
              Submit
            </button>
          </div>
        </form>
        {feedback && (
          <div
            className={`mt-4 text-lg font-semibold ${
              feedback.startsWith("✓") ? "text-green-600" : "text-red-600"
            }`}
          >
            {feedback}
          </div>
        )}
      </section>

      {/* hidden main audio element */}
      {mainMusic && <audio ref={mainAudioRef} className="hidden" />}

      {/* floating play/pause control for main music at bottom-left */}
      {mainMusic && (
        <div className="fixed left-4 bottom-4 z-50">
          <button
            onClick={toggleMainPlay}
            className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow"
          >
            <span className="sr-only">
              {isMainPlaying ? "Pause main music" : "Play main music"}
            </span>
            {isMainPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-slate-900 dark:text-slate-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-slate-900 dark:text-slate-100"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 3v18l15-9L5 3z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
