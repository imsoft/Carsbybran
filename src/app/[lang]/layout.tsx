import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { HtmlLang } from "@/components/layout/HtmlLang";
import { hasLocale } from "./dictionaries";
import { notFound } from "next/navigation";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return [{ lang: "en-US" }, { lang: "es-MX" }];
}

export default async function LangLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <>
      <HtmlLang lang={lang} />
      <div
        className={cn(
          geistSans.variable,
          geistMono.variable,
          "font-sans min-h-dvh flex flex-col bg-background text-foreground antialiased"
        )}
      >
        {children}
      </div>
    </>
  );
}
