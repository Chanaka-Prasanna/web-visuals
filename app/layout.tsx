import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Web Visuals - Easy Data Visualization",
  description:
    "Upload CSV/JSON data and automatically generate insightful charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en " suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased bg-background`}>
        {children}
      </body>
    </html>
  );
}
