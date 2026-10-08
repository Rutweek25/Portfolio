"use client";

import React, { useEffect, useRef } from "react";
import { MARQUEE_ITEMS } from "@/data/profile";
import "./Marquee.css";

const Marquee = () => {
  const trackRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    if (!track) return;

    let targetRate = 1;
    let currentRate = 1;
    let rafId = null;

    const updateSpeed = () => {
      currentRate += (targetRate - currentRate) * 0.1;
      targetRate += (1 - targetRate) * 0.05;

      if (track) {
        try {
          const animations = track.getAnimations();
          for (const anim of animations) {
            anim.playbackRate = currentRate;
          }
        } catch {
          // Fallback if Web Animations API is unavailable
        }
      }

      if (Math.abs(currentRate - 1) > 0.02 || Math.abs(targetRate - 1) > 0.02) {
        rafId = requestAnimationFrame(updateSpeed);
      } else {
        currentRate = 1;
        targetRate = 1;
        try {
          const animations = track.getAnimations();
          for (const anim of animations) {
            anim.playbackRate = 1;
          }
        } catch {
          // Fallback if Web Animations API is unavailable
        }
        rafId = null;
      }
    };

    const handleScroll = (e) => {
      const velocity = Math.abs(e?.velocity || 0);
      // Subtle speed-up capped at 2.2x normal speed
      targetRate = 1 + Math.min(velocity * 0.003, 1.2);
      if (!rafId) {
        rafId = requestAnimationFrame(updateSpeed);
      }
    };

    // Connect to Lenis smooth-scroll instance if available
    const checkLenis = () => {
      const lenis = window.__lenis;
      if (lenis && typeof lenis.on === "function") {
        lenis.on("scroll", handleScroll);
        return true;
      }
      return false;
    };

    if (!checkLenis()) {
      // If lenis initializes slightly later, retry once
      const timer = setTimeout(checkLenis, 300);
      return () => {
        clearTimeout(timer);
        if (rafId) cancelAnimationFrame(rafId);
      };
    }

    return () => {
      const lenis = window.__lenis;
      if (lenis && typeof lenis.off === "function") {
        lenis.off("scroll", handleScroll);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className="marquee-wrapper" aria-label="Tech stack showcase">
      <div className="marquee-track" ref={trackRef}>
        <div className="marquee-group">
          {MARQUEE_ITEMS.map((item, index) => (
            <span key={`first-${index}`} className="marquee-item">
              <span>{item}</span>
              <span className="marquee-dot" aria-hidden="true">
                •
              </span>
            </span>
          ))}
        </div>
        <div
          className="marquee-group marquee-group--duplicate"
          aria-hidden="true"
        >
          {MARQUEE_ITEMS.map((item, index) => (
            <span key={`dupe-${index}`} className="marquee-item">
              <span>{item}</span>
              <span className="marquee-dot" aria-hidden="true">
                •
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Marquee;
