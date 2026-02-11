export const dynamic = "force-dynamic";

import { Feed } from "@/app/components/feed/Feed";
import { getFeed } from "@/app/lib/feed";

export default async function FeedPage() {
  const posts = await getFeed();
  return <Feed posts={posts} />;
}
