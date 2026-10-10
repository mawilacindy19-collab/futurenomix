import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-black z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 rounded-2xl bg-transparent flex items-center justify-center animate-pulse">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-black dark:fill-white" />
            <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
          </svg>
        </div>
      </div>
    </div>
  );
}
