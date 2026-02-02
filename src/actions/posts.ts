"use server";

export type Post = {
	id: number;
	title: string;
	body: string;
};

const API_BASE = "https://jsonplaceholder.typicode.com";

export async function fetchLatestPosts(limit = 3): Promise<Post[]> {
	const response = await fetch(`${API_BASE}/posts?_limit=${limit}`, {
		headers: { Accept: "application/json" },
		next: { revalidate: 60 },
	});

	if (!response.ok) {
		throw new Error("Failed to fetch posts.");
	}

	const data = (await response.json()) as Post[];
	return data;
}
