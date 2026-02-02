import type { MetadataRoute } from "next";
import { websiteConfig } from "@/config/website";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: websiteConfig.name,
		short_name: websiteConfig.name,
		description: websiteConfig.description,
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/favicon.svg",
				sizes: "any",
				type: "image/svg+xml",
			},
		],
	};
}
