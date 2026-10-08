"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoLoop from "./LogoLoop";

// Dynamic import for Three.js 3D SkillOrbit so it does not block SSR/initial paint
const SkillOrbit = dynamic(() => import("./SkillOrbit"), {
  ssr: false,
});

export default function TechStackSection() {
  const sectionRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Subtle scroll entrance for heading and details
      gsap.from(".ts-reveal", {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="relative w-full pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden bg-bg text-fg"
      aria-label="Technologies and Skills"
    >
      {/* Anchor for any #tech-stack links */}
      <span id="tech-stack" style={{ position: "absolute", top: 0 }} />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Top Split Layout: Content + 3D Solar Orbit */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text & Architecture Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center ts-reveal">
            <span className="font-mono text-xs sm:text-sm tracking-[0.3em] font-semibold uppercase text-accent">
              04 / TECH STACK &amp; SKILLS
            </span>

            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-semibold tracking-tight text-fg leading-[1.08]">
              Architected with{" "}
              <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-4">
                modern precision.
              </span>
            </h2>

            <p className="mt-5 text-base sm:text-lg text-fg-muted leading-relaxed">
              Interactive 3D orbital simulation showcasing core languages,
              full-stack frameworks, databases, and DevOps tooling in my active
              development stack.
            </p>

            {/* Architecture Focus Badges */}
            <div className="mt-7 flex flex-wrap gap-2 sm:gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-theme-border bg-bg-alt/70 text-fg">
                Full-Stack Architecture
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-theme-border bg-bg-alt/70 text-fg">
                Real-Time Systems
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-theme-border bg-bg-alt/70 text-fg">
                REST &amp; Distributed APIs
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium border border-theme-border bg-bg-alt/70 text-fg">
                Scalable Cloud &amp; CI/CD
              </span>
            </div>

            {/* Parallax Interaction Cue */}
            <div className="mt-8 flex items-center gap-3 text-xs font-mono text-fg-subtle">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span>Interactive 3D Solar Orbit • Move cursor to tilt parallax</span>
            </div>
          </div>

          {/* Right Column: 3D Skill Orbit Canvas */}
          <div className="lg:col-span-7 w-full h-[360px] sm:h-[440px] md:h-[500px] lg:h-[540px] relative flex items-center justify-center ts-reveal">
            {/* Subtle radial backdrop glow */}
            <div
              className="absolute inset-0 pointer-events-none rounded-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-accent) 10%, transparent) 0%, transparent 70%)",
              }}
              aria-hidden="true"
            />
            {mounted ? (
              <SkillOrbit />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-fg-muted font-mono text-xs tracking-widest uppercase">
                Initialising 3D Orbit...
              </div>
            )}
          </div>
        </div>

        {/* Divider & Showcase Header */}
        <div className="mt-16 md:mt-20 pt-8 border-t border-theme-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ts-reveal">
          <div>
            <h3 className="text-sm md:text-base font-semibold tracking-wider uppercase text-fg">
              Full Technology Ecosystem
            </h3>
            <p className="text-xs text-fg-subtle mt-0.5">
              Continuous loop of tools, runtime environments, and platforms
            </p>
          </div>
          <span className="text-xs font-mono text-fg-subtle">
            HOVER TO SLOW LOOP • SHARP VECTOR LOGOS
          </span>
        </div>
      </div>

      {/* React Bits Continuous Technology Logo Loop (Full Width) */}
      <div className="mt-6 md:mt-8 w-full">
        <LogoLoop
          hoverSpeed={200}
          logoHeight={80}
          gap={70}
          speed={45}
          direction="left"
        />
      </div>
    </section>
  );
}
