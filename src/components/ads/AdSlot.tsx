"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  format: "leaderboard" | "rectangle" | "infeed";
  label: string;
  className?: string;
}

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

const slotByFormat: Record<AdSlotProps["format"], string | undefined> = {
  leaderboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD?.trim(),
  rectangle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE?.trim(),
  infeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INFEED?.trim(),
};

const dimensionMap: Record<AdSlotProps["format"], string> = {
  leaderboard: "min-h-[90px] w-full max-w-[728px]",
  rectangle: "min-h-[250px] w-[300px] max-w-full",
  infeed: "min-h-[200px] w-full",
};

const labelMap: Record<AdSlotProps["format"], string> = {
  leaderboard: "728×90",
  rectangle: "300×250",
  infeed: "Responsive",
};

function AdSenseUnit({
  format,
  adSlot,
}: {
  format: AdSlotProps["format"];
  adSlot: string;
}) {
  const insRef = useRef<HTMLModElement>(null);
  const didPush = useRef(false);

  useEffect(() => {
    if (!insRef.current || didPush.current) return;
    didPush.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* AdSense no disponible (bloqueador, red, etc.) */
    }
  }, []);

  return (
    <div className={cn("overflow-hidden", dimensionMap[format])}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId!}
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

export function AdSlot({ format, label, className }: AdSlotProps) {
  const adSlot = slotByFormat[format];
  const live = !!(clientId && adSlot);

  if (live) {
    return (
      <div className={cn("flex flex-col items-center gap-1.5", className)}>
        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
          {label}
        </span>
        <AdSenseUnit format={format} adSlot={adSlot} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center gap-1.5", className)}>
      <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
        {label}
      </span>
      <div
        className={cn(
          dimensionMap[format],
          "flex items-center justify-center rounded border border-dashed border-border bg-muted/30"
        )}
        aria-hidden="true"
      >
        <span className="px-2 text-center text-[11px] text-muted-foreground/40">
          {labelMap[format]}
          {!clientId && (
            <span className="mt-1 block text-[10px]">
              Define NEXT_PUBLIC_ADSENSE_CLIENT_ID y el slot de este formato.
            </span>
          )}
          {clientId && !adSlot && (
            <span className="mt-1 block text-[10px]">
              Falta NEXT_PUBLIC_ADSENSE_SLOT_
              {format === "leaderboard"
                ? "LEADERBOARD"
                : format === "rectangle"
                  ? "RECTANGLE"
                  : "INFEED"}
              .
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
