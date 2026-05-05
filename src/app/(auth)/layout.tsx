import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Geist } from "next/font/google";
import { Car } from "lucide-react";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const t=localStorage.getItem('theme');if(t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div
            className={cn(
              geist.variable,
              "font-sans min-h-dvh flex flex-col bg-background text-foreground antialiased"
            )}
          >
            {/* Minimal header */}
            <header className="border-b px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Car className="size-5 text-accent" />
                <span className="font-bold tracking-tight">
                  Carsby<span className="text-accent">bran</span>
                </span>
              </Link>
              <ThemeToggle />
            </header>

            {/* Centered content */}
            <main className="flex-1 flex items-center justify-center p-4">
              {children}
            </main>

            <footer className="py-4 text-center text-xs text-muted-foreground border-t">
              © {new Date().getFullYear()} Carsbybran
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
