import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerCompass Kenya - Official Guidance Platform",
  description: "AI-powered career guidance for Kenyan students in the CBE system. Designed by Sidmadina Technologies.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased min-h-screen flex flex-col`}>
        <SessionProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <FirebaseClientProvider>
              <Navigation />
              <main className="flex-grow">{children}</main>
              <footer className="border-t py-12 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                  <p className="text-sm font-bold text-primary mb-2">CAREERCOMPASS KENYA</p>
                  <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Designed by Sidmadina Technologies.</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-4 uppercase tracking-widest">Empowering Frere Town Secondary School</p>
                </div>
              </footer>
              <Toaster />
            </FirebaseClientProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
