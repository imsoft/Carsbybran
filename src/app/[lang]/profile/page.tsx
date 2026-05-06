import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getDictionary, hasLocale } from "../dictionaries";
import { getSession } from "@/lib/session";
import { getUserStats } from "@/lib/mock-user-data";
import { Card, CardContent } from "@/components/ui/card";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Star, MessageCircle, CalendarDays } from "lucide-react";

export async function generateMetadata({ params }: PageProps<"/[lang]/profile">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return { title: `${dict.profile.title} — Carsbybran`, robots: { index: false, follow: false } };
}

export default async function ProfilePage({ params }: PageProps<"/[lang]/profile">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const session = await getSession();
  const stats = session ? await getUserStats(session.userId) : { favorites: 0, reviews: 0, comments: 0 };

  const memberSince = session?.expiresAt
    ? new Date(
        new Date(session.expiresAt).getTime() - 7 * 24 * 60 * 60 * 1000
      ).toLocaleDateString(lang === "es-MX" ? "es-MX" : "en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const statsItems = [
    { label: dict.profile.stats.favorites, value: stats.favorites, icon: Bookmark, href: `/${lang}/favorites` },
    { label: dict.profile.stats.reviews, value: stats.reviews, icon: Star, href: `/${lang}/my-reviews` },
    { label: dict.profile.stats.comments, value: stats.comments, icon: MessageCircle, href: "#" },
  ];

  return (
    <>
      <Navbar lang={lang} dict={dict.nav} />
      <main className="container mx-auto max-w-2xl px-4 py-12 space-y-8">

        {/* Header card */}
        <Card>
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-5">
              <AvatarUpload
                name={session?.name ?? "??"}
                avatarUrl={session?.avatarUrl}
              />
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold truncate">{session?.name}</h1>
                <p className="text-sm text-muted-foreground truncate">{session?.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CalendarDays className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {dict.profile.memberSince} {memberSince}
                  </span>
                  {session?.role === "admin" && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-1">Admin</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {statsItems.map(({ label, value, icon: Icon, href }) => (
            <a key={label} href={href} className="block">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4 pb-4 text-center space-y-1">
                  <Icon className="size-5 mx-auto text-muted-foreground" />
                  <p className="text-2xl font-bold tabular-nums">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>

        {/* Account info */}
        <Card>
          <CardContent className="pt-5 pb-5 space-y-3">
            <h2 className="text-sm font-semibold">{dict.profile.account}</h2>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{dict.profile.name}</span>
              <span className="text-sm font-medium">{session?.name}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{dict.profile.email}</span>
              <span className="text-sm font-medium">{session?.email}</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{dict.profile.password}</span>
              <span className="text-sm text-muted-foreground">••••••••</span>
            </div>
          </CardContent>
        </Card>

      </main>
      <Footer lang={lang} dict={dict.footer} />
    </>
  );
}
