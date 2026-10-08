import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import useOptionalImage from "../useOptionalImage";
import { ABOUT_CARD } from "@/data/profile";

// Optional photo: drop a file at /public/about-photo.jpg and it fills the card
// automatically. Without it, the card shows your initials and quick stats.
const PHOTO_SRC = "/about-photo.jpg";

const FeaturedVideo = ({ refForward, ...props }) => {
  const ref = useRef(null);
  const hasPhoto = useOptionalImage(PHOTO_SRC);

  const variants = {
    initial: { scale: 1, x: 0, y: 0 },
    animate: { scale: 1.08, x: 0, y: 0 },
  };

  const { scrollYProgress } = useScroll({
    target: refForward,
    layoutEffect: false,
  });

  const [progress, setProgress] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setProgress(value);
  });

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="initial"
      animate={progress > 0.35 ? "animate" : "initial"}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 w-[72vw] sm:w-[50vw] md:w-[32vw] lg:w-[26vw] max-w-[20rem] md:max-w-[360px] aspect-[3/4] md:aspect-[856/1024] overflow-hidden rounded-3xl shadow-xl flex-shrink-0 mx-auto md:mx-0"
      style={{
        background:
          "linear-gradient(160deg, var(--color-accent) 0%, #0A1FB8 55%, #050A52 100%)",
      }}
      {...props}
    >
      {hasPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={PHOTO_SRC}
          alt={`Portrait of ${ABOUT_CARD.initials}`}
          draggable="false"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col justify-between p-[7%] text-white">
          <div
            className="text-[0.7rem] md:text-[0.95vw] tracking-[0.28em] font-semibold uppercase opacity-80"
          >
            {ABOUT_CARD.caption}
          </div>

          <div
            className="font-semibold leading-none text-center select-none"
            style={{
              fontSize: "clamp(6rem, 17vw, 18rem)",
              letterSpacing: "-0.07em",
              color: "var(--color-accent-soft)",
            }}
          >
            {ABOUT_CARD.initials}
          </div>

          <div className="grid grid-cols-3 gap-3 border-t border-white/25 pt-[5%]">
            {ABOUT_CARD.stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span
                  className="font-semibold leading-none"
                  style={{
                    fontSize: "clamp(1.4rem, 3vw, 3.4rem)",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {s.value}
                </span>
                <span className="mt-1 text-[0.6rem] md:text-[0.8vw] tracking-[0.2em] uppercase opacity-75">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default FeaturedVideo;
