'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function SplashScreen({ children }: { children?: React.ReactNode }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide splash screen after 1.5s
    const timer = setTimeout(() => {
      setShow(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-zinc-800 dark:to-black"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="flex flex-col items-center gap-4 animate-in fade-in duration-300"
            >
              <div className="relative flex items-center justify-center w-32 h-32 rounded-2xl bg-transparent overflow-hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 25 25 L 47.5 25 L 42.5 35 L 37.5 35 L 41.5 43 L 47.5 43 L 45.5 51 L 50 75 Z" className="fill-black dark:fill-white" />
                  <path d="M 52.5 25 L 75 25 L 58 59 L 50 59 L 61 37 L 52.5 37 Z" fill="#ef4444" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn("transition-opacity duration-500", show ? "opacity-0 pointer-events-none" : "opacity-100")}>
        {children}
      </div>
    </>
  );
}
