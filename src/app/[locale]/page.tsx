import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { constructMetadata } from "@/lib/metadata";
import type { AppLocale } from "@/i18n/routing";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

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

export default function HomePage() {
	return (
		<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<LocaleSwitcher />
			<div className="absolute left-6 top-6 z-10">
				<ThemeToggle />
			</div>
		</main>
	);
}
