import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from 'next/font/google';
import "./globals.css";

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' });

export const metadata: Metadata = {
  title: "Saeed & Nasrin - March 21, 2026",
  description: "Join us for our special day at the Four Seasons Hotel Toronto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${openSans.variable}`}>
      <body className="bg-blush-100 text-gray-800 antialiased">{children}</body>
    </html>
  );
}
