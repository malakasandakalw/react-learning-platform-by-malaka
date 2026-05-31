import type { MetadataRoute } from "next";

const siteUrl = "https://react-learning-hub-by-malaka.netlify.app";

const levels = ["easy", "medium", "advanced"] as const;

const coreHooks = [
  "use-state",
  "use-effect",
  "use-layout-effect",
  "use-ref",
  "use-memo",
  "use-callback",
  "use-reducer",
];
const modernHooks = [
  "use-transition",
  "use-deferred-value",
  "use-id",
  "use-optimistic",
];
const react19Hooks = ["use-hook", "use-action-state", "use-form-status"];
const patterns = [
  "suspense",
  "error-boundary",
  "portals",
  "hoc",
  "render-props",
  "compound-components",
];

function url(path: string, priority = 0.7): MetadataRoute.Sitemap[number] {
  return {
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority,
  };
}

function sectionWithLevels(base: string): MetadataRoute.Sitemap {
  return [url(base, 0.8), ...levels.map((l) => url(`${base}/${l}`))];
}

function hookSection(prefix: string, hooks: string[]): MetadataRoute.Sitemap {
  return [
    url(prefix, 0.8),
    ...hooks.flatMap((hook) => sectionWithLevels(`${prefix}/${hook}`)),
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    url("/", 1.0),
    url("/decision-guide", 0.9),
    ...hookSection("/hooks", coreHooks),
    ...hookSection("/modern-hooks", modernHooks),
    url("/react-19", 0.8),
    ...react19Hooks.flatMap((h) => sectionWithLevels(`/react-19/${h}`)),
    ...sectionWithLevels("/custom-hooks"),
    ...sectionWithLevels("/context"),
    ...sectionWithLevels("/redux"),
    url("/patterns", 0.8),
    ...patterns.flatMap((p) => sectionWithLevels(`/patterns/${p}`)),
  ];
}
