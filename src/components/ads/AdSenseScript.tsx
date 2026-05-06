import Script from "next/script";

const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim();

/** Carga el script de AdSense solo si hay ID de cliente (ca-pub-…). */
export function AdSenseScript() {
  if (!clientId) return null;
  return (
    <Script
      id="adsense-loader"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
