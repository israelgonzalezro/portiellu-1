"use client";

import { useEffect, useState } from "react";
import { HorreoMark } from "./Icons";
import { content, type Lang } from "../lib/content";

export default function SiteHeader({ lang = "es" }: { lang?: Lang }) {
  const t = content[lang].nav;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const home = lang === "en" ? "/en" : "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#apartamentos", label: t.apartments },
    { href: "#entorno", label: t.surroundings },
    { href: "#contacto", label: t.contact }
  ];

  return (
    <header className={`site-header${scrolled || open ? " solid" : ""}`}>
      <div className="site-header-inner">
        <a href={home} className="logo" aria-label="El Portiellu">
          <HorreoMark size={38} />
          <span>
            <strong>El Portiellu</strong>
            <small>Apartamentos rurales</small>
          </span>
        </a>

        <nav className={`main-nav${open ? " open" : ""}`} aria-label={t.menu}>
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href={t.otherLangHref} className="lang-pill" hrefLang={lang === "es" ? "en" : "es"}>
            {t.otherLang}
          </a>
        </nav>

        <a href="#reservar" className="btn btn-gold header-cta">
          {t.book}
        </a>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-label={open ? t.close : t.menu}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
