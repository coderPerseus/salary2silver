import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { constructMetadata } from "@/lib/metadata";
import styles from "./guide.module.css";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
	const { locale } = await params;
	const title =
		locale === "zh" ? "大清打工防坑指南" : "Working in Qing Dynasty — Guide";
	const description =
		locale === "zh"
			? "用最通俗的方式解释：古代俸禄、工钱、货币单位与现代的对应关系。"
			: "A quick, fun guide to ancient salary, wages, and currency—mapped to modern intuition.";

	return constructMetadata({
		title,
		description,
		locale,
		pathname: "/guide",
	});
}

export default function GuidePage() {
	return (
		<div className={styles.screen}>
			<div className={styles.container}>
				<header className={styles.pageHeader}>
					<h1>大清打工防坑指南</h1>
					<p>— 阅后即焚，请勿外传 —</p>
				</header>

				<section className={styles.card}>
					<div className={styles.cardHeader}>
						<span>💰 别被电视剧骗了</span>
					</div>
					<div className={styles.cardBody}>
						<p>
							古装剧里大侠吃顿饭随手扔下一锭银子？
							<br />
							<strong>那是骗人的！</strong>
						</p>
						<p style={{ marginTop: 10 }}>
							在古代，白银是<span className={styles.highlight}>大额钞票</span>
							，老百姓平时用的是铜钱（文）。
						</p>

						<table className={styles.vsTable}>
							<tbody>
								<tr>
									<th>单位</th>
									<th>古代价值</th>
									<th>现代理解</th>
								</tr>
								<tr>
									<td>1 文</td>
									<td>一个馒头</td>
									<td>1 元硬币</td>
								</tr>
								<tr>
									<td>1 贯</td>
									<td>1000 文</td>
									<td>1000 元大钞</td>
								</tr>
								<tr>
									<td>1 两银</td>
									<td>约 0.7-1 贯</td>
									<td>约 700-1000 元</td>
								</tr>
							</tbody>
						</table>

						<p style={{ marginTop: 10, fontSize: "0.9rem", color: "#666" }}>
							*注：如果你在路边摊扔下一锭银子（比如10两），相当于现在吃碗面扔下一块金条，
							店主根本找不开。
						</p>
						<div className={styles.stampMark}>常识</div>
					</div>
				</section>

				<section className={styles.card}>
					<div className={styles.cardHeader}>
						<span>📜 俸禄 vs 工钱</span>
					</div>
					<div className={styles.cardBody}>
						<p>
							你以为当官的工资很高？其实他们的<strong>底薪（正俸）</strong>
							低得离谱！
						</p>
						<ul style={{ margin: "10px 0 10px 20px" }}>
							<li>
								<strong>正俸 (底薪)：</strong>写在明面上的“俸禄”，往往只够温饱。
							</li>
							<li>
								<strong>养廉银 (绩效/奖金)：</strong>雍正时期推广。为了不让你贪污，
								给你发高薪。这才是大头，通常是底薪的{" "}
								<span className={styles.highlight}>10-100倍</span>。
							</li>
						</ul>
						<hr
							style={{
								border: 0,
								borderTop: "1px dashed #ccc",
								margin: "10px 0",
							}}
						/>
						<p>
							<strong>普通打工人呢？</strong>
						</p>
						<p>
							老百姓拿的是<span className={styles.highlight}>工钱</span>
							，按天或按件算。没有养廉银，但胜在自由，不用担心被皇帝砍头。
						</p>
						<div className={styles.stampMark}>职场</div>
					</div>
				</section>

				<section className={styles.card}>
					<div className={styles.cardHeader}>
						<span>🍚 你的钱能买什么？</span>
					</div>
					<div className={styles.cardBody}>
						<p>
							别光看银子数量，要看<strong>购买力</strong>。
						</p>
						<p style={{ marginTop: 10 }}>在康乾盛世（粗略口径）：</p>
						<p>
							⚪ <strong>1 两银子</strong> ≈ 150 斤优质大米。
						</p>
						<p>
							⚪ <strong>月薪 2 两的打工人</strong>，能买 300 斤米。
						</p>

						<p style={{ marginTop: 15, fontWeight: "bold" }}>现代换算：</p>
						<p>
							如果你月薪 3500 元，按现在米价（约3元/斤）能买 1100+ 斤米。
						</p>
						<p
							style={{
								marginTop: 10,
								background: "#eee",
								padding: 10,
								borderRadius: 6,
							}}
						>
							<strong>结论：</strong>现代工业化让我们吃饱饭变得更容易了！虽然咱们银子少，
							但咱们饿不死啊！
						</p>
						<div className={styles.stampMark}>民生</div>
					</div>
				</section>
			</div>

			<Link href="/" className={styles.backBtn}>
				<span>↩ 返回计算器</span>
			</Link>
		</div>
	);
}

