"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { Language } from "@/lib/hooks/useTranslation";
import Container from "./Container";

type NavLabels = {
  home: string;
  about: string;
  services: string;
  menus: string;
  contact: string;
  order: string;
};

type A11yLabels = {
  switchToGerman: string;
  switchToEnglish: string;
  englishFlagAlt: string;
  germanFlagAlt: string;
};

type SiteHeaderProps = {
  language: Language;
  toggleLanguage: () => void;
  pathname: string;
  nav: NavLabels;
  a11y: A11yLabels;
  onOrderClick?: () => void;
};

const isActiveHref = (pathname: string, href: string) => {
  if (href === "/home") return pathname === "/" || pathname === "/home";
  return pathname === href;
};

export default function SiteHeader({ language, toggleLanguage, pathname, nav, a11y, onOrderClick }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);

  const links = useMemo(
    () => [
      { href: "/home", label: nav.home },
      { href: "/services", label: nav.services },
      { href: "/menus", label: nav.menus },
      { href: "/about", label: nav.about },
      { href: "/contact", label: nav.contact },
    ],
    [nav]
  );

  const orderHandler = onOrderClick ?? (() => {});

  const desktopLinkClass = (href: string) =>
    `text-sm tracking-wide transition-colors ${
      isActiveHref(pathname, href) ? "text-white" : "text-white/75 hover:text-white"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-base font-medium transition-colors ${
      isActiveHref(pathname, href) ? "text-white" : "text-white/80 hover:text-white"
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="bg-black/55 backdrop-blur-xl border-b border-white/10">
        <Container className="h-20">
          <div className="flex h-20 items-center justify-between gap-4">
            <Link href="/home" className="flex items-center gap-3">
              <Image
                src="/images/logo-removebg-preview.png"
                alt="La Cannelle"
                width={260}
                height={80}
                priority
                className="h-12 w-auto object-contain"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={desktopLinkClass(link.href)}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                aria-label={language === "EN" ? a11y.switchToGerman : a11y.switchToEnglish}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
              >
                <Image
                  src={
                    language === "EN"
                      ? "/images/language/Flag_of_United_Kingdom-4096x2048.png"
                      : "/images/language/Flag_of_Germany-4096x2453.png"
                  }
                  alt={language === "EN" ? a11y.englishFlagAlt : a11y.germanFlagAlt}
                  width={18}
                  height={18}
                  className="h-[18px] w-auto rounded-sm"
                />
                <span>{language === "EN" ? "EN" : "DE"}</span>
              </button>

              <button
                type="button"
                onClick={orderHandler}
                className="group inline-flex items-center gap-2 rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-semibold text-black hover:brightness-95 transition-all"
              >
                {nav.order}
                <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 p-2 text-white hover:bg-white/10 transition-colors"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </Container>
      </div>

      {open && (
        <div className="md:hidden border-b border-white/10 bg-black/85 backdrop-blur-xl">
          <Container className="py-5">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={mobileLinkClass(link.href)} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleLanguage}
                  aria-label={language === "EN" ? a11y.switchToGerman : a11y.switchToEnglish}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-3 text-sm font-medium text-white/90 hover:bg-white/10 transition-colors"
                >
                  <Image
                    src={
                      language === "EN"
                        ? "/images/language/Flag_of_United_Kingdom-4096x2048.png"
                        : "/images/language/Flag_of_Germany-4096x2453.png"
                    }
                    alt={language === "EN" ? a11y.englishFlagAlt : a11y.germanFlagAlt}
                    width={18}
                    height={18}
                    className="h-[18px] w-auto rounded-sm"
                  />
                  <span>{language === "EN" ? "English" : "Deutsch"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    orderHandler();
                  }}
                  className="inline-flex flex-1 items-center justify-center rounded-full bg-[color:var(--accent)] px-3 py-3 text-sm font-semibold text-black hover:brightness-95 transition-all"
                >
                  {nav.order}
                </button>
              </div>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

