import { DEFAULT_LANGUAGE, getDirection, translate } from "@stability/i18n";
import type { Metadata } from "next";
import { Cairo, Heebo, Ubuntu } from "next/font/google";
import type { PropsWithChildren } from "react";

import { webThemeVariables } from "@/lib/theme";
import { LanguageProvider } from "@/providers/language-provider";

import "./globals.css";

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  display: "swap",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  display: "swap",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: translate(DEFAULT_LANGUAGE, "app.name"),
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      lang={DEFAULT_LANGUAGE}
      dir={getDirection(DEFAULT_LANGUAGE)}
      suppressHydrationWarning
    >
      <body
        className={`${ubuntu.variable} ${heebo.variable} ${cairo.variable}`}
        style={webThemeVariables}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
