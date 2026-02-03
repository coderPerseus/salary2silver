"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { QRCode } from "antd";
import styles from "./salary-calculator.module.css";
import { snapdomToBlob } from "@/lib/snapdom-client";

type Rank = {
  min: number;
  title: string;
  job: string;
  descs: [string, string, string, string, string];
  basis: "month" | "year";
};

const OFFICIAL_RANKS: Rank[] = [
  {
    min: 522,
    title: "正一品",
    job: "朝廷重臣",
    descs: [
      "俸禄高到你打个喷嚏，库房都自动加锁。",
      "大人这收入，属于“不解释，直接封神”。",
      "银两多到数不完：建议雇个从一品帮你记账。",
      "你已经不是打工人了，你是打工人的 KPI。",
      "别人问你年终奖？你：年终？我全年都终。",
    ],
    basis: "year",
  },
  {
    min: 444,
    title: "从一品",
    job: "朝廷重臣",
    descs: [
      "朝会站位靠前，气场自带 BGM，别人只能当伴奏。",
      "这俸禄一看就很稳：稳到你连焦虑都要排队。",
      "你一开口叫“某某”，底下人先把 PPT 改三遍。",
      "你不是升职，是在朝堂里“平移到更高处”。",
      "别人努力攒首付，你的烦恼是库房放不下。",
    ],
    basis: "year",
  },
  {
    min: 366,
    title: "正二品",
    job: "封疆大吏",
    descs: [
      "一方大员，文件一签就是“奉旨”，别人一签就是“奉陪”。",
      "你负责定方向，别人负责找方向，最后都来问你方向。",
      "俸禄不止是钱，更是“你说得算”的底气。",
      "你不内卷，你内定：你一出现，会议就自动结论。",
      "别人怕 KPI，你怕的是：怎么花才能低调一点。",
    ],
    basis: "year",
  },
  {
    min: 288,
    title: "从二品",
    job: "封疆大吏",
    descs: [
      "统筹能手：既要稳又要快，最怕“马上要”，但你偏偏总能要到。",
      "你一皱眉，下面就开始“自查自纠”。",
      "俸禄很高，责任更高：你睡觉都像在批示。",
      "别人是打工，你是“打天下”。",
      "你发话的速度，决定了大家加班的长度。",
    ],
    basis: "year",
  },
  {
    min: 210,
    title: "正三品",
    job: "要职干将",
    descs: [
      "中枢骨干：升迁通道清晰，KPI 也更清晰，压力同样清晰。",
      "你不是在开会，你是在把别人安排得明明白白。",
      "俸禄够体面，脸也得够体面：笑着把锅端走。",
      "别人写周报，你写“定调”。",
      "你这收入，属于“努力有回报，但回报也很忙”。",
    ],
    basis: "year",
  },
  {
    min: 160.5,
    title: "从三品",
    job: "要职干将",
    descs: [
      "会做事、能背锅、还得会写折子：三连技能点全满。",
      "你最大的特长：把“烂摊子”写成“阶段性成果”。",
      "俸禄不错，但你知道的：好日子都是用睡眠换的。",
      "别人靠运气，你靠“把每件事都收尾”。",
      "你一出现，大家都松口气：有人来扛了。",
    ],
    basis: "year",
  },
  {
    min: 144,
    title: "正四品",
    job: "主政一方",
    descs: [
      "管得不小，睡得不多。俸禄上来了，头发下去了。",
      "你这收入，属于“能活得体面，但别想太轻松”。",
      "别人怕被骂，你怕的是：没人接你电话。",
      "你最常说的不是“好的”，而是“按流程来”。",
      "你是领导眼里的宝贝，也是同僚眼里的“麻烦收割机”。",
    ],
    basis: "year",
  },
  {
    min: 126,
    title: "从四品",
    job: "主政一方",
    descs: [
      "事务缠身，最怕“上面来人检查”，但你偏偏最会迎检。",
      "俸禄还行，时间不行：你连焦虑都要预约。",
      "别人打卡下班，你打卡“继续干”。",
      "你不是工作多，是“人情世故”多。",
      "你现在的状态：表面镇定，内心开会。",
    ],
    basis: "year",
  },
  {
    min: 96,
    title: "正五品",
    job: "中层官员",
    descs: [
      "中层支柱：上有压力，下有期待，夹在中间最会做人。",
      "你最擅长的不是决策，是“把决策执行到看起来很合理”。",
      "俸禄不错，但你也明白：锅是按层级分配的。",
      "你开会的意义：让大家知道“还得干”。",
      "你在系统里属于：不算大佬，但谁都离不开你。",
    ],
    basis: "year",
  },
  {
    min: 84,
    title: "从五品",
    job: "中层官员",
    descs: [
      "职位不低，俸禄不高，但“含金量”在名号。",
      "你这收入，属于“看起来体面，花起来心虚”。",
      "你在单位最大的福利：别人不敢随便怼你。",
      "你不是穷，你是“预算紧”。",
      "你把日子过成了四个字：精打细算。",
    ],
    basis: "year",
  },
  {
    min: 60,
    title: "正六品",
    job: "事务官",
    descs: [
      "跑得勤、写得多、背得稳。活都在你这儿汇总。",
      "你不是在工作，你是在给别人“擦屁股”。",
      "俸禄能过日子，但你的精神账单更吓人。",
      "你每天的任务：把“没定”写成“已推进”。",
      "你很重要，重要到谁都可以找你。",
    ],
    basis: "year",
  },
  {
    min: 48,
    title: "从六品",
    job: "事务官",
    descs: [
      "官场多线程选手：一个人顶三个人用。",
      "你一忙起来，连“我很忙”都来不及说。",
      "俸禄不算低，但你的“不可替代”很贵。",
      "别人靠流程，你靠“临时处理”。",
      "你最大的优势：能把烂摊子救活；最大缺点：总被派去救。",
    ],
    basis: "year",
  },
  {
    min: 45,
    title: "正七品",
    job: "七品芝麻官",
    descs: [
      "经典配置：面子有了，里子先紧着点用。",
      "七品也算官：至少别人骂你之前会先想想。",
      "你这俸禄，属于“能当官，但当不了富豪”。",
      "你在单位的地位：上面嫌你慢，下面嫌你凶。",
      "你最大的愿望：别出事；最大的现实：天天出小事。",
    ],
    basis: "year",
  },
  {
    min: 42,
    title: "从七品",
    job: "基层官员",
    descs: [
      "基层顶梁柱，天天在一线，天天被喊“快点”。",
      "你是单位的“缓冲层”：上面的脾气，下面的情绪，都要你消化。",
      "俸禄还行，升迁也行——就是“行得很慢”。",
      "你每天都在解决问题：解决完就会有新问题。",
      "你是那种：不出彩但不能倒的人。",
    ],
    basis: "year",
  },
  {
    min: 39,
    title: "正八品",
    job: "基层官员",
    descs: [
      "官衔在身，锅也在身。出门能抬头，回家先叹气。",
      "你在系统里属于：事不少、钱一般、还得懂规矩。",
      "俸禄够养活自己，养活梦想？先等等。",
      "你最常做的事：传达上意，安抚下意，最后把自己憋坏。",
      "你看起来很忙，实际上也确实很忙。",
    ],
    basis: "year",
  },
  {
    min: 36,
    title: "从八品",
    job: "基层官员",
    descs: [
      "表面体面，实际精打细算：一两银子掰两半花。",
      "你这收入，属于“吃得起面子，买不起里子”。",
      "别人看你像官，你自己看自己像会计。",
      "你已经学会了：把省钱说成“提高资金使用效率”。",
      "你离“富”就差一件事：换个朝代。",
    ],
    basis: "year",
  },
  {
    min: 33,
    title: "正九品",
    job: "科员级",
    descs: [
      "官场底层，但也是“体制内”。开会坐后排，文件跑前排。",
      "你这俸禄：够你买纸写材料，不够你买命续命（睡眠）。",
      "别人写总结，你写“汇总”；别人背锅，你背“背锅的锅”。",
      "你最大的成长：越来越会“按领导意思写”。",
      "你是那种：被需要时很重要，不被提及时很透明的人。",
    ],
    basis: "year",
  },
  {
    min: 30,
    title: "从九品",
    job: "科员级",
    descs: [
      "刚进系统，先学会“照章办事”。章不够就找补充条款。",
      "你还没开始升职，就先学会了忍气吞声。",
      "俸禄不高，但你已经会用“口径”说话了。",
      "你最大的优点：便宜；最大的缺点：也太便宜了。",
      "你现在的状态：会做事，但不敢太会做事。",
    ],
    basis: "year",
  },
  {
    min: 18,
    title: "不入流",
    job: "编外小吏",
    descs: [
      "名分没有，活儿不少：忙起来连喝水都要排队。",
      "你这俸禄：刚够买纸写折子，墨还得赊。",
      "上面一句“辛苦了”，下面一整年辛苦了。",
      "你最大的福利是：离锅最近，背锅最快。",
      "再努力一点，就能从“不入流”升级为“不入眠”。",
    ],
    basis: "year",
  },
];

