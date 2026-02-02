# OpenNext Starter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Read the documentation at https://opennext.js.org/cloudflare.

## Develop

Run the Next.js development server:

```bash
npm run dev
# or similar package manager command
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Preview

Preview the application locally on the Cloudflare runtime:

```bash
npm run preview
# or similar package manager command
```

## Deploy

Deploy the application to Cloudflare:

```bash
npm run deploy
# or similar package manager command
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

推荐使用 opennextjs-cloudflare 的 CLI 通过包脚本上传和部署：运行 pnpm upload（构建并上传）或 pnpm deploy（构建并部署）。也可以直接使用 npx opennextjs-cloudflare upload 或 pnpm dlx
opennextjs-cloudflare upload。如果使用传统方式，可用 wrangler，先运行 npx wrangler login 或 pnpm wrangler login 完成认证。无需 web.run。建议设置好环境变量再上传。

• 用这个仓库的方案，上传到 Cloudflare 建议走 opennextjs-cloudflare CLI（它内部会用 wrangler）：

常用命令（推荐用 package scripts）

- 仅构建并上传：pnpm upload
- 构建并部署：pnpm deploy
- 本地用 Cloudflare runtime 预览：pnpm preview

等价的直接 CLI 用法

- pnpm dlx opennextjs-cloudflare upload
- pnpm dlx opennextjs-cloudflare deploy

第一次用记得登录 wrangler：

- pnpm wrangler login (或 npx wrangler login)

你想要“上传但不发布”，就用 pnpm upload。如果要直接发布线上，用 pnpm deploy。
