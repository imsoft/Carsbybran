"use client";

import Link from "next/link";
import Image from "next/image";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Bookmark, Star, LayoutDashboard } from "lucide-react";
import type { SessionPayload } from "@/lib/definitions";

type Props = {
  session: SessionPayload | null;
  lang: string;
  dict: {
    login: string;
    register: string;
    dashboard: string;
    profile: string;
    favorites: string;
    myReviews: string;
    logout: string;
  };
};

export function NavbarAuthSection({ session, lang, dict }: Props) {
  if (!session) {
    return (
      <div className="flex items-center gap-1.5">
        <Button asChild variant="ghost" size="sm" className="text-sm">
          <Link href={`/${lang}/login`}>{dict.login}</Link>
        </Button>
        <Button asChild size="sm" className="text-sm">
          <Link href={`/${lang}/register`}>{dict.register}</Link>
        </Button>
      </div>
    );
  }

  const initials = session.name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full size-9">
          <Avatar className="size-8">
            {session.avatarUrl && (
              <AvatarImage src={session.avatarUrl} alt={session.name} asChild>
                <Image src={session.avatarUrl} alt={session.name} width={32} height={32} className="rounded-full object-cover" />
              </AvatarImage>
            )}
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium truncate">{session.name}</p>
          <p className="text-xs text-muted-foreground truncate">{session.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {session.role === "admin" && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/dashboard" className="cursor-pointer">
                <LayoutDashboard className="mr-2 size-3.5" />
                {dict.dashboard}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem asChild>
          <Link href={`/${lang}/profile`} className="cursor-pointer">
            <User className="mr-2 size-3.5" />
            {dict.profile}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/favorites`} className="cursor-pointer">
            <Bookmark className="mr-2 size-3.5" />
            {dict.favorites}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/my-reviews`} className="cursor-pointer">
            <Star className="mr-2 size-3.5" />
            {dict.myReviews}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center cursor-pointer">
              <LogOut className="mr-2 size-3.5" />
              {dict.logout}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
