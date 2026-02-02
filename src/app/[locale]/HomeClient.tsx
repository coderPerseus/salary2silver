"use client";

import { useTranslations } from "use-intl";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SiteFooter } from "@/components/SiteFooter";

const stackKeys = ["next", "opennext", "workers", "query", "ui", "intl"] as const;
const highlightKeys = ["router", "edge", "i18n", "design"] as const;

export function HomeClient() {
	const t = useTranslations("Home");
	const year = new Date().getFullYear();

	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
				<header className="flex flex-wrap items-center justify-between gap-4 py-6">
					<div className="flex items-baseline gap-3">
						<span className="text-lg font-semibold tracking-tight">
							{t("nav.brand")}
						</span>
						<span className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
							({t("nav.tagline")})
						</span>
					</div>
					<nav className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
						<Link
							href="/data"
							className="transition hover:text-[var(--foreground)]"
						>
							{t("nav.data")}
						</Link>
						<Link
							href="/blog"
							className="transition hover:text-[var(--foreground)]"
						>
							{t("nav.blog")}
						</Link>
						<LocaleSwitcher inline />
					</nav>
				</header>

				<main className="flex flex-1 flex-col gap-12 py-10 md:py-16">
					<section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
						<div className="flex flex-col gap-4">
							<p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
								{t("intro.label")}
							</p>
							<h1 className="text-4xl font-semibold leading-tight md:text-5xl">
								{t("intro.title")}
							</h1>
							<p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
								{t("intro.subtitle")}
							</p>
						</div>
						<div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
							<p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
								{t("intro.pointsLabel")}
							</p>
							<ul className="mt-4 space-y-3 text-sm text-[var(--foreground)]">
								{highlightKeys.map((key) => (
									<li
										key={key}
										className="flex items-center justify-between border-b border-dashed border-[var(--border)] pb-3 last:border-b-0 last:pb-0"
									>
										<span>{t(`intro.points.${key}`)}</span>
									</li>
								))}
							</ul>
						</div>
					</section>

					<section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] px-6 py-8 md:px-10">
						<div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
							<div>
								<h2 className="text-2xl font-semibold text-[var(--foreground)]">
									{t("stack.title")}
								</h2>
								<p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
									{t("stack.subtitle")}
								</p>
							</div>
							<span className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
								{t("stack.badge")}
							</span>
						</div>
						<div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{stackKeys.map((key) => (
								<div
									key={key}
									className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4"
								>
									<h3 className="text-base font-semibold text-[var(--foreground)]">
										{t(`stack.items.${key}.title`)}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
										{t(`stack.items.${key}.body`)}
									</p>
								</div>
							))}
						</div>
					</section>
				</main>

				<SiteFooter
					summary={t("footer.summary", { year })}
					authorPrefix={t("footer.authorPrefix")}
					authorLabel={t("footer.authorLabel")}
					authorHref="https://luckysnail.cn/"
					rightSlot={<ThemeToggle ariaLabel={t("nav.theme")} />}
				/>
			</div>
		</div>
	);
}
