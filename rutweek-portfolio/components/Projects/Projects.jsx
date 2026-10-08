"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PROJECTS,
  SKILLS,
  ACHIEVEMENTS,
} from "@/data/profile";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="100%"
    height="100%"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

const Row = ({ item, index }) => {
  const hasLink = Boolean(item.href);
  const Wrapper = hasLink ? "a" : "div";
  const wrapperProps = hasLink
    ? { href: item.href, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <li className="pj-row">
      <Wrapper
        className={`pj-link${hasLink ? "" : " pj-link--static"}`}
        {...wrapperProps}
      >
        <span className="pj-num">{String(index + 1).padStart(2, "0")}</span>
        <div className="pj-meta">
          <span className="pj-name">{item.name}</span>
          {item.role && <span className="pj-role">{item.role}</span>}
          {item.note && <span className="pj-note">{item.note}</span>}
        </div>
        <span className="pj-kind">{item.kind}</span>
        <span className="pj-arrow" aria-hidden="true">
          {hasLink ? <ArrowIcon /> : <span className="pj-dot">•</span>}
        </span>
      </Wrapper>
    </li>
  );
};

const Block = ({ id, label, title, items, secondary }) => (
  <>
    <div
      id={id}
      className={`pj-head${secondary ? " pj-head--secondary" : ""}`}
    >
      <span className="pj-label">{label}</span>
      <h2 className="pj-title">{title}</h2>
    </div>
    <ul className="pj-list">
      {items.map((item, i) => (
        <Row key={item.name} item={item} index={i} />
      ))}
    </ul>
  </>
);

const Projects = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const rows = sectionRef.current.querySelectorAll(".pj-row");
      gsap.from(rows, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });

      const titles = sectionRef.current.querySelectorAll(".pj-title");
      gsap.from(titles, {
        opacity: 0,
        y: 40,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects-section" ref={sectionRef}>
      <Block label="PROJECTS" title="selected work" items={PROJECTS} />
      <Block id="skills" label="TECH STACK" title="what i use" items={SKILLS} secondary />
      <Block id="achievements" label="ACHIEVEMENTS" title="beyond the code" items={ACHIEVEMENTS} secondary />
    </section>
  );
};

export default Projects;
