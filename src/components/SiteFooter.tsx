import type { ReactNode } from "react";

export function SiteFooter({
	summary,
	authorPrefix,
	authorLabel,
	authorHref,
	rightSlot,
}: {
	summary: string;
	authorPrefix: string;
	authorLabel: string;
	authorHref: string;
	rightSlot?: ReactNode;
}) {
	return (
		<footer className="flex flex-col gap-4 border-t border-[var(--border)] py-6 text-xs text-[var(--muted)] md:flex-row md:items-center md:justify-between">
			<div className="flex flex-col gap-2">
				<span>{summary}</span>
				<span>
					{authorPrefix}{" "}
					<a
						href={authorHref}
						className="font-semibold text-[var(--foreground)] hover:underline"
					>
						{authorLabel}
					</a>
				</span>
			</div>
			{rightSlot ? <div className="flex justify-end">{rightSlot}</div> : null}
		</footer>
	);
}
