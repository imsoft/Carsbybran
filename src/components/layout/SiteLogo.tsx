"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LIGHT = "/images/site/carsbybran-logo-light.svg";
const DARK = "/images/site/carsbybran-logo-dark.svg";

export type SiteLogoProps = {
  href: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  onClick?: () => void;
};

export function SiteLogo({
  href,
  className,
  imageClassName,
  priority,
  onClick,
}: SiteLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label="Carsbybran"
      className={cn("inline-flex items-center shrink-0", className)}
    >
      <Image
        src={LIGHT}
        alt=""
        width={384}
        height={384}
        className={cn("h-8 w-auto dark:hidden", imageClassName)}
        priority={priority}
      />
      <Image
        src={DARK}
        alt=""
        width={384}
        height={384}
        className={cn("hidden h-8 w-auto dark:block", imageClassName)}
        priority={priority}
      />
    </Link>
  );
}
