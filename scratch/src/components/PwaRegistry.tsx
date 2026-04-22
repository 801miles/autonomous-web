"use client";

import { useEffect } from "react";

export default function PwaRegistry() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
          console.log("Archon PWA Service Worker registered.", reg.scope);
        }).catch((err) => {
          console.error("Service worker registration failed:", err);
        });
      });
    }
  }, []);
  
  return null;
}
