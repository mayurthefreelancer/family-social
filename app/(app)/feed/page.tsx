export const dynamic = "force-dynamic";

import { Feed } from "@/app/components/feed/Feed";
import { requireUser } from "@/app/lib/auth";
import { getFeed } from "@/app/lib/feed";

export default async function FeedPage() {
  const user = await requireUser();
  const posts = await getFeed();
  return <Feed posts={posts} />;
}
