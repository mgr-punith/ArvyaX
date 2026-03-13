"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getJournals, getInsights, logout } from "@/lib/api";

interface Analysis {
  emotion: string;
  keywords: string[];
  summary: string;
}

interface Entry {
  id: number;
  ambience: string;
  text: string;
  created_at: string;
  analysis: Analysis | null;
}

interface Insights {
  totalEntries: number;
  topEmotion: string | null;
  mostUsedAmbience: string | null;
  recentKeywords: string[];
}

const AMBIENCE_EMOJI: Record<string, string> = {
  forest: "🌲",
  ocean: "🌊",
  mountain: "⛰️",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.replace("/login"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    Promise.all([getJournals(u.id), getInsights(u.id)])
      .then(([j, i]) => {
        setEntries(j.data);
        setInsights(i.data);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("user");
    router.replace("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <p className="text-sage text-lg animate-pulse">Loading your journal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Navbar */}
      <nav className="bg-forest px-8 py-4 flex items-center justify-between shadow-md">
        <h1 className="font-serif text-2xl text-mist">ArvyaX</h1>
        <div className="flex items-center gap-4">
          <span className="text-sage text-sm">👤 {user?.username}</span>
          <Link
            href="/journal"
            className="px-4 py-2 border bg-gray-50 border-gray-500 rounded-md text-black text-sm font-medium hover:bg-moss transition-colors"
          >
            + New Entry
          </Link>
          <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 rounded-lg border border-gray-50 text-sage text-sm hover:bg-moss hover:text-cream transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Insights Grid */}
        {insights && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-black rounded-3xl p-5 text-center shadow-sm border border-gray-700">
              <p className="font-serif text-3xl text-forest font-semibold">{insights.totalEntries}</p>
              <p className="text-xs text-sage uppercase tracking-wider mt-1">Total Entries</p>
            </div>

            <div className="bg-black rounded-3xl p-5 text-center shadow-sm border border-gray-700">
              <p className="font-serif text-xl text-forest font-semibold capitalize">
                {insights.topEmotion || "—"}
              </p>
              <p className="text-xs text-sage uppercase tracking-wider mt-1">Top Emotion</p>
            </div>

            <div className="bg-black rounded-3xl p-5 text-center shadow-sm border border-gray-700">
              <p className="font-serif text-xl text-forest font-semibold capitalize">
                {insights.mostUsedAmbience
                  ? `${AMBIENCE_EMOJI[insights.mostUsedAmbience]} ${insights.mostUsedAmbience}`
                  : "—"}
              </p>
              <p className="text-xs text-sage uppercase tracking-wider mt-1">Top Ambience</p>
            </div>

            <div className="bg-black rounded-3xl p-5 shadow-sm border border-gray-700">
              <div className="flex flex-wrap gap-1 justify-center">
                {insights.recentKeywords.slice(0, 4).map((k) => (
                  <span key={k} className="px-2 py-0.5 bg-mist text-forest text-xs rounded-full">
                    {k}
                  </span>
                ))}
              </div>
              <p className="text-xs text-sage uppercase tracking-wider mt-2 text-center">Keywords</p>
            </div>
          </div>
        )}

        {/* Journal Entries */}
        <h2 className="font-serif text-2xl text-forest mb-5">Your Entries</h2>

        {entries.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-sage text-lg">No entries yet.</p>
            <Link
              href="/journal"
              className="px-6 py-3 bg-moss text-cream rounded-lg text-sm font-medium hover:bg-forest transition-colors"
            >
              Write your first entry →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-black rounded-3xl p-6 shadow-sm border border-gray-700 hover:shadow-md transition-shadow"
              >
                {/* Entry Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-mist text-forest text-xs font-medium rounded-full capitalize">
                    {AMBIENCE_EMOJI[entry.ambience]} {entry.ambience}
                  </span>
                  <span className="text-xs text-sage">
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Entry Text */}
                <p className="text-forest text-sm leading-relaxed mb-3">{entry.text}</p>

                {/* Analysis */}
                {entry.analysis && (
                  <div className="border-t border-gray-700 pt-3 flex flex-col gap-2">
                    <span className="text-warm text-xs font-semibold tracking-wide capitalize">
                      🧠 {entry.analysis.emotion}
                    </span>
                    <p className="text-sage text-xs leading-relaxed">{entry.analysis.summary}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {entry.analysis.keywords.map((k) => (
                        <span
                          key={k}
                          className="px-2.5 py-0.5 bg-cream border border-mist text-forest text-xs rounded-full"
                        >
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}