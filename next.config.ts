import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	/* config options here */
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
initOpenNextCloudflareForDev();

export default withNextIntl(nextConfig);
