"use client";

import { useEffect, useState } from "react";

const ROWS = 6;
const COLS = 5;

const WORDS = [
  "APPLE", "BRAIN", "CHAIR", "DREAM", "EARTH", "FLAME", "GRAPE",
  "HOUSE", "IMAGE", "JUICE", "KNIFE", "LEMON", "MUSIC", "NIGHT",
  "OCEAN", "PLANT", "QUEEN", "RIVER", "STONE", "TIGER", "UNCLE",
  "VOICE", "WATER", "YOUTH", "ZEBRA",
];

type Status = "correct" | "present" | "absent";

function pickWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

// Two passes so repeated letters are handled correctly
function evaluate(guess: string, secret: string): Status[] {
  const result: Status[] = Array(COLS).fill("absent");
  const remaining: Record<string, number> = {};

  // Pass 1: mark greens, and count the secret's unmatched letters
  for (let i = 0; i < COLS; i++) {
    if (guess[i] === secret[i]) {
      result[i] = "correct";
    } else {
      remaining[secret[i]] = (remaining[secret[i]] ?? 0) + 1;
    }
  }

  // Pass 2: mark yellows only while unmatched copies of that letter remain
  for (let i = 0; i < COLS; i++) {
    if (result[i] === "correct") continue;
    const letter = guess[i];
    if ((remaining[letter] ?? 0) > 0) {
      result[i] = "present";
      remaining[letter]--;
    }
  }

  return result;
}

const STATUS_CLASSES: Record<Status, string> = {
  correct: "border-green-600 bg-green-600",
  present: "border-yellow-500 bg-yellow-500",
  absent: "border-neutral-700 bg-neutral-700",
};

export default function Home() {
  const [secret, setSecret] = useState("");

// Pick the word in the browser only, after the page loads
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setSecret(pickWord());
}, []);
  const [guesses, setGuesses] = useState<string[]>(Array(ROWS).fill(""));
  const [row, setRow] = useState(0); // the row currently being typed in

  const won = row > 0 && guesses[row - 1] === secret;
  const lost = !won && row >= ROWS;
  const gameOver = won || lost;

  function playAgain() {
    setGuesses(Array(ROWS).fill(""));
    setRow(0);
    setSecret(pickWord());
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (gameOver || !secret) return;

      if (/^[a-zA-Z]$/.test(e.key)) {
        setGuesses((prev) => {
          if (prev[row].length >= COLS) return prev;
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
      } else if (e.key === "Enter") {
        if (guesses[row].length === COLS) {
          setRow(row + 1);
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [row, guesses, gameOver, secret]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-900 p-4 text-white">
      <h1 className="text-3xl font-bold tracking-widest">WORD GUESS</h1>

      <div className="grid gap-1.5">
        {Array.from({ length: ROWS }).map((_, r) => {
          const submitted = r < row;
          const statuses = submitted ? evaluate(guesses[r], secret) : null;

          return (
            <div key={r} className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: COLS }).map((_, c) => {
                const letter = guesses[r][c] ?? "";
                const color = statuses
                  ? STATUS_CLASSES[statuses[c]]
                  : letter
                  ? "border-neutral-400"
                  : "border-neutral-600";

                return (
                  <div
                    key={c}
                    className={`flex h-14 w-14 items-center justify-center border-2 text-2xl font-bold uppercase sm:h-16 sm:w-16 ${color}`}
                  >
                    {letter}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {won && <p className="text-xl font-semibold text-green-400">You got it!</p>}
      {lost && (
        <p className="text-xl font-semibold text-red-400">
          Out of guesses. The word was {secret}.
        </p>
      )}

      {gameOver && (
        <button
          onClick={playAgain}
          className="rounded bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-500"
        >
          Play Again
        </button>
      )}
    </main>
  );
}