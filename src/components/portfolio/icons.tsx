import {
  createElement,
  type ReactNode,
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
  Twitter,
  Link as LinkIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
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
  Twitter,
  Link: LinkIcon,
  Sparkles,
};

export function getIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return MAP[name] ?? Sparkles;
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


