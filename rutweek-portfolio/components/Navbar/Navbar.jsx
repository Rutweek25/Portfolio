"use client";

import React, { useEffect, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Trail } from "./TrailText";

import LetsTalk from "./LetsTalk";
import MenuButton from "./MenuButton";
import Link from "next/link";
import MusicButton from "./MusicButton";
import ResumeButton from "./ResumeButton";

import { PROFILE } from "@/data/profile";

// Shared contact targets — all come from data/profile.js.
const EMAIL = PROFILE.email;
const LINKEDIN_URL = PROFILE.linkedin;

// Smooth-scroll to an in-page section. Uses the global Lenis instance
// exposed by SmoothScroll (window.__lenis) so mobile nav clicks feel
// identical to any other scroll on the site, and falls back to native
// scrollIntoView when Lenis isn't ready yet.
const scrollToSection = (id) => {
  if (typeof window === "undefined") return;
  const target =
    id === "top"
      ? 0
      : document.getElementById(id) ||
        (id === "intro" ? document.getElementById("about") : null) ||
        (id === "tech-stack" ? document.getElementById("skills") : null) ||
        (id === "certifications"
          ? document.getElementById("certification") || document.getElementById("achievements")
          : null) ||
        (id === "contact-section" ? document.getElementById("contact") : null);
  if (target == null) return;
  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    return;
  }
  if (target === 0) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

const MOBILE_NAV_ITEMS = [
  { label: "HOME", target: "intro" },
  { label: "EDUCATION", target: "education" },
  { label: "TECH STACK", target: "tech-stack" },
  { label: "CERTIFICATION", target: "certifications" },
  { label: "CONTACT", target: "contact-section" },
];

function Navbar() {
  const [rotate, setRotate] = useSpring(() => ({
    transform: `rotate(0deg)`,
    config: { tension: 300, friction: 20, mass: 1 },
  }));

  const [open, set] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    set(true);
  }, []);

  // Lock body scroll while the mobile menu is open so the user doesn't
  // accidentally scroll the page behind the overlay.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const handleMobileNav = (e, target) => {
    e.preventDefault();
    setMobileOpen(false);
    setRotate({ transform: "rotate(0deg)" });
    // Give the overlay a frame to close before scrolling so the user
    // sees the motion rather than a jumpy pre-scroll flash.
    setTimeout(() => scrollToSection(target), 50);
  };

  return (
    <>
      {/* Navbar small screen */}
      {/* z-[100001] keeps the navbar (and the dropdown menu it contains) on
          top of every other layer — including the footer (z: 100000) and
          the GradualBlur overlay (z: 99999) — so the menu is always
          accessible and never clipped by another stacking context. */}
      <div className="fixed top-0 left-0 z-[100001] w-full py-5 lg:hidden px-5">
        <div className="flex items-center justify-between w-full font-extrabold">
          <Link
            href="/"
            aria-label="Home"
            onClick={(e) => handleMobileNav(e, "top")}
            className="tracking-wider font-semibold text-2xl cursor-pointer text-fg"
            style={{ letterSpacing: "-0.03em" }}
          >
            {PROFILE.logo}
          </Link>
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="nav_btn_sm flex items-center justify-center cursor-pointer"
            onMouseEnter={() => !mobileOpen && setRotate({ transform: "rotate(90deg)" })}
            onMouseLeave={() => !mobileOpen && setRotate({ transform: "rotate(0deg)" })}
            onClick={() => {
              const next = !mobileOpen;
              setMobileOpen(next);
              setRotate({ transform: next ? "rotate(45deg)" : "rotate(0deg)" });
            }}
          >
            <animated.div className="text-[0.55rem] leading-none" style={rotate}>
              {mobileOpen ? "✕" : "⬤ ⬤"}
            </animated.div>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay — only rendered on small screens. Covers the
          viewport below the navbar with navigation + contact buttons. */}
      <div
        className={`fixed inset-0 z-[100000] lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          className="absolute inset-0 bg-bg"
          onClick={() => {
            setMobileOpen(false);
            setRotate({ transform: "rotate(0deg)" });
          }}
        />
        <div className="relative z-10 h-full w-full flex flex-col pt-24 pb-8 px-6">
          <nav className="flex flex-col gap-1">
            {MOBILE_NAV_ITEMS.map((item, i) => (
              <a
                key={item.target}
                href={item.target === "top" ? "#" : `#${item.target}`}
                onClick={(e) => handleMobileNav(e, item.target)}
                className="flex items-center justify-between py-4 border-b border-theme-border text-fg text-3xl font-semibold transition-colors duration-200 hover:text-brblue"
                style={{
                  letterSpacing: "-0.03em",
                  transform: mobileOpen ? "translateY(0)" : "translateY(20px)",
                  opacity: mobileOpen ? 1 : 0,
                  transition: `transform 0.4s ease ${0.05 + i * 0.05}s, opacity 0.4s ease ${
                    0.05 + i * 0.05
                  }s, color 0.2s ease`,
                }}
              >
                <span>{item.label}</span>
                <span className="text-fg-muted text-base">0{i + 1}</span>
              </a>
            ))}
          </nav>

          <div className="mt-auto pt-8 flex flex-col gap-3">
            <p className="text-fg-muted text-xs tracking-[0.2em] uppercase">Quick actions</p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between bg-accent text-white rounded-full px-5 py-4 text-sm tracking-[0.2em] font-semibold"
            >
              <span>RESUME</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={`mailto:${EMAIL}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between bg-fg text-bg rounded-full px-5 py-4 text-sm tracking-[0.2em] font-semibold"
            >
              <span>EMAIL</span>
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between border-2 border-fg text-fg rounded-full px-5 py-4 text-sm tracking-[0.2em] font-semibold"
            >
              <span>LINKEDIN</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      {/* Navbar large screen */}
      <div className="fixed top-0 left-0 w-full px-6 lg:px-20 z-[100001] ">
        <div className="items-start justify-between hidden lg:flex pt-14 pb-10">
          <div className="tracking-wider font-AeonikMedium text-4xl">
            <Link href="/" aria-label="Home"></Link>
          </div>
          <div className="hidden lg:flex items-center justify-around font-AeonikMedium">
            <Trail open={open} className="flex">
              <MusicButton />
              <ResumeButton />
              <LetsTalk />
              <MenuButton />
            </Trail>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
