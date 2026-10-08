"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useOptionalImage from "../useOptionalImage";
import { EDUCATION, EDUCATION_SECTION } from "@/data/profile";
import "./Education.css";

// Optional school logo: drop /public/logos/<id>.png (ids are in data/profile.js)
// and it replaces the initials badge automatically.
const Logo = ({ id, initials, school }) => {
  const src = `/logos/${id}.png`;
  const hasLogo = useOptionalImage(src);
  return (
    <div className="edu-logo">
      {hasLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${school} logo`} draggable="false" />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
};

const Education = () => {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading lines slide up out of a mask.
      gsap.from(".edu-title-line > span", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".edu-title",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // The blue spine fills as the timeline scrolls through the viewport.
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top 60%",
            end: "bottom 70%",
            scrub: 0.4,
          },
        }
      );

      gsap.utils.toArray(".edu-item").forEach((item) => {
        const card = item.querySelector(".edu-card");
        const fromX = item.classList.contains("edu-item--right") ? 60 : -60;

        gsap.from(card, {
          opacity: 0,
          x: fromX,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });

        // Lights the dot up once the spine reaches it.
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%",
          onEnter: () => item.classList.add("is-active"),
          onLeaveBack: () => item.classList.remove("is-active"),
        });
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section id="education" className="edu" ref={sectionRef}>
      <span id="where-journey-begin" style={{ position: "absolute", top: 0 }} />
      <div className="edu-eyebrow">{EDUCATION_SECTION.eyebrow}</div>

      <h2 className="edu-title">
        <span className="edu-title-line">
          <span>{EDUCATION_SECTION.titleTop}</span>
        </span>
        <span className="edu-title-line edu-title-line--accent">
          <span>{EDUCATION_SECTION.titleAccent}</span>
        </span>
      </h2>

      <div className="edu-rule" />

      <div className="edu-timeline" ref={timelineRef}>
        <div className="edu-track" aria-hidden="true">
          <div className="edu-fill" ref={fillRef} />
        </div>

        {EDUCATION.map((item, i) => (
          <article
            key={item.id}
            className={`edu-item${i % 2 === 1 ? " edu-item--right" : ""}`}
          >
            <span className="edu-connector" aria-hidden="true" />
            <span className="edu-dot" aria-hidden="true" />

            <div className="edu-card">
              <Logo id={item.id} initials={item.initials} school={item.school} />

              <div className="edu-body">
                <div className="edu-head">
                  <h3 className="edu-school">{item.school}</h3>
                  <span className="edu-year">{item.year}</span>
                </div>

                <p className="edu-meta">
                  <span>
                    {item.level}
                    {item.board ? ` · ${item.board}` : ""}
                  </span>
                  <span className="edu-sep" aria-hidden="true">
                    •
                  </span>
                  <strong>{item.score}</strong>
                </p>

                <p className="edu-blurb">{item.blurb}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Education;
