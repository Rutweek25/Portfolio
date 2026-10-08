"use client";

import React, { useState } from "react";
import { a, useSpring } from "@react-spring/web";
import { PROFILE } from "@/data/profile";

const ResumeButton = () => {
  const [hovered, setHovered] = useState(false);
  const resumeUrl = PROFILE.resume || "/resume.pdf";

  const [arrowSpring, arrowApi] = useSpring(() => ({
    y: 0,
    x: 0,
    config: { tension: 300, friction: 15 },
  }));

  const handleMouseEnter = () => {
    setHovered(true);
    arrowApi.start({ y: -2, x: 2 });
  };

  const handleMouseLeave = () => {
    setHovered(false);
    arrowApi.start({ y: 0, x: 0 });
  };

  return (
    <a
      href={resumeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Resume"
      className="nav_btn_lg flex items-center justify-center py-6 px-4 cursor-pointer transition-colors duration-200 border border-theme-border/60 bg-bg-alt hover:bg-accent hover:text-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="font-semibold tracking-wider text-sm">RESUME&nbsp;</span>
      <a.span style={arrowSpring} className="inline-block text-xs font-bold leading-none" aria-hidden="true">
        ↗
      </a.span>
    </a>
  );
};

export default ResumeButton;
