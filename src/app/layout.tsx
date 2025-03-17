import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "cGHS",
  description: "Ghana's stablecoin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Content Security Policy for Veriff */}
        <meta
          httpEquiv="content-security-policy"
          content="default-src 'self' *.veriff.me *.veriff.com;
    script-src 'self' 'unsafe-inline' *.veriff.me *.veriff.com *.hotjar.com *.probity.io;
    img-src blob: 'self' *.probity.io;
    frame-src 'self' *.hotjar.com *.veriff.me *.veriff.com;
    connect-src 'self' *.veriff.com *.veriff.me *.probity.io;
    style-src 'self' 'unsafe-inline' *.veriff.com *.veriff.me;"
        />
      </head>
       <ThirdwebProvider>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        </body>
        </ThirdwebProvider>
    </html>
  );
}
