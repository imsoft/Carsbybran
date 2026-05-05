"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LangSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const toggle = () => {
    const next = lang === "en-US" ? "es-MX" : "en-US";
    const segments = pathname.split("/");
    segments[1] = next;
    router.push(segments.join("/"));
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="font-mono text-xs font-bold tracking-wider"
      aria-label={lang === "en-US" ? "Cambiar a Español" : "Switch to English"}
    >
      {lang === "en-US" ? "ES" : "EN"}
    </Button>
  );
}
