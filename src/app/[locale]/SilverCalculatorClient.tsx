"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import styles from "./salary-calculator.module.css";

type Rank = {
	min: number;
	title: string;
	job: string;
	desc: string;
	basis: "month" | "year";
};

const OFFICIAL_RANKS: Rank[] = [
	{
		min: 522,
		title: "正一品",
		job: "朝廷重臣",
		desc: "位极人臣，俸禄稳得可怕。大人一句话，底下人连夜抄作业。",
		basis: "year",
	},
	{
		min: 444,
		title: "从一品",
		job: "朝廷重臣",
		desc: "顶级班底，朝会站位靠前，气场自带BGM。",
		basis: "year",
	},
	{
		min: 366,
		title: "正二品",
		job: "封疆大吏",
		desc: "一方大员，文件一签就是“奉旨”。",
		basis: "year",
	},
	{
		min: 288,
		title: "从二品",
		job: "封疆大吏",
		desc: "统筹能手，既要稳又要快，最怕“马上要”。",
		basis: "year",
	},
	{
		min: 210,
		title: "正三品",
		job: "要职干将",
		desc: "中枢骨干，升迁通道清晰，KPI也更清晰。",
		basis: "year",
	},
	{
		min: 160.5,
		title: "从三品",
		job: "要职干将",
		desc: "会做事、能背锅、还得会写折子。",
		basis: "year",
	},
	{
		min: 144,
		title: "正四品",
		job: "主政一方",
		desc: "管得不小，睡得不多。俸禄上来了，头发下去了。",
		basis: "year",
	},
	{
		min: 126,
		title: "从四品",
		job: "主政一方",
		desc: "事务缠身，最怕“上面来人检查”。",
		basis: "year",
	},
	{
		min: 96,
		title: "正五品",
		job: "中层官员",
		desc: "中层支柱：上有压力，下有期待，夹在中间最会做人。",
		basis: "year",
	},
	{
		min: 84,
		title: "从五品",
		job: "中层官员",
		desc: "职位不低，俸禄不高，但“含金量”在名号。",
		basis: "year",
	},
	{
		min: 60,
		title: "正六品",
		job: "事务官",
		desc: "跑得勤、写得多、背得稳。活都在你这儿汇总。",
		basis: "year",
	},
	{
		min: 48,
		title: "从六品",
		job: "事务官",
		desc: "官场多线程选手：一个人顶三个人用。",
		basis: "year",
	},
	{
		min: 45,
		title: "正七品",
		job: "七品芝麻官",
		desc: "经典配置：面子有了，里子先紧着点用。",
		basis: "year",
	},
	{
		min: 42,
		title: "从七品",
		job: "基层官员",
		desc: "基层顶梁柱，天天在一线，天天被喊“快点”。",
		basis: "year",
	},
	{
		min: 39,
		title: "正八品",
		job: "基层官员",
		desc: "官衔在身，锅也在身。出门能抬头，回家先叹气。",
		basis: "year",
	},
	{
		min: 36,
		title: "从八品",
		job: "基层官员",
		desc: "表面体面，实际精打细算：一两银子掰两半花。",
		basis: "year",
	},
	{
		min: 33,
		title: "正九品",
		job: "科员级",
		desc: "官场底层，但也是“体制内”。开会坐后排，文件跑前排。",
		basis: "year",
	},
	{
		min: 30,
		title: "从九品",
		job: "科员级",
		desc: "刚进系统，先学会“照章办事”。",
		basis: "year",
	},
	{
		min: 18,
		title: "不入流",
		job: "编外小吏",
		desc: "名分没有，活儿不少：忙起来连喝水都要排队。",
		basis: "year",
	},
];

