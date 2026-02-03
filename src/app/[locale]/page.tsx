import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { constructMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { SilverCalculatorClient } from "./SilverCalculatorClient";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata" });

	return constructMetadata({
		title: t("title"),
		description: t("description"),
		locale,
		pathname: "/",
	});
}

export default async function HomePage({
	params,
}: {
	params: Promise<{ locale: AppLocale }>;
}) {
	await params;

	return <SilverCalculatorClient />;
}
