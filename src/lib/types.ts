// Shared client-side types mirroring the Prisma models (serializable form)

export type Profile = {
  id: string;
  name: string;
  title: string;
  bio: string;
  about: string;
  approach: string | null;
  values: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  photoUrl: string | null;
  available: boolean;
  yearsExperience: number;
  projectsDone: number;
  clientsServed: number;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  color: string | null;
  order: number;
  visible: boolean;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
};

export type Service = {
  id: string;
  number: number;
  title: string;
  slug: string;
  icon: string;
  summary: string;
  content: string | null;
  features: string | null;
  featured: boolean;
  order: number;
  visible: boolean;
  categoryId: string | null;
  category?: Category | null;
};

export type SolutionFeature = { id: string; title: string; order: number };
export type SolutionImage = { id: string; url: string; caption: string | null; order: number };

export type Solution = {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  technology: string;
  status: string;
  summary: string;
  description: string | null;
  demoUrl: string | null;
  industries: string | null;
  pricingNote: string | null;
  order: number;
  visible: boolean;
  features: SolutionFeature[];
  images: SolutionImage[];
};

export type ProjectImage = { id: string; url: string; caption: string | null; order: number };

export type Project = {
  id: string;
  title: string;
  slug: string;
  categoryName: string;
  technology: string;
  status: string;
  summary: string;
  objectives: string | null;
  features: string | null;
  devDetails: string | null;
  demoUrl: string | null;
  githubUrl: string | null;
  thumbnail: string | null;
  featured: boolean;
  order: number;
  visible: boolean;
  images: ProjectImage[];
};

export type Testimonial = {
  id: string;
  clientName: string;
  designation: string;
  business: string | null;
  review: string;
  rating: number;
  date: string | null;
  projectRef: string | null;
  screenshotUrl: string | null;
  proofUrl: string | null;
  photoUrl: string | null;
  visible: boolean;
  order: number;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string;
  url: string;
  icon: string;
  enabled: boolean;
  order: number;
};

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  icon: string | null;
  order: number;
  enabled: boolean;
};

export type SiteSetting = {
  id: string;
  siteName: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  contactEmail: string;
  whatsappNumber: string;
  footerContent: string | null;
};

export type PublicData = {
  profile: Profile | null;
  skills: Skill[];
  services: Service[];
  solutions: Solution[];
  projects: Project[];
  testimonials: Testimonial[];
  socials: SocialLink[];
  navigation: NavigationItem[];
  settings: SiteSetting | null;
};

export type DetailTarget =
  | { kind: "service"; id: string }
  | { kind: "solution"; id: string }
  | { kind: "project"; id: string }
  | { kind: "page"; id: "ai-seo" | "privacy" }
  | null;
