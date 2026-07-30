import { env } from "@Veershree-portfolio/env/web";

export const SITE = {
  name: "Veershree Realty",
  shortName: "Veershree",
  alternateNames: [
    "Veershree Real Estate",
    "Veer Real Estate",
    "Veershree Realty Pune",
    "Veer Realty",
    "Veershree Land",
  ],
  tagline: "Invest in land. Inherit a legacy.",
  description:
    "Veershree Realty (Veershree Real Estate) offers premium land plots, gated communities and clear-title real estate investments in Chakan, Pune and India's top growth corridors since 2010.",
  keywords: [
    "Veershree Realty",
    "Veershree Real Estate",
    "Veer Real Estate",
    "Veershree",
    "Veer Realty",
    "land investment Pune",
    "premium plots Chakan",
    "gated community land Pune",
    "DTCP RERA land",
    "real estate Chakan",
  ].join(", "),
  email: "info@veershreerealty.com",
  phone: "+91-78755-81414",
  phoneDisplay: "+91 78755 81414",
  address: {
    locality: "Chakan",
    region: "Maharashtra",
    postalCode: "410501",
    country: "IN",
  },
  foundingYear: 2010,
  locale: "en_IN",
} as const;

/** Public site origin (no trailing slash). Set VITE_SITE_URL in production. */
export function getSiteUrl(): string {
  if (env.VITE_SITE_URL) return env.VITE_SITE_URL.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "https://veershreerealty.com";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") return `${base}/`;
  return `${base}${normalized}`;
}

export function absoluteAsset(path: string): string {
  const baseUrl = import.meta.env.BASE_URL || "/";
  const assetPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(assetPath, `${getSiteUrl()}${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}`).toString();
}

export function defaultOgImage(): string {
  return absoluteAsset("og-image.jpg");
}

type PageSeoInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  noIndex?: boolean;
};

/** TanStack Router `head` payload for a public page. */
export function buildPageHead({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noIndex = false,
}: PageSeoInput) {
  const url = absoluteUrl(path);
  const ogImage = image || defaultOgImage();
  const fullTitle = title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;

  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "keywords", content: SITE.keywords },
      { name: "author", content: SITE.name },
      {
        name: "robots",
        content: noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large",
      },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: SITE.locale },
      { property: "og:type", content: type },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: ogImage },
      { property: "og:image:alt", content: `${SITE.name} — premium land investments in Pune` },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "RealEstateAgent"],
    "@id": `${url}/#organization`,
    name: SITE.name,
    legalName: SITE.name,
    alternateName: [...SITE.alternateNames],
    url,
    logo: defaultOgImage(),
    image: defaultOgImage(),
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    foundingDate: String(SITE.foundingYear),
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: [
      { "@type": "City", name: "Pune" },
      { "@type": "City", name: "Chakan" },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: [
      "Land investment",
      "Premium residential plots",
      "Gated community land",
      "Real estate in Pune",
      "Veershree Realty",
      "Veershree Real Estate",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "sales",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Marathi"],
    },
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    url,
    description: SITE.description,
    publisher: { "@id": `${url}/#organization` },
    inLanguage: "en-IN",
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function realEstateListingJsonLd(project: {
  name: string;
  slug: string;
  description: string;
  tagline: string;
  image: string;
  location: string;
  priceFrom: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: `${project.name} | ${SITE.name}`,
    description: project.description || project.tagline,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.image,
    offers: project.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          description: `From ${project.priceFrom}`,
        }
      : undefined,
    contentLocation: {
      "@type": "Place",
      name: project.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: project.location,
        addressCountry: "IN",
      },
    },
    provider: {
      "@type": "RealEstateAgent",
      name: SITE.name,
      url: getSiteUrl(),
    },
  };
}
