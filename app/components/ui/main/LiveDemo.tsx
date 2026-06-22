"use client";
import { useState, useRef, useEffect } from "react";

const themes = [
  {
    id: "gradient-1",
    name: "Mystic",
    class: "bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900",
  },
  {
    id: "gradient-2",
    name: "Ocean",
    class: "bg-gradient-to-br from-cyan-900 to-blue-950",
  },
  {
    id: "gradient-3",
    name: "Sunset",
    class: "bg-gradient-to-br from-slate-900 to-rose-950",
  },
  { id: "dark", name: "Dark Mode", class: "bg-slate-950" },
  {
    id: "pattern-1",
    name: "Dots",
    class:
      "bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]",
  },
  {
    id: "pattern-2",
    name: "Grid",
    class:
      "bg-slate-950 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:24px_24px]",
  },
  {
    id: "pattern-3",
    name: "Stripes",
    class:
      "bg-slate-900 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#1e293b_10px,#1e293b_20px)]",
  },
];

const musicTracks = [
  {
    id: "track-1",
    name: "🎵 Lo-Fi Chill",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: "track-2",
    name: "🎹 Ambient Focus",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: "track-3",
    name: "🎸 Synthwave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
];

const preMadeMessages = [
  "🎉 Happy Birthday! Wishing you a fantastic day filled with joy.",
  "❤️ I love you to the moon and back!",
  "🌟 You are a star! Keep shining brightly.",
  "🎓 Congratulations on your amazing achievement!",
  "🥂 Happy Anniversary! Here is to many more wonderful years.",
  "🤗 Sending you a big hug! Get well soon.",
  "🙏 Thank you so much for everything you do.",
  "🚀 Good luck on your new adventure! You will do great.",
];

const LiveDemo = () => {
  const editorRef = useRef<HTMLDivElement>(null);

  // State for preview rendering
  const [htmlContent, setHtmlContent] = useState(
    "This is a secret message...<br><br>You can edit this text and see the magic happen instantly! ✨",
  );

  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("mobile");

  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // States for dropdowns
  const [showTemplates, setShowTemplates] = useState(false);
  const [openTab, setOpenTab] = useState<"bg" | "music" | null>(null);

  // Initialize editor content once
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = htmlContent;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (
    command: string,
    value: string | undefined = undefined,
  ) => {
    if (!editorRef.current) return;

    editorRef.current.focus();
    const selection = window.getSelection();

    if (selection && selection.isCollapsed) {
      const range = document.createRange();
      range.selectNodeContents(editorRef.current);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    document.execCommand(command, false, value);
    handleInput();
  };

  const applyTemplate = (message: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = message;
      setHtmlContent(message);
      setShowTemplates(false);
    }
  };

  const toggleMusic = (trackId: string, src: string) => {
    if (playingTrack === trackId) {
      audioRef.current?.pause();
      setPlayingTrack(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const newAudio = new Audio(src);
      newAudio.loop = true;
      newAudio.play().catch((e) => console.error("Audio play failed:", e));
      audioRef.current = newAudio;
      setPlayingTrack(trackId);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <section className="py-24 bg-slate-950 font-sans border-t border-slate-900">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-50">
            🛠️ Try It Out Right Now!
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Edit the text below, pick a new background, add some music, and
            watch the magic happen.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-16 lg:gap-12 max-w-6xl mx-auto">
          {/* Settings Panel */}
          <div className="w-full lg:w-1/2 space-y-6 bg-slate-900/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-800 shadow-2xl flex flex-col justify-between">
            <div className="space-y-6">
              {/* Text Editor Section */}
              <div className="space-y-3 relative">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Your Message
                  </label>

                  {/* Templates Dropdown Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                    >
                      📝 Ready Messages
                    </button>

                    {showTemplates && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
                        {preMadeMessages.map((msg, idx) => (
                          <button
                            key={idx}
                            onClick={() => applyTemplate(msg)}
                            className="text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white border-b border-slate-700/50 last:border-0 truncate"
                            title={msg}
                          >
                            {msg}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-950 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
                  {/* Toolbar */}
                  <div className="bg-slate-800/80 px-3 py-2 flex flex-wrap gap-2 border-b border-slate-700/50 items-center">
                    <select
                      title="Font Family"
                      aria-label="Font Family"
                      onChange={(e) =>
                        executeCommand("fontName", e.target.value)
                      }
                      defaultValue="Arial"
                      className="bg-slate-900 text-slate-200 border border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Courier New">Courier</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                    </select>

                    <select
                      title="Font Size"
                      aria-label="Font Size"
                      onChange={(e) =>
                        executeCommand("fontSize", e.target.value)
                      }
                      defaultValue="3"
                      className="bg-slate-900 text-slate-200 border border-slate-600 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 w-16 cursor-pointer"
                    >
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Huge</option>
                    </select>

                    <div className="w-[1px] h-5 bg-slate-600 mx-1"></div>

                    <button
                      onClick={() => executeCommand("bold")}
                      className="w-7 h-7 rounded flex items-center justify-center font-serif font-bold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Bold"
                    >
                      B
                    </button>
                    <button
                      onClick={() => executeCommand("italic")}
                      className="w-7 h-7 rounded flex items-center justify-center font-serif italic text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Italic"
                    >
                      I
                    </button>
                    <button
                      onClick={() => executeCommand("underline")}
                      className="w-7 h-7 rounded flex items-center justify-center font-serif underline text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Underline"
                    >
                      U
                    </button>

                    <div className="w-[1px] h-5 bg-slate-600 mx-1"></div>

                    <div
                      className="relative flex items-center rounded overflow-hidden"
                      title="Text Color"
                    >
                      <input
                        type="color"
                        title="Text Color"
                        aria-label="Text Color"
                        onChange={(e) =>
                          executeCommand("foreColor", e.target.value)
                        }
                        className="w-7 h-7 p-0 border-0 cursor-pointer bg-transparent"
                      />
                    </div>

                    <div className="w-[1px] h-5 bg-slate-600 mx-1"></div>

                    <button
                      onClick={() => executeCommand("justifyLeft")}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Align Left"
                    >
                      ⇤
                    </button>
                    <button
                      onClick={() => executeCommand("justifyCenter")}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Align Center"
                    >
                      ⇹
                    </button>
                    <button
                      onClick={() => executeCommand("justifyRight")}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                      title="Align Right"
                    >
                      ⇥
                    </button>
                  </div>

                  {/* Content Editable Area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    className="w-full h-40 p-4 bg-transparent text-slate-100 overflow-y-auto outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Background and Music Toggles (Side by Side) */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => setOpenTab(openTab === "bg" ? null : "bg")}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${openTab === "bg" ? "bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-slate-900 border-slate-700 hover:bg-slate-800"}`}
                >
                  <span className="text-2xl">🎨</span>
                  <span className="text-sm font-bold text-slate-300">
                    Backgrounds
                  </span>
                </button>

                <button
                  onClick={() =>
                    setOpenTab(openTab === "music" ? null : "music")
                  }
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${openTab === "music" ? "bg-slate-800 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]" : "bg-slate-900 border-slate-700 hover:bg-slate-800"}`}
                >
                  <span className="text-2xl">🎧</span>
                  <span className="text-sm font-bold text-slate-300">
                    Background Music
                  </span>
                  {playingTrack && (
                    <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                  )}
                </button>
              </div>

              {/* Background Selection Content */}
              {openTab === "bg" && (
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex gap-4 flex-wrap animate-in fade-in slide-in-from-top-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveTheme(theme)}
                      className={`w-12 h-12 rounded-xl border-2 transition-all duration-300 ${theme.class} ${
                        activeTheme.id === theme.id
                          ? "border-blue-400 scale-110 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                          : "border-slate-700 hover:border-slate-500 hover:scale-105"
                      }`}
                      title={theme.name}
                    />
                  ))}
                </div>
              )}

              {/* Music Selection Content */}
              {openTab === "music" && (
                <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                  {musicTracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => toggleMusic(track.id, track.src)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
                        playingTrack === track.id
                          ? "bg-blue-900/30 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                      }`}
                    >
                      <span className="font-medium text-sm">{track.name}</span>
                      {playingTrack === track.id ? (
                        <span className="flex gap-1 items-center h-4">
                          <span className="w-1 h-3 bg-blue-400 animate-pulse rounded-full"></span>
                          <span className="w-1 h-4 bg-blue-400 animate-pulse delay-75 rounded-full"></span>
                          <span className="w-1 h-2 bg-blue-400 animate-pulse delay-150 rounded-full"></span>
                        </span>
                      ) : (
                        <span className="text-xs opacity-50">▶ Play</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="">
              <button className="w-full py-4 px-6 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)] transform hover:-translate-y-1 text-lg">
                Save & Generate Link
              </button>
            </div>
          </div>

          {/* Preview Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center perspective-1000">
            <div className="flex bg-slate-900 border border-slate-800 rounded-full p-1 mb-8">
              <button
                onClick={() => setViewMode("mobile")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === "mobile"
                    ? "bg-slate-700 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                📱 Mobile
              </button>
              <button
                onClick={() => setViewMode("desktop")}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === "desktop"
                    ? "bg-slate-700 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                💻 Desktop
              </button>
            </div>

            <div
              className={`relative bg-slate-950 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transform transition-all duration-500 hover:scale-[1.02] ${
                viewMode === "mobile"
                  ? "w-[320px] h-[650px] rounded-[3rem] border-[10px]"
                  : "w-full max-w-[600px] h-[400px] rounded-2xl border-[8px]"
              }`}
            >
              <div
                className={`absolute top-0 inset-x-0 flex justify-center z-20 transition-opacity duration-300 ${
                  viewMode === "mobile" ? "opacity-100 h-7" : "opacity-0 h-0"
                }`}
              >
                <div className="w-24 h-6 bg-slate-800 rounded-b-3xl"></div>
              </div>

              <div
                className={`w-full bg-slate-900 border-b border-slate-800 flex items-center px-4 transition-all duration-300 ${
                  viewMode === "desktop"
                    ? "opacity-100 h-8"
                    : "opacity-0 h-0 hidden"
                }`}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                </div>
              </div>

              <div
                className={`flex-1 w-full h-full p-8 flex flex-col justify-center items-center transition-colors duration-500 ${activeTheme.class}`}
              >
                <div className="bg-slate-950/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl w-full max-w-sm overflow-y-auto max-h-[80%]">
                  <div
                    className="text-slate-100 break-words"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  ></div>
                </div>

                <div className="mt-8 px-8 py-3 rounded-full font-bold text-sm bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20 cursor-pointer transition-colors">
                  Unlock Puzzle
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemo;
