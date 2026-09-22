import type { Activity } from "../types/analytics.types";

const API_URL = "https://dummyjson.com";

interface DummyPost {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsResponse {
  posts: DummyPost[];
  total: number;
  skip: number;
  limit: number;
}

function mapPostToActivity(
  post: DummyPost
): Activity {
  return {
    id: post.id,
    userId: post.userId,
    action: "Post Created",
    description: post.title,
    date: new Date().toISOString(),
  };
}

/* ================= USER ACTIVITY ================= */

export async function fetchUserActivity(
  userId: number,
  signal?: AbortSignal
): Promise<Activity[]> {
  const response = await fetch(
    `${API_URL}/users/${userId}/posts`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch user activity"
    );
  }

  const data: PostsResponse =
    await response.json();

  return data.posts.map(
    mapPostToActivity
  );
}

/* ================= RECENT ACTIVITY ================= */

export async function fetchRecentActivity(
  signal?: AbortSignal
): Promise<Activity[]> {
  const response = await fetch(
    `${API_URL}/posts?limit=10`,
    { signal }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to fetch recent activity"
    );
  }

  const data: PostsResponse =
    await response.json();

  return data.posts.map(
    mapPostToActivity
  );
}