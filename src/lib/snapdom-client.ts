export type SnapdomExportOptions = {
	scale?: number;
	backgroundColor?: string;
};

type SnapdomResult = {
	toBlob: (options?: Record<string, unknown>) => Promise<Blob>;
	download: (options?: Record<string, unknown>) => Promise<void>;
};

type SnapdomCaptureFn = (
	node: HTMLElement,
	options?: Record<string, unknown>
) => Promise<SnapdomResult> | SnapdomResult;

type SnapdomFns = {
	toBlob: (node: HTMLElement, options?: Record<string, unknown>) => Promise<Blob>;
	download: (node: HTMLElement, options?: Record<string, unknown>) => Promise<void>;
};

function normalizePngFilename(filename: string) {
	const safe = filename.trim();
	if (!safe) return "capture.png";

	const lastSlash = Math.max(safe.lastIndexOf("/"), safe.lastIndexOf("\\"));
	const lastDot = safe.lastIndexOf(".");
	const hasExt = lastDot > lastSlash;

	if (!hasExt) return `${safe}.png`;
	if (safe.slice(lastDot).toLowerCase() === ".png") return safe;

	return `${safe.slice(0, lastDot)}.png`;
}

async function loadSnapdomFromDeps() {
	if (typeof window === "undefined") {
		throw new Error("SnapDOM can only run in the browser.");
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const mod = await import("@zumer/snapdom");
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const anyMod = mod as any;

	const candidates = [
		// global build (script tag) – exposes `window.snapdom`
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any)?.snapdom,
		anyMod,
		anyMod?.default,
		anyMod?.snapdom,
		anyMod?.default?.snapdom,
	].filter(Boolean);

	const callToBlob = async (target: unknown, node: HTMLElement, options?: Record<string, unknown>) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const t = target as any;

		// Official shortcut: snapdom.toBlob(el, { type: "png", ...captureOptions })
		if (typeof t?.toBlob === "function") return (await t.toBlob(node, options)) as Blob;

		// Official reusable capture: const out = await snapdom(el, options); await out.toBlob({ type: "png" })
		if (typeof t === "function") {
			const out = (await (t as SnapdomCaptureFn)(node, options)) as SnapdomResult;
			if (typeof out?.toBlob === "function") return await out.toBlob(options);
		}

		throw new Error("toBlob not found");
	};

	const callDownload = async (
		target: unknown,
		node: HTMLElement,
		options?: Record<string, unknown>
	) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const t = target as any;

		// Official shortcut: snapdom.download(el, { format: "png", filename, ...captureOptions })
		if (typeof t?.download === "function") {
			await t.download(node, options);
			return;
		}

		// Official reusable capture: const out = await snapdom(el, options); await out.download({ format, filename })
		if (typeof t === "function") {
			const out = (await (t as SnapdomCaptureFn)(node, options)) as SnapdomResult;
			if (typeof out?.download === "function") {
				await out.download(options);
				return;
			}
		}

		throw new Error("download not found");
	};

	const toBlob: SnapdomFns["toBlob"] = async (node, options) => {
		for (const target of candidates) {
			try {
				return await callToBlob(target, node, options);
			} catch {
				// keep trying
			}
		}
		throw new Error("SnapDOM toBlob export not found.");
	};

	const download: SnapdomFns["download"] = async (node, options) => {
		for (const target of candidates) {
			try {
				await callDownload(target, node, options);
				return;
			} catch {
				// keep trying
			}
		}
		throw new Error("SnapDOM download export not found.");
	};

	return { toBlob, download } satisfies SnapdomFns;
}

export async function snapdomToBlob(
	node: HTMLElement,
	{ scale = 2, backgroundColor }: SnapdomExportOptions = {}
): Promise<Blob> {
	const snapdom: SnapdomFns = await loadSnapdomFromDeps();
	return snapdom.toBlob(node, {
		type: "png",
		scale,
		backgroundColor: backgroundColor ?? "transparent",
	});
}

export async function snapdomDownload(
	node: HTMLElement,
	filename: string,
	{ scale = 2, backgroundColor }: SnapdomExportOptions = {}
) {
	const snapdom: SnapdomFns = await loadSnapdomFromDeps();
	await snapdom.download(node, {
		format: "png",
		filename: normalizePngFilename(filename),
		scale,
		backgroundColor: backgroundColor ?? "transparent",
	});
}
