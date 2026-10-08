"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { PROJECTS } from "@/data/profile";

// Lazy-load Three.js so it doesn't block initial page paint
const CylinderRings = dynamic(() => import("./CylinderRings"), { ssr: false });

// Map PROJECTS data → CylinderRings item format
// Each ring: { title, category, description, metrics, accent, specItems }
const RING_COLORS = [
  { accent: "#a9dc98" },  // green
  { accent: "#8fb8e3" },  // blue
  { accent: "#ff6a6a" },  // red
  { accent: "#e8dcc5" },  // cream
];

const CYLINDER_ITEMS = PROJECTS.map((project, i) => {
  // Extract tech names from the note for the spec column
  const techMatch = project.note.match(/^([^.]+)\./);
  const techList = techMatch
    ? techMatch[1].split(",").map((s) => s.trim())
    : [];

  return {
    title: project.name,
    category: project.kind || project.role,
    description: project.note,
    metrics: project.role,
    accent: RING_COLORS[i % RING_COLORS.length].accent,
    specItems: techList.slice(0, 4),
  };
});

const CYLINDER_CONFIGS = RING_COLORS.map((c) => ({
  accent: c.accent,
  specItems: [],
}));

const ProjectsCylinder = () => {
  const [cursorState, setCursorState] = useState({
    text: "",
    isHovering: false,
  });

  const handleSelect = (item) => {
    // Find the matching project and open its link
    const project = PROJECTS.find((p) => p.name === item.title);
    if (project?.href) {
      window.open(project.href, "_blank", "noopener");
    }
  };

  return (
    <section id="projects-section" className="relative">
      <span id="techstack-section" style={{ position: "absolute", top: 0 }} />
      <div className="ts-head">
        <span className="ts-label">PROJECTS</span>
        <h2 className="ts-title">selected work</h2>
      </div>

      <div className="ts-cylinder-wrapper">
        <CylinderRings
          items={CYLINDER_ITEMS}
          configs={CYLINDER_CONFIGS}
          onSelect={handleSelect}
          setCursorState={setCursorState}
        />
      </div>
    </section>
  );
};

export default ProjectsCylinder;
