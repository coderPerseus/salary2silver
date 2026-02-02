import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { constructMetadata } from "@/lib/metadata";
import { DataClient } from "./DataClient";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "Metadata.Data" });

	return constructMetadata({
		title: t("title"),
		description: t("description"),
		locale,
		pathname: "/data",
	});
}

export default function DataPage() {
	return <DataClient />;
}
