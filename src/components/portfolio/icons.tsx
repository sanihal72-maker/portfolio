import {
  createElement,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  Globe,
  ShoppingBag,
  MonitorSmartphone,
  Search,
  Wrench,
  Boxes,
  MessageCircle,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  Link as LinkIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Official X (formerly Twitter) SVG Icon
export function XIcon({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className || "size-4"}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

// Map of canonical icon names to components
const MAP: Record<string, any> = {
  globe: Globe,
  shoppingbag: ShoppingBag,
  monitorsmartphone: MonitorSmartphone,
  search: Search,
  wrench: Wrench,
  boxes: Boxes,
  messagecircle: MessageCircle,
  whatsapp: MessageCircle,
  mail: Mail,
  email: Mail,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  github: Github,
  twitter: XIcon,
  x: XIcon,
  "x-twitter": XIcon,
  link: LinkIcon,
  sparkles: Sparkles,
};

export function getIcon(name?: string | null): any {
  if (!name) return Sparkles;
  const key = name.toLowerCase().replace(/[-_\s]/g, "");
  return MAP[key] || MAP[name.toLowerCase()] || Sparkles;
}

// Helper to resolve icon by social platform name or icon name
export function getSocialIcon(platform?: string | null, iconName?: string | null): any {
  if (platform) {
    const pKey = platform.toLowerCase().trim();
    if (pKey === "x" || pKey === "twitter") return XIcon;
    if (MAP[pKey]) return MAP[pKey];
  }
  return getIcon(iconName);
}

// Module-level component for rendering icons by name. Uses createElement so
// we never assign a component to a capitalized variable during render.
export function DynamicIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}): ReactNode {
  return createElement(getIcon(name), { className });
}
