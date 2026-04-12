import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type SeoConfig = {
  title: string;
  description: string;
  type?: "website" | "article";
};

const DEFAULT_SEO: SeoConfig = {
  title: "Football Data | Statistiques football",
  description:
    "Analysez les joueurs et clubs de football avec des statistiques detaillees et des visualisations.",
  type: "website",
};

const ROUTE_SEO: Array<{ test: (path: string) => boolean; seo: SeoConfig }> = [
  {
    test: (path) => path === "/",
    seo: {
      title: "Football Data | Analyse de joueurs et clubs",
      description:
        "Plateforme d'analyse football: profils joueurs, donnees clubs et outils de visualisation.",
      type: "website",
    },
  },
  {
    test: (path) => path === "/joueur",
    seo: {
      title: "Recherche de joueurs | Football Data",
      description:
        "Recherchez un joueur et consultez son profil avec ses statistiques de performance.",
      type: "website",
    },
  },
  {
    test: (path) => path.startsWith("/joueur/"),
    seo: {
      title: "Profil joueur | Football Data",
      description:
        "Statistiques detaillees d'un joueur: buts, passes, tirs et indicateurs de performance.",
      type: "article",
    },
  },
  {
    test: (path) => path === "/club",
    seo: {
      title: "Clubs de football | Football Data",
      description:
        "Explorez les clubs de football et leurs donnees de performance sur la saison.",
      type: "website",
    },
  },
  {
    test: (path) => path.startsWith("/club/"),
    seo: {
      title: "Profil club | Football Data",
      description:
        "Consultez les stats d'un club: resultats, buts, stade et performances.",
      type: "article",
    },
  },
  {
    test: (path) => path === "/radar",
    seo: {
      title: "Comparateur radar | Football Data",
      description:
        "Comparez visuellement deux joueurs avec un radar de performances football.",
      type: "website",
    },
  },
];

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertCanonical(url: string) {
  let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", "canonical");
    document.head.appendChild(element);
  }

  element.setAttribute("href", url);
}

function upsertJsonLd(pathname: string, canonicalUrl: string) {
  const prev = document.getElementById("seo-jsonld");
  if (prev) prev.remove();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Football Data",
    url: window.location.origin,
    inLanguage: "fr-FR",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    about: pathname.startsWith("/club/")
      ? { "@type": "SportsTeam" }
      : pathname.startsWith("/joueur/")
      ? { "@type": "Person" }
      : { "@type": "Thing", name: "Football analytics" },
  };

  const script = document.createElement("script");
  script.id = "seo-jsonld";
  script.type = "application/ld+json";
  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
}

export default function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const match = ROUTE_SEO.find((entry) => entry.test(path));
    const seo = match?.seo ?? DEFAULT_SEO;
    const canonicalUrl = `${window.location.origin}${path}`;

    document.title = seo.title;
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", "index,follow,max-image-preview:large");
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", seo.type ?? "website");
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:site_name", "Football Data");
    upsertMeta("property", "og:locale", "fr_FR");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    upsertCanonical(canonicalUrl);
    upsertJsonLd(path, canonicalUrl);
  }, [location.pathname]);

  return null;
}