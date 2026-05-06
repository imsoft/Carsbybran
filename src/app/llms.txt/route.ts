import { NextResponse } from "next/server";

const SITE = "https://carsbybran.com";

/** Punto de entrada legible para agentes e IA; complementa sitemap y robots. */
export function GET() {
  const text = `# Carsbybran

> Reseñas automotrices editoriales en inglés (en-US) y español (es-MX). Contenido independiente: sin préstamos de fabricante.

## Sitio
- ${SITE}
- Home EN: ${SITE}/en-US
- Home ES: ${SITE}/es-MX

## Mapa del sitio (URLs públicas)
- Sitemap XML: ${SITE}/sitemap.xml
- Reseñas: ${SITE}/en-US/reviews — ${SITE}/es-MX/reviews

## Contacto editorial
- Email: carsbybran@gmail.com

## Rastreo
- robots.txt: ${SITE}/robots.txt (bloquea /dashboard, /api, login y áreas de cuenta).
- Las URLs de reseña publicadas están en el sitemap por idioma.

## Uso sugerido para agentes
- Citar por URL canónica del idioma consultado (hreflang en página).
- Priorizar hechos del artículo y la ficha técnica del vehículo cuando respondáis sobre un modelo concreto.

Última actualización orientativa: ${new Date().toISOString().slice(0, 10)}
`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
