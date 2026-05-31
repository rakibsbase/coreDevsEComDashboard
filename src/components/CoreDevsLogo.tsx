import React from "react";

interface CoreDevsLogoProps {
  className?: string; // class for the container
  iconSize?: string;  // size for the SVG icon container
  withText?: boolean; // whether to show "Core Devs" text next to or under
  vertical?: boolean; // text layout direction
}

export default function CoreDevsLogo({
  className = "",
  iconSize = "w-9 h-9",
  withText = false,
  vertical = false
}: CoreDevsLogoProps) {
  return (
    <div className={`flex ${vertical ? "flex-col items-center" : "items-center gap-3"} group/logo ${className}`}>
      {/* Premium Core Devs Emblem */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-violet-400 text-white shadow-md shadow-primary/25 transition-transform duration-300 group-hover/logo:scale-105 p-1.5 shrink-0 ${iconSize}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left bracket < */}
          <polyline points="9 18 3 12 9 6" />
          {/* Right bracket > */}
          <polyline points="15 6 21 12 15 18" />
          {/* Floating glowing core pixel/node in middle */}
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      </div>

      {withText && (
        <span
          className={`font-display font-bold tracking-tight text-text-primary uppercase transition-colors duration-200 ${
            vertical ? "text-sm sm:text-base mt-2 text-center" : "text-sm sm:text-base lg:text-lg"
          }`}
        >
          Core Devs
        </span>
      )}
    </div>
  );
}
