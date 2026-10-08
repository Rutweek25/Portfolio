import { useSpring, a } from "@react-spring/web";
import React, { useEffect, useRef, useState } from "react";

import { PROFILE } from "@/data/profile";

// Contact info comes from data/profile.js.
const EMAIL = PROFILE.email;
const LINKEDIN_URL = PROFILE.linkedin;

// Smoothly scrolls to a section by id. Uses the active Lenis instance
// (exposed by SmoothScroll on `window.__lenis`) when available, so the
// motion is consistent with every other scroll on the site. Falls back to
// the browser's native smooth scrollIntoView if Lenis isn't ready yet
// (e.g. during SSR hydration).
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

const Menu = ({ open, onOutsideClick, onClose }) => {
  const ref = useRef();
  const handleChildClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onOutsideClick(event);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleChildClick);
    return () => {
      document.removeEventListener("click", handleChildClick);
    };
  }, []);

  const [contents, contentsApi] = useSpring(() => ({
    from: { y: 100, opacity: 0, transform: "rotate(20deg)" },
  }));

  const [news, newsApi] = useSpring(() => ({
    from: { y: 100, opacity: 0, transform: "rotate(-20deg)" },
  }));
  const [hidden, setHidden] = useState(true);
  useEffect(() => {

    if(open == false){
      setTimeout(() => {
        setHidden(false);}
      , 500);
    }else{
      setHidden(true)
    }

    contentsApi.start({
      y: open ? 0 : 100,
      opacity: open ? 1 : 0,
      transform: open ? `rotate(0deg)` : `rotate(20deg)`,
    });

    newsApi.start({
      y: open ? 0 : 100,
      opacity: open ? 1 : 0,
      transform: open ? `rotate(0deg)` : `rotate(-20deg)`,
    });

  }, [open]);

  // The 5 requested portfolio sections
  const navItems = [
    { label: "HOME", target: "intro" },
    { label: "EDUCATION", target: "education" },
    { label: "TECH STACK", target: "tech-stack" },
    { label: "CERTIFICATION", target: "certifications" },
    { label: "CONTACT", target: "contact-section" },
  ];

  const handleNavClick = (e, target) => {
    e.preventDefault();
    scrollToSection(target);
    if (typeof onClose === "function") onClose();
  };

  return (
    <>
      {hidden && (
        <div
          className="absolute top-[4rem] right-0 w-[20rem] "
          ref={ref}
        >
          {/* Site navigation — smooth scroll, never redirect */}
          <a.div
            className="rounded-xl bg-bg-alt text-fg flex flex-col font-Aeonik text-2xl p-7"
            style={contents}
          >
            {navItems.map((item, i) => (
              <a
                key={item.target}
                href={`#${item.target}`}
                onClick={(e) => handleNavClick(e, item.target)}
                className={`flex items-center justify-between transition-colors duration-200 hover:text-brblue cursor-pointer ${
                  i === 0 ? "pb-2.5" : i === navItems.length - 1 ? "pt-2.5" : "py-2.5"
                }`}
              >
                <span>{item.label}</span>
                <span className="text-fg-muted text-sm">•</span>
              </a>
            ))}
          </a.div>

          {/* Quick actions & Contact */}
          <a.div
            className="rounded-xl bg-bg-alt text-fg flex flex-col p-7 my-2"
            style={news}
          >
            <div className="font-Aeonik text-2xl leading-tight">
              Got an idea?
              <br />
              Let&apos;s talk.
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <a
                href={PROFILE.resume || "/resume.pdf"}
                target="_blank"
                rel="noreferrer"
                onClick={() => onClose && onClose()}
                className="flex items-center justify-between bg-accent text-white rounded-xl px-4 py-3 text-sm tracking-widest font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span>RESUME</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                onClick={() => onClose && onClose()}
                className="flex items-center justify-between bg-fg text-bg rounded-xl px-4 py-3 text-sm tracking-widest font-semibold transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span>EMAIL</span>
                <span aria-hidden="true">↗</span>
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => onClose && onClose()}
                className="flex items-center justify-between border-2 border-fg text-fg rounded-xl px-4 py-3 text-sm tracking-widest font-semibold transition-colors duration-200 hover:bg-accent-soft"
              >
                <span>LINKEDIN</span>
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </a.div>
        </div>
      )}
    </>
  );
};

export default Menu;
