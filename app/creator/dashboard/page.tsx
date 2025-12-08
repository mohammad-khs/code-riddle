"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CreatorDashboard() {
  const router = useRouter();
  const [riddles, setRiddles] = useState<any[]>([]);
  const [prizeLetter, setPrizeLetter] = useState("");
  const [mainMusicFile, setMainMusicFile] = useState<File | null>(null);
  const [musicFile, setMusicFile] = useState<File | null>(null);
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
    let mainMusicBase64 = undefined;
    if (mainMusicFile) {
      mainMusicBase64 = await fileToDataUrl(mainMusicFile);
    }

    let base64 = undefined;
    if (musicFile) {
      base64 = await fileToDataUrl(musicFile);
    }
    const res = await fetch("/api/riddles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "save",
        solver,
        riddles,
        prizeLetter,
        prizeMusicBase64: base64,
        mainMusicBase64: base64,
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
    <section className="max-w-3xl mx-auto bg-white dark:bg-slate-800 border dark:border-slate-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Creator Dashboard
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Assign to Solver
          </label>
          <select
            value={solver}
            onChange={(e) => setSolver(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          >
            <option value="">Select solver...</option>
            {solvers.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {riddles.map((r, i) => (
          <div
            key={i}
            className="bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-md p-4"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Question
              </label>
              <input
                value={r.question}
                onChange={(e) => updateRiddle(i, "question", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              />
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Answer
              </label>
              <input
                value={r.answer}
                onChange={(e) => updateRiddle(i, "answer", e.target.value)}
                className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
              />
            </div>
            <div className="mt-3">
              <button onClick={() => removeRiddle(i)} className="text-red-600">
                Remove
              </button>
            </div>
          </div>
        ))}

        <div>
          <button
            onClick={addRiddle}
            className="inline-flex items-center gap-2 bg-gray-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 px-3 py-1 rounded-md"
          >
            Add Riddle
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Prize Letter
          </label>
          <textarea
            value={prizeLetter}
            onChange={(e) => setPrizeLetter(e.target.value)}
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          />
        </div>
        {/* new */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Main Music (optional)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setMainMusicFile(e.target.files ? e.target.files[0] : null)
            }
            className="mt-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Prize Music (optional)
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) =>
              setMusicFile(e.target.files ? e.target.files[0] : null)
            }
            className="mt-2"
          />
        </div>

        <div>
          <button
            onClick={save}
            className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md"
          >
            Save All
          </button>
        </div>
        {msg && (
          <div className="mt-2 text-slate-700 dark:text-slate-200">{msg}</div>
        )}
      </div>
    </section>
  );
}