const EUNUCH_RANKS: Rank[] = [
	{
		min: 8,
		title: "太监·四品",
		job: "督领侍",
		desc: "内廷硬通货：走路带风，传话都能决定方向。",
		basis: "month",
	},
	{
		min: 7,
		title: "太监·五品",
		job: "宫殿正侍",
		desc: "管事管人还管心情：领导一皱眉，你先把灯点亮。",
		basis: "month",
	},
	{
		min: 6,
		title: "太监·六品",
		job: "正侍",
		desc: "内廷中层：每天都在“马上要”，但又不能“马上走”。",
		basis: "month",
	},
	{
		min: 5,
		title: "太监·六/七品",
		job: "副侍/副侍",
		desc: "干得最多的那一层：活你来，锅也你来。",
		basis: "month",
	},
	{
		min: 3,
		title: "太监·七品",
		job: "副侍监",
		desc: "还在上升期：努力点，离“管事”就差一口气。",
		basis: "month",
	},
	{
		min: 2.5,
		title: "太监·无品级",
		job: "二等",
		desc: "能吃能跑能熬夜：主打一个“随叫随到”。",
		basis: "month",
	},
	{
		min: 2,
		title: "太监·无品级",
		job: "底层",
		desc: "底层打拼：工资不高，规矩不少，靠经验保命。",
		basis: "month",
	},
	{
		min: 0,
		title: "太监·试用",
		job: "杂使",
		desc: "先把活干明白：从端茶送水开始卷。",
		basis: "month",
	},
];

const MAID_RANKS: Rank[] = [
	{
		min: 20,
		title: "宫女·顶级",
		job: "掌事女官",
		desc: "顶配待遇：说话有人听，做事有人跟，连规矩都为你让路。",
		basis: "month",
	},
	{
		min: 10,
		title: "宫女·一等",
		job: "掌事宫女",
		desc: "核心岗：既管人也管事，最怕“突击检查”。",
		basis: "month",
	},
	{
		min: 6,
		title: "宫女·高层",
		job: "要紧差使",
		desc: "高层跑动：消息灵通，责任也更重。",
		basis: "month",
	},
	{
		min: 4,
		title: "宫女·二等",
		job: "内务能手",
		desc: "中层稳定：事情熟、流程熟、人也熟。",
		basis: "month",
	},
	{
		min: 3,
		title: "宫女·三等",
		job: "当差宫女",
		desc: "日常运转主力：忙是真的忙，累也是真的累。",
		basis: "month",
	},
	{
		min: 2,
		title: "宫女·底层",
		job: "粗使宫女",
		desc: "底层起步：力气活多，规矩更多，先学会别出错。",
		basis: "month",
	},
	{
		min: 0,
		title: "宫女·试用",
		job: "杂役",
		desc: "先熟悉规矩：跑腿、打杂、随叫随到。",
		basis: "month",
	},
];

