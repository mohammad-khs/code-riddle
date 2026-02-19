"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/app/components/ui/Loader";
import QuestionView from "./QuestionView";
import ResultView from "./ResultView";
import { Riddle, Prize } from "@/types/solver-solve";

export default function SolverSolve() {
  // too much useStates in a single component
  // local storage problem
  // add an optimized component / function to handle audio
  // too many useEffects
  // add a universal fetcher
  // use next form for database update and auth
  // not using types correctly
  // there cannot be main music which is riddle music and no riddles 
  const router = useRouter();

  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [result, setResult] = useState<Prize | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [mainMusic, setMainMusic] = useState("");
  const [isMainPlaying, setIsMainPlaying] = useState(false);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const [answerLoading, setAnswerLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate session with the server
    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid || data.user.role !== "solver") {
          router.push("/solver/login");
          return;
        }
        setUsername(data.user.username);
        // Get creatorUsername from validate response
        if (data.user.creatorUsername) {
          setCreatorUsername(data.user.creatorUsername);
        }
        setAuthorized(true);
        setIsLoading(false);
      })
      .catch(() => {
        router.push("/solver/login");
      });
  }, [router]);

  useEffect(() => {
    if (!authorized || !username || !creatorUsername) return;
    // Fetch riddles for this solver, scoped to the correct creator
    fetch(
      `/api/riddles?solver=${encodeURIComponent(username)}&creator=${encodeURIComponent(creatorUsername)}`,
    )
      .then((r) => r.json())
      .then((d) => {
        const riddleSet = d.riddleSet || {};
        const riddleList = riddleSet.riddles || [];
        setRiddles(riddleList);
        setMainMusic(riddleSet.mainprizeMusic || "");
        // If no riddles, fetch the prize directly
        if (riddleList.length === 0) {
          finish([]);
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => {});        
      setIsLoading(false);
  }, [authorized, username, creatorUsername]);

  function submitAnswer(e: any) {
    e.preventDefault();
    setFeedback("");
    setAnswerLoading(true);
    // Check if current answer is correct
    const currentRiddle = riddles[index];
    const userAnswer = currentAnswer.trim().toLowerCase();
    const correctAnswer = (currentRiddle.answer || "")
      .toString()
      .trim()
      .toLowerCase();
    if (userAnswer === "") {
      setFeedback("✗ You wrote nothing");
      setAnswerLoading(false);
      return;
    }
    if (userAnswer === correctAnswer) {
      // Answer is correct
      const nextAnswers = [...answers];
      nextAnswers[index] = currentAnswer;
      setAnswers(nextAnswers);
      setCurrentAnswer("");
      setFeedback("✓ Correct");

      // Move to next riddle or finish
      setTimeout(() => {
        if (index + 1 < riddles.length) {
          setIndex(index + 1);
          setFeedback("");
        } else {
          // All riddles completed
          finish(nextAnswers);
        }
        setAnswerLoading(false);
      }, 800);
    } else {
      // Answer is incorrect
      setFeedback("✗ Wrong, try again.");
      setAnswerLoading(false);
    }
  }

  async function finish(ans: string[]) {
    if (!username || !creatorUsername) return;
        setIsLoading(true);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ solver: username, creatorUsername, answers: ans }),
    });
    const j = await res.json();
    if (j.success && j.prize) {
      setResult(j.prize);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    // when main music is set, try to autoplay
    if (mainMusic && mainAudioRef.current) {
      try {
        mainAudioRef.current.src = `${mainMusic}`;
        mainAudioRef.current.loop = true;
        const p = mainAudioRef.current.play();
        if (p && typeof p.then === "function") {
          p.then(() => setIsMainPlaying(true)).catch(() =>
            setIsMainPlaying(false),
          );
        }
      } catch (e) {
        console.error(e)
        // ignore autoplay errors
      }
    }
  }, [mainMusic]);

  useEffect(() => {
    // when prize arrives and has music, try to autoplay and pause main music
    if (result && result.music) {
      try {
        if (mainAudioRef.current && isMainPlaying) {
          mainAudioRef.current.pause();
          setIsMainPlaying(false);
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = result.music;
          const p = audioRef.current.play();
          if (p && typeof p.then === "function") {
            p.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        }
      } catch (e) {
                console.error(e)
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

  if (isLoading) {
    return <Loader />;
  }

  if (result?.letter || result?.music || result?.backgroundImage) {
    return (
      <>
        <ResultView
          prize={result}
          isPlaying={isPlaying}
          onTogglePlay={togglePlay}
        />
        {result.music && (
          <audio ref={audioRef} src={result.music} className="hidden" />
        )}
      </>
    );
  }

  if (!riddles || riddles.length === 0) {
    return (
      <div
        dir="rtl"
        className="h-svh flex items-center justify-center max-w-3xl mx-auto p-6 text-center text-2xl"
      >
        Wait a moment 😊
      </div>
    );
  }

  const item = riddles[index];

  return (
    <>
      <QuestionView
        riddle={item}
        totalRiddles={index + 1}
        currentAnswer={currentAnswer}
        feedback={feedback}
        isLoading={answerLoading}
        mainMusicPlaying={isMainPlaying}
        onAnswerChange={setCurrentAnswer}
        onSubmit={submitAnswer}
        onToggleMainMusic={toggleMainPlay}
      />
      {mainMusic && <audio ref={mainAudioRef} className="hidden" />}
    </>
  );
}
