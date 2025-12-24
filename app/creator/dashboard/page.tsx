"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SolverSelector from "@/app/components/ui/creator/dashboard/SolverSelector";
import RiddleList from "@/app/components/ui/creator/dashboard/RiddleList";
import PrizeInput from "@/app/components/ui/creator/dashboard/PrizeInput";
import MediaUploadSection from "@/app/components/ui/creator/dashboard/media-selector/MediaUploadSection";
import SaveButton from "@/app/components/ui/creator/dashboard/SaveButton";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Upload failed");
  }

  return result.path;
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [riddles, setRiddles] = useState<any[]>([]);
  const [prizeLetter, setPrizeLetter] = useState("");
  const [mainMusicFile, setMainMusicFile] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(
    null
  );
  const [msg, setMsg] = useState("");
  const [solver, setSolver] = useState("");
  const [solvers, setSolvers] = useState<string[]>([]);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is a creator
    const userType = localStorage.getItem("userType");
    if (userType !== "creator") {
      router.push("/");
      return;
    }
    setAuthorized(true);
  }, [router]);

  useEffect(() => {
    if (!authorized) return;
    const creatorUsername = localStorage.getItem("username");
    if (!creatorUsername) return;
    // Fetch solvers created by this creator
    fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "list_solvers",
        creator: creatorUsername,
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        setSolvers(d.solvers || []);
      });
  }, [authorized]);

  useEffect(() => {
    if (!solver) return;
    fetch(`/api/riddles?solver=${encodeURIComponent(solver)}`)
      .then((r) => r.json())
      .then((d) => {
        setRiddles(d.riddles || []);
        setPrizeLetter((d.prize && d.prize.letter) || "");
      })
      .catch(() => {});
  }, [solver]);

  function addRiddle() {
    setRiddles([...riddles, { question: "", answer: "" }]);
  }

  function updateRiddle(i: number, field: string, value: string) {
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
        riddles,
        prizeLetter,
        prizeMusicPath,
        mainMusicPath,
        backgroundImagePath,
      }),
    });
    const j = await res.json();
    if (j.success) setMsg("Saved");
    else setMsg("Error saving");
  }

  if (!authorized) {
    return null;
  }

  return (
    <section className="max-w-3xl mx-auto bg-white dark:bg-black/35 backdrop-blur-md border dark:border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Creator Dashboard
      </h2>
      <div className="space-y-4">
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
