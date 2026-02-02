import { routing } from "@/i18n/routing";
import type { LocalePrefix, LocalePrefixMode } from "next-intl/routing";

export function getBaseUrl(): string {
	if (process.env.NEXT_PUBLIC_APP_URL) {
		return process.env.NEXT_PUBLIC_APP_URL;
	}

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`;
	}

	return "http://localhost:3000";
}

export function getImageUrl(path: string): URL {
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return new URL(path);
	}

	return new URL(path, getBaseUrl());
}

function normalizePathname(pathname?: string): string {
	if (!pathname || pathname === "/") {
		return "/";
	}

	return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocalePathname(pathname: string, locale: string): string {
	const normalized = normalizePathname(pathname);
	const suffix = normalized === "/" ? "" : normalized;
	const localePrefix = routing.localePrefix as LocalePrefix<
		typeof routing.locales,
		LocalePrefixMode
	> | null;
	const localePrefixMode =
		typeof localePrefix === "string" ? localePrefix : localePrefix?.mode;

	if (localePrefixMode === "never") {
		return normalized;
	}

	if (localePrefixMode === "as-needed" && locale === routing.defaultLocale) {
		return normalized;
	}

	return `/${locale}${suffix}`;
}

export function getUrl(pathname: string, locale: string): string {
	return `${getBaseUrl()}${getLocalePathname(pathname, locale)}`;
}
