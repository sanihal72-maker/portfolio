import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { Providers } from "@/components/providers";

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

export const metadata: Metadata = {
  title: "Arya Dev — Full-Stack Developer & Business Solutions Specialist",
  description:
    "Premium portfolio of a Full-Stack Developer building websites, e-commerce, POS/ERP solutions, and AI SEO services. Custom software for real businesses.",
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
  authors: [{ name: "Arya Dev" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Arya Dev — Full-Stack Developer & Business Solutions Specialist",
    description:
      "Building digital experiences. Websites, E-commerce, POS/ERP, AI SEO and custom business solutions.",
    siteName: "Arya Dev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arya Dev — Full-Stack Developer & Business Solutions Specialist",
    description:
      "Building digital experiences. Websites, E-commerce, POS/ERP, AI SEO and custom business solutions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
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