const EUNUCH_RANKS: Rank[] = [
  {
    min: 8,
    title: "太监·四品",
    job: "督领侍",
    descs: [
      "内廷顶流：你一句“传”，别人就开始跑。",
      "走路带风，传话带电，情绪管理也是你的副业。",
      "你这收入属于“嘴一张，事情就办了”。",
      "别人靠流程，你靠“口谕”。",
      "俸禄高到你说“辛苦了”，对方就真的不敢辛苦。",
    ],
    basis: "month",
  },
  {
    min: 7,
    title: "太监·五品",
    job: "宫殿正侍",
    descs: [
      "管事管人还管心情：领导一皱眉，你先把灯点亮。",
      "你是“关键节点”：消息到你这儿才算消息。",
      "俸禄不低，脸色更重要：你最懂“风向”。",
      "你一句“这不合规矩”，能让全宫安静三秒。",
      "你不加班，你是“常驻值守”。",
    ],
    basis: "month",
  },
  {
    min: 6,
    title: "太监·六品",
    job: "正侍",
    descs: [
      "内廷中层：每天都在“马上要”，但又不能“马上走”。",
      "你最常说的不是“好的”，而是“已安排”。",
      "俸禄够体面，但你也知道：体面是靠绷出来的。",
      "你一忙起来，连叹气都要排期。",
      "你不是打工人，你是“打工调度中心”。",
    ],
    basis: "month",
  },
  {
    min: 5,
    title: "太监·六/七品",
    job: "副侍/副侍",
    descs: [
      "干得最多的那一层：活你来，锅也你来。",
      "你每天都在收拾烂摊子，还得装作“风平浪静”。",
      "俸禄看着不错，但你的烦恼也按月续费。",
      "你把“救火”练成了核心竞争力。",
      "你最大的优势：靠谱；最大的惩罚：更靠谱。",
    ],
    basis: "month",
  },
  {
    min: 3,
    title: "太监·七品",
    job: "副侍监",
    descs: [
      "还在上升期：努力点，离“管事”就差一口气。",
      "你现在的任务：别出错；你的奖励：更多任务。",
      "俸禄够你把日子过下去，但别指望过得漂亮。",
      "你是宫里那种：谁都能叫你，但你谁都惹不起。",
      "你以为你在升职？其实你在“升责任”。",
    ],
    basis: "month",
  },
  {
    min: 2.5,
    title: "太监·无品级",
    job: "二等",
    descs: [
      "能吃能跑能熬夜：主打一个“随叫随到”。",
      "你最大的资产：耐心；最大的消耗：耐心。",
      "俸禄不多，但你已经学会“把委屈写在脸外”。",
      "你在宫里的价值：哪里缺人你就去哪儿。",
      "你不是被安排，你是被“默认安排”。",
    ],
    basis: "month",
  },
  {
    min: 2,
    title: "太监·无品级",
    job: "底层",
    descs: [
      "底层打拼：工资不高，规矩不少，靠经验保命。",
      "你这收入，在宫里属于“活着就行”的那档。",
      "别问升不升：先把今天熬过去。",
      "你已经掌握了宫廷生存法则：少说话，多跑腿。",
      "你最大的快乐：今天没挨骂；明天再说。",
    ],
    basis: "month",
  },
  {
    min: 0,
    title: "太监·试用",
    job: "杂使",
    descs: [
      "先把活干明白：从端茶送水开始卷。",
      "你现在的 KPI：别把茶洒了；加分项：别把人得罪了。",
      "俸禄是入门级，规矩是满配版。",
      "你以为你在试用，宫里以为你在“试命”。",
      "别灰心：熬得住就有机会，熬不住也没机会。",
    ],
    basis: "month",
  },
];

