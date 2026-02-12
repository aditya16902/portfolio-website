import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aditya Tamilisetti - Data Science & AI Engineer",
  description: "Portfolio of Aditya Tamilisetti - Data Scientist and AI Engineer specializing in ML, NLP, and Applied AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
