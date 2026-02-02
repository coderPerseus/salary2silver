"use client";

import { useLocale } from "use-intl";
import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";

const labels: Record<(typeof routing.locales)[number], string> = {
	en: "EN",
	zh: "中文",
};

export function LocaleSwitcher({ inline = false }: { inline?: boolean }) {
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<div
			className={`flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)] shadow-sm ${
				inline
					? ""
					: "absolute right-6 top-6 z-10 bg-white/90 text-[#666666] backdrop-blur"
			}`}
		>
			{routing.locales.map((entry) => {
				const isActive = entry === locale;

				return (
					<Link
						key={entry}
						href={pathname}
						locale={entry}
						className={`rounded-full px-3 py-1 transition ${
							isActive
								? "bg-[var(--foreground)] text-[var(--background)]"
								: "hover:bg-[var(--border)]"
						}`}
						aria-current={isActive ? "page" : undefined}
					>
						{labels[entry]}
					</Link>
				);
			})}
		</div>
	);
}
