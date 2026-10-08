"use client";

import React, { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiquidEther from "../LiquidEther/LiquidEther";
import useOptionalImage from "../useOptionalImage";
import Preloader from "../Preloader/Preloader";
import { PROFILE } from "@/data/profile";

// Module-level constant so the array reference stays stable across renders
// (otherwise LiquidEther's useEffect would tear down/rebuild WebGL each render).
const HERO_LIQUID_COLORS = ["#D9E6FF"];

const SplitChars = ({ text, className, id }) => {
  return (
    <span className={className} id={id}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="hero-char"
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  // Optional transparent-PNG cutout of you: add public/portrait.png and it
  // shows up here automatically. Without it the hero is just type + motion.
  const hasPortrait = useOptionalImage("/portrait.png");
  const headingRef = useRef(null);
  const stroke1Ref = useRef(null);
  const stroke2Ref = useRef(null);
  const endLineRef = useRef(null);
  const parallaxInstanceRef = useRef(null);

  // Initialize wagerfield/parallax (parallax-js) after reveal finishes.
  const initParallax = useCallback(async () => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const isTouch =
      window.matchMedia("(hover: none), (pointer: coarse)").matches ||
      window.innerWidth < 1024;
    try {
      const mod = await import("parallax-js");
      const Parallax = mod.default || mod;
      if (!sectionRef.current) return;
      parallaxInstanceRef.current = new Parallax(sectionRef.current, {
        relativeInput: true,
        hoverOnly: !isTouch,
        selector: ".hero-layer",
        scalarX: isTouch ? 4 : 2,
        scalarY: isTouch ? 4 : 2,
        frictionX: isTouch ? 0.18 : 0.1,
        frictionY: isTouch ? 0.18 : 0.1,
      });
    } catch (err) {
      console.error("Failed to init parallax-js:", err);
    }
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    document.body.style.overflow = "";

    const headingChars = headingRef.current?.querySelectorAll(".hero-char") || [];
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const stroke1Width = isMobile ? "40vw" : "22vw";
    const stroke2Width = isMobile ? "30vw" : "16vw";

    const revealTl = gsap.timeline({
      onComplete: () => {
        initParallax();
      },
    });

    // Animate hero scale up from 0.88 to 1 with "hop" ease (from Animmaster landing reveal)
    revealTl
      .fromTo(
        sectionRef.current,
        { scale: 0.9, autoAlpha: 1 },
        { scale: 1, duration: 1.25, ease: "hop" }
      )
      .to(
        headingChars,
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.95,
          ease: "power3.out",
        },
        "-=0.9"
      )
      .to(
        imgRef.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "sine.out",
        },
        "-=0.7"
      )
      .to(
        stroke2Ref.current,
        {
          autoAlpha: 1,
          width: stroke2Width,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.8"
      )
      .to(
        stroke1Ref.current,
        {
          autoAlpha: 1,
          width: stroke1Width,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.7"
      );
  }, [initParallax]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const headingChars = headingRef.current?.querySelectorAll(".hero-char") || [];

    // Hide hero elements initially until preloader reveals
    gsap.set(headingChars, { autoAlpha: 0, y: 100 });
    gsap.set(imgRef.current, { autoAlpha: 0, y: "50%", scale: 0.8 });
    gsap.set([stroke1Ref.current, stroke2Ref.current], { autoAlpha: 0, width: "0%" });
    gsap.set(endLineRef.current, { autoAlpha: 0 });

    const endLineTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300",
      scrub: true,
      animation: gsap.to(endLineRef.current, { autoAlpha: 1, ease: "none" }),
    });

    const requestGyroPermission = () => {
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
      ) {
        DeviceOrientationEvent.requestPermission().catch(() => {});
      }
    };
    const handleFirstGesture = () => {
      requestGyroPermission();
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
    };
    window.addEventListener("touchstart", handleFirstGesture, { once: true, passive: true });
    window.addEventListener("click", handleFirstGesture, { once: true });

    return () => {
      endLineTrigger.kill();
      if (parallaxInstanceRef.current) {
        try {
          parallaxInstanceRef.current.destroy();
        } catch {}
        parallaxInstanceRef.current = null;
      }
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("click", handleFirstGesture);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Landing Page Reveal Preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Hero — direct children of #hero-section are parallax layers.
          Each layer's `data-depth` controls how much it moves with the cursor. */}
      <div id="hero-section" ref={sectionRef}>
        {/* Animated fluid background. Not a `.hero-layer` so parallax-js skips it. */}
        <div id="hero-bg-fluid">
          <LiquidEther
            colors={HERO_LIQUID_COLORS}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Back stroke (behind heading) */}
        <div className="hero-layer" data-depth="0.20" style={{ zIndex: 4 }}>
          <div id="hero-stroke-2" ref={stroke2Ref}>
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        {/* Heading text (deepest, moves least) */}
        <div className="hero-layer" data-depth="0.10" style={{ zIndex: 5 }}>
          <div id="hero-heading" ref={headingRef}>
            <SplitChars text={PROFILE.logo} />
          </div>
        </div>

        {/* Portrait image (foreground, moves more) */}
        <div className="hero-layer" data-depth="0.50" style={{ zIndex: 10 }}>
          <div id="hero-img" ref={imgRef}>
            {hasPortrait && (
              <img src="/portrait.png" alt={PROFILE.name} draggable="false" />
            )}
          </div>
        </div>

        {/* Front stroke (top-most) */}
        <div className="hero-layer" data-depth="0.30" style={{ zIndex: 11 }}>
          <div id="hero-stroke-1" ref={stroke1Ref}>
            <img src="/Svg_Stroke.png" alt="" draggable="false" />
          </div>
        </div>

        {/* End-of-hero indicator line */}
        <div className="hero-end-line" ref={endLineRef}></div>
      </div>
    </>
  );
};

export default HeroSection;
