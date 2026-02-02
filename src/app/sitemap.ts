import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { generateHreflangUrls } from "@/lib/hreflang";
import { getUrl } from "@/lib/urls";

const staticRoutes = ["/", "/data", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
	return staticRoutes.flatMap((route) =>
		routing.locales.map((locale) => ({
			url: getUrl(route, locale),
			alternates: {
				languages: generateHreflangUrls(route),
			},
		}))
	);
}
