import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "KRHS Portal | Faculty Evaluation Engine",
    template: "%s | KRHS Portal"
  },
  description: "Automated daily logging and evaluation system for KRHS International educators.",
  keywords: ["education", "school management", "daily logging", "teacher evaluation", "KRHS"],
  authors: [{ name: "Code Craft" }],
  
  // Open Graph controls how your link looks when shared on WhatsApp, Facebook, or LinkedIn
  openGraph: {
    title: "KRHS Faculty Portal",
    description: "Submit your daily classroom updates and track student engagement.",
    url: "https://teacher-s-monitoring-system.vercel.app/",
    siteName: "KRHS Portal",
    images: [
      {
        url: "/kite.png", // This image will appear in the WhatsApp link preview
        width: 800,
        height: 600,
        alt: "KRHS Portal Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  
  // Instructs Google's web crawlers to index the site
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
