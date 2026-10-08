"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

/**
 * CertificationCard Component
 * Centered layout:
 *   [ circular logo ]
 *   Certification Name
 *   Issuer
 *   Year
 *
 * Responsive, subtle border, smooth 300ms hover lift and glow.
 */
export default function CertificationCard({ cert, index = 0 }) {
  const [imgError, setImgError] = useState(false);
  const hasLink = Boolean(cert.credentialUrl);

  const CardWrapper = hasLink ? motion.a : motion.article;
  const linkProps = hasLink
    ? {
        href: cert.credentialUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `View credential for ${cert.title} (opens in new tab)`,
      }
    : {
        role: "article",
        "aria-label": `${cert.title} by ${cert.issuer}`,
      };

  return (
    <CardWrapper
      {...linkProps}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative flex flex-col items-center text-center justify-between p-8 sm:p-10 rounded-2xl bg-bg-alt border border-theme-border transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-accent/60 ${
        hasLink ? "cursor-pointer" : "cursor-default"
      }`}
      style={{
        boxShadow: "0 4px 20px -4px rgba(0, 0, 0, 0.03)",
      }}
    >
      {/* Ambient hover glow inside card */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, color-mix(in srgb, var(--color-accent) 8%, transparent) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Card Content Top & Middle */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Centered Circular Logo Container */}
        <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full p-4 mb-6 flex items-center justify-center bg-bg border border-theme-border/80 transition-transform duration-300 ease-out group-hover:scale-105 shadow-sm">
          {!imgError && cert.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cert.logo}
              alt={`${cert.issuer} logo`}
              className="w-full h-full object-contain pointer-events-none"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <span
              className="font-mono font-bold text-base sm:text-lg text-accent tracking-wider select-none"
              aria-hidden="true"
            >
              {cert.initials || cert.issuer.slice(0, 3).toUpperCase()}
            </span>
          )}
        </div>

        {/* Certification Title */}
        <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-fg leading-snug group-hover:text-accent transition-colors duration-200">
          {cert.title}
        </h3>

        {/* Issuing Organization */}
        <p className="mt-2.5 text-sm sm:text-base font-normal text-fg-muted">
          {cert.issuer}
        </p>
      </div>

      {/* Card Footer: Year & Optional Credential Action */}
      <div className="relative z-10 mt-8 pt-6 w-full border-t border-theme-border/60 flex flex-col items-center gap-2">
        <span className="font-mono text-xs tracking-widest uppercase text-fg-subtle px-3 py-1 rounded-full border border-theme-border bg-bg/50">
          {cert.year}
        </span>

        {hasLink && (
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-accent tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity mt-1">
            <span>View Credential</span>
            <svg
              className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </span>
        )}
      </div>
    </CardWrapper>
  );
}
