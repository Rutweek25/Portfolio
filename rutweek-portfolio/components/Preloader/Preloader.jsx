"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { PROFILE } from "@/data/profile";
import "./Preloader.css";

const Preloader = ({ onComplete }) => {
  const backdropRef = useRef(null);
  const preloaderRef = useRef(null);
  const btnContainerRef = useRef(null);
  const btnTrackRef = useRef(null);
  const btnProgressRef = useRef(null);
  const svgStrokesRef = useRef(null);
  const counterValRef = useRef(null);
  const counterWrapRef = useRef(null);
  const labelRef = useRef(null);
  const outroLabelRef = useRef(null);

  const [isReady, setIsReady] = useState(false);
  const hasExitedRef = useRef(false);
  const autoTriggerTimerRef = useRef(null);

  const triggerExit = useCallback(() => {
    if (hasExitedRef.current) return;
    hasExitedRef.current = true;

    if (autoTriggerTimerRef.current) {
      clearTimeout(autoTriggerTimerRef.current);
      autoTriggerTimerRef.current = null;
    }

    const track = btnTrackRef.current;
    const progress = btnProgressRef.current;
    const pathLength = track ? track.getTotalLength() : 942.5;

    const exitTl = gsap.timeline({
      onComplete: () => {
        if (preloaderRef.current) preloaderRef.current.style.display = "none";
        if (backdropRef.current) backdropRef.current.style.display = "none";
        document.body.style.overflow = "";
        if (typeof onComplete === "function") {
          onComplete();
        }
      },
    });

    exitTl
      .to(preloaderRef.current, {
        scale: 0.8,
        duration: 1.1,
        ease: "hop",
      })
      .to(
        [track, progress],
        {
          strokeDashoffset: -pathLength,
          duration: 1.1,
          ease: "hop",
        },
        "<"
      )
      .to(
        labelRef.current,
        {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=1.0"
      )
      .to(
        outroLabelRef.current,
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "power3.out",
        },
        "-=0.6"
      )
      .to(
        preloaderRef.current,
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 1.35,
          ease: "hop",
        },
        "-=0.2"
      )
      .to(
        backdropRef.current,
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          duration: 1.35,
          ease: "hop",
        },
        "-=1.2"
      );
  }, [onComplete]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(CustomEase);
    try {
      CustomEase.create("hop", "0.9, 0, 0.1, 1");
      CustomEase.create("glide", "0.8, 0, 0.2, 1");
    } catch {
      // If already registered, continue
    }

    document.body.style.overflow = "hidden";

    const track = btnTrackRef.current;
    const progress = btnProgressRef.current;
    if (!track || !progress) return;

    const pathLength = track.getTotalLength() || 942.5;

    // Set initial dash attributes
    gsap.set([track, progress], {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const lines = preloaderRef.current?.querySelectorAll(".preloader-line") || [];
    gsap.set(lines, { yPercent: 105 });
    gsap.set(labelRef.current, { autoAlpha: 0, yPercent: 100 });
    gsap.set(outroLabelRef.current, { autoAlpha: 0, yPercent: 100 });

    const counterObj = { value: 0 };

    const introTl = gsap.timeline({ delay: 0.4 });

    // Lines slide up into view
    introTl
      .to(lines, {
        yPercent: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
      })
      .to(
        track,
        {
          strokeDashoffset: 0,
          duration: 2.1,
          ease: "hop",
        },
        "<"
      )
      .to(
        svgStrokesRef.current,
        {
          rotation: 270,
          duration: 2.1,
          ease: "hop",
        },
        "<"
      );

    // 0 to 100 counter and synchronized circular stroke progress
    introTl.to(
      counterObj,
      {
        value: 100,
        duration: 2.3,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.floor(counterObj.value);
          if (counterValRef.current) {
            counterValRef.current.innerText = `${val}`;
          }
          if (progress) {
            const currentOffset = pathLength - (pathLength * val) / 100;
            gsap.set(progress, { strokeDashoffset: currentOffset });
          }
        },
        onComplete: () => {
          setIsReady(true);
        },
      },
      "<+=0.2"
    );

    // Reveal "ENGAGE" button
    introTl
      .to(
        counterWrapRef.current,
        {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.1"
      )
      .to(
        labelRef.current,
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: 0.65,
          ease: "power3.out",
        },
        "-=0.2"
      )
      .to(
        btnContainerRef.current,
        {
          scale: 0.94,
          duration: 0.8,
          ease: "hop",
          onComplete: () => {
            // Auto-trigger exit after 1.4s if visitor does not click
            autoTriggerTimerRef.current = setTimeout(() => {
              triggerExit();
            }, 1400);
          },
        },
        "-=0.4"
      );

    return () => {
      introTl.kill();
      if (autoTriggerTimerRef.current) {
        clearTimeout(autoTriggerTimerRef.current);
      }
      document.body.style.overflow = "";
    };
  }, [triggerExit]);

  return (
    <>
      {/* ── Background Technical Information Layer ── */}
      <div className="preloader-backdrop" ref={backdropRef} aria-hidden="true">
        <div className="pb-row">
          <div className="pb-col">
            <p>{PROFILE.name} // PORTFOLIO</p>
            <p>SYS_VER // 2.5.0</p>
          </div>
          <div className="pb-col">
            <p>ROLE // {PROFILE.role}</p>
            <p>DEV // REACT · NEXT · NODE</p>
          </div>
          <div className="pb-col">
            <p>LOCATION // INDIA</p>
            <p>STATUS // INITIALIZING</p>
          </div>
        </div>

        <div className="pb-row">
          <div className="pb-col">
            <p>SURFACE // STAGE 01</p>
            <p>// / / ///// / / / ///</p>
          </div>
          <div className="pb-col">
            <p>COORDINATES // 16.5062° N, 80.6480° E</p>
          </div>
          <div className="pb-col">
            <p>INTERACTIVE 3D ENGINE // READY</p>
          </div>
        </div>
      </div>

      {/* ── Active Preloader Layer ── */}
      <div className="preloader" ref={preloaderRef}>
        <div className="p-row">
          <div>
            <span className="preloader-line-mask">
              <span className="preloader-line">INITIATING SYSTEM</span>
            </span>
          </div>
          <div>
            <span className="preloader-line-mask">
              <span className="preloader-line">{PROFILE.logo} // DEV_SYS</span>
            </span>
          </div>
        </div>

        <div className="p-row">
          <div className="p-col">
            <div className="p-sub-col">
              <span className="preloader-line-mask">
                <span className="preloader-line">PHASE 01</span>
              </span>
              <span className="preloader-line-mask">
                <span className="preloader-line">SEQUENCE // 100%</span>
              </span>
            </div>
            <div className="p-sub-col">
              <span className="preloader-line-mask">
                <span className="preloader-line">SIGNAL SCAN</span>
              </span>
              <span className="preloader-line-mask">
                <span className="preloader-line">CORE MODULES OK</span>
              </span>
            </div>
          </div>
          <div className="p-col">
            <span className="preloader-line-mask">
              <span className="preloader-line">ENGAGE // READY</span>
            </span>
          </div>
        </div>

        {/* Center Circular Interactive Area */}
        <div
          className={`preloader-btn-container${isReady ? " is-ready" : ""}`}
          ref={btnContainerRef}
          onClick={() => {
            if (isReady) triggerExit();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (isReady && (e.key === "Enter" || e.key === " ")) {
              triggerExit();
            }
          }}
          aria-label="Enter portfolio"
        >
          {/* Animated 0-100 Counter */}
          <div className="pbc-center-content" ref={counterWrapRef}>
            <div className="pbc-counter-wrap">
              <span className="pbc-counter" ref={counterValRef}>
                0
              </span>
              <span className="pbc-percent">%</span>
            </div>
            <span className="pbc-status-tag">CALIBRATING</span>
          </div>

          {/* Action Labels */}
          <p id="pbc-label" ref={labelRef}>
            ENGAGE
          </p>
          <p id="pbc-outro-label" ref={outroLabelRef}>
            ACCESS GRANTED
          </p>

          {/* Dual Circle SVG Strokes */}
          <div className="pbc-svg-strokes" ref={svgStrokesRef}>
            <svg viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle
                className="stroke-track"
                ref={btnTrackRef}
                cx="160"
                cy="160"
                r="150"
                stroke="rgba(255, 255, 255, 0.16)"
                strokeWidth="2.5"
              />
              <circle
                className="stroke-progress"
                ref={btnProgressRef}
                cx="160"
                cy="160"
                r="150"
                stroke="var(--color-accent, #4A83FF)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default Preloader;
