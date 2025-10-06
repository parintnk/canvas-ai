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
  title: "Canvas Marketing - เพื่อนคู่คิดด้าน Marketing",
  description: "Canvas Marketing Agency พร้อมเป็นเพื่อนคู่คิดและช่วยเหลือธุรกิจของคุณให้เติบโต ด้วยความเชี่ยวชาญด้าน Digital Marketing, Branding และ Content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
