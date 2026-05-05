export function HtmlLang({ lang }: { lang: string }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `document.documentElement.lang="${lang}";`,
      }}
    />
  );
}
