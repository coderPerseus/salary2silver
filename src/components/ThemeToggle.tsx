"use client";

import { useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

function getPreferredTheme(): ThemeMode {
	if (typeof window === "undefined") {
		return "light";
	}

	const stored = window.localStorage.getItem("theme");
	if (stored === "light" || stored === "dark") {
		return stored;
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

export function ThemeToggle({
	ariaLabel = "Toggle theme",
}: {
	ariaLabel?: string;
}) {
	const [theme, setTheme] = useState<ThemeMode>("light");

	useEffect(() => {
		setTheme(getPreferredTheme());
	}, []);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
		window.localStorage.setItem("theme", theme);
	}, [theme]);

	const nextTheme = theme === "dark" ? "light" : "dark";

	return (
		<button
			type="button"
			onClick={() => setTheme(nextTheme)}
			className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
			aria-label={ariaLabel}
			title={ariaLabel}
		>
			{theme === "dark" ? (
				<svg
					viewBox="0 0 24 24"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M12 3v2m0 14v2m9-9h-2M5 12H3m14.364-6.364-1.414 1.414M7.05 16.95l-1.414 1.414m0-11.314L7.05 7.05m9.9 9.9 1.414 1.414M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
					/>
				</svg>
			) : (
				<svg
					viewBox="0 0 24 24"
					className="h-4 w-4"
					fill="none"
					stroke="currentColor"
					strokeWidth="1.6"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M21 12.8A8 8 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z"
					/>
				</svg>
			)}
		</button>
	);
}
