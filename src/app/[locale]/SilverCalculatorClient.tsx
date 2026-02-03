"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./salary-calculator.module.css";

type Rank = {
	min: number;
	title: string;
	job: string;
	desc: string;
};

const RANK_SYSTEM: Rank[] = [
	{
		min: 180,
		title: "正一品",
		job: "太师/大学士",
		desc: "位极人臣，国之栋梁！大人请受小的一拜！",
	},
	{
		min: 155,
		title: "正二品",
		job: "总督/尚书",
		desc: "封疆大吏，也就是现在的省部级大佬。",
	},
	{
		min: 130,
		title: "正三品",
		job: "巡抚/府尹",
		desc: "一省要务尽在掌握，现代大概相当于副省级。",
	},
	{
		min: 105,
		title: "正四品",
		job: "道员/知府",
		desc: "主政一方，相当于现在的厅局级干部。",
	},
	{
		min: 80,
		title: "正五品",
		job: "知州/郎中",
		desc: "骨干中层，既要对上汇报也要带队冲锋。",
	},
	{
		min: 60,
		title: "正六品",
		job: "通判",
		desc: "干得不少、背锅不少，属于系统里的“万能人”。",
	},
	{
		min: 45,
		title: "正七品",
		job: "知县(县令)",
		desc: "百里侯，也就是大家常说的七品芝麻官，但好歹是正印官。",
	},
	{
		min: 40,
		title: "正八品",
		job: "县丞",
		desc: "副手担当，跑腿协调样样都得会。",
	},
	{
		min: 33,
		title: "正九品",
		job: "主簿/巡检",
		desc: "虽然是官场底层，但也吃上了皇粮，相当于现在的科员。",
	},
	{
		min: 20,
		title: "未入流",
		job: "衙役/师爷",
		desc: "在衙门里干活的临时工，虽无官身，但也算体面。",
	},
	{
		min: 12,
		title: "市井",
		job: "掌柜/账房",
		desc: "有点手艺或资本的体面人，也就是现在的白领。",
	},
	{
		min: 6,
		title: "平民",
		job: "店小二/长工",
		desc: "起早贪黑，勉强温饱。大人，时代变了，咱还是送外卖吧。",
	},
	{
		min: 0,
		title: "流民",
		job: "乞丐/难民",
		desc: "这收入...在古代恐怕熬不过这个冬天。建议去施粥棚排队。",
	},
];

type CalculatorResult = {
	silverGrams: number;
	monthlyTaels: number;
	yearlyTaels: number;
	rank: Rank;
};

