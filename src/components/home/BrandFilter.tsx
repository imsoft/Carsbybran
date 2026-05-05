import Link from "next/link";
import type { Brand } from "@/lib/articles";

interface BrandFilterProps {
  brands: Brand[];
  lang: string;
  dict: { title: string; subtitle: string };
}

export function BrandFilter({ brands, lang, dict }: BrandFilterProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground md:text-2xl">
          {dict.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{dict.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {brands.map((brand) => (
          <Link
            key={brand.slug}
            href={`/${lang}/brands/${brand.slug}`}
            className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-all duration-150 hover:border-accent hover:text-accent hover:shadow-sm"
          >
            <span>{brand.name}</span>
            <span className="text-xs tabular-nums text-muted-foreground transition-colors group-hover:text-accent/70">
              ({brand.count})
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
