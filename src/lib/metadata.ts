import type { Metadata } from "next";
import { websiteConfig } from "@/config/website";
import { routing, type AppLocale } from "@/i18n/routing";
import { generateAlternates, getCurrentHreflang } from "./hreflang";
import { getBaseUrl, getImageUrl, getUrl } from "./urls";

export function constructMetadata({
	title,
	description,
	image,
	noIndex = false,
	locale,
	pathname = "/",
}: {
	title?: string;
	description?: string;
	image?: string;
	noIndex?: boolean;
	locale?: AppLocale;
	pathname?: string;
} = {}): Metadata {
	const resolvedTitle = title ?? websiteConfig.name;
	const resolvedDescription = description ?? websiteConfig.description;
	const resolvedImage = image ?? websiteConfig.metadata.ogImage;
	const ogImageUrl = getImageUrl(resolvedImage).toString();

	const canonicalUrl = locale ? getUrl(pathname, locale) : undefined;
	const alternates = canonicalUrl
		? routing.locales.length > 1
			? {
					canonical: canonicalUrl,
					...generateAlternates(pathname),
				}
			: { canonical: canonicalUrl }
		: undefined;

	return {
		title: resolvedTitle,
		description: resolvedDescription,
		alternates,
		openGraph: {
			type: "website",
			locale: locale ? getCurrentHreflang(locale).replace("-", "_") : "en_US",
			url: canonicalUrl,
			title: resolvedTitle,
			description: resolvedDescription,
			siteName: websiteConfig.name,
			images: [ogImageUrl],
		},
		twitter: {
			card: "summary_large_image",
			title: resolvedTitle,
			description: resolvedDescription,
			images: [ogImageUrl],
			site: getBaseUrl(),
		},
		icons: {
			icon: "/favicon.svg",
		},
		metadataBase: new URL(getBaseUrl()),
		manifest: `${getBaseUrl()}/manifest.webmanifest`,
		...(noIndex
			? {
					robots: {
						index: false,
						follow: false,
					},
				}
			: {}),
	};
}
