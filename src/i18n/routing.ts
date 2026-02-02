import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["en", "zh"] as const,
	defaultLocale: "en",
	localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