const MAID_RANKS: Rank[] = [
  {
    min: 20,
    title: "宫女·顶级",
    job: "掌事女官",
    descs: [
      "顶配待遇：说话有人听，做事有人跟，连规矩都为你让路。",
      "你一开口，内务府先把清单递上来：请您过目。",
      "这收入属于“项目你不写，方向你来定”。",
      "你不是宫女，你是内廷的“项目经理”。",
      "别人靠努力，你靠“气场+经验+资源”。",
    ],
    basis: "month",
  },
  {
    min: 10,
    title: "宫女·一等",
    job: "掌事宫女",
    descs: [
      "核心岗：既管人也管事，最怕“突击检查”，但你偏偏最会应对。",
      "你掌握关键流程：谁想糊弄你都糊弄不过去。",
      "俸禄不低，责任更高：你说“不行”就真的不行。",
      "你一天的工作：安排别人；顺便也安排自己。",
      "你现在的状态：忙到稳，稳到累。",
    ],
    basis: "month",
  },
  {
    min: 6,
    title: "宫女·高层",
    job: "要紧差使",
    descs: [
      "高层跑动：消息灵通，责任也更重。",
      "你是“关键联系人”：话传到你这儿才算数。",
      "俸禄能撑住体面，但你也得撑住情绪。",
      "你不是在跑腿，你是在跑“风向”。",
      "你最怕的不是忙，是“忙得没有把握”。",
    ],
    basis: "month",
  },
  {
    min: 4,
    title: "宫女·二等",
    job: "内务能手",
    descs: [
      "中层稳定：事情熟、流程熟、人也熟——就是自己不太舒服。",
      "你最擅长的事：把混乱变成“像样”。",
      "俸禄还行，时间不行：总有人找你“顺便帮一下”。",
      "你不是多能干，是“不得不能干”。",
      "你属于那种：不出彩，但谁都不想换掉的人。",
    ],
    basis: "month",
  },
  {
    min: 3,
    title: "宫女·三等",
    job: "当差宫女",
    descs: [
      "日常运转主力：忙是真的忙，累也是真的累。",
      "你这俸禄：够过日子，不够过脾气。",
      "你每天都在“马上要”，只是你从来没“马上好”。",
      "你属于：没人看见时最重要，被看见时最容易挨说。",
      "你不缺工作，你缺的是休息。",
    ],
    basis: "month",
  },
  {
    min: 2,
    title: "宫女·底层",
    job: "粗使宫女",
    descs: [
      "底层起步：力气活多，规矩更多，先学会别出错。",
      "你现在的福利：饭能吃饱；你的代价：活也干饱。",
      "俸禄不高，要求不低：错一次要记很久。",
      "你每天都在练技能：手快、眼快、心更快。",
      "别怕：熬过去就会发现——还得继续熬。",
    ],
    basis: "month",
  },
  {
    min: 0,
    title: "宫女·试用",
    job: "杂役",
    descs: [
      "先熟悉规矩：跑腿、打杂、随叫随到。",
      "你现在的目标：别惹事；你的现实：事总来惹你。",
      "俸禄是入门级，任务是全能级。",
      "你属于“看起来很闲，其实很累”的那一层。",
      "别急：等你熟练了，就会更忙。",
    ],
    basis: "month",
  },
];

