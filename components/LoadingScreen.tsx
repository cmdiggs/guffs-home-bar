"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";

const LoadingContext = createContext<{ isReady: boolean; setReady: () => void } | null>(null);

export function useLoading() {
  const ctx = useContext(LoadingContext);
  return ctx ?? { isReady: true, setReady: () => {} };
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  const setReady = () => setIsReady(true);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const t = setTimeout(() => setShowLoader(false), 400);
    return () => clearTimeout(t);
  }, [isReady]);

  return (
    <LoadingContext.Provider value={{ isReady, setReady }}>
      {showLoader ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-300"
          style={{ opacity: isReady ? 0 : 1 }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center justify-center">
            <div className="logo-load-animate h-14 w-[200px] md:h-16 md:w-[240px]">
              <Image
                src="/guffs-logo.svg"
                alt="Guffs"
                width={240}
                height={64}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      ) : null}
      <div className={showLoader ? "opacity-0" : "animate-[fadeIn_0.3s_ease-out]"}>{children}</div>
    </LoadingContext.Provider>
  );
}
