"use client";

import React, { useRef, useEffect, useId } from "react";
import { TECH_STACK_LOGOS } from "@/data/skills";
import "./LogoLoop.css";

/**
 * LogoLoop Component
 * Inspired by React Bits: https://reactbits.dev/animations/logo-loop?hoverSpeed=200&logoHeight=80&gap=70
 *
 * @param {Array} items - List of technology logo objects { name, category, icon, color }
 * @param {number} speed - Base animation loop duration in seconds (default: 45)
 * @param {number} hoverSpeed - Slower speed in seconds when hovering (default: 200)
 * @param {number} logoHeight - Height of each logo pill in px (default: 80)
 * @param {number} gap - Spacing between logo pills in px (default: 70)
 * @param {string} direction - Direction of movement: "left" or "right" (default: "left")
 * @param {string} ariaLabel - Accessible landmark label
 */
export default function LogoLoop({
  items = TECH_STACK_LOGOS,
  speed = 45,
  hoverSpeed = 200,
  logoHeight = 80,
  gap = 70,
  direction = "left",
  ariaLabel = "Technology stack logo showcase",
}) {
  const trackRef = useRef(null);
  const animRef = useRef(null);
  const rafId = useRef(null);
  const currentRate = useRef(1);
  const targetRate = useRef(1);
  const uniqueId = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const track = trackRef.current;
    if (!track) return;

    // Grab the active CSS animation or register Web Animations API instance
    const animations = track.getAnimations();
    const anim = animations.length > 0 ? animations[0] : null;
    animRef.current = anim;

    const targetHoverRatio = Math.max(0.05, speed / hoverSpeed);

    const updateRate = () => {
      // Smooth linear interpolation for playback rate
      currentRate.current += (targetRate.current - currentRate.current) * 0.08;

      if (animRef.current) {
        try {
          animRef.current.playbackRate = currentRate.current;
        } catch {
          // Fallback if browser security or context restricts playbackRate
        }
      }

      if (Math.abs(targetRate.current - currentRate.current) > 0.005) {
        rafId.current = requestAnimationFrame(updateRate);
      } else {
        currentRate.current = targetRate.current;
        if (animRef.current) {
          try {
            animRef.current.playbackRate = targetRate.current;
          } catch {}
        }
        rafId.current = null;
      }
    };

    const handleMouseEnter = () => {
      targetRate.current = targetHoverRatio;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateRate);
      }
    };

    const handleMouseLeave = () => {
      targetRate.current = 1.0;
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(updateRate);
      }
    };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [speed, hoverSpeed]);

  return (
    <div
      className="logo-loop-container"
      aria-label={ariaLabel}
      style={{
        "--loop-duration": `${speed}s`,
        "--loop-gap": `${gap}px`,
        "--logo-height": `${logoHeight}px`,
      }}
    >
      <div
        className="logo-loop-track"
        ref={trackRef}
        style={{
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {/* Primary Set */}
        <div className="logo-loop-list">
          {items.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={`primary-${tech.name}-${i}`}
                className="logo-loop-item"
                style={{
                  "--item-color": tech.color || "var(--color-accent)",
                }}
                title={tech.name}
              >
                <div className="logo-loop-icon" aria-hidden="true">
                  {Icon && <Icon />}
                </div>
                <div className="logo-loop-info">
                  <span className="logo-loop-name">{tech.name}</span>
                  {tech.category && (
                    <span className="logo-loop-cat">{tech.category}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Seamless Duplicate Set (Screen-reader hidden) */}
        <div className="logo-loop-list" aria-hidden="true">
          {items.map((tech, i) => {
            const Icon = tech.icon;
            return (
              <div
                key={`dupe-${tech.name}-${i}`}
                className="logo-loop-item"
                style={{
                  "--item-color": tech.color || "var(--color-accent)",
                }}
                tabIndex={-1}
              >
                <div className="logo-loop-icon">
                  {Icon && <Icon />}
                </div>
                <div className="logo-loop-info">
                  <span className="logo-loop-name">{tech.name}</span>
                  {tech.category && (
                    <span className="logo-loop-cat">{tech.category}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
