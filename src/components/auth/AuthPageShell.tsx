import type { ReactNode } from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AuthPageShell({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <>
      <header className="border-b px-4 h-14 flex items-center justify-between">
        <Link href={`/${lang}`} className="flex items-center gap-2">
          <Car className="size-5 text-accent" />
          <span className="font-bold tracking-tight">
            Carsby<span className="text-accent">bran</span>
          </span>
        </Link>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="py-4 text-center text-xs text-muted-foreground border-t">
        © {new Date().getFullYear()} Carsbybran
      </footer>
    </>
  );
}
