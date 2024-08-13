import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { template: "%s | Tweeter", default: "Tweeter" },
  description: "Tweet your tweets on Tweeter !",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} max-w-screen-sm min-w-80 mx-auto *:box-border vsc-initialized`}
      >
        {children}
      </body>
    </html>
  );
}
