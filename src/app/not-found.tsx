import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "@/components/layout/SiteLogo";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <SiteLogo href="/" imageClassName="h-9 w-auto" />
        </div>

        <div className="space-y-2">
          <p className="text-8xl font-bold tabular-nums text-muted-foreground/20">404</p>
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <Button asChild>
          <Link href="/">
            <ArrowLeft className="size-4 mr-2" />
            Back to home
          </Link>
        </Button>
      </div>
    </div>
  );
}
