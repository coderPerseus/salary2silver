# SEO Guide (Next.js App Router + next-intl)

这份文档描述当前项目的 SEO 逻辑与使用方式，帮助新增页面时快速接入同样的 SEO 能力（元数据、OpenGraph、Twitter、hreflang、sitemap、robots、manifest）。

## 1. 当前项目的 SEO 能力一览

已实现：

- 统一元数据构建器（title/description/canonical/OG/Twitter/robots）
- 多语言 hreflang + canonical
- 自动 sitemap / robots.txt / PWA manifest
- 页面级 `generateMetadata` + i18n 文案

对应文件：

- `src/lib/metadata.ts`：统一构建 Metadata
- `src/lib/hreflang.ts`：hreflang + alternates
- `src/lib/urls.ts`：站点 URL 规则与 locale 路径
- `src/config/website.ts`：站点 SEO 基础配置
- `src/app/sitemap.ts`：站点地图
- `src/app/robots.ts`：robots
- `src/app/manifest.ts`：manifest
- `src/messages/en.json`、`src/messages/zh.json`：SEO 文案

## 2. 站点级配置

### 2.1 站点配置

`src/config/website.ts`

- `name`：站点名（用于 OG/Twitter/siteName）
- `description`：默认描述
- `metadata.ogImage`：默认 OG 图片
- `i18n.locales.*.hreflang`：hreflang 映射

### 2.2 基础 URL

`src/lib/urls.ts`

- `getBaseUrl()` 优先读取 `NEXT_PUBLIC_APP_URL`
- 未设置时，开发环境会退回 `http://localhost:3000`

建议：在生产环境配置 `NEXT_PUBLIC_APP_URL`，否则 canonical/OG/sitemap 会使用 localhost。

## 3. 页面级 SEO 使用方式

### 3.1 新页面（推荐模板）

> 新页面应是 **Server Component**，这样可以安全地运行 `generateMetadata`。

```tsx
// src/app/[locale]/about/page.tsx
import type { Metadata } from "next";
import type { AppLocale } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { constructMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata.About" });

  return constructMetadata({
    title: t("title"),
    description: t("description"),
    locale,
    pathname: "/about",
  });
}

export default function AboutPage() {
  return <div>About</div>;
}
```

对应 i18n 文案：

```json
// src/messages/en.json
{
  "Metadata": {
    "About": {
      "title": "About — Next × Cloudflare Starter",
      "description": "Learn more about this starter."
    }
  }
}
```

```json
// src/messages/zh.json
{
  "Metadata": {
    "About": {
      "title": "关于 — Next × Cloudflare 启动模板",
      "description": "了解此模板。"
    }
  }
}
```

### 3.2 自定义 OG 图 / 不索引页面

```tsx
return constructMetadata({
  title: t("title"),
  description: t("description"),
  locale,
  pathname: "/pricing",
  image: "/og-pricing.png",
  noIndex: false,
});
```

`noIndex: true` 用于登录页、后台页等不希望收录的页面。

## 4. hreflang / alternates 说明

- `constructMetadata` 会自动根据 `pathname` 生成:
  - `canonical`
  - `alternates.languages`（hreflang）
- 语言定义来自 `src/i18n/routing.ts` 与 `src/config/website.ts`

## 5. 站点地图 & robots

- `src/app/sitemap.ts` 自动生成 `/sitemap.xml`
- `src/app/robots.ts` 自动生成 `/robots.txt`
- 如需新增路径，向 `staticRoutes` 增加即可

## 6. manifest

`src/app/manifest.ts` 会生成 `/manifest.webmanifest`，供浏览器识别 PWA 信息。

## 7. 新页面接入清单（必做）

1. 新页面路径加入 `generateMetadata`（参考 3.1）
2. `messages/en.json`、`messages/zh.json` 增加 `Metadata.xxx`
3. 需要收录的页面：如果是静态页面，追加到 `sitemap.ts` 的 `staticRoutes`
4. 如需自定义 OG 图，传入 `image`

---

如果你要新增带动态路由的页面（如博客、docs、产品详情），可以按以上模板扩展：

- `generateMetadata` 内读取 slug / 数据源
- `pathname` 传入完整路径（不含 locale 前缀）
- `sitemap.ts` 生成动态路由列表

## SEO 最佳实现

- 语义化 HTML - 使用正确的 HTML5 标签
- 响应式设计 - 移动端友好
- 快速加载 - Next.js 优化和图片优化
- 结构化 URL - 清晰的路由结构
- 规范链接 - 避免重复内容
- 多语言支持 - 完整的 hreflang 实现
- 动态站点地图 - 自动更新
- 社交媒体优化 - OG 和 Twitter 卡片
- 可访问性 - 图片 alt 标签等
