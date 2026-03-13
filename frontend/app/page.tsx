"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-cream flex flex-col">

      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-forest">ArvyaX</h1>
        <div className="flex gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm text-moss border border-moss rounded-md hover:bg-moss hover:text-cream transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm bg-moss text-cream rounded-md hover:bg-forest transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 pb-20">

        <span className="text-4xl mb-6">🌿</span>

        <h2 className="font-serif text-5xl md:text-6xl text-forest leading-tight max-w-2xl mb-5">
          A journal for your
          <span className="italic text-sage"> nature moments</span>
        </h2>

        <p className="text-moss text-base max-w-md leading-relaxed mb-10">
          After every forest walk, ocean visit, or mountain hike — write down how you felt.
          Let AI gently reflect it back to you.
        </p>

        <div className="flex gap-3">
          <Link
            href="/register"
            className="px-6 py-3 bg-moss text-cream rounded-md text-sm font-medium hover:bg-forest transition-colors"
          >
            Start journaling
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-sand text-moss rounded-md text-sm hover:border-moss transition-colors"
          >
            I have an account
          </Link>
        </div>

        {/* Feature row */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl w-full">
          {[
            { emoji: "🌲", title: "Forest", desc: "Calm walks, rain sounds, stillness" },
            { emoji: "🌊", title: "Ocean", desc: "Waves, open sky, deep breaths" },
            { emoji: "⛰️", title: "Mountain", desc: "Altitude, effort, perspective" },
          ].map((item) => (
            <div
              key={item.title}
              className=" border border-sand rounded-md px-5 py-6 text-left"
            >
              <span className="text-2xl">{item.emoji}</span>
              <p className="font-medium text-forest mt-3 mb-1">{item.title}</p>
              <p className="text-sage text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-sage border-t border-sand">
        Made for those who find peace in nature
      </footer>

    </div>
  );
}