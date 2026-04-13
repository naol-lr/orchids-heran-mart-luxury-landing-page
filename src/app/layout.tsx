import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HERAN Mart — Your Neighborhood Market, Elevated",
  description: "Fresh essentials, polite service, and everyday convenience in Las Vegas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark overflow-x-hidden">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-[#050505] text-[#F5F5F5] selection:bg-[rgba(193,163,106,0.3)] min-h-screen relative overflow-x-hidden w-full max-w-[100vw]`}
      >
        <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] bg-[url('https://upload.wikimedia.org/wikipedia/commons/a/a2/Noise_Texture.png')] mix-blend-overlay"></div>
        <div className="relative z-10">
        <AuthProvider>
          <CartProvider>
            {children}
            <AuthModal />
          </CartProvider>
        </AuthProvider>
          <VisualEditsMessenger />
        </div>
      </body>
    </html>
  );
}
