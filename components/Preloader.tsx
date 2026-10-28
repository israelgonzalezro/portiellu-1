"use client";

import { useEffect, useState } from "react";
import { HorreoMark } from "./Icons";

// Pantalla de carga breve al entrar en la web. Si algo falla, el CSS la oculta sola.
export default function Preloader({ label }: { label: string }) {
  const [hidden, setHidden] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const started = Date.now();
    const finish = () => {
      const wait = Math.max(0, 900 - (Date.now() - started));
      window.setTimeout(() => setHidden(true), wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const safety = window.setTimeout(() => setHidden(true), 2500);
    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(safety);
    };
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const timer = window.setTimeout(() => setGone(true), 600);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  if (gone) return null;

  return (
    <div className={`preloader${hidden ? " hide" : ""}`} role="status" aria-label={label}>
      <div className="preloader-inner">
        <span className="preloader-mark">
          <HorreoMark size={64} />
        </span>
        <strong>El Portiellu</strong>
        <small>Cabielles · Asturias</small>
        <span className="preloader-bar" />
      </div>
    </div>
  );
}
