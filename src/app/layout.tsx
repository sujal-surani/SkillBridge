import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  title: "SkillBridge — Share. Learn. Repeat.",
  description:
    "Community-driven peer-to-peer knowledge exchange for everyone. Trade skills in drawing, health, cooking, gardening, languages, music, practical life crafts, and tech with your neighbors. No mandatory payment.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-cream-100 text-slate-body antialiased" suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