function clampNumber(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

function formatNumber(value: number) {
	if (!Number.isFinite(value)) return "0.00";
	return value.toFixed(2);
}

function useAnimatedNumber(target: number, durationMs = 900) {
	const [value, setValue] = useState(0);
	const targetRef = useRef(target);

	useEffect(() => {
		targetRef.current = target;
		let raf = 0;
		const start = performance.now();
		const from = 0;
		const to = targetRef.current;

		const tick = (now: number) => {
			const t = clampNumber((now - start) / durationMs, 0, 1);
			const eased = 1 - Math.pow(1 - t, 3);
			setValue(from + (to - from) * eased);
			if (t < 1) raf = window.requestAnimationFrame(tick);
		};

		setValue(0);
		raf = window.requestAnimationFrame(tick);
		return () => window.cancelAnimationFrame(raf);
	}, [target, durationMs]);

	return value;
}

const copy: Record<
	AppLocale,
	{
		title: string;
		subtitle: (silverPrice: number) => string;
		salaryLabel: string;
		salaryPlaceholder: string;
		toggleSettings: string;
		priceLabel: string;
		gramsLabel: string;
		jokePreset: string;
		hardcorePreset: string;
		calcBtn: string;
		helpLink: string;
		monthly: string;
		yearly: string;
		grams: string;
		commentLabel: string;
		rankHint: (min: number) => string;
		errorInvalidSalary: string;
		errorInvalidSettings: string;
	}
> = {
	zh: {
		title: "赛博俸禄司",
		subtitle: (silverPrice) => `今日银价：${silverPrice}元/克 (玩梗版)`,
		salaryLabel: "输入您的月薪 (人民币)",
		salaryPlaceholder: "例如：5000",
		toggleSettings: "[ 调整参数 ]",
		priceLabel: "银价 (元/克)",
		gramsLabel: "1两 = (克)",
		jokePreset: "一键玩梗 (35/50)",
		hardcorePreset: "一键考据 (7.2/37.3)",
		calcBtn: "核算俸禄",
		helpLink: "📖 查看防坑指南",
		monthly: "折合月银",
		yearly: "折合年俸",
		grams: "折合白银",
		commentLabel: "【评语】",
		rankHint: (min) => `(按年俸 ${min} 两判定)`,
		errorInvalidSalary: "请大人输入合法的银两数目（工资）！",
		errorInvalidSettings: "请检查参数：银价与“1两=克”都必须大于 0。",
	},
	en: {
		title: "Cyber Salary Office",
		subtitle: (silverPrice) => `Silver price: ¥${silverPrice}/g (meme mode)`,
		salaryLabel: "Monthly salary (RMB)",
		salaryPlaceholder: "e.g. 5000",
		toggleSettings: "[ Advanced ]",
		priceLabel: "Silver price (RMB/g)",
		gramsLabel: "1 tael = (g)",
		jokePreset: "Meme preset (35/50)",
		hardcorePreset: "Historical preset (7.2/37.3)",
		calcBtn: "Calculate",
		helpLink: "📖 Quick guide",
		monthly: "Monthly",
		yearly: "Yearly",
		grams: "Silver",
		commentLabel: "[Comment]",
		rankHint: (min) => `(ranked by ≥ ${min} taels/year)`,
		errorInvalidSalary: "Please enter a valid salary.",
		errorInvalidSettings: "Invalid settings: price and grams per tael must be > 0.",
	},
};

export function SilverCalculatorClient({ locale }: { locale: AppLocale }) {
	const t = copy[locale] ?? copy.en;

	const [salary, setSalary] = useState<string>("");
	const [silverPrice, setSilverPrice] = useState<number>(35);
	const [gramsPerTael, setGramsPerTael] = useState<number>(50);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<CalculatorResult | null>(null);
	const [stampNonce, setStampNonce] = useState(0);
	const resultRef = useRef<HTMLDivElement | null>(null);

	const subtitle = useMemo(() => t.subtitle(silverPrice), [t, silverPrice]);

	const displayedMonthly = useAnimatedNumber(result?.monthlyTaels ?? 0);
	const displayedYearly = useAnimatedNumber(result?.yearlyTaels ?? 0);

	const displayedGrams = useAnimatedNumber(result?.silverGrams ?? 0, 700);

	function applyPreset(preset: "joke" | "hardcore") {
		if (preset === "joke") {
			setSilverPrice(35);
			setGramsPerTael(50);
			return;
		}

		setSilverPrice(7.2);
		setGramsPerTael(37.3);
	}

	function calculate() {
		const parsedSalary = Number.parseFloat(salary);
		if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) {
			setError(t.errorInvalidSalary);
			setResult(null);
			return;
		}

		if (!Number.isFinite(silverPrice) || silverPrice <= 0) {
			setError(t.errorInvalidSettings);
			setResult(null);
			return;
		}

		if (!Number.isFinite(gramsPerTael) || gramsPerTael <= 0) {
			setError(t.errorInvalidSettings);
			setResult(null);
			return;
		}

		setError(null);

		const silverGrams = parsedSalary / silverPrice;
		const monthlyTaels = silverGrams / gramsPerTael;
		const yearlyTaels = monthlyTaels * 12;

		let matched = RANK_SYSTEM[RANK_SYSTEM.length - 1];
		for (const rank of RANK_SYSTEM) {
			if (yearlyTaels >= rank.min) {
				matched = rank;
				break;
			}
		}

		setStampNonce((n) => n + 1);
		setResult({
			silverGrams,
			monthlyTaels,
			yearlyTaels,
			rank: matched,
		});

		window.setTimeout(() => {
			resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 80);
	}

	return (
		<div className={styles.screen}>
			<div className={styles.scrollContainer}>
				<div className={styles.topTools}>
					<LocaleSwitcher inline />
					<ThemeToggle ariaLabel="Toggle theme" />
				</div>

				<header className={styles.header}>
					<h1 className={styles.title}>{t.title}</h1>
					<div className={styles.subtitle}>{subtitle}</div>
					<Link href="/guide" className={styles.helpLink}>
						{t.helpLink}
					</Link>
				</header>

				<div className={styles.inputGroup}>
					<label className={styles.inputLabel} htmlFor="salary">
						{t.salaryLabel}
					</label>
					<input
						id="salary"
						type="number"
						inputMode="numeric"
						className={styles.currencyInput}
						placeholder={t.salaryPlaceholder}
						value={salary}
						onChange={(event) => setSalary(event.target.value)}
					/>

					<div
						className={styles.settingsToggle}
						onClick={() => setSettingsOpen((open) => !open)}
						role="button"
						tabIndex={0}
						onKeyDown={(event) => {
							if (event.key === "Enter" || event.key === " ") {
								event.preventDefault();
								setSettingsOpen((open) => !open);
							}
						}}
					>
						{t.toggleSettings}
					</div>

					<div
						className={`${styles.advancedSettings} ${settingsOpen ? styles.show : ""}`}
					>
						<label>
							{t.priceLabel}:{" "}
							<input
								type="number"
								className={styles.miniInput}
								value={silverPrice}
								step="0.1"
								onChange={(event) =>
									setSilverPrice(Number.parseFloat(event.target.value))
								}
							/>
						</label>
						<br />
						<label>
							{t.gramsLabel}:{" "}
							<input
								type="number"
								className={styles.miniInput}
								value={gramsPerTael}
								step="0.1"
								onChange={(event) =>
									setGramsPerTael(Number.parseFloat(event.target.value))
								}
							/>
						</label>

						<div className={styles.presetRow}>
							<button
								type="button"
								className={styles.presetBtn}
								onClick={() => applyPreset("joke")}
							>
								{t.jokePreset}
							</button>
							<button
								type="button"
								className={styles.presetBtn}
								onClick={() => applyPreset("hardcore")}
							>
								{t.hardcorePreset}
							</button>
						</div>
					</div>

					{error ? <div className={styles.error}>{error}</div> : null}
				</div>

				<button type="button" className={styles.calcBtn} onClick={calculate}>
					{t.calcBtn}
				</button>

				{result ? (
					<div className={styles.resultArea} ref={resultRef}>
						<p className={styles.resultValue}>
							{t.monthly} <span>{formatNumber(displayedMonthly)}</span> 两
							<br />
							{t.yearly} <span>{formatNumber(displayedYearly)}</span> 两
						</p>

						<div className={styles.smallMeta}>
							{t.grams}: {formatNumber(displayedGrams)} g
						</div>

						<div
							key={stampNonce}
							className={`${styles.sealStamp} ${styles.animate}`}
						>
							<div className={styles.sealTitle}>{result.rank.title}</div>
							<div className={styles.sealGrade}>{result.rank.job}</div>
						</div>

						<div className={styles.comment}>
							<strong>{t.commentLabel}</strong> {result.rank.desc}
							<br />
							<span
								style={{
									fontSize: "0.8em",
									color: "#888",
									marginTop: 5,
									display: "block",
								}}
							>
								{t.rankHint(result.rank.min)}
							</span>
						</div>
					</div>
				) : null}

				<div className={styles.cloudBg} />
			</div>
		</div>
	);
}

