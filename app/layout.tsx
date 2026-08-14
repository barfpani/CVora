import type { Metadata } from "next";
import { Inter, Merriweather, Roboto_Mono, Outfit, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const merriweather = Merriweather({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-merriweather",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const computerModern = localFont({
  src: [
    {
      path: "../computer-modern/cmunrm.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../computer-modern/cmunti.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../computer-modern/cmunbx.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../computer-modern/cmunbi.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-computer-modern",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CVora",
  description: "With CVora you can Edit your existing resume, or you can build your own resume with ease which will help you to get your dream job.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${merriweather.variable} ${robotoMono.variable} ${outfit.variable} ${playfairDisplay.variable} ${computerModern.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-orange-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-150">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