type CalculatorResult = {
  salaryRmb: number;
  silverPrice: number;
  gramsPerTael: number;
  silverGrams: number;
  monthlyTaels: number;
  yearlyTaels: number;
  rank: Rank;
  profileLabel: string;
  comment: string;
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

function pickRandom(quips: readonly string[]) {
  if (quips.length === 0) return "";
  const max = quips.length;
  try {
    if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
      const buf = new Uint32Array(1);
      crypto.getRandomValues(buf);
      return quips[buf[0] % max] ?? quips[0]!;
    }
  } catch {
    // ignore
  }

  return quips[Math.floor(Math.random() * max)] ?? quips[0]!;
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

function computeResult(payload: {
  salaryRmb: number;
  silverPrice: number;
  gramsPerTael: number;
  mode: ProfileMode;
  gender: Gender;
  invalidSalaryError: string;
  invalidSettingsError: string;
}): { ok: true; result: CalculatorResult } | { ok: false; error: string } {
  const parsedSalary = payload.salaryRmb;
  if (!Number.isFinite(parsedSalary) || parsedSalary <= 0) {
    return { ok: false, error: payload.invalidSalaryError };
  }

  if (!Number.isFinite(payload.silverPrice) || payload.silverPrice <= 0) {
    return { ok: false, error: payload.invalidSettingsError };
  }

  if (!Number.isFinite(payload.gramsPerTael) || payload.gramsPerTael <= 0) {
    return { ok: false, error: payload.invalidSettingsError };
  }

  const silverGrams = parsedSalary / payload.silverPrice;
  const monthlyTaels = silverGrams / payload.gramsPerTael;
  const yearlyTaels = monthlyTaels * 12;

  let profileLabel = "";
  let matched: Rank;
  let comment = "";

  if (payload.mode === "official") {
    profileLabel = "有编制（官员）";
    matched = OFFICIAL_RANKS[OFFICIAL_RANKS.length - 1];
    for (const rank of OFFICIAL_RANKS) {
      if (yearlyTaels >= rank.min) {
        matched = rank;
        break;
      }
    }
    comment = pickRandom(matched.descs);
  } else {
    profileLabel =
      payload.gender === "male" ? "无编制（太监）" : "无编制（宫女）";
    const ranks = payload.gender === "male" ? EUNUCH_RANKS : MAID_RANKS;
    matched = ranks[ranks.length - 1];
    for (const rank of ranks) {
      if (monthlyTaels >= rank.min) {
        matched = rank;
        break;
      }
    }
    comment = pickRandom(matched.descs);
  }

  return {
    ok: true,
    result: {
      salaryRmb: parsedSalary,
      silverPrice: payload.silverPrice,
      gramsPerTael: payload.gramsPerTael,
      silverGrams,
      monthlyTaels,
      yearlyTaels,
      rank: matched,
      profileLabel,
      comment,
    },
  };
}

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
  const latestInputsRef = useRef({
    salary: "",
    silverPrice: 35,
    gramsPerTael: 50,
  });
  const latestResultRef = useRef<CalculatorResult | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>("");
  const shareCardRef = useRef<HTMLDivElement | null>(null);

  const subtitle = useMemo(
    () => t.subtitle(silverPrice, gramsPerTael),
    [t, silverPrice, gramsPerTael],
  );

  const displayedMonthly = useAnimatedNumber(result?.monthlyTaels ?? 0);
  const displayedYearly = useAnimatedNumber(result?.yearlyTaels ?? 0);

  const displayedGrams = useAnimatedNumber(result?.silverGrams ?? 0, 700);

  useEffect(() => {
    latestInputsRef.current = { salary, silverPrice, gramsPerTael };
  }, [salary, silverPrice, gramsPerTael]);

  useEffect(() => {
    latestResultRef.current = result;
  }, [result]);

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
    const computed = computeResult({
      salaryRmb: parsedSalary,
      silverPrice,
      gramsPerTael,
      mode,
      gender,
      invalidSalaryError: copy.zh.errorInvalidSalary,
      invalidSettingsError: copy.zh.errorInvalidSettings,
    });

    if (!computed.ok) {
      setError(computed.error);
      latestResultRef.current = null;
      setResult(null);
      return;
    }

    setError(null);
    setStampNonce((n) => n + 1);
    latestResultRef.current = computed.result;
    setResult(computed.result);

    window.setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }

  useEffect(() => {
    const prev = latestResultRef.current;
    if (!prev) return;

    const parsedSalary = Number.parseFloat(latestInputsRef.current.salary);
    const activeSalaryRmb =
      Number.isFinite(parsedSalary) && parsedSalary > 0
        ? parsedSalary
        : prev.salaryRmb;

    const computed = computeResult({
      salaryRmb: activeSalaryRmb,
      silverPrice: latestInputsRef.current.silverPrice,
      gramsPerTael: latestInputsRef.current.gramsPerTael,
      mode,
      gender,
      invalidSalaryError: copy.zh.errorInvalidSalary,
      invalidSettingsError: copy.zh.errorInvalidSettings,
    });

    if (!computed.ok) {
      setError(computed.error);
      latestResultRef.current = null;
      setResult(null);
      return;
    }

    setError(null);
    setStampNonce((n) => n + 1);
    latestResultRef.current = computed.result;
    setResult(computed.result);
  }, [mode, gender]);

  useEffect(() => {
    if (!shareOpen) {
      setShareError(null);
      setShareUrl("");
      return;
    }

    setShareError(null);
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, [shareOpen]);

  function makeShareFacts(payload: CalculatorResult) {
    const riceJin = Math.max(0, Math.round(payload.monthlyTaels * 150));
    const taelRmb = payload.gramsPerTael * payload.silverPrice;
    const monthlyRmbByTael = Math.round(payload.monthlyTaels * taelRmb);
    const thresholdMonthly =
      payload.rank.basis === "year" ? payload.rank.min / 12 : payload.rank.min;
    const thresholdRmb = Math.round(thresholdMonthly * taelRmb);

    const common = [
      `大米指数（粗略口径）：你这月银大概能买 ${riceJin} 斤米。`,
      `按你当前参数：1两≈¥${Math.round(taelRmb)}，你的月银≈¥${monthlyRmbByTael}。`,
      "温馨提示：别学大侠随手扔银子，摊主真的找不开。",
    ];

    const official = [
      `对标门槛：${payload.rank.title} 至少约每月 ${formatNumber(thresholdMonthly)} 两（≈¥${thresholdRmb}）。`,
      "俸禄是“编制的体面”，但体面也需要你把折子写得漂亮。",
      "你最大的武器不是刀，是“请示、批示、会议纪要”。",
    ];

    const palace = [
      `宫里工资主打一个：包吃包住，情绪折旧另算。`,
      `对标门槛：${payload.rank.title} 至少约每月 ${formatNumber(thresholdMonthly)} 两（≈¥${thresholdRmb}）。`,
      "宫廷生存法则：少说话，多干活，别抢镜头。",
    ];

    const list = payload.profileLabel.includes("官员")
      ? [...official, ...common]
      : [...palace, ...common];

    const chosen: string[] = [];
    for (let i = 0; i < list.length && chosen.length < 3; i += 1) {
      const pick = pickRandom(list);
      if (!chosen.includes(pick)) chosen.push(pick);
    }
    return chosen.slice(0, 3);
  }

  async function exportShareCard() {
    if (!shareCardRef.current) return;
    setShareBusy(true);
    setShareError(null);

    try {
      const blob = await snapdomToBlob(shareCardRef.current, {
        backgroundColor: "#f4ecd8",
        scale: 2,
      });

      const filename = `薪资计算器-白银版_${Date.now()}.png`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.rel = "noopener";
      anchor.style.display = "none";
      document.body.appendChild(anchor);

      if (!("download" in anchor)) {
        window.open(url, "_blank", "noopener,noreferrer");
        setShareError(
          "当前浏览器不支持自动下载：已打开图片页，请长按/右键保存；或直接截图分享。",
        );
        return;
      }

      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch {
      setShareError("导出失败：请直接截图保存后分享（或换个浏览器再试）。");
    } finally {
      setShareBusy(false);
    }
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
            <div
              className={styles.segmented}
              role="tablist"
              aria-label="身份选择"
            >
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
              <div
                className={styles.segmented}
                role="radiogroup"
                aria-label="性别选择"
              >
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
            <div className={styles.resultHeader}>
              <span className={styles.resultHeaderTitle}>核算结果</span>
              <button
                type="button"
                className={styles.shareBtn}
                onClick={() => setShareOpen(true)}
              >
                分享
              </button>
            </div>

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
              <strong>{t.commentLabel}</strong> {result.comment}
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

      {shareOpen && result ? (
        <div
          className={styles.modalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="分享卡片"
        >
          <div className={styles.modalSheet}>
            <div className={styles.modalTop}>
              <div className={styles.modalTitle}>分享卡片</div>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setShareOpen(false)}
                aria-label="关闭"
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.shareCardWrap}>
                <div className={styles.shareCard} ref={shareCardRef}>
                  <div className={styles.shareCardHead}>
                    <div className={styles.shareCardTitle}>
                      薪资计算器-白银版
                    </div>
                    <div className={styles.shareCardMeta}>
                      <span className={styles.shareCardMetaPill}>
                        {result.profileLabel}
                      </span>
                      <span className={styles.shareCardMetaDot}>·</span>
                      <span>月薪 ¥{Math.round(result.salaryRmb)}</span> ≈
                      <span className={styles.shareStatLabel}>月银</span>{" "}
                      <span>{formatNumber(result.monthlyTaels)} 两</span>
                    </div>

                    <div className={styles.shareBadge} aria-hidden="true">
                      <div className={styles.shareBadgeInner}>
                        <div className={styles.shareBadgeTitle}>
                          {result.rank.title}
                        </div>
                        <div className={styles.shareBadgeSub}>
                          {result.rank.job}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.shareLore}>
                    <div className={styles.shareLoreTitle}>
                      今日小抄（看完装懂）
                    </div>
                    <ul className={styles.shareLoreList}>
                      {makeShareFacts(result).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.shareQuote}>
                    <span className={styles.shareQuoteLabel}>
                      毒舌/吹捧随机：
                    </span>
                    {result.comment}
                  </div>

                  <div className={styles.shareCardFoot}>
                    <div className={styles.shareParams}>
                      银价 {result.silverPrice} 元/克 · 1两=
                      {result.gramsPerTael}克
                      <br />
                    </div>

                    <div className={styles.qrFrame}>
                      <QRCode
                        value={shareUrl || "https://example.com"}
                        type="svg"
                        size={92}
                        bordered={false}
                        color="#2b2b2b"
                        bgColor="transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalPrimaryBtn}
                  onClick={exportShareCard}
                  disabled={shareBusy}
                >
                  {shareBusy ? "生成中…" : "下载"}
                </button>
                <button
                  type="button"
                  className={styles.modalSecondaryBtn}
                  onClick={() => setShareOpen(false)}
                >
                  关闭
                </button>
              </div>

              {shareError ? (
                <div className={styles.error}>{shareError}</div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