type CalculatorResult = {
	silverGrams: number;
	monthlyTaels: number;
	yearlyTaels: number;
	rank: Rank;
	profileLabel: string;
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
	"zh",
	{
		title: string;
		subtitle: (silverPrice: number, gramsPerTael: number) => string;
		identityLabel: string;
		officialTab: string;
		nonOfficialTab: string;
		genderLabel: string;
		genderMale: string;
		genderFemale: string;
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
		profile: string;
		commentLabel: string;
		rankHintYear: (min: number) => string;
		rankHintMonth: (min: number) => string;
		errorInvalidSalary: string;
		errorInvalidSettings: string;
	}
> = {
	zh: {
		title: "薪资计算器-白银版",
		subtitle: (silverPrice, gramsPerTael) =>
			`银价：${silverPrice} 元/克 · 1两=${gramsPerTael}克（可调整）`,
		identityLabel: "身份",
		officialTab: "有编制（官员）",
		nonOfficialTab: "无编制（内廷）",
		genderLabel: "性别",
		genderMale: "男（太监）",
		genderFemale: "女（宫女）",
		salaryLabel: "输入你的月薪（人民币）",
		salaryPlaceholder: "例如：5000",
		toggleSettings: "[ 参数 ]",
		priceLabel: "银价（元/克）",
		gramsLabel: "1两 =（克）",
		jokePreset: "玩梗 (35/50)",
		hardcorePreset: "考据 (7.2/37.3)",
		calcBtn: "开始核算",
		helpLink: "📖 防坑指南（俸禄 / 工钱 / 货币）",
		monthly: "折合月银",
		yearly: "折合年俸",
		grams: "折合白银",
		profile: "身份",
		commentLabel: "【评语】",
		rankHintYear: (min) => `（按年俸 ≥ ${min} 两判定）`,
		rankHintMonth: (min) => `（按月俸 ≥ ${min} 两判定）`,
		errorInvalidSalary: "请输入合法的月薪金额（> 0）。",
		errorInvalidSettings: "请检查参数：银价与“1两=克”都必须大于 0。",
	},
};

type ProfileMode = "official" | "palace";
type Gender = "male" | "female";

export function SilverCalculatorClient() {
	const t = copy.zh;

	const [salary, setSalary] = useState<string>("");
	const [silverPrice, setSilverPrice] = useState<number>(35);
	const [gramsPerTael, setGramsPerTael] = useState<number>(50);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [mode, setMode] = useState<ProfileMode>("official");
	const [gender, setGender] = useState<Gender>("male");
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<CalculatorResult | null>(null);
	const [stampNonce, setStampNonce] = useState(0);
	const resultRef = useRef<HTMLDivElement | null>(null);

	const subtitle = useMemo(
		() => t.subtitle(silverPrice, gramsPerTael),
		[t, silverPrice, gramsPerTael]
	);

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

		let profileLabel = "";
		let matched: Rank;

		if (mode === "official") {
			profileLabel = "有编制（官员）";
			matched = OFFICIAL_RANKS[OFFICIAL_RANKS.length - 1];
			for (const rank of OFFICIAL_RANKS) {
				if (yearlyTaels >= rank.min) {
					matched = rank;
					break;
				}
			}
		} else {
			profileLabel = gender === "male" ? "无编制（太监）" : "无编制（宫女）";
			const ranks = gender === "male" ? EUNUCH_RANKS : MAID_RANKS;
			matched = ranks[ranks.length - 1];
			for (const rank of ranks) {
				if (monthlyTaels >= rank.min) {
					matched = rank;
					break;
				}
			}
		}

		setStampNonce((n) => n + 1);
		setResult({
			silverGrams,
			monthlyTaels,
			yearlyTaels,
			rank: matched,
			profileLabel,
		});

		window.setTimeout(() => {
			resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 80);
	}

	return (
		<div className={styles.screen}>
			<div className={styles.scrollContainer}>
				<header className={styles.header}>
					<h1 className={styles.title}>{t.title}</h1>
					<div className={styles.subtitle}>{subtitle}</div>
				</header>

				<div className={styles.profilePanel}>
					<div className={styles.profileRow}>
						<span className={styles.profileLabel}>{t.identityLabel}</span>
						<div className={styles.segmented} role="tablist" aria-label="身份选择">
							<button
								type="button"
								role="tab"
								aria-selected={mode === "official"}
								className={`${styles.segmentedBtn} ${
									mode === "official" ? styles.active : ""
								}`}
								onClick={() => setMode("official")}
							>
								{t.officialTab}
							</button>
							<button
								type="button"
								role="tab"
								aria-selected={mode === "palace"}
								className={`${styles.segmentedBtn} ${
									mode === "palace" ? styles.active : ""
								}`}
								onClick={() => setMode("palace")}
							>
								{t.nonOfficialTab}
							</button>
						</div>
					</div>

					{mode === "palace" ? (
						<div className={styles.profileRow}>
							<span className={styles.profileLabel}>{t.genderLabel}</span>
							<div className={styles.segmented} role="radiogroup" aria-label="性别选择">
								<button
									type="button"
									role="radio"
									aria-checked={gender === "male"}
									className={`${styles.segmentedBtn} ${
										gender === "male" ? styles.active : ""
									}`}
									onClick={() => setGender("male")}
								>
									{t.genderMale}
								</button>
								<button
									type="button"
									role="radio"
									aria-checked={gender === "female"}
									className={`${styles.segmentedBtn} ${
										gender === "female" ? styles.active : ""
									}`}
									onClick={() => setGender("female")}
								>
									{t.genderFemale}
								</button>
							</div>
						</div>
					) : null}
				</div>

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
							{t.priceLabel}：{" "}
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
							{t.gramsLabel}：{" "}
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
						<div className={styles.smallMeta}>
							{t.profile}：{result.profileLabel}
						</div>
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
								{result.rank.basis === "year"
									? t.rankHintYear(result.rank.min)
									: t.rankHintMonth(result.rank.min)}
							</span>
						</div>
					</div>
				) : null}

				<div className={styles.footerLinks}>
					<Link href="/guide" className={styles.helpLink}>
						{t.helpLink}
					</Link>
				</div>

				<div className={styles.cloudBg} />
			</div>
		</div>
	);
}
