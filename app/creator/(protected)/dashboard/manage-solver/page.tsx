"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SolverSelector from "@/app/components/ui/creator/dashboard/SolverSelector";
import RiddleList from "@/app/components/ui/creator/dashboard/RiddleList";
import PrizeInput from "@/app/components/ui/creator/dashboard/PrizeInput";
import MediaUploadSection from "@/app/components/ui/creator/dashboard/media-selector/MediaUploadSection";
import SaveButton from "@/app/components/ui/creator/dashboard/SaveButton";
import { uploadFileDirectly } from "@/utils/supabase/direct-upload";

interface RiddleDraft {
  question: string;
  answer: string;
}

async function uploadFile(file: File): Promise<string> {
  const result = await uploadFileDirectly(file);

  if (!result.success) {
    throw new Error(result.message || "Upload failed");
  }

  return result.path || "";
}

export default function ManageSolver() {
  const router = useRouter();
  const [riddles, setRiddles] = useState<RiddleDraft[]>([]);
  const [prizeLetter, setPrizeLetter] = useState("");
  const [mainMusicFile, setMainMusicFile] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null,
  );
  const [msg, setMsg] = useState("");
  const [solver, setSolver] = useState("");
  const [solvers, setSolvers] = useState<string[]>([]);
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid || data.user?.role !== "creator") {
          router.push("/creator/login");
          return;
        }

        setUsername(data.user.username);
        setAuthorized(true);
        setLoading(false);
      })
      .catch(() => {
        router.push("/creator/login");
      });
  }, [router]);

  useEffect(() => {
    if (!authorized || !username) return;

    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "list_solvers",
        creatorUsername: username,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setSolvers(d.solvers || []);
      });
  }, [authorized, username]);

  useEffect(() => {
    if (!solver) return;

    fetch(
      `/api/riddles?solver=${encodeURIComponent(solver)}&creator=${encodeURIComponent(username)}`,
    )
      .then((r) => r.json())
      .then((d) => {
        const riddleSet = d.riddleSet || {};
        setRiddles(riddleSet.riddles || []);
        setPrizeLetter((riddleSet.prize && riddleSet.prize.letter) || "");
      })
      .catch(() => {});
  }, [solver, username]);

  function addRiddle() {
    setRiddles([...riddles, { question: "", answer: "" }]);
  }

  function updateRiddle(i: number, field: keyof RiddleDraft, value: string) {
    const copy = [...riddles];
    copy[i] = { ...copy[i], [field]: value };
    setRiddles(copy);
  }

  function removeRiddle(i: number) {
    const copy = [...riddles];
    copy.splice(i, 1);
    setRiddles(copy);
  }

  async function save() {
    if (!solver) {
      setMsg("Please select a solver");
      return;
    }

    if (!username) {
      setMsg("Creator username not found");
      return;
    }

    setMsg("Saving...");

    let mainMusicPath = undefined;
    if (mainMusicFile) {
      mainMusicPath = await uploadFile(mainMusicFile);
    }

    let prizeMusicPath = undefined;
    if (musicFile) {
      prizeMusicPath = await uploadFile(musicFile);
    }

    let backgroundImagePath = undefined;
    if (backgroundImageFile) {
      backgroundImagePath = await uploadFile(backgroundImageFile);
    }

    const res = await fetch("/api/riddles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        solver,
        creatorUsername: username,
        riddles,
        prizeLetter,
        prizeMusicPath,
        mainMusicPath,
        backgroundImagePath,
      }),
    });

    const j = await res.json();

    if (j.success) setMsg("Saved");
    else setMsg(j.message || "Error saving");
  }

  if (loading || !authorized) {
    return (
      <section className="flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-300 backdrop-blur-xl">
        Loading solver data...
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
      <div className="border-b border-slate-800 bg-slate-950/50 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
          Manage Solver
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-50">
          Riddle Builder
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Select a solver, edit the riddles, attach media, and save the
          experience.
        </p>
      </div>

      <div className="space-y-5 p-6">
        <SolverSelector
          solvers={solvers}
          selectedSolver={solver}
          onChange={setSolver}
        />

        {solver && (
          <>
            <RiddleList
              riddle={riddles}
              onUpdate={updateRiddle}
              onRemove={removeRiddle}
              onAdd={addRiddle}
            />

            <PrizeInput prizeLetter={prizeLetter} onUpdate={setPrizeLetter} />

            <MediaUploadSection
              mainMusicFile={mainMusicFile}
              musicFile={musicFile}
              backgroundImageFile={backgroundImageFile}
              onMainMusicChange={setMainMusicFile}
              onPrizeMusicChange={setMusicFile}
              onBackgroundImageChange={setBackgroundImageFile}
            />
            <SaveButton onSave={save} message={msg} />
          </>
        )}
      </div>
    </section>
  );
}
