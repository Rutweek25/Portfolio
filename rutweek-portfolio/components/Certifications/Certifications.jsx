"use client";

import React, { useState, useMemo } from "react";
import { CERTIFICATIONS_DATA } from "@/data/certifications";
import CertificationCard from "./CertificationCard";

export default function Certifications() {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const list = ["All"];
    CERTIFICATIONS_DATA.forEach((c) => {
      if (c.category && !list.includes(c.category)) {
        list.push(c.category);
      }
    });
    return list;
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === "All") return CERTIFICATIONS_DATA;
    return CERTIFICATIONS_DATA.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return (
    <section
      id="certifications"
      className="relative w-full py-24 sm:py-32 bg-bg text-fg overflow-hidden"
      aria-label="Certifications and Credentials"
    >
      {/* Anchors for navigation */}
      <span id="achievements" style={{ position: "absolute", top: 0 }} />
      <span id="certification" style={{ position: "absolute", top: 0 }} />

      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16">
        {/* Section Eyebrow */}
        <div className="font-mono text-xs sm:text-sm tracking-[0.35em] font-semibold uppercase text-accent">
          05 / CERTIFICATIONS &amp; CREDENTIALS
        </div>

        {/* Section Heading & Subtitle */}
        <div className="mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-theme-border/60">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-fg leading-[1.05]">
              Validated depth,{" "}
              <span className="text-accent underline decoration-accent/30 decoration-wavy underline-offset-4">
                proven execution.
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-base sm:text-lg text-fg-muted leading-relaxed">
              Industry credentials, specialized academic foundations, and
              competitive problem-solving milestones verifying hands-on technical competence.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div
            className="flex flex-wrap gap-2 pt-2 md:pt-0"
            role="tablist"
            aria-label="Filter certifications"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-accent border-accent text-white shadow-md shadow-accent/20 font-semibold"
                    : "bg-transparent border-theme-border text-fg-muted hover:border-accent hover:text-fg"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Card Grid (Desktop: 4, Tablet: 2, Mobile: 1) */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {filteredItems.map((cert, index) => (
            <CertificationCard
              key={cert.id}
              cert={cert}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
