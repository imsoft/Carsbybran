import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/session";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, ChevronRight } from "lucide-react";
import { MobileSidebarTrigger } from "./AppSidebar";
import Link from "next/link";

type Crumb = { label: string; href?: string };

type Props = {
  breadcrumbs?: Crumb[];
};

export async function DashboardHeader({ breadcrumbs }: Props) {
  const session = await getSession();
  const initials = session?.name
    ? session.name.slice(0, 2).toUpperCase()
    : "AD";

  return (
    <header className="h-14 border-b px-4 flex items-center gap-3 bg-background shrink-0">
      <MobileSidebarTrigger />

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="breadcrumb" className="flex-1 flex items-center gap-1 min-w-0">
          {breadcrumbs.map((crumb, i) => {
            const isLast = i === breadcrumbs.length - 1;
            return (
              <span key={i} className="flex items-center gap-1 min-w-0">
                {i > 0 && (
                  <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className={
                      isLast
                        ? "text-sm font-medium truncate"
                        : "text-sm text-muted-foreground truncate"
                    }
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-2 shrink-0">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full size-8">
              <Avatar className="size-8">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium">{session?.name ?? "Admin"}</p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.email ?? ""}
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings" className="cursor-pointer">
                <User className="mr-2 size-3.5" />
                Ajustes
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <form action={logout}>
                <button type="submit" className="flex w-full items-center cursor-pointer">
                  <LogOut className="mr-2 size-3.5" />
                  Cerrar sesión
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
