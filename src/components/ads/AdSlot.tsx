"use client";

import { cn } from "@/lib/utils";

interface AdSlotProps {
  format: "leaderboard" | "rectangle" | "infeed";
  label: string;
  className?: string;
}

const dimensionMap: Record<AdSlotProps["format"], string> = {
  leaderboard: "h-[90px] w-full max-w-[728px]",
  rectangle: "h-[250px] w-[300px]",
  infeed: "h-[200px] w-full",
};

const labelMap: Record<AdSlotProps["format"], string> = {
  leaderboard: "728×90",
  rectangle: "300×250",
  infeed: "Responsive",
};

export function AdSlot({ format, label, className }: AdSlotProps) {
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
        {/*
          Production: replace this div's content with the AdSense <ins> tag:
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
            data-ad-slot="XXXXXXXXXX"
            data-ad-format={format === "infeed" ? "fluid" : "fixed"}
          />
        */}
        <span className="text-[11px] text-muted-foreground/40">
          {labelMap[format]}
        </span>
      </div>
    </div>
  );
}
