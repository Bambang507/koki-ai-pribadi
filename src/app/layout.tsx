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
  title: "Koki AI | Asisten Memasak Pribadi",
  description: "Dapatkan resep masakan lezat yang dipersonalisasi dari Chef AI yang dirancang khusus untuk seleramu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
    >
      <body className="font-sans min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
