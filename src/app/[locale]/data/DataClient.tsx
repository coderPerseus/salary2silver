"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "use-intl";
import { fetchLatestPosts } from "@/actions/posts";
import { Link } from "@/i18n/navigation";

export function DataClient() {
	const t = useTranslations("Data");
	const postsQuery = useQuery({
		queryKey: ["latest-posts"],
		queryFn: () => fetchLatestPosts(6),
	});

	const isLoadingPosts = postsQuery.status === "pending";
	const postsError =
		postsQuery.error instanceof Error ? postsQuery.error.message : t("error");

	return (
		<main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<div className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-16 md:py-20">
				<header className="flex flex-col gap-4">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">
							{t("eyebrow")}
						</p>
						<Link
							href="/"
							className="text-xs uppercase tracking-[0.3em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
						>
							{t("backHome")}
						</Link>
					</div>
					<h1 className="text-4xl font-semibold leading-tight md:text-5xl">
						{t("title")}
					</h1>
					<p className="max-w-2xl text-base leading-relaxed text-[var(--muted)]">
						{t("subtitle")}
					</p>
					<button
						type="button"
						onClick={() => postsQuery.refetch()}
						className="w-fit rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)] transition hover:text-[var(--foreground)]"
					>
						{postsQuery.isFetching ? t("refreshing") : t("refresh")}
					</button>
				</header>

				<section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{isLoadingPosts ? (
						<div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-[var(--muted)]">
							{t("loading")}
						</div>
					) : postsQuery.isError ? (
						<div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-sm text-red-500">
							{postsError}
						</div>
					) : (
						postsQuery.data?.map((post) => (
							<article
								key={post.id}
								className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6"
							>
								<p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
									{t("postLabel")} #{post.id}
								</p>
								<h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
									{post.title}
								</h2>
								<p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
									{post.body}
								</p>
							</article>
						))
					)}
				</section>
			</div>
		</main>
	);
}
