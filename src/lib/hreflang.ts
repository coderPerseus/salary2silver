import { websiteConfig } from "@/config/website";
import { type AppLocale, routing } from "@/i18n/routing";
import { getUrl } from "./urls";

export function getHreflangValue(locale: AppLocale) {
	return websiteConfig.i18n.locales[locale]?.hreflang ?? locale;
}

export function generateHreflangUrls(pathname: string) {
	const entries = routing.locales.map((locale) => {
		return [getHreflangValue(locale), getUrl(pathname, locale)] as const;
	});

	const defaultUrl = getUrl(pathname, routing.defaultLocale);

	return {
		...Object.fromEntries(entries),
		"x-default": defaultUrl,
	};
}

export function generateAlternates(pathname: string) {
	const hreflangUrls = generateHreflangUrls(pathname);

	return {
		languages: Object.fromEntries(
			Object.entries(hreflangUrls).filter(([key]) => key !== "x-default")
		),
	};
}

export function getCurrentHreflang(locale: AppLocale) {
	return getHreflangValue(locale);
}
