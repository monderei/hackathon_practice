"use client";

import { useEffect, useState } from "react";

const ROWS = 6;
const COLS = 5;

export default function Home() {
  // One string per row, e.g. ["HEL", "", "", "", "", ""]
  const [guesses, setGuesses] = useState<string[]>(Array(ROWS).fill(""));
  // Which row we're typing in. Stays 0 until Enter does something.
  const [row] = useState(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Let browser shortcuts like Ctrl+R through
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (/^[a-zA-Z]$/.test(e.key)) {
        setGuesses((prev) => {
          if (prev[row].length >= COLS) return prev; // row is full
          const next = [...prev];
          next[row] = prev[row] + e.key.toUpperCase();
          return next;
        });
      } else if (e.key === "Backspace") {
        setGuesses((prev) => {
          const next = [...prev];
          next[row] = prev[row].slice(0, -1);
          return next;
        });
      }
      // Enter does nothing yet
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [row]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-900 p-4 text-white">
      <h1 className="text-3xl font-bold tracking-widest">WORD GUESS</h1>

      <div className="grid gap-1.5">
        {Array.from({ length: ROWS }).map((_, r) => (
          <div key={r} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: COLS }).map((_, c) => {
              const letter = guesses[r][c] ?? "";
              return (
                <div
                  key={c}
                  className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase sm:h-16 sm:w-16 ${
                    letter ? "border-neutral-400" : "border-neutral-600"
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}