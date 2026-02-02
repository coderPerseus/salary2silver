import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

function isPlainObject(value: unknown): value is Messages {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeMessages(base: Messages, override: Messages): Messages {
	const result: Messages = { ...base };

	for (const [key, value] of Object.entries(override)) {
		if (isPlainObject(value) && isPlainObject(result[key])) {
			result[key] = mergeMessages(result[key] as Messages, value);
			continue;
		}

		result[key] = value;
	}

	return result;
}

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;
	const timeZone = "UTC";

	if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
		locale = routing.defaultLocale;
	}

	const localeMessages = (await import(`../messages/${locale}.json`)).default;

	if (locale !== routing.defaultLocale) {
		const defaultMessages = (await import(`../messages/${routing.defaultLocale}.json`))
			.default;
		return {
			locale,
			messages: mergeMessages(defaultMessages, localeMessages),
			timeZone,
		};
	}

	return {
		locale,
		messages: localeMessages,
		timeZone,
	};
});
