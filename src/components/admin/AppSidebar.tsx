"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Settings,
  ExternalLink,
  ChevronRight,
  Car,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/articles", label: "Artículos", icon: FileText, exact: false },
  { href: "/dashboard/settings", label: "Ajustes", icon: Settings, exact: true },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <>
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
              isActive(href, exact)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span>{label}</span>
            {isActive(href, exact) && (
              <ChevronRight className="size-3 ml-auto text-muted-foreground" />
            )}
          </Link>
        ))}
      </nav>
      <div className="p-2">
        <Separator className="mb-2" />
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <ExternalLink className="size-4 shrink-0" />
          <span>Ver sitio</span>
        </a>
      </div>
    </>
  );
}

function SidebarBrand() {
  return (
    <div className="h-14 flex items-center px-4 gap-2 border-b shrink-0">
      <Car className="size-5 text-accent" />
      <span className="font-semibold text-sm tracking-tight">Carsbybran</span>
      <span className="ml-auto text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Admin
      </span>
    </div>
  );
}

// Desktop sidebar
export function AppSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r bg-sidebar text-sidebar-foreground">
      <SidebarBrand />
      <NavLinks />
    </aside>
  );
}

// Mobile hamburger trigger — rendered in the header
export function MobileSidebarTrigger() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden size-8">
          <Menu className="size-4" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0 flex flex-col bg-sidebar text-sidebar-foreground">
        <SheetHeader className="sr-only">
          <SheetTitle>Navegación</SheetTitle>
        </SheetHeader>
        <SidebarBrand />
        <NavLinks />
      </SheetContent>
    </Sheet>
  );
}
