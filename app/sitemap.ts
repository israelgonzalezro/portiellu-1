import type { MetadataRoute } from "next";

const languages = {
  "es-ES": "https://elportiellu.com",
  "en-GB": "https://elportiellu.com/en"
};

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://elportiellu.com",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages }
    },
    {
      url: "https://elportiellu.com/en",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages }
    }
  ];
}
