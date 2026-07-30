type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Renders schema.org JSON-LD. Safe for crawlers in the document body. */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD must be raw JSON text for crawlers.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
