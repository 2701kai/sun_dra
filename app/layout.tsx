import type { Metadata, Viewport } from "next";
import { Fraunces, Shrikhand } from "next/font/google";
import { Providers } from "@/components/motion/Providers";
import "./globals.css";

const shrikhand = Shrikhand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shrikhand",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "variable",
  axes: ["opsz", "SOFT"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "sun_dra · Sandra, a free spirit in her own paradise",
  description:
    "An over-the-top 70s birthday celebration for Sandra: twenty thousand kilometres away from home, exactly where she belongs.",
  openGraph: {
    title: "Happy Birthday, Sandra",
    description: "A celebration of beautiful women in general, and one free spirit in particular.",
    images: ["/media/sandra-sun.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#f6ead2",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${shrikhand.variable} ${fraunces.variable}`}>
      <body className="grain">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
