"use client";

import * as React from "react";
import {
  siHtml5,
  siCss,
  siJavascript,
  siBootstrap,
  siTailwindcss,
  siPhp,
  siMysql,
  siReact,
  siNodedotjs,
  siExpress,
  siPostgresql,
  type SimpleIcon,
} from "simple-icons";

// Map technology name (as stored in DB) -> official brand icon
const LOGO_MAP: Record<string, SimpleIcon> = {
  HTML5: siHtml5,
  CSS3: siCss,
  JavaScript: siJavascript,
  Bootstrap: siBootstrap,
  "Tailwind CSS": siTailwindcss,
  "Pure PHP": siPhp,
  PHP: siPhp,
  MySQL: siMysql,
  "React.js": siReact,
  React: siReact,
  "Node.js": siNodedotjs,
  Node: siNodedotjs,
  "Express.js": siExpress,
  Express: siExpress,
  PostgreSQL: siPostgresql,
};

// Some brand colors are too dark to read on a dark card (e.g. Express #0A0A0A).
// Override those to a readable tone.
const COLOR_OVERRIDE: Record<string, string> = {
  "Express.js": "#A1A1AA",
  Express: "#A1A1AA",
};

function hexLuminance(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length !== 6) return 1;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function TechLogo({
  name,
  fallbackColor,
  className,
}: {
  name: string;
  fallbackColor?: string | null;
  className?: string;
}) {
  const icon = LOGO_MAP[name];
  if (!icon) {
    // Fallback: colored letter tile (for admin-added custom technologies)
    const bg = fallbackColor || "#8B5CF6";
    return (
      <span
        className={`inline-flex items-center justify-center rounded-lg font-mono text-sm font-bold text-white ${className ?? ""}`}
        style={{ backgroundColor: bg, width: "2.25rem", height: "2.25rem" }}
      >
        {name.charAt(0)}
      </span>
    );
  }

  // Pick a readable color: override > brand hex > fallback
  let color = COLOR_OVERRIDE[name] || `#${icon.hex}`;
  if (!COLOR_OVERRIDE[name] && hexLuminance(color) < 0.18) {
    color = "#A1A1AA";
  }

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg border border-border bg-background ${className ?? ""}`}
      style={{ width: "2.25rem", height: "2.25rem" }}
    >
      <svg
        viewBox="0 0 24 24"
        role="img"
        aria-label={name}
        fill={color}
        className="size-5"
      >
        <path d={icon.path} />
      </svg>
    </span>
  );
}

export function hasTechLogo(name: string): boolean {
  return !!LOGO_MAP[name];
}
