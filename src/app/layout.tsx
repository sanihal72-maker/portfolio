import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";

import { db } from "@/lib/db";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let favicon = "/logo.svg";
  let siteName = "Sajid Al Nihal";
  let description = "Premium portfolio of a Full-Stack Developer building websites, e-commerce, POS/ERP solutions, and AI SEO services.";

  try {
    const settings = await db.siteSetting.findFirst();
    const profile = await db.profile.findFirst();
    if (settings?.faviconUrl) favicon = settings.faviconUrl;
    if (settings?.siteName) siteName = settings.siteName;
    else if (profile?.name) siteName = profile.name;
    if (profile?.bio) description = profile.bio;
  } catch {
    // fallback if db error
  }

  const title = `${siteName} — Full-Stack Developer & Business Solutions Specialist`;

  return {
    title,
    description,
    keywords: [
      "Full-Stack Developer",
      "Business Solutions",
      "E-commerce Development",
      "POS ERP",
      "AI SEO",
      "Website Development",
      "React",
      "Node.js",
    ],
    authors: [{ name: siteName }],
    icons: {
      icon: [{ url: favicon }],
      shortcut: [{ url: favicon }],
      apple: [{ url: favicon }],
    },
    openGraph: {
      title,
      description,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Providers>
            {children}
            <Toaster />
            <SonnerToaster richColors position="top-right" theme="dark" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
