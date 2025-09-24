import type { Post } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export interface PostFilters {
  published?: boolean;
  communityId?: string;
  tags?: string[];
  search?: string;
}

export async function fetchPosts(filters: PostFilters = {}): Promise<Post[]> {
  const params = new URLSearchParams();

  if (filters.published !== undefined) {
    params.set("published", String(filters.published));
  }

  if (filters.communityId) {
    params.set("communityId", filters.communityId);
  }

  if (filters.tags && filters.tags.length > 0) {
    for (const tag of filters.tags) {
      if (tag) {
        params.append("tags", tag);
      }
    }
  }

  if (filters.search) {
    params.set("search", filters.search);
  }

  const queryString = params.toString();
  const url = queryString ? `/api/posts?${queryString}` : "/api/posts";
  const response = await apiRequest("GET", url);
  return await response.json();
}
