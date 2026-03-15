import type { Post } from "./types";

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  return url.endsWith("/") ? url : `${url}/`;
};

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(getBaseUrl());
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(data: {
  username: string;
  title: string;
  content: string;
}): Promise<Post> {
  const res = await fetch(getBaseUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function updatePost(
  id: number,
  data: { title: string; content: string }
): Promise<Post> {
  const url = `${getBaseUrl()}${id}/`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function deletePost(id: number): Promise<void> {
  const url = `${getBaseUrl()}${id}/`;
  const res = await fetch(url, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete post");
}
