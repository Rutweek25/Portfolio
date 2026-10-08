"use client";
import { Suspense, useRef, useEffect } from "react";
import FeaturedVideo from "@/components/Featured/FeaturedVideo";
import Header from "@/components/Featured/Header";
import Skiggle from "@/components/Featured/Skiggle";
import SubHeader from "@/components/Featured/SubHeader";
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection/HeroSection";
import SmoothScroll from "@/components/SmoothScroll";
import GradualBlur from "@/components/GradualBlur/GradualBlur";
import HorizontalScroll from "@/components/HorizontalScroll/HorizontalScroll";
import Education from "@/components/Education/Education";
import TechStackSection from "@/components/TechStack/TechStackSection";
import Contact from "@/components/Contact/Contact";
import SiteFooter from "@/components/SiteFooter/SiteFooter";
import ProjectsCylinder from "@/components/TechStack/TechStack";
import Certifications from "@/components/Certifications/Certifications";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const ref = useRef(null);
  const blurRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const blur = blurRef.current;
    const footer = document.getElementById("main-footer");
    if (!blur || !footer) return;

    // The GradualBlur effect should be visible across the whole site, but
    // disabled while the footer is on screen — the footer is the one
    // component that opts out of the blur. Compute the initial visibility
    // from the footer's current viewport position so a hard reload anywhere
    // on the page lands in the correct state, then keep it in sync as the
    // user scrolls past the footer in either direction.
    const setVisible = (visible) =>
      gsap.to(blur, { autoAlpha: visible ? 1 : 0, duration: 0.3 });

    const footerInView = footer.getBoundingClientRect().top < window.innerHeight;
    gsap.set(blur, { autoAlpha: footerInView ? 0 : 1 });

    const trigger = ScrollTrigger.create({
      trigger: footer,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => setVisible(false),
      onEnterBack: () => setVisible(false),
      onLeave: () => setVisible(false),
      onLeaveBack: () => setVisible(true),
    });

    return () => trigger.kill();
  }, []);

  return (
    <SmoothScroll>
      <Suspense
        fallback={
          <div className="w-screen bg-black h-screen text-white text-4xl md:text-7xl lg:text-9xl flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <div className="bg-bg text-fg h-auto w-screen overflow-x-hidden">
          <Navbar />

          <HeroSection />

          <div
            id="intro"
            className="relative w-full h-auto mt-16 md:mt-24 flex flex-col pb-20 md:pb-28 overflow-hidden"
            ref={ref}
          >
            {/* Backward compatibility anchor for #about */}
            <span id="about" style={{ position: "absolute", top: 0 }} />

            <Skiggle />

            {/* Introduction Section Header Bar with Eyebrow and Top-Right Resume Button */}
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between z-20 mb-6 md:mb-8">
              <div className="font-mono text-xs sm:text-sm tracking-[0.35em] font-semibold uppercase text-accent flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                01 / INTRODUCTION
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                id="intro-resume-btn"
                aria-label="View Rutweek Vaidya Resume"
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 py-2 sm:px-6 sm:py-2.5 rounded-full border border-theme-border bg-bg-alt/90 text-fg hover:text-white hover:bg-accent backdrop-blur-md font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                <span>RESUME</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold"
                >
                  ↗
                </span>
              </a>
            </div>

            <Header />
            <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 mt-10 md:mt-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-12 lg:gap-16 z-10">
              <FeaturedVideo refForward={ref} />
              <SubHeader />
            </div>
          </div>

          <Education />

          <TechStackSection />

          <ProjectsCylinder />

          <Certifications />

          <HorizontalScroll />
          <Contact />
          <SiteFooter />

          {/* GradualBlur — hidden when footer is in view */}
          <div
            ref={blurRef}
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              pointerEvents: "none",
              zIndex: 99999,
            }}
          >
            <GradualBlur
              target="parent"
              position="bottom"
              height="6rem"
              strength={2}
              divCount={6}
              curve="bezier"
              exponential={false}
              opacity={0.9}
              zIndex={1}
            />
          </div>
        </div>
      </Suspense>
    </SmoothScroll>
  );
}
