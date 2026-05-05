import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AppSidebar } from "@/components/admin/AppSidebar";
import { cn } from "@/lib/utils";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
              "font-sans min-h-dvh flex bg-background text-foreground antialiased"
            )}
          >
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
