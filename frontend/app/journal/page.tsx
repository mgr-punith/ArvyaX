"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createJournal, analyzeText } from "@/lib/api";

const AMBIENCES = [
  { value: "forest", emoji: "🌲", label: "Forest" },
  { value: "ocean", emoji: "🌊", label: "Ocean" },
  { value: "mountain", emoji: "⛰️", label: "Mountain" },
];

interface Analysis {
  emotion: string;
  keywords: string[];
  summary: string;
}

export default function JournalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [ambience, setAmbience] = useState("forest");
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/login"); return; }
    setUser(JSON.parse(stored));
  }, []);

  const handleSave = async () => {
    if (!text.trim() || !user) return;
    setSaving(true);
    setError("");
    try {
      const res = await createJournal({ userId: String(user.id), ambience, text });
      setSavedId(res.data.id);
      setSaved(true);
    } catch {
      setError("Failed to save entry. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setError("");
    try {
      const res = await analyzeText({ text, entryId: savedId || undefined });
      setAnalysis(res.data);
    } catch {
      setError("Analysis failed. Check your connection.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="bg-forest px-8 py-4 flex items-center justify-between shadow-md">
        <h1 className="font-serif text-2xl text-mist">ArvyaX</h1>
        <Link href="/dashboard" className="text-sage text-sm hover:text-mist transition-colors">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h2 className="font-serif text-3xl text-forest mb-1">New Entry</h2>
        <p className="text-sage text-sm mb-8">Reflect on your nature session</p>

        {/* Ambience Selector */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-moss uppercase tracking-wide mb-3">
            Choose Ambience
          </p>
          <div className="flex gap-3">
            {AMBIENCES.map((a) => (
              <button
                key={a.value}
                onClick={() => setAmbience(a.value)}
                className={`flex-1 flex flex-col items-center py-4 rounded-xl border-2 transition-all cursor-pointer
                  ${ambience === a.value
                    ? "border-moss bg-mist"
                    : "border-sand bg-gray-300 hover:border-sage "
                  }`}
              >
                <span className="text-3xl mb-1">{a.emoji}</span>
                <span className="text-md font-bold text-black">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-2">
          <p className="text-xs font-medium text-moss uppercase tracking-wide mb-3">
            Your Reflection
          </p>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write about your experience... How did you feel?"
            rows={8}
            className="w-full px-4 py-3 rounded-xl border border-sand bg-black text-forest text-sm leading-relaxed focus:outline-none focus:border-moss transition-colors resize-none"
          />
          <p className="text-right text-xs text-sage mt-1">{text.length} characters</p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            disabled={saving || !text.trim()}
            className="flex-1 cursor-pointer py-3 rounded-xl bg-moss text-cream font-medium text-sm hover:bg-forest transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          >
            {saving ? "Saving..." : saved ? "✓ Saved!" : "Save Entry"}
          </button>
          <button
            onClick={handleAnalyze}
            disabled={analyzing || !text.trim()}
            className="flex-1 cursor-pointer py-3 rounded-xl border-2 border-moss text-moss font-medium text-sm hover:bg-moss hover:text-cream transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analyzing ? "Analyzing..." : "Analyze Emotions"}
          </button>
        </div>

        {/* Analysis Result */}
        {analysis && (
          <div className="mt-8 bg-black rounded-xl p-6 border border-sand shadow-sm">
            <h3 className="font-serif text-xl text-forest mb-4">Emotion Analysis</h3>

            <div className="inline-block px-4 py-1.5 bg-mist rounded-full text-forest text-sm font-semibold capitalize mb-3">
              {analysis.emotion}
            </div>

            <p className="text-sage text-sm leading-relaxed mb-4">{analysis.summary}</p>

            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((k) => (
                <span
                  key={k}
                  className="px-3 py-1 bg-cream border border-mist text-forest text-xs rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="mt-6 w-full py-3 rounded-xl bg-forest text-cream text-sm font-medium hover:bg-moss transition-colors cursor-pointer"
            >
              View All Entries →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}