const ROWS = 6;
const COLS = 5;

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-neutral-900 p-4 text-white">
      <h1 className="text-3xl font-bold tracking-widest">WORD GUESS</h1>

      <div className="grid gap-1.5">
        {Array.from({ length: ROWS }).map((_, row) => (
          <div key={row} className="grid grid-cols-5 gap-1.5">
            {Array.from({ length: COLS }).map((_, col) => (
              <div
                key={col}
                className="flex h-14 w-14 items-center justify-center border-2 border-neutral-600 text-2xl font-bold uppercase sm:h-16 sm:w-16"
              />
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}