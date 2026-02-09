import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Guffs - Home Bar",
  description: "Welcome to Guffs - Experience craft cocktails and sports memorabilia",
  icons: { icon: "/guffs-logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={playfair.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
